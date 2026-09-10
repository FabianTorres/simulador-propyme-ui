/**
 * Fixtures de maqueta (QA) — Pagina 2 (Egresos).
 *
 * Datos estaticos que simulan la respuesta del motor FastAPI mientras
 * el backend no esta desplegado. No contienen logica de negocio.
 */
import type { DigitadosEgresos, EgresosResponseData, FilaEgreso } from '../pages/egresos/types/egresos';

/** Valores digitados vacios de Egresos (para el request inicial e importacion). */
export const crearDigitadosEgresosVacios = (): DigitadosEgresos => ({
  no_pagadas: {},
  no_considerar_patrimonio: {},
  factura_renta_presunta: {},
  egresos_ano: {},
  egresos_adeudados_at_anterior: {},
});

/**
 * FIXTURE de filas — captura de la respuesta de FastAPI. Los montos ya
 * fueron calculados por el motor 14D1 (Python); este frontend solo los pinta.
 */
export const MOCK_FILAS_EGRESOS: FilaEgreso[] = [
  { codigo: '8.1', concepto: 'Gasto por saldo inicial de existencias o insumos del negocio en cambio de régimen', codigo_f22: 1406, egresos_ano: '500000', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '500000' },
  { codigo: '8.2', concepto: 'Gasto por saldo inicial de activo fijo en cambio de régimen', codigo_f22: 1407, egresos_ano: '1200000', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '1200000' },
  { codigo: '8.3', concepto: 'Gasto por pérdida tributaria en cambio de régimen', codigo_f22: 1408, egresos_ano: '300000', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '300000' },
  { codigo: '8.4', concepto: 'Compras y/o Servicios Internas del Giro o Facturas de Compra Emitidas', codigo_f22: 1409, egresos_ano: '3000000', egresos_adeudados_at_anterior: '200000', monto_egresos_pagados: '3000000' },
  { codigo: '8.6', concepto: 'Importaciones del Giro', codigo_f22: 1409, egresos_ano: '800000', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '800000' },
  { codigo: '8.7', concepto: 'Notas de Crédito recibidas', codigo_f22: 1409, egresos_ano: '150000', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '-150000' },
  { codigo: '8.8', concepto: 'Notas de Débito recibidas', codigo_f22: 1409, egresos_ano: '250000', egresos_adeudados_at_anterior: '50000', monto_egresos_pagados: '250000' },
  { codigo: '8.9', concepto: 'Compras y/o Servicios Sin derecho a Crédito Fiscal que digan relación con el giro del negocio', codigo_f22: 1409, egresos_ano: '900000', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '900000' },
  { codigo: '8.11', concepto: 'Facturas recibidas de Proveedores: Supermercados y Comercios similares que sean del giro del negocio', codigo_f22: 1409, egresos_ano: '400000', egresos_adeudados_at_anterior: '100000', monto_egresos_pagados: '400000' },
  { codigo: '8.31', concepto: 'Existencias, insumos y servicios del negocio adeudados en el ejercicio anterior y pagados en el ejercicio actual', codigo_f22: 1818, egresos_ano: '350000', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '350000' },
  { codigo: '8.5', concepto: 'Compras Internas e Importaciones del Activo Fijo', codigo_f22: 1413, egresos_ano: '1500000', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '1500000' },
  { codigo: '8.10', concepto: 'Facturas recibidas por adquisición o construcción de bienes inmuebles', codigo_f22: 1413, egresos_ano: '600000', egresos_adeudados_at_anterior: '150000', monto_egresos_pagados: '600000' },
  { codigo: '8.12', concepto: 'Pérdidas tributarias de ejercicios anteriores', codigo_f22: 1426, egresos_ano: '0', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '0' },
  { codigo: '8.13', concepto: 'Gastos de rentas de fuente extranjera', codigo_f22: 1429, egresos_ano: '0', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '0' },
  { codigo: '8.14', concepto: 'Remuneraciones pagadas', codigo_f22: 1411, egresos_ano: '2000000', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '2000000' },
  { codigo: '8.15', concepto: 'Honorarios pagadas', codigo_f22: 1412, egresos_ano: '700000', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '700000' },
  { codigo: '8.17', concepto: 'Arriendos pagados', codigo_f22: 1415, egresos_ano: '1200000', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '1200000' },
  { codigo: '8.18', concepto: 'Gastos por responsabilidad social', codigo_f22: 1416, egresos_ano: '0', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '0' },
  { codigo: '8.19', concepto: 'Gastos por inversión en investigación y desarrollo no certificados por CORFO', codigo_f22: 1417, egresos_ano: '0', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '0' },
  { codigo: '8.20', concepto: 'Gastos por inversión en investigación y desarrollo certificados por CORFO', codigo_f22: 1418, egresos_ano: '0', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '0' },
  { codigo: '8.21', concepto: 'Impuestos Pagados excepto Impuestos a la Renta', codigo_f22: 1424, egresos_ano: '350000', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '350000' },
  { codigo: '8.22', concepto: 'Intereses y reajustes pagados por préstamos y otros', codigo_f22: 1419, egresos_ano: '180000', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '180000' },
  { codigo: '8.23', concepto: 'Gastos o egresos pagados o adeudados por operaciones con empresas relacionadas del art. 14 letra A) LIR', codigo_f22: 1425, egresos_ano: '0', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '0' },
  { codigo: '8.24', concepto: 'Otros gastos deducibles de los ingresos (pagados e incluyendo corrección monetaria)', codigo_f22: 1424, egresos_ano: '450000', egresos_adeudados_at_anterior: '250000', monto_egresos_pagados: '450000' },
  { codigo: '8.25', concepto: 'Ajuste por partidas del inciso 1° y 3° del art. 21 de la LIR pagados', codigo_f22: 1421, egresos_ano: '0', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '0' },
  { codigo: '8.26', concepto: 'Ajuste por partidas del art. 21 inc. 1° no afectados con IU 40% y del inc. 2° LIR pagados', codigo_f22: 1422, egresos_ano: '0', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '0' },
  { codigo: '8.27', concepto: 'Pérdida en rescate o enajenación de inversiones o bienes no depreciables', codigo_f22: 1423, egresos_ano: '80000', egresos_adeudados_at_anterior: '30000', monto_egresos_pagados: '80000' },
  { codigo: '8.28', concepto: 'Créditos incobrables castigados en el ejercicio (reconocidos sobre ingresos devengados)', codigo_f22: 1427, egresos_ano: '0', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '0' },
  { codigo: '8.29', concepto: 'Gastos aceptados por donaciones', codigo_f22: 1428, egresos_ano: '0', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '0' },
  { codigo: '8', concepto: 'TOTAL EGRESOS', codigo_f22: 1430, egresos_ano: '0', egresos_adeudados_at_anterior: '0', monto_egresos_pagados: '13810000' },
];

/** Respuesta completa del motor para la Pagina 2 (captura QA). */
export const MOCK_RESPUESTA_EGRESOS: EgresosResponseData = {
  filas: MOCK_FILAS_EGRESOS,
  // Flags de UI calculados por el motor; el frontend solo los aplica.
  avisos: {
    aviso_arriendos_pagados: true,
    mostrar_columna_patrimonio: true,
    mostrar_columna_renta_presunta: false,
  },
};
