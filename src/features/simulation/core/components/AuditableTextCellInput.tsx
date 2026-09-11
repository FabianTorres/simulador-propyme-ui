/**
 * AuditableTextCellInput — Input de texto con micro-boton "fx".
 *
 * Dumb UI: variante de AuditableCellInput para campos de texto (RUT y fechas).
 * Solo aplica formato/UX (mascara de fecha); no contiene reglas de negocio.
 */
export interface AuditableTextCellInputProps {
  value: string;
  onChange: (val: string) => void;
  traceKey: string;
  onOpenInspector: (key: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  /** Variante de formato: "fecha" aplica mascara dd/mm/aaaa. */
  variant?: 'texto' | 'fecha';
}

/** Aplica mascara dd/mm/aaaa a una cadena de entrada. */
const aplicarMascaraFecha = (raw: string): string => {
  const digitos = raw.replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
};

export const AuditableTextCellInput = ({
  value,
  onChange,
  traceKey,
  onOpenInspector,
  disabled = false,
  placeholder,
  maxLength,
  variant = 'texto',
}: AuditableTextCellInputProps) => {
  const handleChange = (raw: string) => {
    onChange(variant === 'fecha' ? aplicarMascaraFecha(raw) : raw);
  };

  return (
    <div className="relative group flex items-center">
      <input
        type="text"
        inputMode={variant === 'fecha' ? 'numeric' : 'text'}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => handleChange(e.target.value)}
        className={`w-full text-center font-mono py-1.5 pl-2 pr-6 border rounded text-xs transition-all ${
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
