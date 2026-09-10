import { useState } from 'react';
import { IncomeTable } from './IncomeTable';
import type { DigitadosIngresos, IngresosResponseData } from './types/ingresos';

interface IngresosPageProps {
  response: IngresosResponseData;
  digitados: DigitadosIngresos;
  onDigitadoChange: (
    seccion: keyof DigitadosIngresos,
    codigo: string,
    valor: number
  ) => void;
  onOpenInspector: (fieldKey: string) => void;
}

/** Pagina 1 — Ingresos por Ventas del Año (orquestador fino). */
export const IngresosPage = ({
  response,
  digitados,
  onDigitadoChange,
  onOpenInspector,
}: IngresosPageProps) => {
  const [showAllRows, setShowAllRows] = useState(false);

  return (
    <>
      {/* ===== Panel de Cabecera de la Pagina ===== */}
      <section className="bg-slate-950 rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-4 shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center text-base">
            ⚡
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Página 1 · Ingresos Por Ventas del Año</h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAllRows((v) => !v)}
            aria-pressed={showAllRows}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showAllRows
                ? 'bg-cyan-400/20 border-cyan-400/40 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
            }`}
          >
            <span
              className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-black transition-colors ${
                showAllRows ? 'bg-cyan-400 text-slate-950' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {showAllRows ? '✓' : ''}
            </span>
            Desplegar totalidad de las filas
          </button>
        </div>
      </section>

      {/* ===== Tarjeta de la Tabla ===== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Banner avisos de bienes raices */}
        {response.avisos.aviso_arriendos_bienes_raices && (
          <div className="mx-4 mt-4 bg-cyan-50 border border-cyan-200 rounded-xl px-4 py-3 flex items-start gap-3 shadow-2xs">
            <span className="mt-0.5 w-6 h-6 shrink-0 rounded-lg bg-cyan-500/20 text-cyan-700 flex items-center justify-center font-bold text-xs font-serif">
              i
            </span>
            <div className="text-xs text-cyan-900 leading-relaxed font-medium">
              Si el ingreso proveniente del arrendamiento de bienes raíces se encuentra facturado e incluido en ítems anteriores de ingresos, correspondería rebajarlas en "Ingresos percibidos provenientes de arriendos de bienes raíces" para no duplicar dicho ingreso.
            </div>
          </div>
        )}
        <IncomeTable
          response={response}
          digitados={digitados}
          showAllRows={showAllRows}
          onDigitadoChange={onDigitadoChange}
          onOpenInspector={onOpenInspector}
        />
      </div>
    </>
  );
};
