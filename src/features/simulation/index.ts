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
export { EgresosPage } from './pages/egresos/EgresosPage';
export { EgresosTable } from './pages/egresos/EgresosTable';
export { FILA_META_EGRESOS, NOMBRES_OFICIALES_EGRESOS } from './pages/egresos/data/egresosCatalog';
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
  DigitadosEgresos,
  FilaEgreso,
  AvisosEgresos,
  EgresosResponseData,
} from './pages/egresos/types/egresos';
export type {
  SimulacionGlobalRequest,
  SimulacionGlobalResponse,
  DigitadosGlobal,
  PaginaKey,
} from './core/types/global';
export type {
  FieldTraceability,
  IntermediateFactor,
  BackendInspector,
  BackendVariableUsada,
} from './core/types/inspector';