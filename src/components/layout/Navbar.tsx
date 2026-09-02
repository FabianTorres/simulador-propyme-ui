export const Navbar = () => {
  return (
    <header className="bg-slate-950 text-white border-b border-slate-800/80 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-black text-white text-xs tracking-wider shadow-inner shadow-indigo-400/20">
            SII
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-sm tracking-tight text-slate-100">
              Simulador Propyme
            </span>
            <span className="text-slate-700">/</span>

          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-slate-300 text-[11px]">v{__APP_VERSION__}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
