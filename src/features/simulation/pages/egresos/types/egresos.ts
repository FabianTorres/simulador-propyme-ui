import type { BackendInspector } from '../../../core/types/inspector';

/** Valores digitados por el usuario en la Pagina 2 (estado "sucio"). */
export interface DigitadosEgresos {
  no_pagadas: Record<string, number>;
  no_considerar_patrimonio: Record<string, number>;
  factura_renta_presunta: Record<string, number>;
  egresos_ano: Record<string, number>;
  egresos_adeudados_at_anterior?: Record<string, number>;
}

/** Fila normalizada de la tabla de Egresos devuelta por el backend. */
export interface FilaEgreso {
  /** Codigo de columna de la partida (ej: "8.1", "8"). */
  codigo: string;
  concepto: string;
  /** Codigo del Formulario 22 (null para partidas sin codigo). */
  codigo_f22: number | null;
  /** Columna B — Egresos del ano. Propuesta del motor. */
  egresos_ano: string;
  /** Columna H — Monto adeudados en el ejercicio anterior y pagados en el ejercicio actual. */
  egresos_adeudados_at_anterior: string;
  /** Columna F — Monto Compras o Egresos Pagados (resultado del backend). */
  monto_egresos_pagados: string;
  /** Columna C — No Pagadas del ano, cuando el backend lo entrega. */
  no_pagadas?: string | null;
  /** Columna D — No Considerar: es de Patrimonio Personal, cuando el backend lo entrega. */
  no_considerar_patrimonio?: string | null;
  /** Columna E — Facturas de Actividad de Renta Presunta, cuando el backend lo entrega. */
  factura_renta_presunta?: string | null;
  /** Diccionario de trazabilidad por celda, enviado por el motor de auditoria. */
  inspectores?: Record<string, BackendInspector>;
}

export interface AvisosEgresos {
  aviso_arriendos_pagados: boolean;
  mostrar_columna_patrimonio: boolean;
  mostrar_columna_renta_presunta: boolean;
}

/** Datos de respuesta para la Pagina 2 (Egresos) dentro del wrapper global. */
export interface EgresosResponseData {
  filas: FilaEgreso[];
  avisos: AvisosEgresos;
}
