/**
 * Catalogo de Metadatos QA — Pagina 2 (Egresos).
 *
 * Dumb UI: este catalogo contiene SOLO texto de auditoria (formula
 * descriptiva, explicacion y referencia legal de cada partida) extraido de
 * docs/Pagina_2_Egresos.md. No contiene logica de negocio ni calculos;
 * alimenta la Caja de Cristal (FormulaInspector) y el renderizado de la grilla.
 */
import type { FilaMeta } from '../../ingresos/data/incomeCatalog';

export const FILA_META_EGRESOS: Record<string, FilaMeta> = {
  '8.1': { signo: '(+)', codigoF22: 1406, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Gasto por saldo inicial de existencias o insumos del negocio en cambio de regimen.', referenciaLegal: 'Art. 14 letra D) LIR' },
  '8.2': { signo: '(+)', codigoF22: 1407, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Gasto por saldo inicial de activo fijo en cambio de regimen.', referenciaLegal: 'Art. 14 letra D) LIR' },
  '8.3': { signo: '(+)', codigoF22: 1408, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Gasto por perdida tributaria en cambio de regimen.', referenciaLegal: 'Art. 14 letra D) LIR' },
  '8.4': { signo: '(+)', codigoF22: 1409, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Compras y/o servicios internas del giro o facturas de compra emitidas.', referenciaLegal: 'Art. 14 letra D) N° 3 LIR' },
  '8.6': { signo: '(+)', codigoF22: 1409, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Importaciones del giro.', referenciaLegal: 'Art. 14 letra D) N° 3 LIR' },
  '8.7': { signo: '(−)', codigoF22: 1409, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Notas de credito recibidas. Rebajan la base de egresos.', referenciaLegal: 'Art. 14 letra D) N° 3 LIR' },
  '8.8': { signo: '(+)', codigoF22: 1409, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Notas de debito recibidas.', referenciaLegal: 'Art. 14 letra D) N° 3 LIR' },
  '8.9': { signo: '(+)', codigoF22: 1409, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Compras y/o servicios sin derecho a credito fiscal relacionados con el giro.', referenciaLegal: 'Art. 14 letra D) N° 3 LIR' },
  '8.11': { signo: '(+)', codigoF22: 1409, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Facturas de proveedores supermercados y comercios similares del giro.', referenciaLegal: 'Art. 14 letra D) N° 3 LIR' },
  '8.31': { signo: '(+)', codigoF22: 1818, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Existencias, insumos y servicios del negocio adeudados y pagados en el ejercicio.', referenciaLegal: 'Art. 14 letra D) N° 3 LIR' },
  '8.5': { signo: '(+)', codigoF22: 1413, formula: 'POS(Egresos + Monto adeudados en el ejercicio anterior y pagados en el ejercicio actual - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Compras internas e importaciones del activo fijo.', referenciaLegal: 'Art. 14 letra D) N° 3 LIR' },
  '8.10': { signo: '(+)', codigoF22: 1413, formula: 'POS(Egresos + Monto adeudados en el ejercicio anterior y pagados en el ejercicio actual - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Facturas por adquisicion o construccion de bienes inmuebles, cuotas pagadas.', referenciaLegal: 'Art. 14 letra D) N° 3 LIR' },
  '8.12': { signo: '(+)', codigoF22: 1426, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Perdidas tributarias de ejercicios anteriores.', referenciaLegal: 'Art. 31 N° 3 LIR' },
  '8.13': { signo: '(+)', codigoF22: 1429, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Gastos de rentas de fuente extranjera.', referenciaLegal: 'Art. 41 LIR' },
  '8.14': { signo: '(+)', codigoF22: 1411, formula: 'POS(Egresos + Monto adeudados en el ejercicio anterior y pagados en el ejercicio actual - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Remuneraciones pagadas.', referenciaLegal: 'Art. 31 LIR' },
  '8.15': { signo: '(+)', codigoF22: 1412, formula: 'POS(Egresos + Monto adeudados en el ejercicio anterior y pagados en el ejercicio actual - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Honorarios pagados.', referenciaLegal: 'Art. 31 LIR' },
  '8.17': { signo: '(+)', codigoF22: 1415, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Arriendos pagados.', referenciaLegal: 'Art. 31 LIR' },
  '8.18': { signo: '(+)', codigoF22: 1416, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Gastos por responsabilidad social.', referenciaLegal: 'Art. 31 LIR' },
  '8.19': { signo: '(+)', codigoF22: 1417, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Gastos por inversion en investigacion y desarrollo no certificados por CORFO.', referenciaLegal: 'Ley I+D (CORFO)' },
  '8.20': { signo: '(+)', codigoF22: 1418, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Gastos por inversion en investigacion y desarrollo certificados por CORFO.', referenciaLegal: 'Ley I+D (CORFO)' },
  '8.21': { signo: '(+)', codigoF22: 1424, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Impuestos pagados excepto impuestos a la renta.', referenciaLegal: 'Art. 31 LIR' },
  '8.22': { signo: '(+)', codigoF22: 1419, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Intereses y reajustes pagados por prestamos y otros.', referenciaLegal: 'Art. 31 N° 1 LIR' },
  '8.23': { signo: '(+)', codigoF22: 1425, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Gastos o egresos pagados o adeudados por operaciones con empresas relacionadas.', referenciaLegal: 'Art. 14 letra A) LIR' },
  '8.24': { signo: '(+)', codigoF22: 1424, formula: 'POS(Egresos + Monto adeudados en el ejercicio anterior y pagados en el ejercicio actual - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Otros gastos deducibles de los ingresos, pagados e incluyendo correccion monetaria.', referenciaLegal: 'Art. 31 LIR' },
  '8.25': { signo: '(+)', codigoF22: 1421, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Ajuste por partidas del inciso 1° y 3° del art. 21 de la LIR pagados.', referenciaLegal: 'Art. 21 inc. 1° y 3° LIR' },
  '8.26': { signo: '(+)', codigoF22: 1422, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Ajuste por partidas del art. 21 inc. 1° y 2° LIR pagados.', referenciaLegal: 'Art. 21 inc. 1° y 2° LIR' },
  '8.27': { signo: '(+)', codigoF22: 1423, formula: 'POS(Egresos + Monto adeudados en el ejercicio anterior y pagados en el ejercicio actual - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Perdida en rescate o enajenacion de inversiones o bienes no depreciables.', referenciaLegal: 'Art. 41 LIR' },
  '8.28': { signo: '(+)', codigoF22: 1427, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Creditos incobrables castigados en el ejercicio.', referenciaLegal: 'Art. 31 N° 4 LIR' },
  '8.29': { signo: '(+)', codigoF22: 1428, formula: 'POS(Egresos - No Pagadas - No Considerar: es de Patrimonio Personal - Facturas de Actividad de Renta Presunta)', explicacion: 'Gastos aceptados por donaciones.', referenciaLegal: 'Ley de donaciones' },
  '8': { signo: '(=)', codigoF22: 1430, formula: '8.1 + 8.2 + 8.3 + 8.4 + 8.5 + 8.6 - 8.7 + 8.8 + 8.9 + 8.10 + 8.11 + 8.13 + 8.14 + 8.15 + 8.17 + 8.18 + 8.19 + 8.20 + 8.21 + 8.22 + 8.23 + 8.24 + 8.25 + 8.26 + 8.27 + 8.28 + 8.29 + 8.31', explicacion: 'TOTAL EGRESOS — alimenta la Linea 1 del Formulario 22.', referenciaLegal: 'Art. 14 letra D) LIR' },
};

/**
 * Nombres oficiales de cada partida segun la glosa del SII (Formulario 22).
 * Se usa en la columna de concepto de la grilla para reemplazar los nombres
 * resumidos que entrega el backend. Las claves coinciden con fila.codigo.
 */
export const NOMBRES_OFICIALES_EGRESOS: Record<string, string> = {
  '8.1': 'Gasto por saldo inicial de existencias o insumos del negocio en cambio de régimen',
  '8.2': 'Gasto por saldo inicial de activo fijo en cambio de régimen',
  '8.3': 'Gasto por pérdida tributaria en cambio de régimen',
  '8.4': 'Compras y/o Servicios Internas del Giro o Facturas de Compra Emitidas (no incluir las Facturas recibidas de proveedores Supermercados y comercios similares) (Cód. 520 F29)',
  '8.6': 'Importaciones del Giro (Cód. 535 F29)',
  '8.7': 'Notas de Crédito recibidas (Cód. 528 F29)',
  '8.8': 'Notas de Débito recibidas (Cód. 532 F29)',
  '8.9': 'Compras y/o Servicios Sin derecho a Crédito Fiscal que digan relación con el giro del negocio (Cód. 521 + 560 + 562 F29)',
  '8.11': 'Facturas recibidas de Proveedores: Supermercados y Comercios similares que sean del giro del negocio (Cód. 762 F29)',
  '8.31': 'Existencias, insumos y servicios del negocio adeudados en el ejercicio anterior y pagados en el ejercicio actual',
  '8.5': 'Compras Internas e Importaciones del Activo Fijo (Cód. 525 y 553 F29)',
  '8.10': 'Facturas recibidas por adquisición o construcción de bienes inmuebles (Cód. 766 F29) (cuotas efectivamente pagadas)',
  '8.12': 'Pérdidas tributarias de ejercicios anteriores',
  '8.13': 'Gastos de rentas de fuente extranjera',
  '8.14': 'Remuneraciones pagadas',
  '8.15': 'Honorarios pagadas',
  '8.17': 'Arriendos pagados',
  '8.18': 'Gastos por responsabilidad social',
  '8.19': 'Gastos por inversión en investigación y desarrollo no certificados por CORFO',
  '8.20': 'Gastos por inversión en investigación y desarrollo certificados por CORFO',
  '8.21': 'Impuestos Pagados excepto Impuestos a la Renta',
  '8.22': 'Intereses y reajustes pagados por préstamos y otros',
  '8.23': 'Gastos o egresos pagados o adeudados por operaciones con empresas relacionadas del art. 14 letra A) LIR (depurados de notas de débito y crédito)',
  '8.24': 'Otros gastos deducibles de los ingresos (pagados e incluyendo corrección monetaria)',
  '8.25': 'Ajuste por partidas del inciso 1° y 3° del art. 21 de la LIR pagados',
  '8.26': 'Ajuste por partidas del art. 21 inc. 1° no afectados con IU 40% y del inc. 2° LIR pagados',
  '8.27': 'Pérdida en rescate o enajenación de inversiones o bienes no depreciables',
  '8.28': 'Créditos incobrables castigados en el ejercicio (reconocidos sobre ingresos devengados)',
  '8.29': 'Gastos aceptados por donaciones',
  '8': 'TOTAL EGRESOS',
};

/**
 * Orden canonico de las filas de la Pagina 2 segun docs/Pagina_2_Egresos.md.
 * Se usa en la tabla para no depender del orden en que el backend entregue
 * el array `filas`.
 */
export const ORDEN_FILAS_EGRESOS: string[] = [
  '8.1', '8.2', '8.3', '8.4', '8.6', '8.7', '8.8', '8.9', '8.11', '8.31',
  '8.5', '8.10', '8.12', '8.13', '8.14', '8.15', '8.17', '8.18', '8.19', '8.20',
  '8.21', '8.22', '8.23', '8.24', '8.25', '8.26', '8.27', '8.28', '8.29', '8',
];
