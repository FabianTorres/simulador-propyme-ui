import type { FieldTraceability } from '../types/inspector';
import { formatMonto } from '../../../utils/parsers';

interface FormulaInspectorProps {
  trace: FieldTraceability | null;
  isOpen: boolean;
  onClose: () => void;
}

const ORIGEN_STYLES: Record<string, string> = {
  vector: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  digitado: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  externo: 'text-amber-700 bg-amber-50 border-amber-200',
  calculado: 'text-cyan-700 bg-cyan-50 border-cyan-200',
  default: 'text-slate-700 bg-slate-50 border-slate-200',
};

export const FormulaInspector = ({ trace, isOpen, onClose }: FormulaInspectorProps) => {
  if (!isOpen || !trace) return null;

  return (
    <>
      {/* Backdrop sutil */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/20 backdrop-blur-2xs z-40 transition-opacity"
      />

      {/* Panel Desplegable (Slide-over) */}
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Cabecera del Inspector */}
        <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {trace.casillaCode}
            </span>
            <span className="text-xs font-medium text-slate-300">Auditoria de Casilla</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-mono transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Resultado Principal */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              {trace.label}
            </span>
            <div className="text-2xl font-bold text-slate-950 font-mono tracking-tight">
              {formatMonto(trace.calculatedValue)}
            </div>
          </div>

          {/* Bloque de Formula / Entrada Manual */}
          {trace.isManualInput ? (
            <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <span>Valor de Entrada</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Este valor no posee calculo automatico. Corresponde a una variable de entrada o a un valor ingresado manualmente.
              </p>
            </div>
          ) : (
            <div className="bg-slate-950 rounded-xl p-4 text-slate-200 space-y-3 border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                <span>Formula Matematica</span>
                <span className="text-slate-500 font-mono">RULE_ENGINE</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-indigo-200 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {trace.formula}
              </div>
              {trace.evaluatedExpression && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Reemplazo Numerico
                  </span>
                  <div className="font-mono text-sm text-white leading-relaxed whitespace-pre-wrap">
                    {trace.evaluatedExpression}
                  </div>
                </div>
              )}
              {trace.calculationSteps && trace.calculationSteps.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Desglose
                  </span>
                  {trace.calculationSteps.map((paso, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-400 font-mono leading-relaxed">
                      <span className="text-slate-600 mt-0.5">↳</span>
                      <span className="whitespace-pre-wrap">{paso}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Variables y Factores Intermedios */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Variables Intermedias ({trace.factors.length})
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Origen de datos</span>
            </div>

            <div className="space-y-2">
              {trace.factors.map((factor, idx) => (
                <div
                  key={idx}
                  className="bg-white hover:bg-slate-50 p-3 rounded-xl border border-slate-200 transition-all shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-800">{factor.name}</span>
                    <span className="font-mono font-bold text-slate-950">
                      {typeof factor.value === 'number'
                        ? formatMonto(factor.value)
                        : factor.value}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-medium px-2 py-0.5 rounded-md border ${ORIGEN_STYLES[factor.source] ?? ORIGEN_STYLES.default}`}>
                      {factor.source}
                    </span>
                    {factor.note && <span className="text-slate-400 font-mono">{factor.note}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referencia Normativa */}
          <div className="p-3.5 bg-gradient-to-r from-indigo-50/70 to-blue-50/40 border border-indigo-100 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-indigo-950 block uppercase tracking-wider">
              Normativa Legal Aplicada
            </span>
            <p className="text-xs text-indigo-900/90 leading-relaxed font-medium">
              {trace.legalReference}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
