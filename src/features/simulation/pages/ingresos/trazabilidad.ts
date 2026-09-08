import { FILA_META } from './data/incomeCatalog';
import type { BackendInspector, FieldTraceability, IntermediateFactor } from '../../core/types/inspector';
import type { SimulacionGlobalResponse } from '../../core/types/global';
import type { DigitadosIngresos, FilaIngreso } from './types/ingresos';
import { parseNumero } from '../../../../utils/parsers';

/* Trazabilidad para la Caja de Cristal (metadata QA, no logica tributaria) */
type SeccionCategoria = 'resultado' | 'neto' | 'noPercibido' | 'patrimonio' | 'rentaPresunta' | 'adeudados';

const categoriaSeccion = (key: string): SeccionCategoria => {
  if (key.startsWith('adeudados_')) return 'adeudados';
  if (key.startsWith('noPerc_')) return 'noPercibido';
  if (key.startsWith('patrimonio_')) return 'patrimonio';
  if (key.startsWith('presunta_')) return 'rentaPresunta';
  if (key.startsWith('neto_')) return 'neto';
  return 'resultado';
};

const parteCodigo = (key: string): string => key.split('_').pop() ?? '7.1';

const factorIngresos = (
  fila: FilaIngreso,
  digitados: DigitadosIngresos
): IntermediateFactor[] => {
  const codigo = fila.codigo;
  return [
    { name: 'Ingresos percibidos AT anterior', source: 'Col. A (propuesta)', value: parseNumero(fila.ingresos_adeudados_at_anterior) },
    { name: 'Ingresos del año (Neto)', source: 'Col. B (backend)', value: parseNumero(fila.ingresos_ano) },
    { name: 'Monto No Percibido', source: 'Col. C (digitado)', value: digitados.monto_no_percibido[codigo] ?? 0 },
    { name: 'Patrimonio Personal', source: 'Col. D (digitado)', value: digitados.no_considerar_patrimonio[codigo] ?? 0 },
    { name: 'Renta Presunta', source: 'Col. E (digitado)', value: digitados.factura_renta_presunta[codigo] ?? 0 },
  ];
};

const etiquetaPorSeccion: Record<SeccionCategoria, string> = {
  resultado: 'Monto Ingreso Percibido',
  neto: 'Ingresos del Año (Neto) — Propuesta del motor',
  noPercibido: 'Monto No Percibido del Año (Neto)',
  patrimonio: 'No Considerar: es de Patrimonio Personal',
  rentaPresunta: 'Facturas de Actividad de Renta Presunta',
  adeudados: 'Ingresos percibidos de montos adeudados de AT anterior',
};

const trazabilidadDesdeBackend = (
  key: string,
  fila: FilaIngreso,
  seccion: SeccionCategoria
): FieldTraceability => {
  const llaveInspector = key.startsWith('neto_')
    ? 'ingresos_ano'
    : key.startsWith('adeudados_')
      ? 'ingresos_adeudados_at_anterior'
      : key.startsWith('noPerc_')
        ? 'monto_no_percibido'
        : key.startsWith('patrimonio_')
          ? 'no_considerar_patrimonio'
          : key.startsWith('presunta_')
            ? 'factura_renta_presunta'
            : key.startsWith('percibido_')
              ? 'monto_ingreso_percibido'
              : 'monto_ingreso_percibido';
  const inspector = fila.inspectores?.[llaveInspector] as BackendInspector;
  const meta = FILA_META[fila.codigo];
  return {
    fieldId: key,
    casillaCode:
      meta?.codigoF22 != null
        ? `F22 [C${meta.codigoF22}] · Fila ${fila.codigo}`
        : `Fila ${fila.codigo}`,
    label: `${etiquetaPorSeccion[seccion]} — ${fila.concepto.slice(0, 46)}${fila.concepto.length > 46 ? '…' : ''}`,
    calculatedValue: parseNumero(inspector.valor),
    formula: inspector.literal,
    evaluatedExpression: inspector.evaluado,
    calculationSteps: inspector.pasos,
    isManualInput:
      inspector.pasos.length === 0 &&
      inspector.variables_usadas.length === 1 &&
      inspector.variables_usadas[0].origen === 'digitado',
    factors: inspector.variables_usadas.map((variable) => ({
      name: variable.nombre,
      source: variable.origen,
      value: parseNumero(variable.valor),
    })),
    legalReference: meta?.referenciaLegal ?? 'docs/Pagina_1_14D1.md',
    status: 'ok',
  };
};

export function construirTrazabilidad(
  key: string,
  response: SimulacionGlobalResponse,
  digitados: DigitadosIngresos
): FieldTraceability {
  const { filas } = response.ingresos;
  const codigo = parteCodigo(key);
  const fila = filas.find((f) => f.codigo === codigo);
  const seccion = categoriaSeccion(key);
  if (!fila) {
    return {
      fieldId: key,
      casillaCode: `Fila ${codigo}`,
      label: 'Campo de Página 1 — Ingresos',
      calculatedValue: 0,
      formula: '—',
      evaluatedExpression: undefined,
      calculationSteps: [],
      isManualInput: false,
      factors: [],
      legalReference: 'docs/Pagina_1_14D1.md',
      status: 'ok',
    };
  }
  const meta = FILA_META[codigo];
  const llaveInspector = key.startsWith('neto_')
    ? 'ingresos_ano'
    : key.startsWith('adeudados_')
      ? 'ingresos_adeudados_at_anterior'
      : key.startsWith('noPerc_')
        ? 'monto_no_percibido'
        : key.startsWith('patrimonio_')
          ? 'no_considerar_patrimonio'
          : key.startsWith('presunta_')
            ? 'factura_renta_presunta'
            : key.startsWith('percibido_')
              ? 'monto_ingreso_percibido'
              : undefined;
  const celdaInspector = llaveInspector != null ? fila.inspectores?.[llaveInspector] : undefined;
  if (celdaInspector) {
    return trazabilidadDesdeBackend(key, fila, seccion);
  }
  const valorCampo =
    seccion === 'neto'
      ? parseNumero(fila.ingresos_ano)
      : seccion === 'noPercibido'
        ? (digitados.monto_no_percibido[codigo] ?? 0)
        : seccion === 'patrimonio'
          ? (digitados.no_considerar_patrimonio[codigo] ?? 0)
          : seccion === 'rentaPresunta'
            ? (digitados.factura_renta_presunta[codigo] ?? 0)
            : parseNumero(fila.monto_ingreso_percibido);
  return {
    fieldId: key,
    casillaCode: meta.codigoF22 !== null ? `F22 [C${meta.codigoF22}] · Fila ${codigo}` : `Fila ${codigo}`,
    label: `${etiquetaPorSeccion[seccion]} — ${fila.concepto.slice(0, 46)}${fila.concepto.length > 46 ? '…' : ''}`,
    calculatedValue: valorCampo,
    formula: meta.formula,
    evaluatedExpression: undefined,
    calculationSteps: [],
    isManualInput: true,
    factors: factorIngresos(fila, digitados),
    legalReference: meta.referenciaLegal,
    status: 'ok',
  };
}
