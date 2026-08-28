/**
 * useSimulador — Custom hook que encapsula toda la logica de estado e
 * interacciones del Orquestador del Simulador Propyme.
 *
 * Dumb UI: este hook es el unico lugar donde reside el estado local
 * (response, digitados, flags de UI) y las funciones que lo manipulan.
 * Los componentes de presentacion (AuditWorkspace, GlobalControlBar,
 * IncomeTable) solo consumen lo que este hook expone.  Cero calculos
 * tributarios; todo viene pre-calculado del backend (FastAPI).
 */
import { useState, type ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import {
  crearRequestInicial,
  obtenerRespuestaInicial,
  recalcularCaso,
} from '../api/simuladorApi';
import type {
  DigitadosIngresos,
  SimulacionGlobalRequest,
  SimulacionGlobalResponse,
} from '../types/ingresos';
import { parseNumero, debugLog } from '../../../utils/parsers';

/** RUTs disponibles por defecto en el selector de la barra superior. */
export const RUTS_POR_DEFECTO = [
  '76.123.456-7',
  '77.987.654-K',
  '78.111.222-3',
];

export interface UseSimuladorReturn {
  /* ── Estados ──────────────────────────────────────────── */
  response: SimulacionGlobalResponse;
  digitados: DigitadosIngresos;
  hasChanges: boolean;
  isRecalculating: boolean;
  isImporting: boolean;
  rutSeleccionado: string;
  atributo14D1: boolean;
  atributoCRRP: boolean;
  recalcError: string | null;
  selectedField: string;
  isInspectorOpen: boolean;
  showAllRows: boolean;

  /* ── Acciones ─────────────────────────────────────────── */
  setRutSeleccionado: (rut: string) => void;
  setAtributo14D1: (val: boolean | ((prev: boolean) => boolean)) => void;
  setAtributoCRRP: (val: boolean | ((prev: boolean) => boolean)) => void;
  setHasChanges: (val: boolean) => void;
  setIsInspectorOpen: (val: boolean) => void;
  setShowAllRows: (val: boolean | ((prev: boolean) => boolean)) => void;

  handleRecalcularCaso: () => Promise<void>;
  handleFileUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRevertir: () => void;
  handleDigitadoChange: (
    seccion: keyof DigitadosIngresos,
    codigo: string,
    valor: number
  ) => void;
  openInspector: (fieldKey: string) => void;
}

export const useSimulador = (): UseSimuladorReturn => {
  const [response, setResponse] = useState<SimulacionGlobalResponse>(() =>
    obtenerRespuestaInicial()
  );
  const [digitados, setDigitados] = useState<DigitadosIngresos>(() => ({
    ...crearRequestInicial().digitados.ingresos,
    ingresos_adeudados_at_anterior: {},
  }));
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [rutSeleccionado, setRutSeleccionado] = useState<string>(RUTS_POR_DEFECTO[0]);
  const [atributo14D1, setAtributo14D1] = useState<boolean>(true);
  const [atributoCRRP, setAtributoCRRP] = useState<boolean>(false);
  const [recalcError, setRecalcError] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string>('total_7');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [showAllRows, setShowAllRows] = useState<boolean>(false);

  // Memoria persistente de vectores y externos importados desde Excel
  // (se preservan entre recalculaciones para evitar amnesia de estado).
  const [vectores, setVectores] = useState<Record<string, number>>({});
  const [externos, setExternos] = useState<Record<string, number>>({});

  /* Handlers -------------------------------------------------------------- */

  const openInspector = (fieldKey: string) => {
    setSelectedField(fieldKey);
    setIsInspectorOpen(true);
  };

  const handleDigitadoChange = (
    seccion: keyof DigitadosIngresos,
    codigo: string,
    valor: number
  ) => {
    setHasChanges(true);
    setRecalcError(null);
    setDigitados((prev) => ({
      ...prev,
      [seccion]: { ...prev[seccion], [codigo]: valor },
    }));
  };

  const handleRevertir = () => {
    setResponse(obtenerRespuestaInicial());
    setDigitados(crearRequestInicial().digitados.ingresos);
    setVectores({});
    setExternos({});
    setHasChanges(false);
    setShowAllRows(false);
    setSelectedField('total_7');
    setRecalcError(null);
  };
const handleRecalcularCaso = async () => {
    debugLog('1. Boton clickeado correctamente!');

    if (isRecalculating) {
      debugLog('Cancelado: Ya estaba recalculando.');
      return;
    }

    debugLog('2. Paso el bloqueo, preparando el payload...');
    setIsRecalculating(true);
    setRecalcError(null);

    try {
      // Se construye el payload a partir de los estados actuales (no de
      // crearRequestInicial) para preservar vectores y externos importados.
      // Se solicita explicitamente la trazabilidad del motor de auditoria.
      const payload: SimulacionGlobalRequest = {
        at: '2025',
        modulo: 'ingresos_14d1',
        patrimonio_personal: false,
        mostrar_formulas: true,
        vectores: vectores,
        externos: {
          ...externos,
          '14D1': atributo14D1 ? 1 : 0,
          CRRP: atributoCRRP ? 1 : 0,
        },
        digitados: { ingresos: digitados },
      };
      debugLog('3. Payload armado, a punto de disparar el fetch a FastAPI:', payload);

      const next = await recalcularCaso(payload);

      debugLog('4. Respuesta exitosa del backend:', next);
      setResponse(next);
      setHasChanges(false);
    } catch (error) {
      console.error('Fallo la ejecucion dentro del Try/Catch:', error);
      setRecalcError(
        'No fue posible comunicarse con el motor de calculo. Verifica que FastAPI este disponible.'
      );
    } finally {
      setIsRecalculating(false);
      debugLog('5. Ejecucion terminada (Finally).');
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isImporting) return;

    const input = event.currentTarget;
    setIsImporting(true);
    setRecalcError(null);

    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });

      const hojaVectores = workbook.Sheets['Vectores'];
      const hojaCalculadora = workbook.Sheets['Calculadora'];

      if (!hojaVectores || !hojaCalculadora) {
        throw new Error('El archivo no contiene las hojas "Vectores" y/o "Calculadora".');
      }

      const vectoresParseados = XLSX.utils
        .sheet_to_json<{ Id: string; Valor: string | number }>(hojaVectores)
        .reduce<Record<string, number>>((acumulador, fila) => {
          acumulador[fila.Id] = parseNumero(fila.Valor);
          return acumulador;
        }, {});

      const calculadoraParseada = XLSX.utils
        .sheet_to_json<{ Id: string; Valor: string | number }>(hojaCalculadora)
        .reduce<Record<string, number>>((acumulador, fila) => {
          acumulador[fila.Id] = parseNumero(fila.Valor);
          return acumulador;
        }, {});

      // Se persisten en el estado para que futuras recalculaciones no los pierdan.
      setVectores(vectoresParseados);
      setExternos(calculadoraParseada);

      const rutImportado = workbook.SheetNames.reduce<string | null>(
        (encontrado, nombreHoja) => {
          if (encontrado) return encontrado;
          const filas = XLSX.utils.sheet_to_json<Record<string, unknown>>(
            workbook.Sheets[nombreHoja],
            { defval: null }
          );
          const fila = filas.find((f) => f.RUT != null && String(f.RUT).trim() !== '');
          return fila ? String(fila.RUT).trim() : null;
        },
        null
      );

      if (rutImportado) {
        debugLog('[Excel P1] RUT importado:', rutImportado);
        setRutSeleccionado(rutImportado);
      }

      const digitadosVacios: DigitadosIngresos = {
        monto_no_percibido: {},
        no_considerar_patrimonio: {},
        factura_renta_presunta: {},
        ingresos_ano: {},
        ingresos_adeudados_at_anterior: {},
      };

      const payload: SimulacionGlobalRequest = {
        at: '2025',
        modulo: 'ingresos_14d1',
        patrimonio_personal: false,
        mostrar_formulas: true,
        vectores: vectoresParseados,
        externos: { ...calculadoraParseada, '14D1': atributo14D1 ? 1 : 0, CRRP: atributoCRRP ? 1 : 0 },
        digitados: { ingresos: digitadosVacios },
      };

      const next = await recalcularCaso(payload);
      setResponse(next);
      setDigitados(digitadosVacios);
      setHasChanges(false);
    } catch (error) {
      console.error('Fallo la importacion del Excel:', error);
      setRecalcError('No fue posible importar el archivo Excel. Verifica que contenga las hojas "Vectores" y "Calculadora".');
    } finally {
      setIsImporting(false);
      input.value = '';
    }
  };

  return {
    response,
    digitados,
    hasChanges,
    isRecalculating,
    isImporting,
    rutSeleccionado,
    atributo14D1,
    atributoCRRP,
    recalcError,
    selectedField,
    isInspectorOpen,
    showAllRows,
    setRutSeleccionado,
    setAtributo14D1,
    setAtributoCRRP,
    setHasChanges,
    setIsInspectorOpen,
    setShowAllRows,
    handleRecalcularCaso,
    handleFileUpload,
    handleRevertir,
    handleDigitadoChange,
    openInspector,
  };
};