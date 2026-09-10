import { FILA_META_EGRESOS } from './data/egresosCatalog';
import type { BackendInspector, FieldTraceability, IntermediateFactor } from '../../core/types/inspector';
import type { SimulacionGlobalResponse } from '../../core/types/global';
import type { DigitadosEgresos, FilaEgreso } from './types/egresos';
import { parseNumero } from '../../../../utils/parsers';

/* Trazabilidad para la Caja de Cristal (metadata QA, no logica tributaria) */
type SeccionCategoria = 'resultado' | 'egresosNeto' | 'noPagadas' | 'patrimonio' | 'rentaPresunta' | 'adeudados';

const categoriaSeccion = (key: string): SeccionCategoria => {
  if (key.startsWith('adeudadosEgresos_')) return 'adeudados';
  if (key.startsWith('noPagadas_')) return 'noPagadas';
  if (key.startsWith('patrimonio_')) return 'patrimonio';
  if (key.startsWith('presunta_')) return 'rentaPresunta';
  if (key.startsWith('egresosNeto_')) return 'egresosNeto';
  return 'resultado';
};

const parteCodigo = (key: string): string => key.split('_').pop() ?? '8.1';

const factorEgresos = (
  fila: FilaEgreso,
  digitados: DigitadosEgresos
): IntermediateFactor[] => {
  const codigo = fila.codigo;
  return [
    { name: 'Monto adeudados AT anterior', source: 'Col. H (propuesta)', value: parseNumero(fila.egresos_adeudados_at_anterior) },
    { name: 'Egresos del año', source: 'Col. B (backend)', value: parseNumero(fila.egresos_ano) },
    { name: 'No Pagadas del año', source: 'Col. C (digitado)', value: digitados.no_pagadas[codigo] ?? 0 },
    { name: 'Patrimonio Personal', source: 'Col. D (digitado)', value: digitados.no_considerar_patrimonio[codigo] ?? 0 },
    { name: 'Renta Presunta', source: 'Col. E (digitado)', value: digitados.factura_renta_presunta[codigo] ?? 0 },
  ];
};

const etiquetaPorSeccion: Record<SeccionCategoria, string> = {
  resultado: 'Monto Compras o Egresos Pagados',
  egresosNeto: 'Egresos del año — Propuesta del motor',
  noPagadas: 'No Pagadas del año',
  patrimonio: 'No Considerar: es de Patrimonio Personal',
  rentaPresunta: 'Facturas de Actividad de Renta Presunta',
  adeudados: 'Monto adeudados en el ejercicio anterior y pagados',
};

const trazabilidadDesdeBackend = (
  key: string,
  fila: FilaEgreso,
  seccion: SeccionCategoria
): FieldTraceability => {
  const llaveInspector = key.startsWith('egresosNeto_')
    ? 'egresos_ano'
    : key.startsWith('adeudadosEgresos_')
      ? 'egresos_adeudados_at_anterior'
      : key.startsWith('noPagadas_')
        ? 'no_pagadas'
        : key.startsWith('patrimonio_')
          ? 'no_considerar_patrimonio'
          : key.startsWith('presunta_')
            ? 'factura_renta_presunta'
            : 'monto_egresos_pagados';
  const inspector = fila.inspectores?.[llaveInspector] as BackendInspector;
  const meta = FILA_META_EGRESOS[fila.codigo];
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
    legalReference: meta?.referenciaLegal ?? 'docs/Pagina_2_Egresos.md',
    status: 'ok',
  };
};

export function construirTrazabilidadEgresos(
  key: string,
  response: SimulacionGlobalResponse,
  digitados: DigitadosEgresos
): FieldTraceability {
  const egresos = response.egresos;
  const codigo = parteCodigo(key);
  const fila = egresos?.filas.find((f) => f.codigo === codigo);
  const seccion = categoriaSeccion(key);
  if (!egresos || !fila) {
    return {
      fieldId: key,
      casillaCode: `Fila ${codigo}`,
      label: 'Campo de Página 2 — Egresos',
      calculatedValue: 0,
      formula: '—',
      evaluatedExpression: undefined,
      calculationSteps: [],
      isManualInput: false,
      factors: [],
      legalReference: 'docs/Pagina_2_Egresos.md',
      status: 'ok',
    };
  }
  const meta = FILA_META_EGRESOS[codigo];
  const llaveInspector = key.startsWith('egresosNeto_')
    ? 'egresos_ano'
    : key.startsWith('adeudadosEgresos_')
      ? 'egresos_adeudados_at_anterior'
      : key.startsWith('noPagadas_')
        ? 'no_pagadas'
        : key.startsWith('patrimonio_')
          ? 'no_considerar_patrimonio'
          : key.startsWith('presunta_')
            ? 'factura_renta_presunta'
            : key.startsWith('egresosPagados_')
              ? 'monto_egresos_pagados'
              : undefined;
  const celdaInspector = llaveInspector != null ? fila.inspectores?.[llaveInspector] : undefined;
  if (celdaInspector) {
    return trazabilidadDesdeBackend(key, fila, seccion);
  }
  const valorCampo =
    seccion === 'egresosNeto'
      ? parseNumero(fila.egresos_ano)
      : seccion === 'noPagadas'
        ? (digitados.no_pagadas[codigo] ?? 0)
        : seccion === 'patrimonio'
          ? (digitados.no_considerar_patrimonio[codigo] ?? 0)
          : seccion === 'rentaPresunta'
            ? (digitados.factura_renta_presunta[codigo] ?? 0)
            : seccion === 'adeudados'
              ? parseNumero(fila.egresos_adeudados_at_anterior)
              : parseNumero(fila.monto_egresos_pagados);
  return {
    fieldId: key,
    casillaCode: meta.codigoF22 !== null ? `F22 [C${meta.codigoF22}] · Fila ${codigo}` : `Fila ${codigo}`,
    label: `${etiquetaPorSeccion[seccion]} — ${fila.concepto.slice(0, 46)}${fila.concepto.length > 46 ? '…' : ''}`,
    calculatedValue: valorCampo,
    formula: meta.formula,
    evaluatedExpression: undefined,
    calculationSteps: [],
    isManualInput: true,
    factors: factorEgresos(fila, digitados),
    legalReference: meta.referenciaLegal,
    status: 'ok',
  };
}

