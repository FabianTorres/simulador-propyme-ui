import type { BackendInspector, FieldTraceability, IntermediateFactor } from '../../core/types/inspector';
import type { SimulacionGlobalResponse } from '../../core/types/global';
import type { DigitadosRetiros, RetirosResponseData } from './types/retiros';
import { parseNumero } from '../../../../utils/parsers';

/**
 * Trazabilidad de la Caja de Cristal para la Pagina 3 (Retiros).
 *
 * Dumb UI: solo mapea las claves de inspector que envia el backend
 * (Modo Auditoria) a la estructura generica FieldTraceability. No calcula nada.
 */

interface ResueltoRetiro {
  claveInspector: string;
  etiqueta: string;
  valor: number;
}

/** Traduce una clave de UI de Retiros al inspector y valor correspondiente. */
const resolverRetiro = (
  key: string,
  retiros: RetirosResponseData
): ResueltoRetiro => {
  if (key === 'ret_1044') {
    return { claveInspector: '1044', etiqueta: '[1044] · Tope Suma ISFUT_H', valor: parseNumero(retiros.calculo.v1044) };
  }
  if (key === 'ret_1045') {
    return { claveInspector: '1045', etiqueta: '[1045] · Tope Suma ISFUT_A', valor: parseNumero(retiros.calculo.v1045) };
  }
  if (key === 'ret30') {
    return { claveInspector: 'ret30', etiqueta: 'RET30 · Σ Monto retiro', valor: parseNumero(retiros.totales.ret30) };
  }
  if (key === 'ret15') {
    return { claveInspector: 'ret15', etiqueta: 'RET15 · Σ Monto ISFUT_H', valor: parseNumero(retiros.totales.ret15) };
  }
  if (key.startsWith('ret14_')) {
    const rut = key.slice('ret14_'.length);
    return {
      claveInspector: `ret14.${rut}`,
      etiqueta: `RET14 · Σ ISFUT_H socio ${rut}`,
      valor: parseNumero(retiros.totales.ret14[rut]),
    };
  }
  if (key.startsWith('validacionFila_')) {
    const resto = key.slice('validacionFila_'.length);
    const [fila, grupo] = resto.split('_');
    const codigoGrupo = grupo === 'f1' ? 'validacion_f1' : 'validacion_f2';
    return {
      claveInspector: `fila${fila}_${codigoGrupo}`,
      etiqueta: grupo === 'f1'
        ? `Validación Fila ${fila} · RET5 ≥ RET6 + RET7`
        : `Validación Fila ${fila} · RET10 ≥ RET11 + RET12`,
      valor: 0,
    };
  }
  return { claveInspector: key, etiqueta: 'Campo de Página 3 — Retiros', valor: 0 };
};

const factoresDesdeInspector = (inspector: BackendInspector): IntermediateFactor[] =>
  inspector.variables_usadas.map((variable) => ({
    name: variable.nombre,
    source: variable.origen,
    value: parseNumero(variable.valor),
  }));

export function construirTrazabilidadRetiros(
  key: string,
  response: SimulacionGlobalResponse,
  _digitados: DigitadosRetiros
): FieldTraceability {
  const retiros = response.retiros;
  if (!retiros) {
    return {
      fieldId: key,
      casillaCode: 'Página 3 · Retiros',
      label: 'Campo de Página 3 — Retiros (sin datos)',
      calculatedValue: 0,
      formula: '—',
      calculationSteps: [],
      isManualInput: false,
      factors: [],
      legalReference: 'docs/Pagina_3_Retiros.md',
      status: 'ok',
    };
  }

  const { claveInspector, etiqueta, valor } = resolverRetiro(key, retiros);
  const inspector = retiros.inspectores?.[claveInspector];

  if (inspector) {
    return {
      fieldId: key,
      casillaCode: etiqueta,
      label: etiqueta,
      calculatedValue: parseNumero(inspector.valor),
      formula: inspector.literal,
      evaluatedExpression: inspector.evaluado,
      calculationSteps: inspector.pasos,
      isManualInput:
        inspector.pasos.length === 0 &&
        inspector.variables_usadas.length === 1 &&
        inspector.variables_usadas[0].origen === 'digitado',
      factors: factoresDesdeInspector(inspector),
      legalReference: 'docs/Pagina_3_Retiros.md',
      status: 'ok',
    };
  }

  return {
    fieldId: key,
    casillaCode: etiqueta,
    label: etiqueta,
    calculatedValue: valor,
    formula: 'Valor calculado por el motor (sin desglose disponible).',
    calculationSteps: [],
    isManualInput: false,
    factors: [],
    legalReference: 'docs/Pagina_3_Retiros.md',
    status: 'ok',
  };
}
