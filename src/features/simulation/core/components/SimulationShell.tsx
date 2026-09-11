import { useState } from 'react';
import { GlobalControlBar } from './GlobalControlBar';
import { FormulaInspector } from './FormulaInspector';
import { PageTabs } from './PageTabs';
import { useSimulador } from '../hooks/useSimulador';
import { PagePlaceholder } from './PagePlaceholder';
import { IngresosPage } from '../../pages/ingresos/IngresosPage';
import { PatrimonioModal } from '../../pages/ingresos/PatrimonioModal';
import { construirTrazabilidad } from '../../pages/ingresos/trazabilidad';
import { construirTrazabilidadEgresos } from '../../pages/egresos/trazabilidad';
import { EgresosPage } from '../../pages/egresos/EgresosPage';
import { construirTrazabilidadRetiros } from '../../pages/retiros/trazabilidad';
import { RetirosPage } from '../../pages/retiros/RetirosPage';
import { DeterminacionRliPage } from '../../pages/determinacion-rli/DeterminacionRliPage';
import { BaseImponiblePage } from '../../pages/base-imponible/BaseImponiblePage';
import { CapitalPropioPage } from '../../pages/capital-propio/CapitalPropioPage';
import { RrePage } from '../../pages/rre/RrePage';
import { ConfirmacionPage } from '../../pages/confirmacion/ConfirmacionPage';

/**
 * SimulationShell — Orquestador presentacional del Simulador Propyme.
 *
 * Dumb UI: mantiene el estado de la pagina activa, delega la logica al hook
 * useSimulador y renderiza la barra global, los tabs, la pagina activa, el
 * inspector (Caja de Cristal) y el modal de Empresario Individual.
 */
export const SimulationShell = () => {
  const [activePageId, setActivePageId] = useState<number>(1);
  const simulador = useSimulador();
  const activeTrace =
    activePageId === 2
      ? construirTrazabilidadEgresos(simulador.selectedField, simulador.response, simulador.digitados.egresos)
      : activePageId === 3
        ? construirTrazabilidadRetiros(simulador.selectedField, simulador.response, simulador.digitados.retiros)
        : construirTrazabilidad(simulador.selectedField, simulador.response, simulador.digitados.ingresos);

  const avisoValor1 = simulador.response.ingresos.avisos.valor1_pcalc;
  const avisoValor2 = simulador.response.ingresos.avisos.valor2_pcalc;
  const requiresModal =
    simulador.response.ingresos.avisos.mostrar_columna_patrimonio &&
    avisoValor1 !== undefined &&
    avisoValor2 !== undefined &&
    simulador.patrimonioPersonal === null;

  const renderActivePage = () => {
    switch (activePageId) {
      case 1:
        return (
          <IngresosPage
            response={simulador.response.ingresos}
            digitados={simulador.digitados.ingresos}
            onDigitadoChange={(seccion, codigo, valor) =>
              simulador.handleDigitadoChange('ingresos', seccion, codigo, valor)
            }
            onOpenInspector={simulador.openInspector}
          />
        );
      case 2:
        return simulador.response.egresos ? (
          <EgresosPage
            response={simulador.response.egresos}
            digitados={simulador.digitados.egresos}
            onDigitadoChange={(seccion, codigo, valor) =>
              simulador.handleDigitadoChange('egresos', seccion, codigo, valor)
            }
            onOpenInspector={simulador.openInspector}
          />
        ) : (
          <PagePlaceholder title="Página 2 · Egresos (sin datos)" />
        );
      case 3:
        return simulador.response.retiros ? (
          <RetirosPage
            response={simulador.response.retiros}
            digitados={simulador.digitados.retiros}
            onFilasChange={simulador.handleRetirosFilasChange}
            onOpenInspector={simulador.openInspector}
          />
        ) : (
          <PagePlaceholder title="Página 3 · Retiros (sin datos)" />
        );
      case 4:
        return <DeterminacionRliPage />;
      case 5:
        return <BaseImponiblePage />;
      case 6:
        return <CapitalPropioPage />;
      case 7:
        return <RrePage />;
      case 8:
        return <ConfirmacionPage />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* ===== 1. Barra global de control y persistencia ===== */}
      <GlobalControlBar
        hasChanges={simulador.hasChanges}
        isRecalculating={simulador.isRecalculating}
        isImporting={simulador.isImporting}
        rutSeleccionado={simulador.rutSeleccionado}
        atributo14D1={simulador.atributo14D1}
        atributoCRRP={simulador.atributoCRRP}
        setRutSeleccionado={simulador.setRutSeleccionado}
        setAtributo14D1={simulador.setAtributo14D1}
        setAtributoCRRP={simulador.setAtributoCRRP}
        setHasChanges={simulador.setHasChanges}
        handleRecalcularCaso={simulador.handleRecalcularCaso}
        handleFileUpload={simulador.handleFileUpload}
      />

      {/* ===== 2. Banner "Modificaciones en memoria" (dirty state) ===== */}
      {simulador.hasChanges && (
        <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 text-amber-900">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-semibold">
              Modificaciones en memoria: valores no enviados al motor. Presiona{' '}
              <strong>⚡ Recalcular Caso</strong> en la barra superior para persistir.
            </span>
          </div>
          <button
            type="button"
            onClick={simulador.handleRevertir}
            className="text-xs font-semibold text-amber-800 underline decoration-amber-500/60 underline-offset-2 hover:text-amber-950 cursor-pointer"
          >
            Revertir cambios
          </button>
        </div>
      )}

      {/* ===== 3. Error de calculo ===== */}
      {simulador.recalcError && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-2xl px-4 py-3 flex items-start gap-3">
          <span className="mt-0.5 w-5 h-5 shrink-0 rounded-lg bg-red-500/20 text-red-700 flex items-center justify-center font-bold text-xs">!</span>
          <div className="text-xs text-red-900 leading-relaxed flex-1">{simulador.recalcError}</div>
        </div>
      )}

      {/* ===== 4. Navegador de paginas ===== */}
      <PageTabs activePageId={activePageId} onChange={setActivePageId} />

      {/* ===== 5. Pagina activa ===== */}
      {renderActivePage()}

      {/* ===== 6. Slide-Over Drawer (Caja de Cristal) ===== */}
      <FormulaInspector
        trace={activeTrace}
        isOpen={simulador.isInspectorOpen}
        onClose={() => simulador.setIsInspectorOpen(false)}
      />

      {/* ===== 7. Modal Empresario Individual (Patrimonio Personal) ===== */}
      <PatrimonioModal
        isOpen={requiresModal}
        valor1={avisoValor1 ?? 0}
        valor2={avisoValor2 ?? 0}
        onRespond={(res) => {
          simulador.handleRecalcularCaso(res);
        }}
      />
    </div>
  );
};
