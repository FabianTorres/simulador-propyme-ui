# AGENTS.md — Guía para el agente de desarrollo

## Propósito
Este archivo centraliza el contexto del proyecto para que cualquier agente de IA
(o un humano) retome el trabajo sin perder el hilo, incluso después de reiniciar
la sesión. Leerlo completo antes de tocar código.

## Resumen del proyecto
- **Qué es:** Frontend del "Simulador Asistente Propyme", interfaz para el
  simulador tributario del Régimen Propyme (Formulario 22).
- **Filosofía:** "Dumb UI / Smart Backend". El frontend NO calcula nada; solo
  renderiza datos, captura inputs y aplica reglas visuales. Toda la lógica
  tributaria y matemática vive en el backend (Python/FastAPI).
- **Stack:** React 18 + Vite + TypeScript (estricto) + TailwindCSS + SheetJS (`xlsx`).

## Reglas no negociables (ver .clinerules)
1. **Dumb UI:** cero fórmulas tributarias, sumatorias o lógica de negocio en
   JavaScript/TypeScript. Si un valor cambia, se resuelve en el backend.
2. **Estado "sucio":** los inputs del usuario NO recalculan en vivo. Se guardan
   en `digitados` y se envían recién al presionar "Recalcular Caso" (POST).
3. **Paleta estricta:** fondo `#eef2f6`; tinta `slate-900`/`slate-950`; acentos
   `indigo-600`/`indigo-700`; highlights `cyan-400`/`cyan-300`; estados
   `emerald-500` (OK) y `amber-500` (alerta).
4. **Tipografía:** UI general `font-sans` (Inter); datos numéricos/monetarios,
   códigos SII y fórmulas SIEMPRE en `font-mono` (JetBrains Mono) con alineación tabular.
5. **Componentes complejos:** patrón Slide-Over Drawer ("Caja de Cristal").
   No usar modales centrados.
6. **TypeScript estricto:** interfaces para payloads y respuestas
   (`SimulationRequest`, `SimulationResponse`, etc.).
7. **Comentarios:** en español, impersonales y sin tildes/ñ (ej. "ano" en vez de
   "año"). Nomenclatura del código en inglés para lo estructural y español para
   conceptos tributarios (ej. `montoNoPercibido`, `handleRecalcularCaso`).

## Endpoint único
```
POST http://localhost:8002/api/v1/simulador/calcular
```
El cliente está en `src/features/simulation/api/simuladorApi.ts`. Mientras el
backend no esté desplegado, la llamada se resuelve con fixtures (mocks) estáticos.

## Arquitectura del módulo principal
Todo vive en `src/features/simulation/`:

- `core/types/` → contratos globales (`global.ts`, `inspector.ts`).
- `core/data/` → metadata de páginas (`pages.config.ts`) y RUTs (`ruts.ts`).
- `core/hooks/useSimulador.ts` → orquestador global de estado (único lugar con estado).
- `core/components/` → shell, barra, tabs, inspector de trazabilidad y el input reutilizable `AuditableCellInput`.
- `core/utils/excelImport.ts` → parseo de Excel (hojas "Vectores" y "Calculadora").
- `pages/<pagina>/` → feature slice por página del SII (types, data, tabla, page, trazabilidad).
- `__mocks__/` → fixtures QA (`ingresosMock.ts` = mock global; `egresosMock.ts`).
- `api/simuladorApi.ts` → transporte HTTP (fetch único).

### Contratos clave
- `DigitadosGlobal` = `{ ingresos; egresos; retiros; rre }`.
- `SimulacionGlobalRequest` = `{ at, patrimonio_personal, mostrar_formulas?, vectores, externos, digitados }`.
- `SimulacionGlobalResponse` = `{ ingresos; egresos | null; retiros | null }`.
- `PaginaKey` = `'ingresos' | 'egresos' | 'retiros'`.
- `useSimulador.handleDigitadoChange(page, seccion, codigo, valor)` actualiza el
  estado sucio anidado por página.
- `useSimulador.handleRetirosFilasChange(filas)` reemplaza el arreglo completo de
  filas de Retiros (página con filas dinámicas).

## Estado del proyecto

### Fase 1 — Página 1 (Ingresos): COMPLETA
`pages/ingresos/` con `IngresosPage`, `IncomeTable`, `PatrimonioModal`,
`trazabilidad` y `incomeCatalog`. Reglas de visibilidad y bloqueo implementadas
según `docs/Pagina_1_14D1.md`.

### Fase 2 — Página 2 (Egresos): IMPLEMENTADA (maqueta)
`pages/egresos/` con `EgresosPage`, `EgresosTable`, `trazabilidad` y
`egresosCatalog`. Columnas: Compras y Servicios (A), adeudados AT anterior (H),
Egresos del año (B), No Pagadas (C), Patrimonio (D), Renta Presunta (E),
Monto Compras o Egresos Pagados (F).

Nombres backend de Egresos (confirmados):
`egresos_ano`, `egresos_adeudados_at_anterior`, `no_pagadas`,
`no_considerar_patrimonio`, `factura_renta_presunta`, `monto_egresos_pagados`.

**Orden canónico de filas (NO numérico)** en `egresosCatalog.ts` →
`ORDEN_FILAS_EGRESOS`; la tabla ordena con `ordenarFilasEgresos`:
`8.1 → 8.2 → 8.3 → 8.4 → 8.6 → 8.7 → 8.8 → 8.9 → 8.11 → 8.31 → 8.5 → 8.10 → 8.12 … 8.29 → 8`.

Reglas UI de Egresos:
- `CODIGOS_B_EDITABLES` (col B editable), `CODIGOS_H_EDITABLES` (col H editable
  solo con monto AT-1 > 0), `ROWS_CON_COL_C/D/E`.
- La fila `8.31` mantiene C, D y E bloqueadas permanentemente.
- El bloqueo por `Columna B === 0` deshabilita las columnas C/D/E de esa fila.
- Banner de advertencia `aviso_arriendos_pagados`.
- Pendiente de esta fase: tooltips de 8.14/8.15/8.17/8.27 y validación contra el backend real.

### Fase 3 — Página 3 (Retiros): IMPLEMENTADA (maqueta)
`pages/retiros/` con `RetirosPage`, `RetirosTable`, `trazabilidad`, `types/retiros.ts`
y `data/retirosCatalog.ts`. Es la primera pagina con **filas dinamicas** (lista de
socios que el analista agrega/duplica/elimina), no filas fijas tipo 7.x/8.x.

Reglas clave de Retiros:
- El backend **no siembra el RIAC**: los socios viajan siempre en `digitados.retiros.filas`
  (los digita el analista QA o vienen del import). Enviar `filas: []` devuelve Retiros vacio.
- Por decision de maqueta, **todas las celdas editables se habilitan** en toda fila
  creada por el analista (la matriz de bloqueo RIAC vs Nueva del SII real no se replica).
  `es_registro_nuevo` se envia `true` en filas creadas con "Nuevo"/"Duplicar".
- `digitados.rre` es un **bloque temporal aparte** (`{ h2, h3, h6, h7, i4, i17 }`) que
  Retiros reenvia para calcular `[1044]/[1045]`; hoy va en 0.
- Respuesta `retiros`: `filas` (eco numerado con `validacion_f1`/`validacion_f2`),
  `calculo` (`v1044`/`v1045`), `derivadas` (1040-1052, para RRE/RLI, no se renderizan),
  `totales` (`ret30`, `ret15`, `ret14`), `avisos` (habilitaciones y `validacion_1044_ok`/
  `validacion_1045_ok`) e `inspectores`.
- El nodo `response.retiros` se **preserva intacto** entre ediciones para no perder los
  calculos internos (`calculo`/`derivadas`) que alimentan al RRE.
- `AuditableTextCellInput` (variante de texto) se usa para RUT y fechas `dd/mm/aaaa`.
- El `at` del payload es `'2026'` (proximo periodo sera `'2027'`).

Pendiente: validacion final contra el backend real de Retiros.

### Fase 4 — Páginas 4 a 8: PENDIENTES
RLI, Base Imponible, KPT, RRE, Resumen y Envío. Actualmente son stubs que renderizan
`PagePlaceholder`.

## Convenciones transversales
- El toggle "Desplegar totalidad de las filas" es **estado local por página**
  (`useState` dentro de cada página), no un estado global del hook.
- La trazabilidad de la Caja de Cristal se **despacha por página activa** en `SimulationShell`.
- El mock global vive en `ingresosMock.ts` y compone `egresos` desde `egresosMock.ts`.

## Documentación obligatoria
Al completar un hito, actualizar `docs/TASK_PROGRESS.md` (marcar `[x]` y agregar un
resumen del cambio). No tocar código sin registrar el avance. Este `AGENTS.md`,
`docs/TASK_PROGRESS.md` y `docs/Pagina_*.md` son la fuente de verdad del contexto.

## Comandos
```bash
npm install
npm run dev
npm run build   # valida TypeScript (tsc -b) y empaqueta con Vite
```
