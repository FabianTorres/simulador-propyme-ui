/**
 * AuditableDateCellInput — Input de fecha con micro-boton "fx".
 *
 * Dumb UI: control de presentacion para fechas de Retiros. El modelo interno
 * sigue siendo string "dd/mm/aaaa" (contrato del backend); aqui solo se
 * convierte a "aaaa-mm-dd" para el picker nativo del navegador.
 */

export interface AuditableDateCellInputProps {
  /** Fecha en formato "dd/mm/aaaa" (vacio = sin fecha). */
  value: string;
  onChange: (val: string) => void;
  traceKey: string;
  onOpenInspector: (key: string) => void;
  disabled?: boolean;
}

/** Convierte "dd/mm/aaaa" a "aaaa-mm-dd" para el input nativo (o vacio). */
const aIso = (valor: string): string => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor.trim());
  if (!match) return '';
  return `${match[3]}-${match[2]}-${match[1]}`;
};

/** Convierte "aaaa-mm-dd" del picker a "dd/mm/aaaa" del contrato. */
const desdeIso = (iso: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return '';
  return `${match[3]}/${match[2]}/${match[1]}`;
};

export const AuditableDateCellInput = ({
  value,
  onChange,
  traceKey,
  onOpenInspector,
  disabled = false,
}: AuditableDateCellInputProps) => {
  return (
    <div className="relative group flex items-center">
      <input
        type="date"
        value={aIso(value)}
        disabled={disabled}
        onChange={(e) => onChange(desdeIso(e.target.value))}
        className={`w-full min-w-0 text-center font-mono py-1.5 pl-2 pr-6 border rounded text-xs transition-all ${
          disabled
            ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
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
