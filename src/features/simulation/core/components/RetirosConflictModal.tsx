interface RetirosConflictModalProps {
  isOpen: boolean;
  previasCount: number;
  importadasCount: number;
  onResolve: (modo: 'reemplazar' | 'fusionar' | 'cancelar') => void;
}

/**
 * Modal de conflicto de importacion de socios (Pagina 3).
 * Se abre cuando el Excel trae hoja "Retiros" y ya hay filas digitadas.
 */
export const RetirosConflictModal = ({
  isOpen,
  previasCount,
  importadasCount,
  onResolve,
}: RetirosConflictModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="bg-slate-950 px-6 py-4">
          <h3 className="text-white font-bold text-sm">Conflicto de socios importados</h3>
          <p className="text-slate-400 text-[11px] mt-0.5">Hoja &quot;Retiros&quot; del Excel vs filas digitadas</p>
        </div>
        <div className="p-6 space-y-4 text-slate-700 text-sm leading-relaxed">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="font-bold text-slate-500 uppercase tracking-wider">Digitadas</span>
              <span className="font-bold text-slate-900">{previasCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-500 uppercase tracking-wider">En Excel</span>
              <span className="font-bold text-slate-900">{importadasCount}</span>
            </div>
          </div>
          <p>
            El archivo trae socios y ya existen filas digitadas. Fusionar suma ambas listas
            (si se repite rut + fechas, gana el Excel). Reemplazar descarta lo digitado.
          </p>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onResolve('cancelar')}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onResolve('reemplazar')}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Reemplazar
          </button>
          <button
            type="button"
            onClick={() => onResolve('fusionar')}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 border border-indigo-700 hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Fusionar
          </button>
        </div>
      </div>
    </div>
  );
};
