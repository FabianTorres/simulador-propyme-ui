export interface IntermediateFactor {
  name: string;
  source: string; // De dónde viene (ej. "Página 1: Ingresos", "Configuración UF/UTM")
  value: number | string;
  note?: string;
}

export interface FieldTraceability {
  fieldId: string;
  casillaCode: string; // Código F22 o DJ (ej. C1402)
  label: string;
  calculatedValue: number;
  formula: string;
  explanation: string;
  factors: IntermediateFactor[];
  legalReference: string;
  status: 'ok' | 'warning' | 'recalculated';
}
