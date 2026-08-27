/**
 * Catálogo de Metadatos QA — Página 1 (Ingresos).
 *
 * Dumb UI: este catálogo contiene SOLO texto de auditoría (fórmula
 * descriptiva, explicación y referencia legal de cada partida) extraído de
 * docs/Pagina_1_14D1.md. No contiene lógica de negocio ni cálculos; alimenta
 * la Caja de Cristal (FormulaInspector) y el renderizado de la grilla.
 */
export interface FilaMeta {
  /** Operador visual: "(+)" adiciona, "(−)" rebaja, "(=)" totaliza. */
  signo: string;
  /** Código de casilla del Formulario 22 (null para partidas sin código). */
  codigoF22: number | null;
  /** Fórmula descriptiva/documental del motor (no se evalúa aquí). */
  formula: string;
  /** Explicación breve del origen/naturaleza de la partida. */
  explicacion: string;
  /** Referencia normativa (LIR, circulares, etc.). */
  referenciaLegal: string;
}

export const FILA_META: Record<string, FilaMeta> = {
  '7.1': {
    signo: '(+)',
    codigoF22: 1400,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Exportaciones netas efectivamente percibidas en el flujo de caja del ejercicio (F29 Cód. 20).',
    referenciaLegal: 'Art. 14 letra D) N° 3 LIR',
  },
  '7.2': {
    signo: '(+)',
    codigoF22: 1400,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Facturación por ventas y servicios gravados con IVA (F29 Cód. 502, 717 y 501).',
    referenciaLegal: 'Art. 14 letra D) N° 3 LIR',
  },
  '7.3': {
    signo: '(+)',
    codigoF22: 1400,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Ventas y servicios exentos o no gravados (F29 Cód. 142 y 715).',
    referenciaLegal: 'Art. 14 letra D) N° 3 LIR',
  },
  '7.4': {
    signo: '(+)',
    codigoF22: 1400,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Ventas con retención sobre el margen de comercialización (F29 Cód. 732).',
    referenciaLegal: 'Art. 14 letra D) N° 3 LIR',
  },
  '7.5': {
    signo: '(+)',
    codigoF22: 1400,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Facturas de compra con retención total y factura de inicio emitida (F29 Cód. 587).',
    referenciaLegal: 'Art. 14 letra D) N° 3 LIR',
  },
  '7.6': {
    signo: '(+)',
    codigoF22: 1400,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Facturas de compra recibidas con retención parcial (F29 Cód. 720).',
    referenciaLegal: 'Art. 14 letra D) N° 3 LIR',
  },
  '7.7': {
    signo: '(+)',
    codigoF22: 1400,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Boletas y comprobantes Transbank (F29 Cód. 111 y 759).',
    referenciaLegal: 'Art. 14 letra D) N° 3 LIR',
  },
  '7.8': {
    signo: '(−)',
    codigoF22: 1400,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Notas de crédito emitidas por ventas y servicios. Rebaja la base de ingresos (F29 Cód. 510, 709 y 734).',
    referenciaLegal: 'Art. 14 letra D) N° 3 LIR',
  },
  '7.9': {
    signo: '(+)',
    codigoF22: 1400,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Notas de débito emitidas (F29 Cód. 513).',
    referenciaLegal: 'Art. 14 letra D) N° 3 LIR',
  },
  '7.10': {
    signo: '(+)',
    codigoF22: 1817,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Ingresos devengados del giro en ejercicios anteriores y percibidos en el ejercicio (arrastre automático de AT anterior).',
    referenciaLegal: 'Circular SII N° 62 de 2020',
  },
  '7.11': {
    signo: '(+)',
    codigoF22: 1400,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Ingresos pagados según contratos no facturados (informados por el contribuyente).',
    referenciaLegal: 'Art. 14 letra D) N° 3 LIR',
  },
  '7.12': {
    signo: '(=)',
    codigoF22: 1400,
    formula: 'POS(7.1 + 7.2 + 7.3 + 7.4 + 7.5 + 7.6 + 7.7 − 7.8 + 7.9 + 7.11)',
    explicacion: 'Subtotal de ingresos por ventas y servicios del giro.',
    referenciaLegal: 'Art. 14 letra D) N° 3 LIR',
  },
  '7.13': {
    signo: '(+)',
    codigoF22: 1587,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Ingresos pagados según contratos con empresas relacionadas.',
    referenciaLegal: 'Art. 14 letra D) N° 3 LIR',
  },
  '7.14': {
    signo: '(+)',
    codigoF22: 1403,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Mayor valor por rescate o enajenación de inversiones o bienes no depreciables.',
    referenciaLegal: 'Art. 14 letra D) LIR · Art. 41 G',
  },
  '7.15': {
    signo: '(+)',
    codigoF22: 1588,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Ingresos percibidos provenientes de arriendos de bienes raíces (asistente BR).',
    referenciaLegal: 'Circular BR · Art. 14 letra D) LIR',
  },
  '7.16': {
    signo: '(+)',
    codigoF22: 1587,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Ingresos por operaciones con empresas relacionadas del art. 14 letra A) LIR (depurados).',
    referenciaLegal: 'Art. 14 letra A) LIR',
  },
  '7.17': {
    signo: '(+)',
    codigoF22: 1402,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Intereses directos percibidos o devengados.',
    referenciaLegal: 'Art. 14 letra D) LIR · Art. 42 N° 2',
  },
  '7.18': {
    signo: '(+)',
    codigoF22: 1402,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Intereses indirectos (asociados al giro).',
    referenciaLegal: 'Art. 14 letra D) LIR · Art. 42 N° 2',
  },
  '7.19': {
    signo: '(+)',
    codigoF22: 1401,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Renta de fuente extranjera percibidas.',
    referenciaLegal: 'Art. 14 letra D) N° 3 LIR',
  },
  '7.20': {
    signo: '(+)',
    codigoF22: 1588,
    formula: 'POS(AdeudadosAT + IngresosAño − NoPercibido − Patrimonio − RentaPresunta)',
    explicacion: 'Otros ingresos percibidos o devengados del giro.',
    referenciaLegal: 'Art. 14 letra D) N° 3 LIR',
  },
  '7.25': {
    signo: '(+)',
    codigoF22: null,
    formula: 'Saldo de ingreso diferido pendiente de tributación (marco legal art. 14 letra D) N° 8 d) LIR).',
    explicacion: 'Ingreso diferido pendiente de tributación según art. 14 letra D) N°8 letra d) LIR.',
    referenciaLegal: 'Art. 14 letra D) N° 8 d) LIR',
  },
  '7.26': {
    signo: '(+)',
    codigoF22: null,
    formula: 'Incremento del saldo de ingreso diferido (ejercicio anterior → ejercicio actual).',
    explicacion: 'Incremento del ingreso diferido pendiente de tributación.',
    referenciaLegal: 'Art. 14 letra D) N° 8 d) LIR',
  },
  '7.27': {
    signo: '(+)',
    codigoF22: 1405,
    formula: 'Crédito sobre Activos Fijos Adquiridos en el ejercicio (poso neto).',
    explicacion: 'Créditos sobre activos fijos adquiridos durante el ejercicio.',
    referenciaLegal: 'Art. 14 letra D) N° 8 d) LIR',
  },
  '7': {
    signo: '(=)',
    codigoF22: 1410,
    formula: '7.12 + 7.13 + 7.14 + 7.15 + 7.16 + 7.17 + 7.18 + 7.19 + 7.20 + 7.25 + 7.26 + 7.27 + 7.10',
    explicacion: 'TOTAL INGRESOS — alimenta la Línea 1 del Formulario 22.',
    referenciaLegal: 'Art. 14 letra D) LIR · Línea 1 F22',
  },
};

/**
 * Nombres oficiales de cada partida segun la glosa del SII (Formulario 22).
 * Se usa en la columna de concepto de la grilla para reemplazar los nombres
 * resumidos que entrega el backend.  Las claves coinciden con fila.codigo.
 */
export const NOMBRES_OFICIALES_INGRESOS: Record<string, string> = {
  '7.1': 'Exportaciones (Cód. 20 F29)',
  '7.2': 'Facturas por ventas y servicios gravados (Cód. 502, 717 y 501 F29)',
  '7.3': 'Ventas y/o Servicios prestados Exentos, o No Gravados (Cód. 142 y 715 F29)',
  '7.4': 'Ventas con retención sobre el margen de comercialización (Contrib. Retenidos) (Cód. 732 F29)',
  '7.5': 'Fact. Compra recibidas Retención total (Cont. retenidos) y fact. de inicio emitida (Cód. 587 F29)',
  '7.6': 'Fact. de Compra recibidas con retención parcial (Cód. 720 F29)',
  '7.7': 'Boletas y Comprobante o recibo de pago de transacciones transbank (Cód. 111 y 759 F29)',
  '7.8': 'Notas de Crédito emitidas por ventas y servicios (Cód. 510, 709 y 734 F29)',
  '7.9': 'Notas de débito emitidas (Cód. 513 F29)',
  '7.10': 'Ingresos devengados del giro ejercicios anteriores y percibidos en el ejercicio',
  '7.11': 'Ingresos pagados según contratos no facturados',
  '7.12': 'Total Ingresos por ventas y servicios',
  '7.13': 'Ingresos pagados según contratos con Empresas Relacionadas',
  '7.14': 'Mayor valor por rescate o enajenación de inversiones o bienes no depreciables',
  '7.15': 'Ingresos percibidos provenientes de arriendos de bienes raíces',
  '7.16': 'Ingresos percibidos o devengados por operaciones con empresas relacionadas del art. 14 letra A) LIR (depurados de notas de débito y crédito)',
  '7.17': 'Intereses Directos',
  '7.18': 'Intereses Indirectos',
  '7.19': 'Renta de fuente extranjera percibidas',
  '7.20': 'Otros ingresos percibidos o devengados',
  '7.25': 'Ingreso diferido pendiente de tributación de acuerdo al art. 14 letra D) N°8, letra d) de la LIR',
  '7.26': 'Incremento Ingreso diferido pendiente de tributación de acuerdo al art. 14 letra D) N°8, letra d) de la LIR',
  '7.27': 'Crédito sobre Activos Fijos Adquiridos en el ejercicio',
  '7': 'TOTAL INGRESOS',
};
