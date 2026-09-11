import { useMemo } from 'react';
import { COLUMNAS_RETIROS, GRUPOS_RETIROS } from './data/retirosCatalog';
import { parseNumero } from '../../../../utils/parsers';
import { AuditableCellInput } from '../../core/components/AuditableCellInput';
import { AuditableTextCellInput } from '../../core/components/AuditableTextCellInput';
import { crearRetiroFilaVacia } from './types/retiros';
import type { DigitadosRetiros, RetiroFilaInput, RetirosResponseData } from './types/retiros';

export interface RetirosTableProps {
  /** Respuesta del backend con los montos ya calculados. */
  response: RetirosResponseData;
  /** Filas editables en estado "sucio". */
  digitados: DigitadosRetiros;
  /** Notifica el reemplazo completo del arreglo de filas (no dispara recalculo). */
  onFilasChange: (filas: RetiroFilaInput[]) => void;
  /** Abre la Caja de Cristal (Slide-Over Drawer) para la celda indicada. */
  onOpenInspector: (fieldKey: string) => void;
}

/** Campos numericos de la fila (para inputs de tipo numero). */
type CampoNumerico =
  | 'acciones'
  | 'f1_monto'
  | 'f1_isfut_h'
  | 'f1_isfut_a'
  | 'saldo'
  | 'f2_monto'
  | 'f2_isfut_h'
  | 'f2_isfut_a';

/**
 * RetirosTable — Grilla dinamica de la Pagina 3 (Retiros).
 *
 * Dumb UI: renderiza las filas que digita el analista QA y pinta los flags de
 * validacion que devuelve el backend. Por decision de maqueta (sin RIAC), todas
 * las celdas editables se habilitan en toda fila creada por el analista.
 */
export const RetirosTable = ({
  response,
  digitados,
  onFilasChange,
  onOpenInspector,
}: RetirosTableProps) => {
  const filas = digitados.filas;

  /** Mapa de validaciones por fila (1-based) segun el eco del backend. */
  const validacionesPorFila = useMemo(() => {
    const mapa = new Map<number, { f1: boolean; f2: boolean }>();
    response.filas.forEach((fila) => {
      mapa.set(fila.fila, { f1: fila.validacion_f1, f2: fila.validacion_f2 });
    });
    return mapa;
  }, [response.filas]);

  const handleFieldChange = (
    index: number,
    campo: keyof RetiroFilaInput,
    valor: number | string | null
  ) => {
    const siguiente = filas.map((fila, i) =>
      i === index ? ({ ...fila, [campo]: valor } as RetiroFilaInput) : fila
    );
    onFilasChange(siguiente);
  };

  const handleAgregar = () => {
    onFilasChange([...filas, crearRetiroFilaVacia(true)]);
  };

  const handleDuplicar = (index: number) => {
    const base = filas[index];
    const nueva = crearRetiroFilaVacia(true, base.rut);
    const siguiente = [...filas];
    siguiente.splice(index + 1, 0, nueva);
    onFilasChange(siguiente);
  };

  const handleEliminar = (index: number) => {
    onFilasChange(filas.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Botonera global */}
      <div className="flex items-center justify-between px-4 pt-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Registros de socios ({filas.length})
        </span>
        <button
          type="button"
          onClick={handleAgregar}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 border border-indigo-700 rounded-xl hover:bg-indigo-700 cursor-pointer transition-all shadow-xs"
        >
          <span className="font-black">+</span> Nuevo
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Encabezado de 3 niveles: letras, grupos, subtitulos. */}
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800 text-indigo-400 font-mono text-[11px] font-bold uppercase tracking-widest">
              <th rowSpan={3} className="py-2 px-3 text-center border-r border-slate-800 align-middle text-slate-400">
                Fila
              </th>
              {COLUMNAS_RETIROS.map((col) => (
                <th key={col.letra} className="py-1.5 px-2 text-center border-r border-slate-800">
                  {col.letra}
                </th>
              ))}
              <th rowSpan={3} className="py-2 px-3 text-center border-l border-slate-800 align-middle text-slate-400">
                Validación
              </th>
            </tr>

            <tr className="bg-slate-950 text-white">
              <th rowSpan={2} className="py-2 px-2 text-left border-r border-slate-800 text-[10px] uppercase tracking-wider text-slate-300">
                Rut socio
              </th>
              <th rowSpan={2} className="py-2 px-2 text-center border-r border-slate-800 text-[10px] uppercase tracking-wider text-slate-300">
                Usufructuario
              </th>
              <th rowSpan={2} className="py-2 px-2 text-center border-r border-slate-800 text-[10px] uppercase tracking-wider text-slate-300">
                Cantidad de Acciones
              </th>
              <th colSpan={4} className="py-2 px-2 text-center border-r border-slate-800 text-[10px] uppercase tracking-wider text-cyan-300">
                {GRUPOS_RETIROS.retiros}
              </th>
              <th rowSpan={2} className="py-2 px-2 text-center border-r border-slate-800 text-[10px] uppercase tracking-wider text-slate-300">
                Saldo monto de retiro en exceso AT-1
              </th>
              <th colSpan={4} className="py-2 px-2 text-center border-r border-slate-800 text-[10px] uppercase tracking-wider text-cyan-300">
                {GRUPOS_RETIROS.devolucion}
              </th>
            </tr>

            <tr className="bg-slate-950 text-white border-t border-slate-800">
              <th className="py-2 px-2 text-center border-r border-slate-800 text-[10px] tracking-wider text-slate-300">Fecha Retiro</th>
              <th className="py-2 px-2 text-center border-r border-slate-800 text-[10px] tracking-wider text-slate-300">Monto retiro</th>
              <th className="py-2 px-2 text-center border-r border-slate-800 text-[10px] tracking-wider text-slate-300">Monto ISFUT_H</th>
              <th className="py-2 px-2 text-center border-r border-slate-800 text-[10px] tracking-wider text-slate-300">Monto ISFUT_A</th>
              <th className="py-2 px-2 text-center border-r border-slate-800 text-[10px] tracking-wider text-slate-300">Fecha</th>
              <th className="py-2 px-2 text-center border-r border-slate-800 text-[10px] tracking-wider text-slate-300">Monto</th>
              <th className="py-2 px-2 text-center border-r border-slate-800 text-[10px] tracking-wider text-slate-300">Monto ISFUT_H</th>
              <th className="py-2 px-2 text-center border-r border-slate-800 text-[10px] tracking-wider text-slate-300">Monto ISFUT_A</th>
            </tr>
          </thead>

          <tbody>
            {filas.length === 0 && (
              <tr>
                <td colSpan={14} className="py-10 px-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    No hay registros de socios. Usa <strong className="text-indigo-600">+ Nuevo</strong> para agregar una fila y digitar los datos del analista.
                  </p>
                </td>
              </tr>
            )}

            {filas.map((fila, index) => {
              const numeroFila = index + 1;
              const validacion = validacionesPorFila.get(numeroFila);
              return (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  {/* Fila: numero + acciones */}
                  <td className="py-2 px-2 border-r border-b border-slate-100 align-middle">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-slate-400 w-4 text-center">{numeroFila}</span>
                      <button
                        type="button"
                        onClick={() => handleDuplicar(index)}
                        title="Duplicar registro (mantiene el RUT del socio)"
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-700 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        ⧉
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEliminar(index)}
                        title="Eliminar registro"
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-700 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </td>

                  {/* Col. A — RUT socio */}
                  <td className="py-2 px-2 border-r border-b border-slate-100">
                    <AuditableTextCellInput
                      value={fila.rut}
                      placeholder="12345678-9"
                      maxLength={12}
                      traceKey={`retRut_${numeroFila}`}
                      onChange={(v) => handleFieldChange(index, 'rut', v)}
                      onOpenInspector={onOpenInspector}
                    />
                  </td>

                  {/* Col. B — Usufructuario */}
                  <td className="py-2 px-2 border-r border-b border-slate-100">
                    <select
                      value={fila.usufructuario ?? ''}
                      title="Ingrese 1 si el Rut corresponde a usufructuario y 2 si corresponde a Nudo propietario."
                      onChange={(e) =>
                        handleFieldChange(index, 'usufructuario', e.target.value === '' ? null : parseNumero(e.target.value))
                      }
                      className="w-full text-center font-mono py-1.5 px-1 border border-slate-300 rounded text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="">-</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                  </td>

                  {/* Col. C — Cantidad de Acciones */}
                  <td className="py-2 px-2 border-r border-b border-slate-100">
                    <AuditableCellInput
                      value={fila.acciones}
                      traceKey={`retAcciones_${numeroFila}`}
                      onChange={(v) => handleFieldChange(index, 'acciones', v)}
                      onOpenInspector={onOpenInspector}
                    />
                  </td>

                  {/* Col. D — Fecha Retiro */}
                  <td className="py-2 px-2 border-r border-b border-slate-100">
                    <AuditableTextCellInput
                      value={fila.f1_fecha}
                      placeholder="dd/mm/aaaa"
                      variant="fecha"
                      maxLength={10}
                      traceKey={`retF1Fecha_${numeroFila}`}
                      onChange={(v) => handleFieldChange(index, 'f1_fecha', v)}
                      onOpenInspector={onOpenInspector}
                    />
                  </td>

                  {/* Col. E-G — Monto retiro / ISFUT_H / ISFUT_A */}
                  {(['f1_monto', 'f1_isfut_h', 'f1_isfut_a'] as CampoNumerico[]).map((campo) => (
                    <td key={campo} className="py-2 px-2 border-r border-b border-slate-100">
                      <AuditableCellInput
                        value={fila[campo]}
                        traceKey={`ret_${campo}_${numeroFila}`}
                        onChange={(v) => handleFieldChange(index, campo, v)}
                        onOpenInspector={onOpenInspector}
                      />
                    </td>
                  ))}

                  {/* Col. H — Saldo */}
                  <td className="py-2 px-2 border-r border-b border-slate-100">
                    <AuditableCellInput
                      value={fila.saldo}
                      traceKey={`retSaldo_${numeroFila}`}
                      onChange={(v) => handleFieldChange(index, 'saldo', v)}
                      onOpenInspector={onOpenInspector}
                    />
                  </td>

                  {/* Col. I — Fecha devolucion */}
                  <td className="py-2 px-2 border-r border-b border-slate-100">
                    <AuditableTextCellInput
                      value={fila.f2_fecha}
                      placeholder="dd/mm/aaaa"
                      variant="fecha"
                      maxLength={10}
                      traceKey={`retF2Fecha_${numeroFila}`}
                      onChange={(v) => handleFieldChange(index, 'f2_fecha', v)}
                      onOpenInspector={onOpenInspector}
                    />
                  </td>

                  {/* Col. J-L — Monto / ISFUT_H / ISFUT_A */}
                  {(['f2_monto', 'f2_isfut_h', 'f2_isfut_a'] as CampoNumerico[]).map((campo) => (
                    <td key={campo} className="py-2 px-2 border-r border-b border-slate-100">
                      <AuditableCellInput
                        value={fila[campo]}
                        traceKey={`ret_${campo}_${numeroFila}`}
                        onChange={(v) => handleFieldChange(index, campo, v)}
                        onOpenInspector={onOpenInspector}
                      />
                    </td>
                  ))}

                  {/* Validacion por fila (flags del backend) */}
                  <td className="py-2 px-2 border-b border-slate-100 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenInspector(`validacionFila_${numeroFila}_f1`)}
                        title="Validación Retiros efectivos (RET5 ≥ RET6 + RET7)"
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold cursor-pointer ${validacion ? (validacion.f1 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700') : 'bg-slate-100 text-slate-400'}`}
                      >
                        F1 {validacion ? (validacion.f1 ? '✓' : '!') : '—'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenInspector(`validacionFila_${numeroFila}_f2`)}
                        title="Validación Devolución de capital (RET10 ≥ RET11 + RET12)"
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold cursor-pointer ${validacion ? (validacion.f2 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700') : 'bg-slate-100 text-slate-400'}`}
                      >
                        F2 {validacion ? (validacion.f2 ? '✓' : '!') : '—'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

