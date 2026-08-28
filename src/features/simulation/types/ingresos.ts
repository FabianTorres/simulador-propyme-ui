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

/** Payload global del Orquestador (unifica todos los modulos). */
export interface SimulacionGlobalRequest {
  at: string;
  modulo: string;
  patrimonio_personal: boolean;
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
}

export interface TotalesIngresos {
  fila_7_12: string;
  fila_7_total: string;
}

/** Flags de UI que el backend calcula; el frontend solo aplica. */
export interface AvisosIngresos {
  aviso_montos_propuestos_7_10: boolean;
  aviso_arriendos_bienes_raices: boolean;
  mostrar_columna_patrimonio: boolean;
  mostrar_columna_renta_presunta: boolean;
}

/** Datos de respuesta para la Pagina 1 (Ingresos) dentro del wrapper global. */
export interface IngresosResponseData {
  filas: FilaIngreso[];
  totales: TotalesIngresos;
  avisos: AvisosIngresos;
}

/** Respuesta normalizada de POST /api/v1/simulador/calcular (Orquestador Global). */
export interface SimulacionGlobalResponse {
  ingresos: IngresosResponseData;
}
