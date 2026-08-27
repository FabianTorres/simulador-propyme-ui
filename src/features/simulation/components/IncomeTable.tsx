/**
 * IncomeTable — Grilla densa de la Página 1 (Ingresos).
 *
 * Dumb UI: este componente solo renderiza montos que ya vienen calculados
 * desde el backend (FastAPI) y captura los inputs del usuario en el estado
 * "sucio" (DigitadosIngresos). No ejecuta fórmulas tributarias.
 *
 * Reglas de UI que aplica (docs/Pagina_1_14D1.md):
 *  - Si Columna B (Ingresos del Año Neto) === 0, los inputs de esa fila
 *    quedan deshabilitados (no se pueden complementar valores).
 *  - Las columnas "Patrimonio Personal" y "Renta Presunta" se muestran solo
 *    si el backend lo ordena vía response.avisos.
 *  - Tooltip informativo en la Fila 7.10 si aviso_montos_propuestos_7_10.
 */
import { useMemo } from 'react';
import { FILA_META, NOMBRES_OFICIALES_INGRESOS } from '../data/incomeCatalog';
import type {
  DigitadosIngresos,
  FilaIngreso,
  IngresosResponseData,
} from '../types/ingresos';

/* Helpers de presentación (parseo/formato — jamás lógica tributaria). */
const parseNumero = (valor: string | number | null | undefined): number => {
  const n = typeof valor === 'number' ? valor : Number(valor);
  return Number.isFinite(n) ? n : 0;
};

const formatMonto = (valor: number): string => `$${valor.toLocaleString('es-CL')}`;

/** Filas totalizadoras que siempre deben visualizarse (regla del documento). */
const CODIGOS_TOTALIZADORES = ['7.12', '7'];

/** Codigo de la fila de cierre: TOTAL INGRESOS (gran total). */
const CODIGO_GRAN_TOTAL = '7';

/** Filas de la Columna B que el documento permite editar explícitamente. */
const CODIGOS_B_EDITABLES = ['7.11', '7.13', '7.14', '7.16', '7.19', '7.20', '7.27'];

/** True si el motor propuso montos en la fila (col. B o col. A/H > 0). */
const filaConValorPropuesto = (fila: FilaIngreso): boolean =>
  parseNumero(fila.ingresos_ano) > 0 ||
  parseNumero(fila.ingresos_adeudados_at_anterior) > 0;

export interface IncomeTableProps {
  /** Respuesta normalizada del backend (montos ya calculados por FastAPI). */
  response: IngresosResponseData;
  /** Valores digitados por el usuario en estado "sucio" (dirty state). */
  digitados: DigitadosIngresos;
  /** Despliega la totalidad de las filas (toggle del orquestador). */
  showAllRows: boolean;
  /** Notifica un cambio de input; no dispara recálculo (Dumb UI). */
  onDigitadoChange: (
    seccion: keyof DigitadosIngresos,
    codigo: string,
    valor: number
  ) => void;
  /** Abre la Caja de Cristal (Slide-Over Drawer) para la celda indicada. */
  onOpenInspector: (fieldKey: string) => void;
}

/** Tooltip informativo sobre el valor propuesto de la Fila 7.10. */
const TooltipPropuesta7_10 = () => {
  const mensaje =
    'El valor propuesto corresponde a la sumatoria de los ingresos del giro registrados el año anterior como no percibidos (partidas detalladas en la columna "Ingresos percibidos de montos adeudados AT anterior").';
  return (
    <span className="relative inline-flex align-middle ml-1.5 group">
      <button
        type="button"
        aria-label="Información sobre el valor propuesto"
        className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 text-[9px] font-black flex items-center justify-center cursor-pointer shadow-2xs hover:bg-cyan-300 transition-colors"
      >
        i
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute z-[70] bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 px-3 py-2 rounded-lg bg-slate-900 text-slate-100 text-[11px] leading-snug shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150"
      >
        {mensaje}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      </span>
    </span>
  );
};

/** Input de celda con micro-botón "fx" que abre el inspector de trazabilidad. */
interface AuditableCellInputProps {
  value: number;
  onChange: (val: number) => void;
  traceKey: string;
  onOpenInspector: (key: string) => void;
  disabled?: boolean;
  isPropuesta?: boolean;
}

const AuditableCellInput = ({
  value,
  onChange,
  traceKey,
  onOpenInspector,
  disabled = false,
  isPropuesta = false,
}: AuditableCellInputProps) => {
  return (
    <div className="relative group flex items-center">
      <input
        type="number"
        inputMode="numeric"
        value={value}
        disabled={disabled}
        min={0}
        onChange={(e) => onChange(parseNumero(e.target.value))}
        className={`w-full text-center font-mono py-1.5 pl-2 pr-6 border rounded text-xs transition-all disabled:opacity-100 ${
          disabled
            ? isPropuesta
              ? 'bg-slate-200/80 border-slate-300 font-bold text-slate-900 cursor-not-allowed shadow-inner'
              : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-white border-slate-300 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500'
        }`}
      />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenInspector(traceKey);
        }}
        title="Auditar regla / origen de este valor"
        className="absolute right-1 w-4 h-4 rounded bg-indigo-100 hover:bg-indigo-600 text-indigo-700 hover:text-white flex items-center justify-center text-[9px] font-mono font-bold transition-all opacity-60 group-hover:opacity-100 cursor-pointer shadow-2xs"
      >
        fx
      </button>
    </div>
  );
};

export const IncomeTable = ({
  response,
  digitados,
  showAllRows,
  onDigitadoChange,
  onOpenInspector,
}: IncomeTableProps) => {
  const { filas, totales, avisos } = response;

  // 1. Se inyectan las filas totalizadoras porque el backend FastAPI las envia
  //    en response.totales en lugar de response.ingresos.filas (Dumb UI).
  const filasCompletas = useMemo(() => {
    const arr = [...filas];

    if (!arr.find((f) => f.codigo === '7.12')) {
      const idx = arr.findIndex((f) => f.codigo === '7.11');
      const fila712: FilaIngreso = {
        codigo: '7.12',
        concepto: 'Total Ingresos por ventas y servicios',
        codigo_f22: 1400,
        ingresos_ano: '0',
        ingresos_adeudados_at_anterior: '0',
        monto_ingreso_percibido: '0',
      };
      if (idx !== -1) arr.splice(idx + 1, 0, fila712);
      else arr.push(fila712);
    }

    if (!arr.find((f) => f.codigo === '7')) {
      arr.push({
        codigo: '7',
        concepto: 'TOTAL INGRESOS',
        codigo_f22: 1410,
        ingresos_ano: '0',
        ingresos_adeudados_at_anterior: '0',
        monto_ingreso_percibido: '0',
      } as FilaIngreso);
    }

    return arr;
  }, [filas]);

  // 2. Aplicamos la regla de visibilidad sobre el array completo (ya con totalizadores)
  const filasVisibles = useMemo(() => {
    const filasDatos = filasCompletas.filter((f) => !CODIGOS_TOTALIZADORES.includes(f.codigo));
    const hayPropuestas = filasDatos.some(filaConValorPropuesto);
    if (showAllRows || !hayPropuestas) return filasCompletas;
    return filasCompletas.filter(
      (f) => CODIGOS_TOTALIZADORES.includes(f.codigo) || filaConValorPropuesto(f)
    );
  }, [filasCompletas, showAllRows]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-950 text-white">
            <th className="py-3 px-3 text-center w-12 border-r border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400">Cód.</th>
            <th className="py-3 px-1 text-center w-8 text-cyan-300 font-black text-sm">·</th>
            <th className="py-3 px-3 text-left border-r border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300">Ventas y Servicios Afectos a IVA</th>
            <th className="py-3 px-3 text-center w-[130px] border-r border-slate-800 text-[10px] uppercase tracking-wider text-slate-300">Ingresos percibidos de montos adeudados de AT anterior</th>
            <th className="py-3 px-1 text-center w-6 text-cyan-300 font-black text-sm">+</th>
            <th className="py-3 px-3 text-center w-[130px] border-r border-slate-800 text-[10px] uppercase tracking-wider text-slate-300">Ingresos del año (Neto)</th>
            <th className="py-3 px-1 text-center w-6 text-cyan-300 font-black text-sm">−</th>
            <th className="py-3 px-3 text-center w-[130px] border-r border-slate-800 text-[10px] uppercase tracking-wider text-slate-300">Monto No Percibido del año (Neto)</th>
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
            <th className="py-3 px-3 text-center w-[140px] border-r border-slate-800 bg-indigo-950 text-[10px] uppercase tracking-wider text-indigo-100">Monto Ingreso Percibido</th>
            <th className="py-3 px-3 text-center w-[80px] text-[10px] uppercase tracking-wider text-slate-400">Código F22</th>
          </tr>
        </thead>
        <tbody>
          {filasVisibles.map((fila) => {
            const codigo = fila.codigo;
            const esTotalizador = CODIGOS_TOTALIZADORES.includes(codigo);
            const netoBackend = parseNumero(fila.ingresos_ano);
            const adeudadosAT = parseNumero(fila.ingresos_adeudados_at_anterior);
            // Bloquea columnas C, D y E si el neto es 0 (Regla original)
            const bloqueado = !esTotalizador && netoBackend === 0;
            // NUEVA REGLA: ¿Se puede editar la Columna B en esta fila?
            const esEditableB = CODIGOS_B_EDITABLES.includes(codigo);
            const meta = FILA_META[codigo];
            const percibido = 
              codigo === '7.12' ? parseNumero(totales.fila_7_12) :
              codigo === CODIGO_GRAN_TOTAL ? parseNumero(totales.fila_7_total) :
              parseNumero(fila.monto_ingreso_percibido);
            const mostrarTooltip7_10 = codigo === '7.10' && avisos.aviso_montos_propuestos_7_10;

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

                {/* Ventas y Servicios Afectos a IVA */}
                <td className="py-2 px-3 border-r border-slate-100">
                  <span className={`text-xs ${esTotalizador ? 'font-bold text-slate-950' : 'text-slate-700'}`}>{NOMBRES_OFICIALES_INGRESOS[codigo] ?? fila.concepto}</span>
                  {mostrarTooltip7_10 && <TooltipPropuesta7_10 />}
                </td>

                {/* Col. A/H — Ingresos percibidos de montos adeudados de AT anterior */}
                <td className="py-2 px-3 border-r border-slate-100 bg-slate-50/50">
                  {esTotalizador ? (
                    <span className="block w-full text-center font-mono text-xs text-slate-300">—</span>
                  ) : adeudadosAT > 0 ? (
                    <AuditableCellInput
                      value={digitados.ingresos_adeudados_at_anterior?.[codigo] ?? adeudadosAT}
                      disabled={false}
                      isPropuesta={true}
                      traceKey={`adeudados_${codigo}`}
                      onChange={(v) => onDigitadoChange('ingresos_adeudados_at_anterior', codigo, v)}
                      onOpenInspector={onOpenInspector}
                    />
                  ) : (
                    <span className="block w-full text-center font-mono text-xs text-slate-300">—</span>
                  )}
                </td>

                {/* Signo + */}
                <td className="py-2 px-1 text-center font-bold text-slate-400 text-sm">+</td>

                {/* Col. B — Ingresos del Año (Neto) */}
                <td className="py-2 px-3 border-r border-slate-100">
                  {esTotalizador ? (
                    <button
                      type="button"
                      onClick={() => onOpenInspector(codigo === '7.12' ? 'total_7_12' : 'total_7')}
                      className="w-full text-center font-mono text-xs font-bold text-slate-950 hover:text-indigo-700 cursor-pointer"
                    >
                      {esTotalizador ? '—' : formatMonto(netoBackend)}
                    </button>
                  ) : (
                    <AuditableCellInput
                      value={digitados.ingresos_ano[codigo] ?? netoBackend}
                      disabled={!esEditableB}
                      isPropuesta={!esEditableB}
                      traceKey={`neto_${codigo}`}
                      onChange={(v) => onDigitadoChange('ingresos_ano', codigo, v)}
                      onOpenInspector={onOpenInspector}
                    />
                  )}
                </td>

                {/* Signo − */}
                <td className="py-2 px-1 text-center font-bold text-slate-400 text-sm">−</td>

                {/* Col. C — Monto No Percibido del Año (Neto) */}
                <td className="py-2 px-3 border-r border-slate-100">
                  {esTotalizador ? (
                    <span className="block w-full text-center font-mono text-xs text-slate-300">—</span>
                  ) : (
                    <AuditableCellInput
                      value={digitados.monto_no_percibido[codigo] ?? 0}
                      disabled={bloqueado}
                      traceKey={`noPerc_${codigo}`}
                      onChange={(v) => onDigitadoChange('monto_no_percibido', codigo, v)}
                      onOpenInspector={onOpenInspector}
                    />
                  )}
                </td>

                {/* Col. D — No Considerar Patrimonio Personal */}
                {avisos.mostrar_columna_patrimonio && (
                  <>
                    <td className="py-2 px-1 text-center font-bold text-slate-400 text-sm">−</td>
                    <td className="py-2 px-3 border-r border-slate-100">
                      {esTotalizador ? (
                        <span className="block w-full text-center font-mono text-xs text-slate-300">—</span>
                      ) : (
                        <AuditableCellInput
                          value={digitados.no_considerar_patrimonio[codigo] ?? 0}
                          disabled={bloqueado}
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
                    <td className="py-2 px-1 text-center font-bold text-slate-400 text-sm">−</td>
                    <td className="py-2 px-3 border-r border-slate-100">
                      {esTotalizador ? (
                        <span className="block w-full text-center font-mono text-xs text-slate-300">—</span>
                      ) : (
                        <AuditableCellInput
                          value={digitados.factura_renta_presunta[codigo] ?? 0}
                          disabled={bloqueado}
                          traceKey={`presunta_${codigo}`}
                          onChange={(v) => onDigitadoChange('factura_renta_presunta', codigo, v)}
                          onOpenInspector={onOpenInspector}
                        />
                      )}
                    </td>
                  </>
                )}

                {/* Signo = */}
                <td className="py-2 px-1 text-center font-bold text-indigo-600 text-sm">=</td>

                {/* Col. F — Monto Ingreso Percibido */}
                <td className={`py-2 px-3 border-r border-slate-100 ${codigo === CODIGO_GRAN_TOTAL ? 'bg-cyan-50/80' : 'bg-slate-50/60'}`}>
                  <button
                    type="button"
                    onClick={() => onOpenInspector(codigo === '7' ? 'total_7' : `percibido_${codigo}`)}
                    className={`w-full text-center font-mono font-bold hover:text-indigo-700 cursor-pointer ${codigo === CODIGO_GRAN_TOTAL ? 'text-sm text-cyan-800' : 'text-xs text-slate-950'}`}
                  >
                    {formatMonto(percibido)}
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
