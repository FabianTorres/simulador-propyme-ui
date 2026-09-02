import { formatMonto } from '../../../utils/parsers';

interface PatrimonioModalProps {
  isOpen: boolean;
  valor1: number;
  valor2: number;
  onRespond: (respuesta: boolean) => void;
}

export const PatrimonioModal = ({ isOpen, valor1, valor2, onRespond }: PatrimonioModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 px-6 py-4">
          <h3 className="text-white font-bold text-lg">Dividendos, retiros y creditos recibidos</h3>
        </div>
        <div className="p-6 space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            Dado que es Empresario Individual, estos dividendos, retiros y creditos recibidos podrian pertenecer a la contabilidad de su empresa o a su patrimonio personal:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="font-bold text-slate-500 uppercase tracking-wider">DIVIDENDOS Y RETIROS</span>
              <span className="font-bold text-slate-900">{formatMonto(valor1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-500 uppercase tracking-wider">CREDITOS</span>
              <span className="font-bold text-slate-900">{formatMonto(valor2)}</span>
            </div>
          </div>
          <p className="font-bold text-slate-900 text-base pt-2">
            ¿Corresponde a tu patrimonio personal?
            <br/><span className="text-xs font-normal text-slate-500">(Es decir, estan fuera de la contabilidad de la empresa)</span>
          </p>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button onClick={() => onRespond(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer">
            NO
          </button>
          <button onClick={() => onRespond(true)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 border border-indigo-700 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 cursor-pointer">
            SI, es personal
          </button>
        </div>
      </div>
    </div>
  );
};