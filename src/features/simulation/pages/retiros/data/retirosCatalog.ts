/**
 * Catalogo de columnas y metadatos QA — Pagina 3 (Retiros).
 *
 * Dumb UI: aqui solo hay metadata de presentacion (letras, codigos RETn,
 * etiquetas y tooltips) extraida de docs/Pagina_3_Retiros.md. No hay logica
 * de negocio ni calculos.
 */
import type { RetiroFilaInput } from '../types/retiros';

/** Grupo visual al que pertenece una columna (para encabezados agrupados). */
export type GrupoRetiro = 'retiros' | 'devolucion' | null;

/** Tipo de control que se renderiza en la celda. */
export type TipoCampoRetiro = 'texto' | 'fecha' | 'usufructuario' | 'numero';

export interface ColumnaRetiro {
  /** Letra de columna estilo Excel (A-L). */
  letra: string;
  /** Codigo de la columna segun el SII (RET1-RET12). */
  codigo: string;
  /** Campo del contrato RetiroFilaInput asociado. */
  campo: keyof RetiroFilaInput;
  /** Etiqueta visible en el encabezado. */
  label: string;
  /** Grupo al que pertenece (null = columna independiente). */
  grupo: GrupoRetiro;
  /** Tipo de control de entrada. */
  tipo: TipoCampoRetiro;
  /** Tooltip opcional (documentacion del SII). */
  tooltip?: string;
}

/** Etiquetas de los grupos de columnas (encabezado superior). */
export const GRUPOS_RETIROS: Record<'retiros' | 'devolucion', string> = {
  retiros: 'Retiros efectivos del ejercicio',
  devolucion: 'Devolución de capital',
};

/** Tooltip normativo de la columna RET2 (Usufructuario). */
export const TOOLTIP_USUFRUCTUARIO =
  'Ingrese 1 si el Rut corresponde a usufructuario y 2 si corresponde a Nudo propietario.';

/** Definicion canonica de las 12 columnas de Retiros (A-L). */
export const COLUMNAS_RETIROS: ColumnaRetiro[] = [
  { letra: 'A', codigo: 'RET1', campo: 'rut', label: 'Rut socio', grupo: null, tipo: 'texto' },
  { letra: 'B', codigo: 'RET2', campo: 'usufructuario', label: 'Usufructuario', grupo: null, tipo: 'usufructuario', tooltip: TOOLTIP_USUFRUCTUARIO },
  { letra: 'C', codigo: 'RET3', campo: 'acciones', label: 'Cantidad de Acciones', grupo: null, tipo: 'numero' },
  { letra: 'D', codigo: 'RET4', campo: 'f1_fecha', label: 'Fecha Retiro', grupo: 'retiros', tipo: 'fecha' },
  { letra: 'E', codigo: 'RET5', campo: 'f1_monto', label: 'Monto retiro', grupo: 'retiros', tipo: 'numero' },
  { letra: 'F', codigo: 'RET6', campo: 'f1_isfut_h', label: 'Monto ISFUT_H', grupo: 'retiros', tipo: 'numero' },
  { letra: 'G', codigo: 'RET7', campo: 'f1_isfut_a', label: 'Monto ISFUT_A', grupo: 'retiros', tipo: 'numero' },
  { letra: 'H', codigo: 'RET8', campo: 'saldo', label: 'Saldo monto de retiro en exceso AT-1', grupo: null, tipo: 'numero' },
  { letra: 'I', codigo: 'RET9', campo: 'f2_fecha', label: 'Fecha', grupo: 'devolucion', tipo: 'fecha' },
  { letra: 'J', codigo: 'RET10', campo: 'f2_monto', label: 'Monto', grupo: 'devolucion', tipo: 'numero' },
  { letra: 'K', codigo: 'RET11', campo: 'f2_isfut_h', label: 'Monto ISFUT_H', grupo: 'devolucion', tipo: 'numero' },
  { letra: 'L', codigo: 'RET12', campo: 'f2_isfut_a', label: 'Monto ISFUT_A', grupo: 'devolucion', tipo: 'numero' },
];

/**
 * Encabezados canonicos de la hoja Excel "Retiros" (misma subida que
 * Vectores/Calculadora). Cada fila de la hoja equivale a un objeto
 * FilaRetiroDigitada (1 socio + 1 fecha, sin agrupar por RUT).
 */
export const HEADERS_EXCEL_RETIROS: string[] = [
  'RUT',
  'Usufructuario',
  'Acciones',
  'F1_Fecha',
  'F1_Monto',
  'F1_ISFUT_H',
  'F1_ISFUT_A',
  'Saldo',
  'F2_Fecha',
  'F2_Monto',
  'F2_ISFUT_H',
  'F2_ISFUT_A',
];

/**
 * Mapeo de encabezado normalizado (minusculas, sin tildes ni separadores)
 * hacia el campo del contrato. Incluye alias RET1..RET12 por compatibilidad.
 */
export const MAPEO_EXCEL_RETIROS: Record<string, keyof RetiroFilaInput> = {
  rut: 'rut',
  ret1: 'rut',
  usufructuario: 'usufructuario',
  ret2: 'usufructuario',
  acciones: 'acciones',
  ret3: 'acciones',
  cantidadacciones: 'acciones',
  f1fecha: 'f1_fecha',
  fecharetiro: 'f1_fecha',
  ret4: 'f1_fecha',
  f1monto: 'f1_monto',
  montoretiro: 'f1_monto',
  ret5: 'f1_monto',
  f1isfuth: 'f1_isfut_h',
  montoisfuth: 'f1_isfut_h',
  ret6: 'f1_isfut_h',
  f1isfuta: 'f1_isfut_a',
  montoisfuta: 'f1_isfut_a',
  ret7: 'f1_isfut_a',
  saldo: 'saldo',
  ret8: 'saldo',
  saldomontoretiroexceso: 'saldo',
  f2fecha: 'f2_fecha',
  fecha: 'f2_fecha',
  ret9: 'f2_fecha',
  f2monto: 'f2_monto',
  monto: 'f2_monto',
  ret10: 'f2_monto',
  f2isfuth: 'f2_isfut_h',
  ret11: 'f2_isfut_h',
  f2isfuta: 'f2_isfut_a',
  ret12: 'f2_isfut_a',
};

/**
 * Clave de deduplicacion para fusion (rut + fechas). No es regla tributaria,
 * solo evita duplicar el mismo registro al combinar Excel con digitados.
 */
export const claveFilaRetiro = (fila: Pick<RetiroFilaInput, 'rut' | 'f1_fecha' | 'f2_fecha'>): string =>
  `${fila.rut.trim().toUpperCase()}|${fila.f1_fecha.trim()}|${fila.f2_fecha.trim()}`;
