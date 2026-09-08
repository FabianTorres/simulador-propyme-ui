import { SII_PAGES } from '../data/pages.config';

interface PageTabsProps {
  activePageId: number;
  onChange: (id: number) => void;
}

/** Navegador de paginas del Simulador (8 tabs del SII). */
export const PageTabs = ({ activePageId, onChange }: PageTabsProps) => {
  return (
    <nav>
      <ul className="flex gap-1.5 flex-wrap">
        {SII_PAGES.map((page) => {
          const isActive = page.id === activePageId;
          return (
            <li key={page.id}>
              <button
                type="button"
                onClick={() => onChange(page.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-600/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <span>{page.shortName}</span>
                <span className={`ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-indigo-500/30 text-indigo-100' : 'bg-slate-100 text-slate-500'
                }`}>
                  {page.badge}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
