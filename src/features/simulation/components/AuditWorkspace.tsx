/**
 * AuditWorkspace — Orquestador de la Página 1 (Ingresos).
 *
 * Dumb UI: este componente es SOLO el orquestador. Mantiene el estado local
 * (response, digitados, flags de UI), dibuja el esqueleto de la página y
 * delega la grilla a <IncomeTable />. No hay fórmulas tributarias aquí; el
 * trace de la Caja de Cristal es metadata QA (incomeCatalog.ts) + datos que
 * ya vienen calculados desde el backend (FastAPI).
 */
import { useState, type ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { FormulaInspector } from './FormulaInspector';
import { IncomeTable } from './IncomeTable';
import {
  crearRequestInicial,
  obtenerRespuestaInicial,
  recalcularIngresos,
} from '../api/ingresosApi';
import { FILA_META } from '../data/incomeCatalog';
import type {
  DigitadosIngresos,
  FilaIngreso,
  SimulacionGlobalRequest,
  SimulacionGlobalResponse,
} from '../types/ingresos';
import type { FieldTraceability, IntermediateFactor } from '../types/inspector';

/* -------------------------------------------------------------------------- */
/* Navegador de Páginas (8 Tabs del SII)                                      */
/* -------------------------------------------------------------------------- */

const parseNumero = (valor: string | number | null | undefined): number => {
  const n = typeof valor === 'number' ? valor : Number(valor);
  return Number.isFinite(n) ? n : 0;
};

interface SiiPageTab {
  id: number;
  name: string;
  shortName: string;
  badge: string;
}

const siiPages: SiiPageTab[] = [
  { id: 1, name: 'Página 1: Ingresos por Ventas del Año', shortName: '1. Ingresos', badge: '22 filas' },
  { id: 2, name: 'Página 2: Egresos', shortName: '2. Egresos', badge: '4 campos' },
  { id: 3, name: 'Página 3: Retiros', shortName: '3. Retiros', badge: 'Cálculo' },
  { id: 4, name: 'Página 4: Determinación RLI', shortName: '4. RLI', badge: '1 campo' },
  { id: 5, name: 'Página 5: Base Imponible', shortName: '5. Base Imp.', badge: 'Cálculo' },
  { id: 6, name: 'Página 6: Capital Propio Tributario', shortName: '6. KPT', badge: 'Cálculo' },
  { id: 7, name: 'Página 7: Registro de Renta Empresarial', shortName: '7. RRE', badge: 'Resumen' },
  { id: 8, name: 'Página 8: Resumen y Envío de DJ', shortName: '8. Resumen y Envío', badge: 'Cierre' },
];

/** RUTs disponibles por defecto en el selector de la barra superior. */
const RUTS_POR_DEFECTO = [
  '76.123.456-7',
  '77.987.654-K',
  '78.111.222-3',
];

/* -------------------------------------------------------------------------- */
/* Trazabilidad para la Caja de Cristal (metadata QA, no lógica tributaria)  */
/* -------------------------------------------------------------------------- */

type SeccionCategoria = 'resultado' | 'neto' | 'noPercibido' | 'patrimonio' | 'rentaPresunta';

const categoriaSeccion = (key: string): SeccionCategoria => {
  if (key.startsWith('noPerc_')) return 'noPercibido';
  if (key.startsWith('patrimonio_')) return 'patrimonio';
  if (key.startsWith('presunta_')) return 'rentaPresunta';
  if (key.startsWith('neto_')) return 'neto';
  return 'resultado';
};

const parteCodigo = (key: string): string => key.split('_').pop() ?? '7.1';

const factorIngresos = (
  fila: FilaIngreso,
  digitados: DigitadosIngresos
): IntermediateFactor[] => {
  const codigo = fila.codigo;
  return [
    { name: 'Ingresos percibidos AT anterior', source: 'Col. A (propuesta)', value: parseNumero(fila.ingresos_adeudados_at_anterior) },
    { name: 'Ingresos del año (Neto)', source: 'Col. B (backend)', value: parseNumero(fila.ingresos_ano) },
    { name: 'Monto No Percibido', source: 'Col. C (digitado)', value: digitados.monto_no_percibido[codigo] ?? 0 },
    { name: 'Patrimonio Personal', source: 'Col. D (digitado)', value: digitados.no_considerar_patrimonio[codigo] ?? 0 },
    { name: 'Renta Presunta', source: 'Col. E (digitado)', value: digitados.factura_renta_presunta[codigo] ?? 0 },
  ];
};

function construirTrazabilidad(
  key: string,
  response: SimulacionGlobalResponse,
  digitados: DigitadosIngresos
): FieldTraceability {
  const { filas, totales } = response.ingresos;

  // Totales consolidados (7.12 y 7).
  if (key === 'total_7_12' || key === 'total_7') {
    const es12 = key === 'total_7_12';
    const valor = es12
      ? parseNumero(totales.fila_7_12)
      : parseNumero(totales.fila_7_total);
    return {
      fieldId: key,
      casillaCode: es12 ? 'F22 [C1400] · Subtotal 7.12' : 'F22 [C1410] · Fila 7 TOTAL',
      label: es12 ? 'Total por Ventas y Servicios (7.12)' : 'TOTAL INGRESOS — Línea 1 F22',
      calculatedValue: valor,
      formula: es12
        ? 'POS(7.1 + 7.2 + 7.3 + 7.4 + 7.5 + 7.6 + 7.7 − 7.8 + 7.9 + 7.11)'
        : '7.12 + 7.13 + 7.14 + 7.15 + 7.16 + 7.17 + 7.18 + 7.19 + 7.20 + 7.25 + 7.26 + 7.27 + 7.10',
      explanation: es12
        ? 'Subtotal de las ventas y servicios del giro antes de las deducciones de la Línea 2 (F22).'
        : 'Total consolidado de ingresos percibidos que alimenta la Línea 1 del Formulario 22 (C1410).',
      factors: filas
        .filter((f) =>
          es12 ? f.codigo !== '7' : f.codigo !== '7' && f.codigo !== '7.12'
        )
        .map((f) => ({
          name: `Fila ${f.codigo} · ${f.concepto.slice(0, 42)}${f.concepto.length > 42 ? '…' : ''}`,
          source: es12 ? 'Col. B (Neto)' : 'Col. F (Percibido)',
          value: es12 ? parseNumero(f.ingresos_ano) : parseNumero(f.monto_ingreso_percibido),
        })),
      legalReference: 'Art. 14 letra D) LIR · Línea 1 F22',
      status: 'ok',
    };
  }

  const codigo = parteCodigo(key);
  const fila = filas.find((f) => f.codigo === codigo);
  if (!fila) {
    return {
      fieldId: key,
      casillaCode: `Fila ${codigo}`,
      label: 'Campo de Página 1 — Ingresos',
      calculatedValue: 0,
      formula: '—',
      explanation: 'La partida no posee valores propuestos en el caso.',
      factors: [],
      legalReference: 'docs/Pagina_1_14D1.md',
      status: 'ok',
    };
  }

  const meta = FILA_META[codigo];
  const seccion = categoriaSeccion(key);
  const valorCampo =
    seccion === 'neto'
      ? parseNumero(fila.ingresos_ano)
      : seccion === 'noPercibido'
        ? (digitados.monto_no_percibido[codigo] ?? 0)
        : seccion === 'patrimonio'
          ? (digitados.no_considerar_patrimonio[codigo] ?? 0)
          : seccion === 'rentaPresunta'
            ? (digitados.factura_renta_presunta[codigo] ?? 0)
            : parseNumero(fila.monto_ingreso_percibido);

  const etiquetaPorSeccion: Record<SeccionCategoria, string> = {
    resultado: 'Monto Ingreso Percibido',
    neto: 'Ingresos del Año (Neto) — Propuesta del motor',
    noPercibido: 'Monto No Percibido del Año (Neto)',
    patrimonio: 'No Considerar: es de Patrimonio Personal',
    rentaPresunta: 'Facturas de Actividad de Renta Presunta',
  };

  return {
    fieldId: key,
    casillaCode: meta.codigoF22 !== null ? `F22 [C${meta.codigoF22}] · Fila ${codigo}` : `Fila ${codigo}`,
    label: `${etiquetaPorSeccion[seccion]} — ${fila.concepto.slice(0, 46)}${fila.concepto.length > 46 ? '…' : ''}`,
    calculatedValue: valorCampo,
    formula: meta.formula,
    explanation: meta.explicacion,
    factors: factorIngresos(fila, digitados),
    legalReference: meta.referenciaLegal,
    status: 'ok',
  };
}

/* -------------------------------------------------------------------------- */
/* AuditWorkspace — Página 1 (Ingresos) del Simulador Propyme                 */
/* -------------------------------------------------------------------------- */

export const AuditWorkspace = () => {
  const [activePageId, setActivePageId] = useState<number>(1);
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
    setHasChanges(false);
    setShowAllRows(false);
    setSelectedField('total_7');
    setRecalcError(null);
  };

  const handleRecalcularCaso = async () => {
    console.log("1. Botón clickeado correctamente!");

    if (isRecalculating) {
      console.log("❌ Cancelado: Ya estaba recalculando.");
      return;
    }

    console.log("2. Pasó el bloqueo, preparando el payload...");
    setIsRecalculating(true);
    setRecalcError(null);

    try {
      // Ojo aquí: si crearRequestInicial falla, esto revienta y salta al catch
      const payload: SimulacionGlobalRequest = {
        ...crearRequestInicial(),
        digitados: { ingresos: digitados },
      };
      // Inyectar atributos tributarios globales en externos para que el motor los considere.
      payload.externos = {
        ...payload.externos,
        '14D1': atributo14D1 ? 1 : 0,
        CRRP: atributoCRRP ? 1 : 0,
      };
      console.log("3. Payload armado, a punto de disparar el fetch a FastAPI:", payload);

      const next = await recalcularIngresos(payload);

      console.log("4. Respuesta exitosa del backend:", next);
      setResponse(next);
      setHasChanges(false);
    } catch (error) {
      console.error("🚨 Falló la ejecución dentro del Try/Catch:", error);
      setRecalcError('No fue posible comunicarse con el motor de cálculo. Verifica que FastAPI esté disponible.');
    } finally {
      setIsRecalculating(false);
      console.log("5. Ejecución terminada (Finally).");
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isImporting) {
      return;
    }

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

      const vectores = XLSX.utils
        .sheet_to_json<{ Id: string; Valor: string | number }>(hojaVectores)
        .reduce<Record<string, number>>((acumulador, fila) => {
          acumulador[fila.Id] = parseNumero(fila.Valor);
          return acumulador;
        }, {});

      const calculadora = XLSX.utils
        .sheet_to_json<{ Id: string; Valor: string | number }>(hojaCalculadora)
        .reduce<Record<string, number>>((acumulador, fila) => {
          acumulador[fila.Id] = parseNumero(fila.Valor);
          return acumulador;
        }, {});

      // RUT opcional: primera fila disponible con columna "RUT".
      const rutImportado = workbook.SheetNames.reduce<string | null>((encontrado, nombreHoja) => {
        if (encontrado) {
          return encontrado;
        }
        const filas = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          workbook.Sheets[nombreHoja],
          { defval: null }
        );
        const fila = filas.find((f) => f.RUT != null && String(f.RUT).trim() !== '');
        return fila ? String(fila.RUT).trim() : null;
      }, null);

      if (rutImportado) {
        console.info('[Excel P1] RUT importado:', rutImportado);
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
        ...crearRequestInicial(),
        vectores,
        // Inyectar atributos tributarios globales para que el motor los considere.
        externos: {
          ...calculadora,
          '14D1': atributo14D1 ? 1 : 0,
          CRRP: atributoCRRP ? 1 : 0,
        },
        digitados: { ingresos: digitadosVacios },
      };

      const next = await recalcularIngresos(payload);
      setResponse(next);
      setDigitados(digitadosVacios);
      setHasChanges(false);
    } catch (error) {
      console.error('🚨 Falló la importación del Excel:', error);
      setRecalcError('No fue posible importar el archivo Excel. Verifica que contenga las hojas "Vectores" y "Calculadora".');
    } finally {
      setIsImporting(false);
      input.value = '';
    }
  };

  const activeTrace = construirTrazabilidad(selectedField, response, digitados);

  return (
    <div className="space-y-4">
      {/* ===== 1. BARRA GLOBAL DE CONTROL Y PERSISTENCIA ===== */}
      <section className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col gap-0">
        {/* ----- Fila 1: Contexto del Contribuyente ----- */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                RUT Caso:
              </span>
              <select
                value={rutSeleccionado}
                onChange={(event) => setRutSeleccionado(event.target.value)}
                className="font-mono text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 cursor-pointer shadow-2xs"
              >
                <option value="76.123.456-7">76.123.456-7 · Serv. Ingeniería SpA</option>
                <option value="77.987.654-K">77.987.654-K · Comercializadora Sur Ltda.</option>
                <option value="78.111.222-3">78.111.222-3 · Consultora Tech EIRL</option>
                {!RUTS_POR_DEFECTO.includes(rutSeleccionado) && (
                  <option value={rutSeleccionado}>{rutSeleccionado} · Datos Importados</option>
                )}
              </select>
            </div>

            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
              hasChanges
                ? 'bg-amber-50 text-amber-800 border-amber-200/80'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${hasChanges ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              {hasChanges ? 'Cambios pendientes' : 'Sincronizado'}
            </span>
          </div>

          {/* Toggles de atributos tributarios globales */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={atributo14D1}
                onChange={() => {
                  setAtributo14D1((prev) => !prev);
                  setHasChanges(true);
                }}
                className="sr-only peer"
              />
              <span className="w-7 h-4 rounded-full bg-slate-300 peer-checked:bg-indigo-500 relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-3" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
                14D1
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={atributoCRRP}
                onChange={() => {
                  setAtributoCRRP((prev) => !prev);
                  setHasChanges(true);
                }}
                className="sr-only peer"
              />
              <span className="w-7 h-4 rounded-full bg-slate-300 peer-checked:bg-cyan-500 relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-3" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
                CRRP
              </span>
            </label>
          </div>
        </div>

        {/* ----- Fila 2: Acciones Globales ----- */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <label
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl transition-all shadow-2xs ${
              isImporting
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-slate-50 hover:border-slate-300 cursor-pointer'
            }`}
          >
            {isImporting ? (
              <>
                <span className="inline-block w-3 h-3 rounded-full border-2 border-slate-400 border-t-slate-700 animate-spin" />
                Procesando Excel...
              </>
            ) : (
              'Importar Excel'
            )}
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isImporting}
            />
          </label>

          {/* BOTÓN CONECTADO AL BACKEND */}
          <button
            type="button"
            onClick={handleRecalcularCaso}
            disabled={!hasChanges || isRecalculating}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 ${
              !hasChanges || isRecalculating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30 cursor-pointer hover:shadow-md'
            }`}
          >
            {isRecalculating ? (
              <>
                <span className="inline-block w-3 h-3 rounded-full border-2 border-slate-500 border-t-white animate-spin align-middle" />
                Calculando...
              </>
            ) : (
              <><span>⚡</span> Recalcular Caso</>
            )}
          </button>

          <button
            type="button"
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-all shadow-2xs"
          >
            Exportar para automatizador
          </button>
        </div>
      </section>

      {/* ===== 2. Banner "Modificaciones en memoria" (dirty state) ===== */}
      {hasChanges && (
        <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 text-amber-900">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-semibold">
              Modificaciones en memoria: valores no enviados al motor. Presiona{' '}
              <strong>⚡ Recalcular Caso</strong> en la barra superior para persistir.
            </span>
          </div>
          <button
            type="button"
            onClick={handleRevertir}
            className="text-xs font-semibold text-amber-800 underline decoration-amber-500/60 underline-offset-2 hover:text-amber-950 cursor-pointer"
          >
            Revertir cambios
          </button>
        </div>
      )}

      {/* ===== 3. Error de cálculo ===== */}
      {recalcError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-xs text-rose-800 flex items-center gap-2.5">
          <span className="font-bold">⚠</span> {recalcError}
        </div>
      )}

      {/* ===== Navegador de 8 Páginas del SII ===== */}
      <nav className="bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-xs overflow-x-auto">
        <ul className="flex items-center gap-1.5 min-w-max">
          {siiPages.map((page) => {
            const isActive = activePageId === page.id;
            return (
              <li key={page.id}>
                <button
                  type="button"
                  onClick={() => setActivePageId(page.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span>{page.shortName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-indigo-700 text-white font-bold' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {page.badge}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ===== Panel Superior de Control ===== */}
      <section className="bg-slate-950 rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-4 shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center text-base">
            ⚡
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Página 1 · Ingresos</h2>
            <p className="text-[11px] text-slate-400 font-mono">
              POST /api/v1/simulador/calcular · Motor FastAPI
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Switch "Desplegar totalidad de las filas" */}
          <button
            type="button"
            onClick={() => setShowAllRows((v) => !v)}
            aria-pressed={showAllRows}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showAllRows
                ? 'bg-cyan-400/20 border-cyan-400/40 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
            }`}
          >
            <span
              className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-black transition-colors ${
                showAllRows ? 'bg-cyan-400 text-slate-950' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {showAllRows ? '✓' : ''}
            </span>
            Desplegar totalidad de las filas
          </button>


        </div>
      </section>

      {/* ===== Tarjeta de la Tabla ===== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Banner avisos de bienes raíces */}
        {response.ingresos.avisos.aviso_arriendos_bienes_raices && (
          <div className="mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="mt-0.5 w-6 h-6 shrink-0 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-xs">
              ⚠
            </span>
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-bold">Posible duplicación de ingresos:</strong>{' '}
              Si el ingreso proveniente del arrendamiento de bienes raíces se encuentra
              facturado e incluido en ítems anteriores de ingresos, correspondería rebajarlo
              en “Ingresos percibidos provenientes de arriendos de bienes raíces” para no
              duplicar dicho ingreso (Línea 7.15).
            </div>
          </div>
        )}

        <IncomeTable
          response={response.ingresos}
          digitados={digitados}
          showAllRows={showAllRows}
          onDigitadoChange={handleDigitadoChange}
          onOpenInspector={openInspector}
        />
      </div>

      {/* ===== Slide-Over Drawer (Caja de Cristal) ===== */}
      <FormulaInspector
        trace={activeTrace}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />
    </div>
  );
};
