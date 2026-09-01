# Estado de Avance y Hoja de Ruta — Simulador Propyme (Frontend)

## 📌 Contexto y Arquitectura Actual

- **Rol:** Frontend Dumb UI en React + Vite + TailwindCSS.
- **Backend:** Motor determinista FastAPI en `http://localhost:8002` (Página 1 lista al 100%).
- **Paleta de Diseño:** Base Pizarra Frío (`#eef2f6`), Índigo/Cobalto (`indigo-600`), Cyan (`cyan-400`), Cabeceras `slate-950`.
- **Estructura Modular Activa:**
  - `src/features/simulation/types/ingresos.ts`: Contratos de request y response (Orquestador Global).
  - `src/features/simulation/api/simuladorApi.ts`: Cliente HTTP contra `/api/v1/simulador/calcular`.
  - `src/features/simulation/__mocks__/ingresosMock.ts`: Fixtures de maqueta QA extraídos del API.
  - `src/features/simulation/hooks/useSimulador.ts`: Custom hook con toda la lógica de estado (response, digitados, handlers).
  - `src/features/simulation/data/incomeCatalog.ts`: Metadatos estáticos y textos legales de las 24 partidas.
  - `src/features/simulation/components/GlobalControlBar.tsx`: Barra de control superior (RUT, toggles 14D1/CRRP, botones). Componente presentacional puro.
  - `src/features/simulation/components/IncomeTable.tsx`: Tabla densa con operadores (+, −, =), bloqueos y micro-fx.
  - `src/features/simulation/components/AuditWorkspace.tsx`: Orquestador presentacional (invoca hook, renderiza barra + tabla + inspector).
  - `src/features/simulation/components/FormulaInspector.tsx`: Inspector de trazabilidad (Caja de Cristal).
  - `src/features/simulation/index.ts`: Barrel export del módulo.
  - `src/utils/parsers.ts`: Utilidades compartidas (`parseNumero`, `formatMonto`, `debugLog`).
  - `src/components/layout/Navbar.tsx`: Barra de navegación superior.
- **Dependencias eliminadas:** `ag-grid-community`, `ag-grid-react` (no se usaban, ~1.2 MB ahorrados).
- **Assets eliminados:** `App.css`, `react.svg`, `vite.svg` (scaffold de Vite sin uso).

---

## 🚦 Registro de Fases

### Fase 1: Página 1 (Ingresos)

- [x] Definición de tipos TypeScript (`ingresos.ts`).
- [x] Cliente API y Mock (`ingresosApi.ts`).
- [x] Catálogo de Metadatos QA (`incomeCatalog.ts`).
- [x] Componente `IncomeTable.tsx` con reglas UI:
  - [x] Deshabilitar inputs si Columna B (`ingresos_ano`) === 0.
  - [x] Renderizado condicional de columnas (Patrimonio Personal y Renta Presunta vía flags de avisos).
  - [x] Toggle "Desplegar totalidad de las filas".
  - [x] Banners de advertencia (Arriendos) y Tooltips (Fila 7.10).
- [x] Orquestación final en `AuditWorkspace.tsx` con recálculo en vivo y Drawer.
- [x] Importar Excel (P1): lectura con `xlsx`, parseo de hojas "Vectores" y "Calculadora" (clave `Id` → `Valor`), armado del payload (`vectores`/`externos`) y disparo automático del recálculo al backend.
- [x] Selector de RUT controlado en la barra superior; el RUT importado desde el Excel actualiza el estado y se muestra dinámicamente como opción adicional ("· Datos Importados") cuando no está en la lista por defecto.
- [x] Toggles de atributos tributarios globales (14D1 y CRRP) en la barra superior. Activan `setHasChanges(true)` para habilitar el botón de recálculo. Se inyectan como `'14D1'` y `CRRP` (0/1) dentro de `payload.externos` tanto en `handleRecalcularCaso` como en `handleFileUpload`.
- [x] Refactor visual de la barra global a 2 filas (Panel de Control). Fila 1: RUT + badge de estado (izq.) y toggles 14D1/CRRP (der.). Fila 2 (con divisor sutil): botones de acción alineados a la derecha. Botones renombrados: "Importar Excel" y "Exportar para automatizador".
- [x] Fila "TOTAL INGRESOS" (código 7) resaltada visualmente: fondo celeste claro (`bg-cyan-50/80`), borde superior cyan (`border-t-2 border-t-cyan-300`), columna "Monto Ingreso Percibido" con texto más grande (`text-sm`) en cyan oscuro (`text-cyan-800`). Se diferencia de la fila 7.12 que mantiene el gris pizarra.
- [x] Inyección de filas totalizadoras virtuales (7.12 y 7) en `filasCompletas` (useMemo) porque el backend FastAPI las envía solo en `response.totales`, no en `response.filas`. La regla de visibilidad (`filasVisibles`) opera sobre este array completo. Las filas virtuales se insertan en la posición correcta: 7.12 justo después de 7.11, y 7 al final.
- [x] Estandarización de nombres de filas con glosa oficial del SII. Diccionario `NOMBRES_OFICIALES_INGRESOS` en `incomeCatalog.ts` con las 24 partidas. La columna "Ventas y Servicios Afectos a IVA" usa `NOMBRES_OFICIALES_INGRESOS[codigo] ?? fila.concepto` como fallback.
- [x] Refactorización a arquitectura de Orquestador Global: nuevos tipos `SimulacionGlobalRequest` (`digitados.ingresos`) y `SimulacionGlobalResponse` (`ingresos.{filas,totales,avisos}`). Endpoint unificado `POST /api/v1/simulador/calcular`. El `DigitadosIngresos` se anida en `payload.digitados.ingresos`; el componente pasa `response.ingresos` a `IncomeTable` que ahora consume `IngresosResponseData`.
- [x] Limpieza de deuda técnica: duplicación eliminada (`parseNumero`/`formatMonto` → `utils/parsers.ts`), `console.log` reemplazado por `debugLog` condicional, `ingresosApi.ts` renombrado a `simuladorApi.ts` (`recalcularIngresos` → `recalcularCaso`, `INGRESOS_ENDPOINT` → `SIMULADOR_ENDPOINT`), mocks extraídos a `__mocks__/ingresosMock.ts`, barrel export `index.ts`, interfaz obsoleta `SimulacionIngresosRequest` eliminada, `ag-grid` desinstalado, assets Vite eliminados, `index.html` corregido (`lang="es"`, título), `@types/xlsx` agregado.
- [x] Refactorización estructural: custom hook `useSimulador` (toda la lógica de estado y handlers en `hooks/useSimulador.ts`), componente `GlobalControlBar` (barra de control extraída como Dumb UI con `GlobalControlBarProps`), `AuditWorkspace.tsx` convertido en orquestador presentacional puro que invoca el hook y renderiza los sub-componentes.
- [x] Corrección de bug de amnesia de estado: los vectores y externos importados desde Excel ahora se persisten en estados `vectores`/`externos` del hook. `handleRecalcularCaso` construye el payload desde estos estados (no desde `crearRequestInicial()`). `handleRevertir` los limpia junto con el resto del estado.
- [x] Conexión del motor de auditoria del backend en el Módulo de Ingresos: se agrego `mostrar_formulas?: boolean` al request, se creo la interfaz `BackendInspector` y se expuso como propiedad opcional en `FilaIngreso`. Los payloads de `handleRecalcularCaso` y `handleFileUpload` ahora solicitan `mostrar_formulas: true`. El trazador (`construirTrazabilidad`) prioriza `fila.inspector` cuando el backend lo envia, mapeando `literal` como formula, `evaluado` + `pasos` como explicacion y `variables_usadas` como factores intermedios; si no existe, mantiene el fallback local.
- [x] Refactor visual de la Caja de Cristal: `FieldTraceability` ahora soporta `evaluatedExpression`, `calculationSteps` e `isManualInput`; se elimino `explanation`. El mapeo desde `fila.inspector` asigna `evaluado`, `pasos` y detecta entradas manuales (`literal.includes('dig_')`). `FormulaInspector` muestra badges dinamicos por origen (`vector`, `digitado`, `externo`, `calculado`) y renderiza el bloque oscuro vertical con formula, reemplazo numerico y desglose de pasos; para entradas manuales muestra un banner amigable.
- [x] Refactor del motor de auditoria a granularidad celda por celda: `FilaIngreso` ahora expone `inspectores?: Record<string, BackendInspector>` en lugar de un unico `inspector`. `construirTrazabilidad` mapea `neto_` → `ingresos_ano`, `adeudados_` → `ingresos_adeudados_at_anterior` y `percibido_` → `monto_ingreso_percibido`, extrayendo el inspector especifico del diccionario. Las columnas manuales (`noPerc_`, `patrimonio_`, `presunta_`) usan el fallback con `isManualInput: true`. `IncomeTable` mantiene los `traceKey` correctos para cada celda.
- [ ] Pruebas, correcciones y otros.
 - [x] Indicadores visuales de columnas oficiales (Col. A-H-B-C-D-E-F-G) en el `thead` de `IncomeTable.tsx`, para facilitar la referencia cruzada con el formulario del SII. Se agregaron etiquetas sutiles encima de cada titulo de columna sin alterar anchos, renderizaciones condicionales ni logica de la tabla.
 - [x] Adaptación al nuevo contrato BFF del motor de auditoría: Se ajustó la detección de campos manuales evaluando la ausencia de pasos matemáticos y el origen de la variable (`digitado`). Se incorporaron íconos representativos en la Caja de Cristal para la procedencia de los datos (🏛️ vector, ✏️ digitado, 🔗 externo, ⚙️ calculado).
 - [x] Sistema de versionamiento real: `__APP_VERSION__` se lee desde `package.json` y se inyecta via `define` en `vite.config.ts`. Se reemplazo el string quemado `v2026.1` en `Navbar.tsx` por la variable global, y se declaro `__APP_VERSION__` en `src/vite-env.d.ts` para que TypeScript la reconozca.

### Fase 2: Página 2 (Egresos)

- [ ] Definición de contratos y tipos.
- [ ] Integración con endpoint backend de Egresos.
- [ ] Implementación de vista tabular y reglas de bloqueo.

### Fase 3: Páginas 3 a 8

- [ ] Retiros, RLI, Base Imponible, KPT, RRE, Resumen y Envío.
