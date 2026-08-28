export interface IntermediateFactor {
  name: string;
  source: string; // Origen del dato segun el motor (ej. "vector", "digitado", "externo", "calculado")
  value: number | string;
  note?: string;
}

export interface FieldTraceability {
  fieldId: string;
  casillaCode: string; // Código F22 o DJ (ej. C1402)
  label: string;
  calculatedValue: number;
  formula: string;
  /** Expresion matematica con los valores reemplazados (viene del motor). */
  evaluatedExpression?: string;
  /** Pasos intermedios del desglose matematico (viene del motor). */
  calculationSteps?: string[];
  /** Indica si el valor es una entrada manual sin formula automatica. */
  isManualInput?: boolean;
  factors: IntermediateFactor[];
  legalReference: string;
  status: 'ok' | 'warning' | 'recalculated';
}
