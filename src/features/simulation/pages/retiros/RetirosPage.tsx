import { RetirosTable } from './RetirosTable';
import { formatMonto, parseNumero } from '../../../../utils/parsers';
import type { DigitadosRetiros, RetiroFilaInput, RetirosResponseData } from './types/retiros';

interface RetirosPageProps {
  response: RetirosResponseData;
  digitados: DigitadosRetiros;
  onFilasChange: (filas: RetiroFilaInput[]) => void;
  onOpenInspector: (fieldKey: string) => void;
}

/**
 * Pagina 3 — Retiros (14D1).
 *
 * Dumb UI: captura las filas de socios que digita el analista y pinta los
 * calculos internos ([1044]/[1045]) y totales que entrega el backend. Estos
 * valores alimentan al RRE/RLI en paginas posteriores.
 */
export const RetirosPage = ({
  response,
  digitados,
  onFilasChange,
  onOpenInspector,
}: RetirosPageProps) => {
  const { avisos, calculo, totales } = response;

  /** Tarjeta de resumen auditable (franja superior). */
  const resumen = [
    { key: 'ret_1044', etiqueta: '[1044]', descripcion: 'Tope Suma ISFUT_H', valor: calculo.v1044, ok: avisos.validacion_1044_ok },
    { key: 'ret_1045', etiqueta: '[1045]', descripcion: 'Tope Suma ISFUT_A', valor: calculo.v1045, ok: avisos.validacion_1045_ok },
    { key: 'ret30', etiqueta: 'RET30', descripcion: 'Σ Monto retiro', valor: totales.ret30, ok: true },
    { key: 'ret15', etiqueta: 'RET15', descripcion: 'Σ Monto ISFUT_H', valor: totales.ret15, ok: true },
  ];

  const hayErrorTope = !avisos.validacion_1044_ok || !avisos.validacion_1045_ok;

  return (
    <>
      {/* ===== Panel de Cabecera de la Pagina ===== */}
      <section className="bg-slate-950 rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-4 shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center text-base">
            ⤴
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Página 3 · Retiros</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Retiros de socios: el analista digita las filas y el motor calcula las variables internas.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Franja resumen (variables internas auditables) ===== */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {resumen.map((item) => (
          <div
            key={item.key}
            className={`bg-white rounded-2xl border shadow-sm px-4 py-3 flex items-center justify-between gap-3 ${
              item.ok ? 'border-slate-200/90' : 'border-red-300 bg-red-50/60'
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {item.etiqueta}
                </span>
                {!item.ok && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700">Excede tope</span>
                )}
              </div>
              <div className={`font-mono text-sm font-bold truncate ${item.ok ? 'text-slate-950' : 'text-red-800'}`}>
                {formatMonto(parseNumero(item.valor))}
              </div>
              <div className="text-[10px] text-slate-500 truncate">{item.descripcion}</div>
            </div>
            <button
              type="button"
              onClick={() => onOpenInspector(item.key)}
              title="Auditar cálculo (Caja de Cristal)"
              className="w-6 h-6 shrink-0 rounded-lg bg-indigo-100 hover:bg-indigo-600 text-indigo-700 hover:text-white flex items-center justify-center text-[10px] font-mono font-bold transition-all cursor-pointer shadow-2xs"
            >
              fx
            </button>
          </div>
        ))}
      </section>

      {/* ===== Banner de validacion de topes ===== */}
      {hayErrorTope && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-2xl px-4 py-3 flex items-start gap-3">
          <span className="mt-0.5 w-5 h-5 shrink-0 rounded-lg bg-red-500/20 text-red-700 flex items-center justify-center font-bold text-xs">!</span>
          <div className="text-xs text-red-900 leading-relaxed flex-1">
            {!avisos.validacion_1044_ok && (
              <p>El monto ingresado en ISFUT_H (RET6 + RET11) excede el tope [1044].</p>
            )}
            {!avisos.validacion_1045_ok && (
              <p>El monto ingresado en ISFUT_A (RET7 + RET12) excede el tope [1045].</p>
            )}
          </div>
        </div>
      )}

      {/* ===== Tarjeta de la Tabla ===== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <RetirosTable
          response={response}
          digitados={digitados}
          onFilasChange={onFilasChange}
          onOpenInspector={onOpenInspector}
        />
      </div>
    </>
  );
};

