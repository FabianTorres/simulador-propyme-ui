import { parseNumero } from '../../../../utils/parsers';

/** Input de celda con micro-botón "fx" que abre el inspector de trazabilidad. */
export interface AuditableCellInputProps {
  value: number;
  onChange: (val: number) => void;
  traceKey: string;
  onOpenInspector: (key: string) => void;
  disabled?: boolean;
  isPropuesta?: boolean;
}

export const AuditableCellInput = ({
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
