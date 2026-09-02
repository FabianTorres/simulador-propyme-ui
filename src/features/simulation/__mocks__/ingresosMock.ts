/**
 * Fixtures de maqueta (QA) — Pagina 1 (Ingresos).
 *
 * Datos estaticos que simulan la respuesta del motor FastAPI mientras
 * el backend no esta desplegado. No contienen logica de negocio.
 *
 * Separados del cliente HTTP (simuladorApi.ts) para mantener el transporte
 * limpio y permitir que los mocks crezcan con futuras paginas sin ensuciar
 * el modulo de API.
 */
import type { FilaIngreso, SimulacionGlobalRequest, SimulacionGlobalResponse } from '../types/ingresos';

/** Request inicial — valores digitados por defecto de la maqueta. */
export const crearRequestInicial = (): SimulacionGlobalRequest => ({
  at: '2025',
  modulo: 'ingresos_14d1',
  patrimonio_personal: false,
  externos: { Calc4064: 0, Calc4075: 0 },
  vectores: {
    Vx010042: 1,
    Vx014255: 300000,
  },
  digitados: {
    ingresos: {
      monto_no_percibido: { '7.2': 100000 },
      no_considerar_patrimonio: {},
      factura_renta_presunta: {},
      ingresos_ano: { '7.11': 150000 },
    },
  },
});
/**
 * FIXTURE de filas — captura de la respuesta de FastAPI para
 * crearRequestInicial(). Los montos ya fueron calculados por el motor
 * 14D1 (Python); este frontend solo los pinta.
 */
export const MOCK_FILAS_SII: FilaIngreso[] = [
  { codigo: '7.1', concepto: 'Exportaciones (Cód. 20 F29)', codigo_f22: 1400, ingresos_ano: '2400000', ingresos_adeudados_at_anterior: '50000', monto_ingreso_percibido: '2450000' },
  { codigo: '7.2', concepto: 'Facturas por ventas y servicios gravados (Cód. 502, 717 y 501 F29)', codigo_f22: 1400, ingresos_ano: '3600000', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '3500000' },
  { codigo: '7.3', concepto: 'Ventas y/o Servicios prestados Exentos, o No Gravados (Cód. 142 y 715 F29)', codigo_f22: 1400, ingresos_ano: '800000', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '800000' },
  { codigo: '7.4', concepto: 'Ventas con retención sobre el margen de comercialización (Contrib. Retenidos) (Cód. 732 F29)', codigo_f22: 1400, ingresos_ano: '1200000', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '1200000' },
  { codigo: '7.5', concepto: 'Fact. Compra recibidas Retención total (Cont. retenidos) y fact. de inicio emitida (Cód. 587 F29)', codigo_f22: 1400, ingresos_ano: '0', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '0' },
  { codigo: '7.6', concepto: 'Fact. de Compra recibidas con retención parcial (Cód. 720 F29)', codigo_f22: 1400, ingresos_ano: '0', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '0' },
  { codigo: '7.7', concepto: 'Boletas y Comprobante o recibo de pago de transacciones transbank (Cód. 111 y 759 F29)', codigo_f22: 1400, ingresos_ano: '900000', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '900000' },
  { codigo: '7.8', concepto: 'Notas de Crédito emitidas por ventas y servicios (Cód. 510, 709 y 734 F29)', codigo_f22: 1400, ingresos_ano: '0', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '0' },
  { codigo: '7.9', concepto: 'Notas de débito emitidas (Cód. 513 F29)', codigo_f22: 1400, ingresos_ano: '0', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '0' },
  { codigo: '7.10', concepto: 'Ingresos devengados del giro ejercicios anteriores y percibidos en el ejercicio', codigo_f22: 1817, ingresos_ano: '300000', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '300000' },
  { codigo: '7.11', concepto: 'Ingresos pagados según contratos no facturados', codigo_f22: 1400, ingresos_ano: '150000', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '150000' },
  { codigo: '7.12', concepto: 'Total Ingresos por ventas y servicios', codigo_f22: 1400, ingresos_ano: '9050000', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '0' },
  { codigo: '7.13', concepto: 'Ingresos pagados según contratos con Empresas Relacionadas', codigo_f22: 1587, ingresos_ano: '0', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '0' },
  { codigo: '7.14', concepto: 'Mayor valor por rescate o enajenación de inversiones o bienes no depreciables', codigo_f22: 1403, ingresos_ano: '600000', ingresos_adeudados_at_anterior: '80000', monto_ingreso_percibido: '680000' },
  { codigo: '7.15', concepto: 'Ingresos percibidos provenientes de arriendos de bienes raíces', codigo_f22: 1588, ingresos_ano: '320000', ingresos_adeudados_at_anterior: '400000', monto_ingreso_percibido: '720000' },
  { codigo: '7.16', concepto: 'Ingresos percibidos o devengados por operaciones con empresas relacionadas del art. 14 letra A) LIR', codigo_f22: 1587, ingresos_ano: '0', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '0' },
  { codigo: '7.17', concepto: 'Intereses Directos', codigo_f22: 1402, ingresos_ano: '0', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '0' },
  { codigo: '7.18', concepto: 'Intereses Indirectos', codigo_f22: 1402, ingresos_ano: '0', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '0' },
  { codigo: '7.19', concepto: 'Renta de fuente extranjera percibidas', codigo_f22: 1401, ingresos_ano: '0', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '0' },
  { codigo: '7.20', concepto: 'Otros ingresos percibidos o devengados', codigo_f22: 1588, ingresos_ano: '0', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '0' },
  { codigo: '7.25', concepto: 'Ingreso diferido pendiente de tributación de acuerdo al art. 14 letra D) N°8, letra d) de la LIR', codigo_f22: null, ingresos_ano: '0', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '0' },
  { codigo: '7.26', concepto: 'Incremento Ingreso diferido pendiente de tributación del art. 14 letra D) N°8, letra d) de la LIR', codigo_f22: null, ingresos_ano: '0', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '0' },
  { codigo: '7.27', concepto: 'Crédito sobre Activos Fijos Adquiridos en el ejercicio', codigo_f22: 1405, ingresos_ano: '0', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '0' },
  { codigo: '7', concepto: 'TOTAL INGRESOS', codigo_f22: 1410, ingresos_ano: '0', ingresos_adeudados_at_anterior: '0', monto_ingreso_percibido: '10750000' },
];

/** Respuesta completa del motor para crearRequestInicial() (captura QA). */
export const MOCK_RESPUESTA_SII: SimulacionGlobalResponse = {
  ingresos: {
    filas: MOCK_FILAS_SII,
    // Flags de UI calculados por el motor; el frontend solo los aplica.
    avisos: {
      aviso_montos_propuestos_7_10: true,
      aviso_arriendos_bienes_raices: true,
      mostrar_columna_patrimonio: true,
      mostrar_columna_renta_presunta: false,
    },
  },
};

