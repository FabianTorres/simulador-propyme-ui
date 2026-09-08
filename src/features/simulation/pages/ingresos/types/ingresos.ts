import type { BackendInspector } from '../../../core/types/inspector';

/** Valores digitados por el usuario en la Página 1 (estado "sucio"). */
export interface DigitadosIngresos {
  monto_no_percibido: Record<string, number>;
  no_considerar_patrimonio: Record<string, number>;
  factura_renta_presunta: Record<string, number>;
  ingresos_ano: Record<string, number>;
  ingresos_adeudados_at_anterior?: Record<string, number>;
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
