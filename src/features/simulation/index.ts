/**
 * Módulo de Simulación Tributaria — Simulador Propyme.
 *
 * Barrel export: reexporta tipos, API, componentes y catálogos de datos
 * para simplificar los imports entre páginas del simulador.
 *
 * Uso recomendado:
 *   import { IncomeTable, crearRequestInicial, recalcularCaso } from '@/features/simulation';
 */
export { SimulationShell } from './core/components/SimulationShell';
export { IncomeTable } from './pages/ingresos/IncomeTable';
export { IngresosPage } from './pages/ingresos/IngresosPage';
export { FormulaInspector } from './core/components/FormulaInspector';
export { crearRequestInicial, obtenerRespuestaInicial, recalcularCaso, SIMULADOR_ENDPOINT } from './api/simuladorApi';
export { FILA_META, NOMBRES_OFICIALES_INGRESOS } from './pages/ingresos/data/incomeCatalog';
export type { FilaMeta } from './pages/ingresos/data/incomeCatalog';
export type {
  DigitadosIngresos,
  FilaIngreso,
  AvisosIngresos,
  IngresosResponseData,
} from './pages/ingresos/types/ingresos';
export type {
  SimulacionGlobalRequest,
  SimulacionGlobalResponse,
  DigitadosGlobal,
} from './core/types/global';
export type {
  FieldTraceability,
  IntermediateFactor,
  BackendInspector,
  BackendVariableUsada,
} from './core/types/inspector';