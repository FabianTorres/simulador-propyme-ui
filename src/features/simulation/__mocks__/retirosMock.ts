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

/**
 * Ejemplo QA con 4 filas (mismo caso del doc Pagina_3_Retiros.md): el socio
 * 1-9 con dos fechas son dos objetos, sin agrupar por RUT.
 */
export const crearDigitadosRetirosEjemplo = (): DigitadosRetiros => ({
  filas: [
    { rut: '1-9', usufructuario: null, acciones: 50, f1_fecha: '02/01/2025', f1_monto: 100, f1_isfut_h: 0, f1_isfut_a: 0, saldo: 20, f2_fecha: '', f2_monto: 0, f2_isfut_h: 0, f2_isfut_a: 0, es_registro_nuevo: false },
    { rut: '1-9', usufructuario: null, acciones: 0, f1_fecha: '02/02/2025', f1_monto: 50, f1_isfut_h: 8, f1_isfut_a: 0, saldo: 0, f2_fecha: '', f2_monto: 0, f2_isfut_h: 0, f2_isfut_a: 0, es_registro_nuevo: false },
    { rut: '2-7', usufructuario: null, acciones: 50, f1_fecha: '02/03/2025', f1_monto: 25, f1_isfut_h: 0, f1_isfut_a: 0, saldo: 0, f2_fecha: '', f2_monto: 0, f2_isfut_h: 0, f2_isfut_a: 0, es_registro_nuevo: false },
    { rut: '3-5', usufructuario: 1, acciones: 0, f1_fecha: '02/04/2025', f1_monto: 25, f1_isfut_h: 0, f1_isfut_a: 0, saldo: 0, f2_fecha: '', f2_monto: 0, f2_isfut_h: 0, f2_isfut_a: 0, es_registro_nuevo: true },
  ],
});

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
