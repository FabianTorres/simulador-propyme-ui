import type { BackendInspector } from '../../../core/types/inspector';

/**
 * Contratos de la Pagina 3 — Retiros (14D1).
 *
 * Dumb UI: aqui solo se describen las formas de datos que viajan hacia y desde
 * el backend. No hay reglas de negocio ni calculos; los montos llegan
 * pre-calculados desde FastAPI.
 *
 * Cada fila representa un socio (RET1) con una fecha (RET4) e incluye el grupo
 * "Retiros efectivos del ejercicio" (RET4-RET7) y "Devolucion de capital"
 * (RET9-RET12).
 */

/** Fila de Retiros tal como viaja en el request (estado "sucio" del analista). */
export interface RetiroFilaInput {
  /** Col. A (RET1) — RUT del socio. Texto. */
  rut: string;
  /** Col. B (RET2) — 1 = Usufructuario, 2 = Nudo propietario, null = "-". */
  usufructuario: number | null;
  /** Col. C (RET3) — Cantidad de acciones. */
  acciones: number;
  /** Col. D (RET4) — Fecha retiro "dd/mm/aaaa". */
  f1_fecha: string;
  /** Col. E (RET5) — Monto retiro. */
  f1_monto: number;
  /** Col. F (RET6) — Monto ISFUT_H. */
  f1_isfut_h: number;
  /** Col. G (RET7) — Monto ISFUT_A. */
  f1_isfut_a: number;
  /** Col. H (RET8) — Saldo monto de retiro en exceso AT-1. */
  saldo: number;
  /** Col. I (RET9) — Fecha devolucion de capital "dd/mm/aaaa". */
  f2_fecha: string;
  /** Col. J (RET10) — Monto devolucion de capital. */
  f2_monto: number;
  /** Col. K (RET11) — Monto ISFUT_H. */
  f2_isfut_h: number;
  /** Col. L (RET12) — Monto ISFUT_A. */
  f2_isfut_a: number;
  /** true si la fila fue creada/duplicada por el analista (no proviene del RIAC). */
  es_registro_nuevo: boolean;
}

/** Fila de Retiros devuelta por el backend (eco numerado). Los numeros son strings (Decimal). */
export interface RetiroFila {
  /** Posicion 1-based de la fila (para identificar cada registro). */
  fila: number;
  rut: string;
  usufructuario: number | null;
  acciones: string;
  f1_fecha: string;
  f1_monto: string;
  f1_isfut_h: string;
  f1_isfut_a: string;
  saldo: string;
  f2_fecha: string;
  f2_monto: string;
  f2_isfut_h: string;
  f2_isfut_a: string;
  es_registro_nuevo: boolean;
  /** RET5 >= RET6 + RET7 (el backend lo valida). */
  validacion_f1: boolean;
  /** RET10 >= RET11 + RET12 (el backend lo valida). */
  validacion_f2: boolean;
}

/** Variables internas de validacion calculadas por el motor ([1044] y [1045]). */
export interface CalculoRetiros {
  v1044: string;
  v1045: string;
}

/** Variable generada por socio/fecha para usos posteriores (RRE/RLI). No se renderiza. */
export interface DerivadaRetiro {
  codigo: string;
  rut: string;
  fecha: string | null;
  valor: string;
}

/** Totales calculados por el backend. */
export interface TotalesRetiros {
  /** Suma de todos los RET5. */
  ret30: string;
  /** Suma de todos los RET6. */
  ret15: string;
  /** Suma de RET6 por socio (RET1). */
  ret14: Record<string, string>;
}

/** Flags de habilitacion y validaciones globales que el frontend solo pinta. */
export interface AvisosRetiros {
  ret3_habilitado: boolean;
  ret6_habilitado: boolean;
  ret7_habilitado: boolean;
  ret11_habilitado: boolean;
  ret12_habilitado: boolean;
  validacion_1044_ok: boolean;
  validacion_1045_ok: boolean;
}

/** Valores digitados por el analista en la Pagina 3 (estado "sucio"). */
export interface DigitadosRetiros {
  filas: RetiroFilaInput[];
}

/** Bloque temporal de variables del RRE que Retiros reenvia (hoy en 0). */
export interface RreTemporal {
  h2: number;
  h3: number;
  h6: number;
  h7: number;
  i4: number;
  i17: number;
}

/** Datos de respuesta para la Pagina 3 (Retiros) dentro del wrapper global. */
export interface RetirosResponseData {
  filas: RetiroFila[];
  calculo: CalculoRetiros;
  derivadas: DerivadaRetiro[];
  totales: TotalesRetiros;
  avisos: AvisosRetiros;
  /** Diccionario de trazabilidad (Modo Auditoria); null si no se solicito. */
  inspectores: Record<string, BackendInspector> | null;
}

/** Crea una fila de Retiros con valores por defecto. */
export const crearRetiroFilaVacia = (
  es_registro_nuevo: boolean,
  rut = ''
): RetiroFilaInput => ({
  rut,
  usufructuario: null,
  acciones: 0,
  f1_fecha: '',
  f1_monto: 0,
  f1_isfut_h: 0,
  f1_isfut_a: 0,
  saldo: 0,
  f2_fecha: '',
  f2_monto: 0,
  f2_isfut_h: 0,
  f2_isfut_a: 0,
  es_registro_nuevo,
});
