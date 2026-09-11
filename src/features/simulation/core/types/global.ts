import type { DigitadosIngresos, IngresosResponseData } from '../../pages/ingresos/types/ingresos';
import type { DigitadosEgresos, EgresosResponseData } from '../../pages/egresos/types/egresos';
import type { DigitadosRetiros, RetirosResponseData, RreTemporal } from '../../pages/retiros/types/retiros';

/** Clave estable de pagina para indexar el estado digitado del orquestador. */
export type PaginaKey = 'ingresos' | 'egresos' | 'retiros';

/**
 * Entradas digitadas por el usuario, agrupadas por pagina.
 * Conforme se implementen las demas paginas, este nodo acumulara
 * determinacion-rli, etc.
 *
 * `rre` es un bloque temporal aparte (no pertenece a Retiros): variables del
 * Registro de Renta Empresarial que Retiros reenvia para calcular [1044]/[1045].
 */
export interface DigitadosGlobal {
  ingresos: DigitadosIngresos;
  egresos: DigitadosEgresos;
  retiros: DigitadosRetiros;
  rre: RreTemporal;
}

/** Payload global del Orquestador (unifica todos los modulos). */
export interface SimulacionGlobalRequest {
  at: string;
  patrimonio_personal: boolean | null;
  /** Flag para solicitar al motor la trazabilidad de formulas reales. */
  mostrar_formulas?: boolean;
  vectores: Record<string, number>;
  /** Atributos y variables de contexto globales (Calc... y flags). */
  externos: Record<string, number | boolean>;
  digitados: DigitadosGlobal;
}

/** Respuesta normalizada de POST /api/v1/simulador/calcular (Orquestador Global). */
export interface SimulacionGlobalResponse {
  ingresos: IngresosResponseData;
  egresos: EgresosResponseData | null;
  retiros: RetirosResponseData | null;
}

