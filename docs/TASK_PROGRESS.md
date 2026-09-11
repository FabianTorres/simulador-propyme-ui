# Estado de Avance y Hoja de Ruta — Simulador Propyme (Frontend)

## 📌 Contexto y Arquitectura Actual

- **Rol:** Frontend Dumb UI en React + Vite + TailwindCSS.
- **Backend:** Motor determinista FastAPI en `http://localhost:8002` (Página 1 lista al 100%).
- **Paleta de Diseño:** Base Pizarra Frío (`#eef2f6`), Índigo/Cobalto (`indigo-600`), Cyan (`cyan-400`), Cabeceras `slate-950`.
- **Estructura Modular Activa:**
  - `src/features/simulation/core/types/global.ts`: Contratos globales (request/response del Orquestador).
  - `src/features/simulation/core/types/inspector.ts`: Tipos de trazabilidad (BackendInspector, FieldTraceability).
  - `src/features/simulation/core/data/pages.config.ts`: Metadata de las 8 paginas del SII.
  - `src/features/simulation/core/data/ruts.ts`: RUTs por defecto del selector.
  - `src/features/simulation/core/hooks/useSimulador.ts`: Orquestador global de estado (response, digitados, handlers).
  - `src/features/simulation/core/utils/excelImport.ts`: Parseo de Excel (hojas Vectores y Calculadora).
  - `src/features/simulation/core/components/SimulationShell.tsx`: Shell (barra + tabs + pagina activa + inspector + modal).
  - `src/features/simulation/core/components/GlobalControlBar.tsx`: Barra de control superior (Dumb UI).
  - `src/features/simulation/core/components/FormulaInspector.tsx`: Inspector de trazabilidad (Caja de Cristal).
  - `src/features/simulation/core/components/AuditableCellInput.tsx`: Input de celda reutilizable con micro-boton fx.
  - `src/features/simulation/core/components/PageTabs.tsx` / `PagePlaceholder.tsx`: Navegacion y estado temporal de paginas.
  - `src/features/simulation/pages/ingresos/`: Modulo Ingresos (IngresosPage, IncomeTable, PatrimonioModal, trazabilidad, types, data).
  - `src/features/simulation/pages/{egresos,retiros,...}/`: Stubs de las 7 paginas restantes.
  - `src/features/simulation/api/simuladorApi.ts`: Cliente HTTP contra `/api/v1/simulador/calcular`.
  - `src/features/simulation/__mocks__/ingresosMock.ts`: Fixtures de maqueta QA extraidos del API.
  - `src/features/simulation/index.ts`: Barrel export del modulo.
  - `src/utils/parsers.ts`: Utilidades compartidas (`parseNumero`, `formatMonto`, `debugLog`).
  - `src/components/layout/Navbar.tsx`: Barra de navegacion superior.
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
- [x] Refactorización a arquitectura de Orquestador Global: nuevos tipos `SimulacionGlobalRequest` (`digitados.ingresos`) y `SimulacionGlobalResponse` (`ingresos.{filas,avisos}`). Endpoint unificado `POST /api/v1/simulador/calcular`. El `DigitadosIngresos` se anida en `payload.digitados.ingresos`; el componente pasa `response.ingresos` a `IncomeTable` que ahora consume `IngresosResponseData`.
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
 - [x] Modal de Empresario Individual (Patrimonio Personal): se agregaron `valor1_pcalc` y `valor2_pcalc` a `AvisosIngresos`, se creo el componente `PatrimonioModal.tsx` y se integro en `AuditWorkspace.tsx`. El estado `patrimonioPersonal` (boolean | null) se envia en la raiz del payload (`patrimonio_personal`) y se reinicia al revertir.
 - [x] Auto-recalculo silencioso al responder el modal de Patrimonio Personal: `handleRecalcularCaso` ahora acepta un parametro opcional `overridePatrimonio` que actualiza el estado directamente y se envia inmediatamente al backend, evitando depender del ciclo asincrono de React y del boton "Recalcular Caso".
 - [x] Visibilidad normativa de columnas C, D y E en `IncomeTable.tsx`: se agregaron listas maestras `ROWS_CON_COL_C/D/E` basadas en `docs/Pagina_1_14D1.md`. Las celdas de filas no incluidas se renderizan vacias (no bloqueadas), y la fila 7.8 tiene la Columna C bloqueada permanentemente segun la normativa.
 - [x] Consumo de totales calculados del backend para la fila totalizadora 7.12: se agregaron `monto_no_percibido`, `no_considerar_patrimonio` y `factura_renta_presunta` a `FilaIngreso`. La fila 7.12 renderiza botones de texto plano con los valores del backend y abre el inspector. El trazador (`AuditWorkspace.tsx`) mapea las nuevas llaves `noPerc_`, `patrimonio_` y `presunta_` a sus inspectores correspondientes.
 - [x] Reestructuracion del modulo `simulation` en `core/` (contratos, hook, shell y UI compartida) + `pages/` (ingresos completo + 7 stubs). Se elimino `modulo` del request, `14D1` se mantiene en `externos` y `CRRP` pasa a booleano. Se extrajeron `AuditableCellInput`, `parseExcelWorkbook` y la trazabilidad a modulos dedicados. Sin cambios visuales ni funcionales.
 - [x] Sistema de versionamiento real: `__APP_VERSION__` se lee desde `package.json` y se inyecta via `define` en `vite.config.ts`. Se reemplazo el string quemado `v2026.1` en `Navbar.tsx` por la variable global, y se declaro `__APP_VERSION__` en `src/vite-env.d.ts` para que TypeScript la reconozca.
 - [x] Ajustes de UI en tabs y encabezados de Egresos: se eliminaron los badges de los botones de navegacion (`PageTabs.tsx` + `pages.config.ts`) dejando solo el nombre corto de cada pagina. Los botones ahora usan ancho flexible (`flex-1`) y se acomodan al viewport (`sm:flex-nowrap`, texto truncado con `truncate`). En `EgresosTable.tsx` los titulos de columnas se alinearon a la web del SII y se agregaron tooltips con los nombres originales del documento `docs/Pagina_2_Egresos.md`.

### Fase 2: Página 2 (Egresos)

- [x] Definición de contratos y tipos (`egresos.ts`, `DigitadosGlobal`, `PaginaKey`).
- [x] Catálogo de metadatos QA (`egresosCatalog.ts`).
- [x] Mock de maqueta (`egresosMock.ts`) e integración al mock global.
- [x] Componente `EgresosTable.tsx` con reglas UI (bloqueo B === 0, columnas C/D/E condicionales, col H editable por montos AT-1, fila 8.31 bloqueada).
- [x] `EgresosPage.tsx` con banner de arriendos pagados y toggle local por pagina.
- [x] Trazabilidad de celdas (`trazabilidad.ts`) y despacho por pagina en `SimulationShell`.
- [x] Orquestador global (`useSimulador`) con `DigitadosGlobal` y `handleDigitadoChange(page, seccion, codigo, valor)`.
- [x] Orden canonico de filas (`ORDEN_FILAS_EGRESOS` en `egresosCatalog.ts` + ordenamiento en `EgresosTable.tsx` via `ordenarFilasEgresos`) para seguir el orden de `docs/Pagina_2_Egresos.md` sin depender del orden en que el backend entregue `filas`.
- [ ] Integración con endpoint backend de Egresos (pendiente validacion del motor real).
- [ ] Tooltips de las filas 8.14 / 8.15 / 8.17 / 8.27 (se veran despues).

### Fase 3: Página 3 (Retiros)

- [x] Definición de contratos y tipos (`pages/retiros/types/retiros.ts`): `RetiroFilaInput`, `RetiroFila`, `CalculoRetiros`, `DerivadaRetiro`, `TotalesRetiros`, `AvisosRetiros`, `DigitadosRetiros`, `RreTemporal`, `RetirosResponseData`.
- [x] Extensión de contratos globales: `PaginaKey` incluye `'retiros'`; `DigitadosGlobal` agrega `retiros` + `rre`; `SimulacionGlobalResponse` agrega `retiros`.
- [x] Estado inicial vacío (`__mocks__/retirosMock.ts`): el backend no siembra el RIAC, por lo que `retiros.filas` nace vacío (sin datos demo). Integrado en `crearRequestInicial()` y `MOCK_RESPUESTA_SII`.
- [x] Orquestador (`useSimulador`): nuevo `handleRetirosFilasChange(filas)` (reemplaza el arreglo y marca estado sucio); `retiros`/`rre` se incluyen en `handleRecalcularCaso`, `handleFileUpload` y `handleRevertir`. El nodo `response.retiros` (con `calculo`/`derivadas`/`totales`) se preserva intacto entre ediciones para no perder los cálculos internos que alimentan al RRE.
- [x] Cambio de año tributario: `at` paso de `'2025'` a `'2026'` en el payload y en el request inicial (proximo periodo sera `'2027'`).
- [x] Componente de texto auditable (`core/components/AuditableTextCellInput.tsx`): variante de `AuditableCellInput` para RUT y fechas con mascara `dd/mm/aaaa` y micro-boton `fx`.
- [x] Catalogo de columnas (`pages/retiros/data/retirosCatalog.ts`): 12 columnas A-L (RET1-RET12) con grupos "Retiros efectivos del ejercicio" y "Devolucion de capital", tooltip de RET2.
- [x] Tabla dinamica (`RetirosTable.tsx`): encabezado de 3 niveles, filas agregables ("Nuevo"), duplicables (mantiene RET1) y eliminables; todas las celdas editables segun decision de maqueta (sin RIAC).
- [x] Pagina (`RetirosPage.tsx`): panel de cabecera, franja resumen auditable ([1044], [1045], RET30, RET15 con `fx`) y banner de error de topes.
- [x] Trazabilidad (`pages/retiros/trazabilidad.ts`): mapeo de `ret_1044`, `ret_1045`, `ret30`, `ret15`, `ret14_<rut>`, `validacionFila_<i>_f1/f2` a los `inspectores` del backend.
- [x] Despacho por pagina en `SimulationShell` (case 3 + trazabilidad activa por pagina) y barrel exports.
- [ ] Validacion final contra el backend real de Retiros (maqueta QA).
- [ ] Paginas 4 a 8 (RLI, Base Imponible, KPT, RRE, Resumen y Envio).




