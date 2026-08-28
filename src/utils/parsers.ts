/**
 * Utilidades compartidas de presentacion — Simulador Propyme.
 *
 * Dumb UI: estos helpers manejan parseo y formato de datos numericos.
 * No contienen logica tributaria ni calculos de negocio.  Todos los
 * montos ya vienen pre-calculados desde el backend (FastAPI).
 */

/** Convierte un valor (string, number, null o undefined) a numero finito; 0 como fallback. */
export const parseNumero = (valor: string | number | null | undefined): number => {
  const n = typeof valor === 'number' ? valor : Number(valor);
  return Number.isFinite(n) ? n : 0;
};

/** Formatea un numero como monto en pesos chilenos con separador de miles. */
export const formatMonto = (valor: number): string =>
  `$${valor.toLocaleString('es-CL')}`;
/** Logger condicional: solo emite en desarrollo, silencioso en produccion. */
export const debugLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};