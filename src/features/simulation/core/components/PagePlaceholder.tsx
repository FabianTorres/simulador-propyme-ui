interface PagePlaceholderProps {
  title: string;
}

/** Estado visual temporal para paginas aun no implementadas. */
export const PagePlaceholder = ({ title }: PagePlaceholderProps) => (
  <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-[11px] font-bold uppercase tracking-wider">
      En construcción
    </div>
    <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
    <p className="mt-1.5 text-xs text-slate-500">
      Este módulo estará disponible en una próxima versión del simulador.
    </p>
  </div>
);
