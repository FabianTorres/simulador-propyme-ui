/**
 * Contratos de API — Página 1 (Ingresos) · Simulador Propyme
 *
 * El frontend es una "Dumb UI": los montos calculados los entrega el
 * backend (FastAPI). Estas interfaces describen el *payload* del POST
 * `/api/v1/simulador/ingresos` y la respuesta normalizada que consume
 * la grilla de Auditoría.
 *
 * Convención: estructuras en inglés, conceptos de negocio tributario en
 * castellano (mismo criterio que el resto del repo).
 */

/** Valores digitados por el usuario en la Página 1 (estado "sucio"). */
export interface DigitadosIngresos {
  monto_no_percibido: Record<string, number>;
  no_considerar_patrimonio: Record<string, number>;
  factura_renta_presunta: Record<string, number>;
  ingresos_ano: Record<string, number>;
  ingresos_adeudados_at_anterior?: Record<string, number>;
}

/** Variable usada por el motor de auditoria para trazar una formula. */
export interface BackendVariableUsada {
  nombre: string;
  valor: string;
  origen: string;
}

/** Trazabilidad matematica devuelta por el motor de auditoria (Caja de Cristal). */
export interface BackendInspector {
  valor: string;
  literal: string;
  evaluado: string;
  pasos: string[];
  variables_usadas: BackendVariableUsada[];
}

/** Payload global del Orquestador (unifica todos los modulos). */
export interface SimulacionGlobalRequest {
  at: string;
  modulo: string;
  patrimonio_personal: boolean | null;
  /** Flag para solicitar al motor la trazabilidad de formulas reales. */
  mostrar_formulas?: boolean;
  externos: Record<string, number>;
  vectores: Record<string, number>;
  digitados: {
    ingresos: DigitadosIngresos;
  };
}

/** Fila normalizada de la tabla de Ingresos devuelta por el backend. */
export interface FilaIngreso {
  /** Código de columna de la partida (ej: "7.1", "7.12", "7"). */
  codigo: string;
  concepto: string;
  /** Código del Formulario 22 (null para partidas sin código de guerra). */
  codigo_f22: number | null;
  /** Columna B — Ingresos del Año (Neto). Propuesta del motor. */
  ingresos_ano: string;
  /** Columna A/H — Ingresos percibidos de montos adeudados de AT anterior. */
  ingresos_adeudados_at_anterior: string;
  /** Columna F — Monto Ingreso Percibido (resultado del backend). */
  monto_ingreso_percibido: string;
  /** Columna C — Monto No Percibido del Año (Neto), cuando el backend lo entrega (ej. fila 7.12). */
  monto_no_percibido?: string | null;
  /** Columna D — No Considerar Patrimonio Personal, cuando el backend lo entrega (ej. fila 7.12). */
  no_considerar_patrimonio?: string | null;
  /** Columna E — Facturas de Actividad de Renta Presunta, cuando el backend lo entrega (ej. fila 7.12). */
  factura_renta_presunta?: string | null;
  /** Diccionario de trazabilidad por celda, enviado por el motor de auditoria. */
  inspectores?: Record<string, BackendInspector>;
}

export interface AvisosIngresos {
  aviso_montos_propuestos_7_10: boolean;
  aviso_arriendos_bienes_raices: boolean;
  mostrar_columna_patrimonio: boolean;
  mostrar_columna_renta_presunta: boolean;
  valor1_pcalc?: number;
  valor2_pcalc?: number;
}

/** Datos de respuesta para la Pagina 1 (Ingresos) dentro del wrapper global. */
export interface IngresosResponseData {
  filas: FilaIngreso[];
  avisos: AvisosIngresos;
}

/** Respuesta normalizada de POST /api/v1/simulador/calcular (Orquestador Global). */
export interface SimulacionGlobalResponse {
  ingresos: IngresosResponseData;
}
