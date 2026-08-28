/**
 * Módulo de Simulación Tributaria — Simulador Propyme.
 *
 * Barrel export: reexporta tipos, API, componentes y catálogos de datos
 * para simplificar los imports entre páginas del simulador.
 *
 * Uso recomendado:
 *   import { IncomeTable, crearRequestInicial, recalcularCaso } from '@/features/simulation';
 */
export { IncomeTable } from './components/IncomeTable';
export { AuditWorkspace } from './components/AuditWorkspace';
export { FormulaInspector } from './components/FormulaInspector';
export { crearRequestInicial, obtenerRespuestaInicial, recalcularCaso, SIMULADOR_ENDPOINT } from './api/simuladorApi';
export { FILA_META, NOMBRES_OFICIALES_INGRESOS } from './data/incomeCatalog';
export type { FilaMeta } from './data/incomeCatalog';
export type {
  DigitadosIngresos,
  FilaIngreso,
  TotalesIngresos,
  AvisosIngresos,
  IngresosResponseData,
  SimulacionGlobalRequest,
  SimulacionGlobalResponse,
} from './types/ingresos';
export type { FieldTraceability, IntermediateFactor } from './types/inspector';