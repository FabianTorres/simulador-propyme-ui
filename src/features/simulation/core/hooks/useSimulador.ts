/**
 * useSimulador — Custom hook que encapsula toda la logica de estado e
 * interacciones del Orquestador del Simulador Propyme.
 *
 * Dumb UI: este hook es el unico lugar donde reside el estado local
 * (response, digitados, flags de UI) y las funciones que lo manipulan.
 * Los componentes de presentacion solo consumen lo que este hook expone.
 * Cero calculos tributarios; todo viene pre-calculado del backend (FastAPI).
 */
import { useState, type ChangeEvent } from 'react';
import {
  crearRequestInicial,
  obtenerRespuestaInicial,
  recalcularCaso,
} from '../../api/simuladorApi';
import type {
  SimulacionGlobalRequest,
  SimulacionGlobalResponse,
} from '../types/global';
import type { DigitadosIngresos } from '../../pages/ingresos/types/ingresos';
import { RUTS_POR_DEFECTO } from '../data/ruts';
import { parseExcelWorkbook } from '../utils/excelImport';
import { debugLog } from '../../../../utils/parsers';

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
  patrimonioPersonal: boolean | null;

  /* ── Acciones ─────────────────────────────────────────── */
  setRutSeleccionado: (rut: string) => void;
  setAtributo14D1: (val: boolean | ((prev: boolean) => boolean)) => void;
  setAtributoCRRP: (val: boolean | ((prev: boolean) => boolean)) => void;
  setHasChanges: (val: boolean) => void;
  setIsInspectorOpen: (val: boolean) => void;
  setShowAllRows: (val: boolean | ((prev: boolean) => boolean)) => void;
  setPatrimonioPersonal: (val: boolean | null) => void;

  handleRecalcularCaso: (overridePatrimonio?: boolean) => Promise<void>;
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
  const [patrimonioPersonal, setPatrimonioPersonal] = useState<boolean | null>(null);

  // Memoria persistente de vectores y externos importados desde Excel
  // (se preservan entre recalculaciones para evitar amnesia de estado).
  const [vectores, setVectores] = useState<Record<string, number>>({});
  const [externos, setExternos] = useState<Record<string, number>>({});

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
    setPatrimonioPersonal(null);
    setHasChanges(false);
    setShowAllRows(false);
    setSelectedField('total_7');
    setRecalcError(null);
  };

  const handleRecalcularCaso = async (overridePatrimonio?: boolean) => {
    debugLog('1. Boton clickeado correctamente!');

    if (isRecalculating) {
      debugLog('Cancelado: Ya estaba recalculando.');
      return;
    }

    // Si viene un override, se aplica directamente para cerrar el modal
    // inmediatamente sin depender del ciclo de renderizado de React.
    if (overridePatrimonio !== undefined) {
      setPatrimonioPersonal(overridePatrimonio);
    }

    debugLog('2. Paso el bloqueo, preparando el payload...');
    setIsRecalculating(true);
    setRecalcError(null);

    try {
      const payload: SimulacionGlobalRequest = {
        at: '2025',
        patrimonio_personal:
          overridePatrimonio !== undefined ? overridePatrimonio : patrimonioPersonal,
        mostrar_formulas: true,
        vectores: vectores,
        externos: {
          ...externos,
          '14D1': atributo14D1 ? 1 : 0,
          CRRP: atributoCRRP,
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
      const { vectores: vectoresParseados, externos: calculadoraParseada, rut: rutImportado } =
        await parseExcelWorkbook(file);

      setVectores(vectoresParseados);
      setExternos(calculadoraParseada);

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
        patrimonio_personal: patrimonioPersonal,
        mostrar_formulas: true,
        vectores: vectoresParseados,
        externos: {
          ...calculadoraParseada,
          '14D1': atributo14D1 ? 1 : 0,
          CRRP: atributoCRRP,
        },
        digitados: { ingresos: digitadosVacios },
      };

      const next = await recalcularCaso(payload);
      setResponse(next);
      setDigitados(digitadosVacios);
      setHasChanges(false);
    } catch (error) {
      console.error('Fallo la importacion del Excel:', error);
      setRecalcError(
        'No fue posible importar el archivo Excel. Verifica que contenga las hojas "Vectores" y "Calculadora".'
      );
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
    patrimonioPersonal,
    setRutSeleccionado,
    setAtributo14D1,
    setAtributoCRRP,
    setHasChanges,
    setIsInspectorOpen,
    setShowAllRows,
    setPatrimonioPersonal,
    handleRecalcularCaso,
    handleFileUpload,
    handleRevertir,
    handleDigitadoChange,
    openInspector,
  };
};

