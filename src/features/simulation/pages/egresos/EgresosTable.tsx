/**
 * EgresosTable — Grilla densa de la Pagina 2 (Egresos).
 *
 * Dumb UI: este componente solo renderiza montos que ya vienen calculados
 * desde el backend (FastAPI) y captura los inputs del usuario en el estado
 * "sucio" (DigitadosEgresos). No ejecuta formulas tributarias.
 *
 * Reglas de UI que aplica (docs/Pagina_2_Egresos.md):
 *  - Si Columna B (Egresos del ano) === 0, los inputs de esa fila quedan
 *    deshabilitados (no se pueden complementar valores).
 *  - Las columnas "Patrimonio Personal" y "Renta Presunta" se muestran solo
 *    si el backend lo ordena via response.avisos.
 *  - La fila 8.31 mantiene las columnas C, D y E bloqueadas permanentemente.
 */
import { useMemo } from 'react';
import { parseNumero, formatMonto } from '../../../../utils/parsers';
import { FILA_META_EGRESOS, NOMBRES_OFICIALES_EGRESOS } from './data/egresosCatalog';
import type { DigitadosEgresos, EgresosResponseData, FilaEgreso } from './types/egresos';
import { AuditableCellInput } from '../../core/components/AuditableCellInput';

/** Filas totalizadoras que siempre deben visualizarse (regla del documento). */
const CODIGOS_TOTALIZADORES = ['8'];

/** Codigo de la fila de cierre: TOTAL EGRESOS (gran total). */
const CODIGO_GRAN_TOTAL = '8';

/** Filas de la Columna B que el documento permite editar explicitamente. */
const CODIGOS_B_EDITABLES = [
  '8.1', '8.2', '8.3', '8.9', '8.13', '8.17', '8.18', '8.19', '8.20',
  '8.21', '8.22', '8.23', '8.24', '8.25', '8.26', '8.27', '8.28', '8.29',
];

/** Filas de la Columna H editables (solo si hay monto AT-1, marcadas Vx0143xx). */
const CODIGOS_H_EDITABLES = [
  '8.4', '8.6', '8.8', '8.9', '8.11', '8.5', '8.10', '8.14', '8.15', '8.24', '8.27',
];

/** Filas que contienen campos activos o bloqueados en Columna C. */
const ROWS_CON_COL_C = [
  '8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '8.10', '8.11',
  '8.14', '8.15', '8.24', '8.27', '8.31',
];

/** Filas que contienen campos activos o bloqueados en Columna D. */
const ROWS_CON_COL_D = [
  '8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '8.10', '8.11', '8.27', '8.31',
];

/** Filas que contienen campos activos o bloqueados en Columna E. */
const ROWS_CON_COL_E = [
  '8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '8.10', '8.11', '8.27', '8.31',
];

/** True si el motor propuso montos en la fila (col. B o col. H > 0). */
const filaConValorPropuesto = (fila: FilaEgreso): boolean =>
  parseNumero(fila.egresos_ano) > 0 ||
  parseNumero(fila.egresos_adeudados_at_anterior) > 0;

export interface EgresosTableProps {
  /** Respuesta normalizada del backend (montos ya calculados por FastAPI). */
  response: EgresosResponseData;
  /** Valores digitados por el usuario en estado "sucio" (dirty state). */
  digitados: DigitadosEgresos;
  /** Despliega la totalidad de las filas (toggle local de la pagina). */
  showAllRows: boolean;
  /** Notifica un cambio de input; no dispara recalculo (Dumb UI). */
  onDigitadoChange: (
    seccion: keyof DigitadosEgresos,
    codigo: string,
    valor: number
  ) => void;
  /** Abre la Caja de Cristal (Slide-Over Drawer) para la celda indicada. */
  onOpenInspector: (fieldKey: string) => void;
}

export const EgresosTable = ({
  response,
  digitados,
  showAllRows,
  onDigitadoChange,
  onOpenInspector,
}: EgresosTableProps) => {
  const { filas, avisos } = response;

  // Se aplica la regla de visibilidad directamente sobre filas. La fila
  // totalizadora (8) viene nativamente desde el backend.
  const filasVisibles = useMemo(() => {
    const filasDatos = filas.filter((f) => !CODIGOS_TOTALIZADORES.includes(f.codigo));
    const hayPropuestas = filasDatos.some(filaConValorPropuesto);
    if (showAllRows || !hayPropuestas) return filas;
    return filas.filter(
      (f) => CODIGOS_TOTALIZADORES.includes(f.codigo) || filaConValorPropuesto(f)
    );
  }, [filas, showAllRows]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          {/* 1. Fila superior estilo Excel (Letras) */}
          <tr className="bg-slate-900 border-b border-slate-800 text-indigo-400 font-mono text-[11px] font-bold uppercase tracking-widest">
            <th className="border-r border-slate-800"></th>
            <th></th>
            <th className="py-1.5 text-center border-r border-slate-800">A</th>
            <th className="py-1.5 text-center border-r border-slate-800">H</th>
            <th></th>
            <th className="py-1.5 text-center border-r border-slate-800">B</th>
            <th></th>
            <th className="py-1.5 text-center border-r border-slate-800">C</th>
            {avisos.mostrar_columna_patrimonio && (
              <>
                <th></th>
                <th className="py-1.5 text-center border-r border-slate-800">D</th>
              </>
            )}
            {avisos.mostrar_columna_renta_presunta && (
              <>
                <th></th>
                <th className="py-1.5 text-center border-r border-slate-800">E</th>
              </>
            )}
            <th></th>
            <th className="py-1.5 text-center border-r border-slate-800 bg-indigo-950/80">F</th>
            <th className="py-1.5 text-center">G</th>
          </tr>

          {/* 2. Fila de titulos originales */}
          <tr className="bg-slate-950 text-white">
            <th className="py-3 px-3 text-center w-12 border-r border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400">Cód.</th>
            <th className="py-3 px-1 text-center w-8 text-cyan-300 font-black text-sm">·</th>
            <th className="py-3 px-3 text-left border-r border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300 w-[160px]">Compras y Servicios</th>
            <th className="py-3 px-3 text-center w-[130px] border-r border-slate-800 text-[10px] uppercase tracking-wider text-slate-300">Monto adeudados en el ejercicio anterior y pagados</th>
            <th className="py-3 px-1 text-center w-6 text-cyan-300 font-black text-sm">+</th>
            <th className="py-3 px-3 text-center w-[130px] border-r border-slate-800 text-[10px] uppercase tracking-wider text-slate-300">Egresos del año</th>
            <th className="py-3 px-1 text-center w-6 text-cyan-300 font-black text-sm">−</th>
            <th className="py-3 px-3 text-center w-[130px] border-r border-slate-800 text-[10px] uppercase tracking-wider text-slate-300">No Pagadas del año</th>
            {avisos.mostrar_columna_patrimonio && (
              <>
                <th className="py-3 px-1 text-center w-6 text-cyan-300 font-black text-sm">−</th>
                <th className="py-3 px-2 text-center w-[110px] border-r border-slate-800 text-[10px] uppercase tracking-wider text-slate-300">No considerar es de Patrimonio Personal</th>
              </>
            )}
            {avisos.mostrar_columna_renta_presunta && (
              <>
                <th className="py-3 px-1 text-center w-6 text-cyan-300 font-black text-sm">−</th>
                <th className="py-3 px-3 text-center w-[130px] border-r border-slate-800 text-[10px] uppercase tracking-wider text-slate-300">Facturas de Actividad de Renta Presunta</th>
              </>
            )}
            <th className="py-3 px-1 text-center w-6 text-cyan-300 font-black text-sm">=</th>
            <th className="py-3 px-3 text-center w-[140px] border-r border-slate-800 bg-indigo-950 text-[10px] uppercase tracking-wider text-indigo-100">Monto Compras o Egresos Pagados</th>
            <th className="py-3 px-3 text-center w-[80px] text-[10px] uppercase tracking-wider text-slate-400">Código F22</th>
          </tr>
        </thead>
        <tbody>
          {filasVisibles.map((fila) => {
            const codigo = fila.codigo;
            const esTotalizador = CODIGOS_TOTALIZADORES.includes(codigo);
            const netoBackend = parseNumero(fila.egresos_ano);
            const adeudadosAT = parseNumero(fila.egresos_adeudados_at_anterior);
            // Bloquea columnas C, D y E si el neto es 0 (Regla original).
            const bloqueado = !esTotalizador && netoBackend === 0;
            const esEditableB = CODIGOS_B_EDITABLES.includes(codigo);
            const esEditableH = CODIGOS_H_EDITABLES.includes(codigo);
            const mostrarC = ROWS_CON_COL_C.includes(codigo);
            const mostrarD = ROWS_CON_COL_D.includes(codigo);
            const mostrarE = ROWS_CON_COL_E.includes(codigo);
            // Regla especial de la normativa: 8.31 mantiene C, D y E bloqueadas siempre.
            const bloqueadoC = bloqueado || esTotalizador || codigo === '8.31';
            const bloqueadoD = bloqueado || esTotalizador || codigo === '8.31';
            const bloqueadoE = bloqueado || esTotalizador || codigo === '8.31';
            const meta = FILA_META_EGRESOS[codigo];
            const pagados = parseNumero(fila.monto_egresos_pagados);

            return (
              <tr
                key={codigo}
                className={`border-b ${codigo === CODIGO_GRAN_TOTAL ? 'border-t-2 border-t-cyan-300 border-b-cyan-200 bg-cyan-50/80' : 'border-slate-100'} ${esTotalizador && codigo !== CODIGO_GRAN_TOTAL ? 'bg-slate-100/70' : codigo !== CODIGO_GRAN_TOTAL ? 'hover:bg-slate-50/70' : ''}`}
              >
                {/* Cód. */}
                <td className="py-2 px-3 text-center border-r border-slate-100">
                  <span className={`font-mono text-xs ${esTotalizador ? 'font-bold text-indigo-700' : 'font-semibold text-slate-500'}`}>{codigo}</span>
                </td>

                {/* Signo */}
                <td className="py-2 px-1 text-center font-mono text-xs text-cyan-700">{meta?.signo ?? ''}</td>

                {/* Compras y Servicios */}
                <td className="py-2 px-3 border-r border-slate-100 max-w-[160px]">
                  <div className="flex items-center">
                    <span
                      className={`text-xs truncate block w-full ${esTotalizador ? 'font-bold text-slate-950' : 'text-slate-700'}`}
                      title={NOMBRES_OFICIALES_EGRESOS[codigo] ?? fila.concepto}
                    >
                      {NOMBRES_OFICIALES_EGRESOS[codigo] ?? fila.concepto}
                    </span>
                  </div>
                </td>

                {/* Col. H — Monto adeudados AT anterior pagados */}
                <td className="py-2 px-3 border-r border-slate-100 bg-slate-50/50">
                  {codigo === CODIGO_GRAN_TOTAL ? null : esEditableH && adeudadosAT > 0 ? (
                    <AuditableCellInput
                      value={digitados.egresos_adeudados_at_anterior?.[codigo] ?? adeudadosAT}
                      disabled={false}
                      isPropuesta={true}
                      traceKey={`adeudadosEgresos_${codigo}`}
                      onChange={(v) => onDigitadoChange('egresos_adeudados_at_anterior', codigo, v)}
                      onOpenInspector={onOpenInspector}
                    />
                  ) : (
                    <span className="block w-full text-center font-mono text-xs text-slate-300">—</span>
                  )}
                </td>

                {/* Signo + */}
                <td className="py-2 px-1 text-center font-bold text-slate-400 text-sm">
                  {codigo === CODIGO_GRAN_TOTAL ? null : '+'}
                </td>

                {/* Col. B — Egresos del año */}
                <td className="py-2 px-3 border-r border-slate-100">
                  {codigo === CODIGO_GRAN_TOTAL ? null : (
                    <AuditableCellInput
                      value={digitados.egresos_ano[codigo] ?? netoBackend}
                      disabled={!esEditableB}
                      isPropuesta={!esEditableB}
                      traceKey={`egresosNeto_${codigo}`}
                      onChange={(v) => onDigitadoChange('egresos_ano', codigo, v)}
                      onOpenInspector={onOpenInspector}
                    />
                  )}
                </td>

                {/* Signo − (para C) */}
                <td className="py-2 px-1 text-center font-bold text-slate-400 text-sm">
                  {codigo === CODIGO_GRAN_TOTAL || !mostrarC ? null : '−'}
                </td>

                {/* Col. C — No Pagadas del año */}
                <td className="py-2 px-3 border-r border-slate-100">
                  {codigo === CODIGO_GRAN_TOTAL || !mostrarC ? null : (
                    <AuditableCellInput
                      value={digitados.no_pagadas[codigo] ?? 0}
                      disabled={bloqueadoC}
                      traceKey={`noPagadas_${codigo}`}
                      onChange={(v) => onDigitadoChange('no_pagadas', codigo, v)}
                      onOpenInspector={onOpenInspector}
                    />
                  )}
                </td>

                {/* Col. D — No Considerar: es de Patrimonio Personal */}
                {avisos.mostrar_columna_patrimonio && (
                  <>
                    <td className="py-2 px-1 text-center font-bold text-slate-400 text-sm">
                      {codigo === CODIGO_GRAN_TOTAL || !mostrarD ? null : '−'}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-100">
                      {codigo === CODIGO_GRAN_TOTAL || !mostrarD ? null : (
                        <AuditableCellInput
                          value={digitados.no_considerar_patrimonio[codigo] ?? 0}
                          disabled={bloqueadoD}
                          traceKey={`patrimonio_${codigo}`}
                          onChange={(v) => onDigitadoChange('no_considerar_patrimonio', codigo, v)}
                          onOpenInspector={onOpenInspector}
                        />
                      )}
                    </td>
                  </>
                )}

                {/* Col. E — Facturas de Actividad de Renta Presunta */}
                {avisos.mostrar_columna_renta_presunta && (
                  <>
                    <td className="py-2 px-1 text-center font-bold text-slate-400 text-sm">
                      {codigo === CODIGO_GRAN_TOTAL || !mostrarE ? null : '−'}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-100">
                      {codigo === CODIGO_GRAN_TOTAL || !mostrarE ? null : (
                        <AuditableCellInput
                          value={digitados.factura_renta_presunta[codigo] ?? 0}
                          disabled={bloqueadoE}
                          traceKey={`presunta_${codigo}`}
                          onChange={(v) => onDigitadoChange('factura_renta_presunta', codigo, v)}
                          onOpenInspector={onOpenInspector}
                        />
                      )}
                    </td>
                  </>
                )}

                {/* Signo = */}
                <td className="py-2 px-1 text-center font-bold text-indigo-600 text-sm">
                  {codigo === CODIGO_GRAN_TOTAL ? null : '='}
                </td>

                {/* Col. F — Monto Compras o Egresos Pagados */}
                <td className={`py-2 px-3 border-r border-slate-100 ${codigo === CODIGO_GRAN_TOTAL ? 'bg-cyan-50/80' : 'bg-slate-50/60'}`}>
                  <button
                    type="button"
                    onClick={() => onOpenInspector(`egresosPagados_${codigo}`)}
                    className={`w-full text-center font-mono font-bold hover:text-indigo-700 cursor-pointer ${codigo === CODIGO_GRAN_TOTAL ? 'text-sm text-cyan-800' : 'text-xs text-slate-950'}`}
                  >
                    {formatMonto(pagados)}
                  </button>
                </td>

                {/* Código F22 */}
                <td className="py-2 px-3 text-center">
                  <span className="font-mono text-[11px] text-slate-500">{fila.codigo_f22 ?? '—'}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

