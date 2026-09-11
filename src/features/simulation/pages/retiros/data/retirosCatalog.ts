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
