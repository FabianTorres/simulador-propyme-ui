/**
 * Fixtures de maqueta (QA) — Pagina 3 (Retiros).
 *
 * El backend no siembra el RIAC: si se envia `retiros.filas: []` la respuesta
 * llega vacia. Por eso aqui solo se definen formas vacias (sin datos demo) que
 * permiten pintar la pantalla antes del primer recalculo.
 */
import type {
  DigitadosRetiros,
  RetirosResponseData,
  RreTemporal,
} from '../pages/retiros/types/retiros';

/** Valores digitados vacios de Retiros (request inicial e importacion). */
export const crearDigitadosRetirosVacios = (): DigitadosRetiros => ({ filas: [] });

/** Bloque temporal del RRE con valores en 0 (RRE aun no implementado). */
export const crearRreVacio = (): RreTemporal => ({
  h2: 0,
  h3: 0,
  h6: 0,
  h7: 0,
  i4: 0,
  i17: 0,
});

/** Nodo `retiros` vacio (mismo shape que entrega el motor, sin filas). */
export const crearRetirosVacio = (): RetirosResponseData => ({
  filas: [],
  calculo: { v1044: '0', v1045: '0' },
  derivadas: [],
  totales: { ret30: '0', ret15: '0', ret14: {} },
  avisos: {
    ret3_habilitado: false,
    ret6_habilitado: false,
    ret7_habilitado: false,
    ret11_habilitado: false,
    ret12_habilitado: false,
    validacion_1044_ok: true,
    validacion_1045_ok: true,
  },
  inspectores: null,
});
