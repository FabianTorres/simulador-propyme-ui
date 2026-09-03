/**
 * GlobalControlBar — Barra de control superior del Simulador Propyme.
 *
 * Dumb UI: este componente es puramente presentacional. Recibe estados y
 * handlers via props desde el hook useSimulador.
 */
import type { ChangeEvent } from 'react';
import { RUTS_POR_DEFECTO } from '../hooks/useSimulador';

export interface GlobalControlBarProps {
  hasChanges: boolean;
  isRecalculating: boolean;
  isImporting: boolean;
  rutSeleccionado: string;
  atributo14D1: boolean;
  atributoCRRP: boolean;
  setRutSeleccionado: (rut: string) => void;
  setAtributo14D1: (val: boolean | ((prev: boolean) => boolean)) => void;
  setAtributoCRRP: (val: boolean | ((prev: boolean) => boolean)) => void;
  setHasChanges: (val: boolean) => void;
  handleRecalcularCaso: () => Promise<void>;
  handleFileUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const GlobalControlBar = ({
  hasChanges,
  isRecalculating,
  isImporting,
  rutSeleccionado,
  atributo14D1,
  atributoCRRP,
  setRutSeleccionado,
  setAtributo14D1,
  setAtributoCRRP,
  setHasChanges,
  handleRecalcularCaso,
  handleFileUpload,
}: GlobalControlBarProps) => {
  return (
    <section className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col gap-0">
      {/* ----- Fila 1: Contexto del Contribuyente ----- */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              RUT Caso:
            </span>
            <select
              value={rutSeleccionado}
              onChange={(event) => setRutSeleccionado(event.target.value)}
              className="font-mono text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 cursor-pointer shadow-2xs"
            >
              <option value="76.123.456-7">76.123.456-7 · Serv. Ingeniería SpA</option>
              <option value="77.987.654-K">77.987.654-K · Comercializadora Sur Ltda.</option>
              <option value="78.111.222-3">78.111.222-3 · Consultora Tech EIRL</option>
              {!RUTS_POR_DEFECTO.includes(rutSeleccionado) && (
                <option value={rutSeleccionado}>{rutSeleccionado} · Datos Importados</option>
              )}
            </select>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
            hasChanges
              ? 'bg-amber-50 text-amber-800 border-amber-200/80'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${hasChanges ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            {hasChanges ? 'Cambios pendientes' : 'Sincronizado'}
          </span>
        </div>

        {/* Toggles de atributos tributarios globales */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={atributo14D1}
              onChange={() => {
                setAtributo14D1((prev) => !prev);
                setHasChanges(true);
              }}
              className="sr-only peer"
            />
            <span className="w-7 h-4 rounded-full bg-slate-300 peer-checked:bg-indigo-500 relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-3" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
              14D1
            </span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={atributoCRRP}
              onChange={() => {
                setAtributoCRRP((prev) => !prev);
                setHasChanges(true);
              }}
              className="sr-only peer"
            />
            <span className="w-7 h-4 rounded-full bg-slate-300 peer-checked:bg-cyan-500 relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-3" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
              CRRP
            </span>
          </label>
        </div>
      </div>
{/* ----- Fila 2: Acciones Globales ----- */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
        <label
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl transition-all shadow-2xs ${
            isImporting
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:bg-slate-50 hover:border-slate-300 cursor-pointer'
          }`}
        >
          {isImporting ? (
            <>
              <span className="inline-block w-3 h-3 rounded-full border-2 border-slate-400 border-t-slate-700 animate-spin" />
              Procesando Excel...
            </>
          ) : (
            'Importar Excel'
          )}
          <input
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isImporting}
          />
        </label>
        <button
          type="button"
          onClick={() => handleRecalcularCaso()}
          disabled={!hasChanges || isRecalculating}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 ${
            !hasChanges || isRecalculating
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30 cursor-pointer hover:shadow-md'
          }`}
        >
          {isRecalculating ? (
            <>
              <span className="inline-block w-3 h-3 rounded-full border-2 border-slate-500 border-t-white animate-spin align-middle" />
              Calculando...
            </>
          ) : (
            <><span>⚡</span> Recalcular Caso</>
          )}
        </button>
        <button
          type="button"
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-all shadow-2xs"
        >
          Exportar para automatizador
        </button>
      </div>
    </section>
  );
};
