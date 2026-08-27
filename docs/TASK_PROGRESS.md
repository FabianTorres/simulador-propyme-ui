# Estado de Avance y Hoja de Ruta — Simulador Propyme (Frontend)

## 📌 Contexto y Arquitectura Actual

- **Rol:** Frontend Dumb UI en React + Vite + TailwindCSS.
- **Backend:** Motor determinista FastAPI en `http://localhost:8002` (Página 1 lista al 100%).
- **Paleta de Diseño:** Base Pizarra Frío (`#eef2f6`), Índigo/Cobalto (`indigo-600`), Cyan (`cyan-400`), Cabeceras `slate-950`.
- **Estructura Modular Activa:**
  - `src/features/simulation/types/ingresos.ts`: Contratos de request y response.
  - `src/features/simulation/api/ingresosApi.ts`: Cliente HTTP y mock inicial.
  - `src/features/simulation/data/incomeCatalog.ts`: Metadatos estáticos y textos legales de las 22 filas.
  - `src/features/simulation/components/IncomeTable.tsx`: Tabla densa con operadores (+, −, =), bloqueos y micro-fx.
  - `src/features/simulation/components/AuditWorkspace.tsx`: Orquestador de estado, 8 pestañas y Slide-Over Drawer.

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
- [ ] Pruebas, correcciones y otros.

### Fase 2: Página 2 (Egresos)

- [ ] Definición de contratos y tipos.
- [ ] Integración con endpoint backend de Egresos.
- [ ] Implementación de vista tabular y reglas de bloqueo.

### Fase 3: Páginas 3 a 8

- [ ] Retiros, RLI, Base Imponible, KPT, RRE, Resumen y Envío.
