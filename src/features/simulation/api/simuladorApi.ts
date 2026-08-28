/**
 * API — Página 1 (Ingresos) · Simulador Propyme
 *
 * RESPONSABILIDAD (solo transporte de datos):
 *  - Montar el POST /api/v1/simulador/ingresos contra FastAPI.
 *  - Mientras el backend no esté desplegado, resolver la petición con un
 *    FIXTURE ESTÁTICO: captura de la respuesta que produce el motor Python.
 *
 * Dumb UI: este módulo NO contiene reglas de negocio. No hay fórmulas,
 * sumatorias ni cálculos tributarios en el frontend. Los montos llegan
 * pre-calculados desde el backend; aquí solo se mueven datos (request →
 * fetch → response). Cualquier cambio de cifra se resuelve en el backend,
 * nunca en este archivo.
 */
import type {
  SimulacionGlobalRequest,
  SimulacionGlobalResponse,
} from '../types/ingresos';

/**
 * URL del endpoint unificado del Orquestador Global (FastAPI / Docker).
 */
export const SIMULADOR_ENDPOINT = '/api/v1/simulador/calcular';

import { crearRequestInicial, MOCK_RESPUESTA_SII } from '../__mocks__/ingresosMock';

export { crearRequestInicial };
/** Copia inmutable del fixture (evita que los consumidores muten el dato). */
const copiaFixture = (): SimulacionGlobalResponse =>
  JSON.parse(JSON.stringify(MOCK_RESPUESTA_SII)) as SimulacionGlobalResponse;

// ---------------------------------------------------------------------------
// Entry points públicos (transporte)
// ---------------------------------------------------------------------------

/**
 * Respuesta inicial síncrona de la maqueta (permite pintar la grilla sin
 * esperar la primera petición en el montaje del componente).
 */
export const obtenerRespuestaInicial = (): SimulacionGlobalResponse =>
  copiaFixture();

/**
 * POST /api/v1/simulador/calcular — recalcula el caso en el motor de reglas
 * (Orquestador Global).
 */
export const recalcularCaso = async (
  request: SimulacionGlobalRequest
): Promise<SimulacionGlobalResponse> => {

  try {
    const response = await fetch('http://localhost:8002/api/v1/simulador/calcular', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Error del motor FastAPI: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fallo la conexión con el Backend:", error);
    throw error;
  }
};
