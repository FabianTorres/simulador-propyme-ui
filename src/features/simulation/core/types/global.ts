import type { DigitadosIngresos, IngresosResponseData } from '../../pages/ingresos/types/ingresos';

/**
 * Entradas digitadas por el usuario, agrupadas por pagina.
 * Conforme se implementen las demas paginas, este nodo acumulara
 * egresos, retiros, etc.
 */
export interface DigitadosGlobal {
  ingresos: DigitadosIngresos;
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
}
