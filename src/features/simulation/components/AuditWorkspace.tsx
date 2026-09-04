/**
 * AuditWorkspace — Orquestador presentacional de la Pagina 1 (Ingresos).
 *
 * Dumb UI: este componente es pura presentacion. Delega toda la logica de
 * estado al hook useSimulador y la barra de control a GlobalControlBar.
 * No hay formulas tributarias, calculos ni acceso directo a la API.
 */
import { useState } from 'react';
import { FormulaInspector } from './FormulaInspector';
import { IncomeTable } from './IncomeTable';
import { GlobalControlBar } from './GlobalControlBar';
import { PatrimonioModal } from './PatrimonioModal';
import { useSimulador } from '../hooks/useSimulador';
import { FILA_META } from '../data/incomeCatalog';
import type { BackendInspector, DigitadosIngresos, FilaIngreso, SimulacionGlobalResponse } from '../types/ingresos';
import type { FieldTraceability, IntermediateFactor } from '../types/inspector';
import { parseNumero } from '../../../utils/parsers';
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
/* Trazabilidad para la Caja de Cristal (metadata QA, no logica tributaria) */
type SeccionCategoria = 'resultado' | 'neto' | 'noPercibido' | 'patrimonio' | 'rentaPresunta' | 'adeudados';

const categoriaSeccion = (key: string): SeccionCategoria => {
  if (key.startsWith('adeudados_')) return 'adeudados';
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
const etiquetaPorSeccion: Record<SeccionCategoria, string> = {
  resultado: 'Monto Ingreso Percibido',
  neto: 'Ingresos del Año (Neto) — Propuesta del motor',
  noPercibido: 'Monto No Percibido del Año (Neto)',
  patrimonio: 'No Considerar: es de Patrimonio Personal',
  rentaPresunta: 'Facturas de Actividad de Renta Presunta',
  adeudados: 'Ingresos percibidos de montos adeudados de AT anterior',
};

/**
 * Mapea la trazabilidad real devuelta por el motor de auditoria del backend
 * a la interfaz FieldTraceability. Tiene prioridad sobre la metadata estatica
 * local (FILA_META).
 *
 * La llave del inspector se obtiene a partir del prefix del campo (neto_,
 * adeudados_, percibido_) para apuntar al diccionario inspectores de la fila.
 */
const trazabilidadDesdeBackend = (
  key: string,
  fila: FilaIngreso,
  seccion: SeccionCategoria
): FieldTraceability => {
  const llaveInspector = key.startsWith('neto_')
    ? 'ingresos_ano'
    : key.startsWith('adeudados_')
      ? 'ingresos_adeudados_at_anterior'
      : key.startsWith('noPerc_')
        ? 'monto_no_percibido'
        : key.startsWith('patrimonio_')
          ? 'no_considerar_patrimonio'
          : key.startsWith('presunta_')
            ? 'factura_renta_presunta'
            : key.startsWith('percibido_')
              ? 'monto_ingreso_percibido'
              : 'monto_ingreso_percibido';
  const inspector = fila.inspectores?.[llaveInspector] as BackendInspector;
  const meta = FILA_META[fila.codigo];
  return {
    fieldId: key,
    casillaCode:
      meta?.codigoF22 != null
        ? `F22 [C${meta.codigoF22}] · Fila ${fila.codigo}`
        : `Fila ${fila.codigo}`,
    label: `${etiquetaPorSeccion[seccion]} — ${fila.concepto.slice(0, 46)}${fila.concepto.length > 46 ? '…' : ''}`,
    calculatedValue: parseNumero(inspector.valor),
    formula: inspector.literal,
    evaluatedExpression: inspector.evaluado,
    calculationSteps: inspector.pasos,
    isManualInput:
      inspector.pasos.length === 0 &&
      inspector.variables_usadas.length === 1 &&
      inspector.variables_usadas[0].origen === 'digitado',
    factors: inspector.variables_usadas.map((variable) => ({
      name: variable.nombre,
      source: variable.origen,
      value: parseNumero(variable.valor),
    })),
    legalReference: meta?.referenciaLegal ?? 'docs/Pagina_1_14D1.md',
    status: 'ok',
  };
};

function construirTrazabilidad(
  key: string,
  response: SimulacionGlobalResponse,
  digitados: DigitadosIngresos
): FieldTraceability {
  const { filas } = response.ingresos;
  const codigo = parteCodigo(key);
  const fila = filas.find((f) => f.codigo === codigo);
  const seccion = categoriaSeccion(key);
  if (!fila) {
    return {
      fieldId: key,
      casillaCode: `Fila ${codigo}`,
      label: 'Campo de Página 1 — Ingresos',
      calculatedValue: 0,
      formula: '—',
      evaluatedExpression: undefined,
      calculationSteps: [],
      isManualInput: false,
      factors: [],
      legalReference: 'docs/Pagina_1_14D1.md',
      status: 'ok',
    };
  }
  const meta = FILA_META[codigo];
  // Si el motor de auditoria devolvio trazabilidad especifica para la celda,
  // se prioriza sobre la metadata local.
  const llaveInspector = key.startsWith('neto_')
    ? 'ingresos_ano'
    : key.startsWith('adeudados_')
      ? 'ingresos_adeudados_at_anterior'
      : key.startsWith('noPerc_')
        ? 'monto_no_percibido'
        : key.startsWith('patrimonio_')
          ? 'no_considerar_patrimonio'
          : key.startsWith('presunta_')
            ? 'factura_renta_presunta'
            : key.startsWith('percibido_')
              ? 'monto_ingreso_percibido'
              : undefined;
  const celdaInspector = llaveInspector != null ? fila.inspectores?.[llaveInspector] : undefined;
  if (celdaInspector) {
    return trazabilidadDesdeBackend(key, fila, seccion);
  }
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
  return {
    fieldId: key,
    casillaCode: meta.codigoF22 !== null ? `F22 [C${meta.codigoF22}] · Fila ${codigo}` : `Fila ${codigo}`,
    label: `${etiquetaPorSeccion[seccion]} — ${fila.concepto.slice(0, 46)}${fila.concepto.length > 46 ? '…' : ''}`,
    calculatedValue: valorCampo,
    formula: meta.formula,
    evaluatedExpression: undefined,
    calculationSteps: [],
    isManualInput: true,
    factors: factorIngresos(fila, digitados),
    legalReference: meta.referenciaLegal,
    status: 'ok',
  };
}
/* -------------------------------------------------------------------------- */
/* AuditWorkspace — Pagina 1 (Ingresos) del Simulador Propyme                 */
/* -------------------------------------------------------------------------- */
export const AuditWorkspace = () => {
  const [activePageId, setActivePageId] = useState<number>(1);
  const simulador = useSimulador();
  const activeTrace = construirTrazabilidad(simulador.selectedField, simulador.response, simulador.digitados);

  const avisoValor1 = simulador.response.ingresos.avisos.valor1_pcalc;
  const avisoValor2 = simulador.response.ingresos.avisos.valor2_pcalc;
  const requiresModal = simulador.response.ingresos.avisos.mostrar_columna_patrimonio && avisoValor1 !== undefined && avisoValor2 !== undefined && simulador.patrimonioPersonal === null;
  return (
    <div className="space-y-4">
      {/* ===== 1. BARRA GLOBAL DE CONTROL Y PERSISTENCIA ===== */}
      <GlobalControlBar
        hasChanges={simulador.hasChanges}
        isRecalculating={simulador.isRecalculating}
        isImporting={simulador.isImporting}
        rutSeleccionado={simulador.rutSeleccionado}
        atributo14D1={simulador.atributo14D1}
        atributoCRRP={simulador.atributoCRRP}
        setRutSeleccionado={simulador.setRutSeleccionado}
        setAtributo14D1={simulador.setAtributo14D1}
        setAtributoCRRP={simulador.setAtributoCRRP}
        setHasChanges={simulador.setHasChanges}
        handleRecalcularCaso={simulador.handleRecalcularCaso}
        handleFileUpload={simulador.handleFileUpload}
      />
      {/* ===== 2. Banner "Modificaciones en memoria" (dirty state) ===== */}
      {simulador.hasChanges && (
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
            onClick={simulador.handleRevertir}
            className="text-xs font-semibold text-amber-800 underline decoration-amber-500/60 underline-offset-2 hover:text-amber-950 cursor-pointer"
          >
            Revertir cambios
          </button>
        </div>
      )}
      {/* ===== 3. Error de calculo ===== */}
      {simulador.recalcError && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-2xl px-4 py-3 flex items-start gap-3">
          <span className="mt-0.5 w-5 h-5 shrink-0 rounded-lg bg-red-500/20 text-red-700 flex items-center justify-center font-bold text-xs">!</span>
          <div className="text-xs text-red-900 leading-relaxed flex-1">{simulador.recalcError}</div>
        </div>
      )}
      {/* ===== 4. Navegador de Paginas (8 Tabs del SII) ===== */}
      <nav>
        <ul className="flex gap-1.5 flex-wrap">
          {siiPages.map((page) => {
            const isActive = page.id === activePageId;
            return (
              <li key={page.id}>
                <button
                  type="button"
                  onClick={() => setActivePageId(page.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-600/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  <span>{page.shortName}</span>
                  <span className={`ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-indigo-500/30 text-indigo-100' : 'bg-slate-100 text-slate-500'
                  }`}>
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
            <h2 className="text-sm font-bold text-white tracking-tight">Página 1 · Ingresos Por Ventas del Año</h2>

          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Switch "Desplegar totalidad de las filas" */}
          <button
            type="button"
            onClick={() => simulador.setShowAllRows((v) => !v)}
            aria-pressed={simulador.showAllRows}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              simulador.showAllRows
                ? 'bg-cyan-400/20 border-cyan-400/40 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
            }`}
          >
            <span
              className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-black transition-colors ${
                simulador.showAllRows ? 'bg-cyan-400 text-slate-950' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {simulador.showAllRows ? '✓' : ''}
            </span>
            Desplegar totalidad de las filas
          </button>
        </div>
      </section>
      {/* ===== Tarjeta de la Tabla ===== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Banner avisos de bienes raices */}
        {simulador.response.ingresos.avisos.aviso_arriendos_bienes_raices && (
          <div className="mx-4 mt-4 bg-cyan-50 border border-cyan-200 rounded-xl px-4 py-3 flex items-start gap-3 shadow-2xs">
            <span className="mt-0.5 w-6 h-6 shrink-0 rounded-lg bg-cyan-500/20 text-cyan-700 flex items-center justify-center font-bold text-xs font-serif">
              i
            </span>
            <div className="text-xs text-cyan-900 leading-relaxed font-medium">
              Si el ingreso proveniente del arrendamiento de bienes raíces se encuentra facturado e incluido en ítems anteriores de ingresos, correspondería rebajarlas en "Ingresos percibidos provenientes de arriendos de bienes raíces" para no duplicar dicho ingreso.
            </div>
          </div>
        )}
        <IncomeTable
          response={simulador.response.ingresos}
          digitados={simulador.digitados}
          showAllRows={simulador.showAllRows}
          onDigitadoChange={simulador.handleDigitadoChange}
          onOpenInspector={simulador.openInspector}
        />
      </div>
      {/* ===== Slide-Over Drawer (Caja de Cristal) ===== */}
      <FormulaInspector
        trace={activeTrace}
        isOpen={simulador.isInspectorOpen}
        onClose={() => simulador.setIsInspectorOpen(false)}
      />

      {/* ===== Modal Empresario Individual (Patrimonio Personal) ===== */}
      <PatrimonioModal
        isOpen={requiresModal}
        valor1={avisoValor1 ?? 0}
        valor2={avisoValor2 ?? 0}
        onRespond={(res) => {
          simulador.handleRecalcularCaso(res);
        }}
      />
    </div>
  );
};
