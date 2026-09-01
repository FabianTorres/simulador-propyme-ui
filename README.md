# Simulador Asistente Propyme (Frontend)

Interfaz de usuario para el simulador tributario del Régimen Propyme, construida con React, TypeScript y TailwindCSS.

Este proyecto sigue una arquitectura estricta de **"Dumb UI" (Interfaz Tonta)**. El frontend se encarga exclusivamente de la renderización, la captura de inputs del usuario y el manejo del estado local. Toda la lógica de negocio, reglas tributarias y cálculos matemáticos residen en el backend (FastAPI).

## 🛠 Stack Tecnológico

- **Framework:** React 18 + Vite
- **Lenguaje:** TypeScript
- **Estilos:** TailwindCSS
- **Lectura de Archivos:** SheetJS (`xlsx`) para importación de datos en memoria.

## 🏗 Arquitectura y Patrones

- **Orquestador Global:** El estado de la simulación se concentra en un Custom Hook (`useSimulador.ts`). Este hook almacena la materia prima importada (Vectores y variables Externas) y los inputs "sucios" del usuario (`digitados`).
- **Comunicación con API:** Las interacciones del usuario no disparan cálculos en tiempo real. Los cambios marcan la UI como "sincronización pendiente". El recálculo se ejecuta bajo demanda apuntando a un único endpoint global (`/api/v1/simulador/calcular`).
- **Separación de Responsabilidades:** Componentes presentacionales puros (ej. `GlobalControlBar`, `IncomeTable`) que reciben datos y callbacks mediante props. La UI no contiene diccionarios ni reglas lógicas quemadas en el código.

## 🚀 Instalación y Uso

1. Instalar dependencias, levantar el entorno de desarrollo y compilación para producción:
   ```bash
   npm install
   npm run dev
   npm run build
   ```

## 🏷️ Versionamiento (SemVer)

Este proyecto utiliza Versionamiento Semántico. La versión mostrada en la cabecera de la aplicación se lee automáticamente desde el archivo `package.json` durante el proceso de compilación de Vite mediante la variable inyectada `__APP_VERSION__`.

Para actualizar la versión de la interfaz, **NO edites el código fuente ni los componentes de React**. Utiliza los comandos estándar de npm en tu terminal:

- **Bugs y parches:** `npm version patch` (ej. `1.0.0` → `1.0.1`).
- **Nuevas características (ej. nueva página del SII):** `npm version minor` (ej. `1.0.1` → `1.1.0`).
- **Cambios estructurales masivos:** `npm version major` (ej. `1.1.0` → `2.0.0`).

Al ejecutar estos comandos, npm actualizará el `package.json` automáticamente y creará un tag en Git. La nueva versión se reflejará en la UI en el próximo `npm run dev` o `npm run build`.

## 📁 Estructura del Proyecto y Responsabilidades

```text
simulador-propyme-ui/
├── docs/                             # Documentación esencial para desarrolladores y agentes de IA.
│   ├── Pagina_1_14D1.md              # Reglas de negocio y fórmulas tributarias (Página 1).
│   └── TASK_PROGRESS.md              # Tracker de progreso y checklist de hitos del proyecto.
├── public/                           # Assets estáticos públicos.
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                       # Assets estáticos procesados por Vite (imágenes, etc.).
│   │   └── hero.png
│   ├── components/                   # Componentes transversales y de layout de toda la app.
│   │   ├── layout/
│   │   │   └── Navbar.tsx            # Barra de navegación principal del sitio.
│   │   └── ui/                       # (Futuro) Componentes UI genéricos (botones, modales, etc.).
│   ├── config/                       # Configuraciones globales de la aplicación.
│   ├── features/                     # Arquitectura basada en "Feature Slices" (Módulos de negocio).
│   │   └── simulation/               # MÓDULO PRINCIPAL: Simulador Tributario Propyme.
│   │       ├── __mocks__/
│   │       │   └── ingresosMock.ts   # Fixtures y datos de prueba desacoplados de la API.
│   │       ├── api/
│   │       │   └── simuladorApi.ts   # Cliente HTTP (fetch). Conecta con POST /api/v1/simulador/calcular.
│   │       ├── components/           # Componentes UI específicos de la simulación (Dumb UI).
│   │       │   ├── AuditWorkspace.tsx # Orquestador presentacional (esqueleto, tabs y layout principal).
│   │       │   ├── FormulaInspector.tsx # Cajón lateral (Slide-Over) para auditar reglas y fórmulas.
│   │       │   ├── GlobalControlBar.tsx # Barra superior (RUT, Toggles 14D1/CRRP, Botones de acción).
│   │       │   └── IncomeTable.tsx   # Grilla densa de ingresos. Muestra cálculos y captura digitados.
│   │       ├── data/
│   │       │   └── incomeCatalog.ts  # Diccionarios estáticos (glosas oficiales del SII, metadatos).
│   │       ├── hooks/
│   │       │   └── useSimulador.ts   # EL CEREBRO: Custom hook que maneja el estado global, vectores y handlers.
│   │       ├── types/
│   │       │   ├── ingresos.ts       # Interfaces de TypeScript para payloads de red (Request/Response).
│   │       │   └── inspector.ts      # Interfaces para la trazabilidad de la Caja de Cristal.
│   │       └── index.ts              # Barrel export para centralizar las importaciones del módulo.
│   ├── lib/                          # Librerías de terceros configuradas (ej. clientes axios).
│   ├── routes/                       # Configuración de enrutamiento (React Router).
│   ├── utils/
│   │   └── parsers.ts                # Funciones puras transversales (parseNumero, formatMonto, debugLog).
│   ├── App.tsx                       # Componente raíz de React.
│   ├── index.css                     # Estilos globales e inyección de TailwindCSS.
│   └── main.tsx                      # Punto de entrada de la aplicación.
├── eslint.config.js                  # Reglas de linting para mantener calidad de código.
├── index.html                        # Plantilla HTML principal.
├── vite.config.ts                    # Configuración del bundler Vite.
└── package.json                      # Dependencias y scripts del proyecto.
```
