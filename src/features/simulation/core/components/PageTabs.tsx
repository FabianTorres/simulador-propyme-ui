import { SII_PAGES } from '../data/pages.config';

interface PageTabsProps {
  activePageId: number;
  onChange: (id: number) => void;
}

/** Navegador de paginas del Simulador (8 tabs del SII). */
export const PageTabs = ({ activePageId, onChange }: PageTabsProps) => {
  return (
    <nav className="w-full">
      <ul className="flex gap-1.5 flex-wrap sm:flex-nowrap">
        {SII_PAGES.map((page) => {
          const isActive = page.id === activePageId;
          return (
            <li key={page.id} className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => onChange(page.id)}
                className={`w-full px-2 sm:px-3 py-2.5 rounded-xl text-[10px] sm:text-xs font-semibold transition-all border cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-600/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <span className="block truncate">{page.shortName}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
