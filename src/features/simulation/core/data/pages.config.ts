export interface SiiPageTab {
  id: number;
  /** Clave estable de la pagina (para enrutado y registro de componentes). */
  key: string;
  name: string;
  shortName: string;
  badge: string;
}

/** Metadata de las 8 paginas del Simulador (una sola fuente de verdad). */
export const SII_PAGES: SiiPageTab[] = [
  { id: 1, key: 'ingresos', name: 'Página 1: Ingresos por Ventas del Año', shortName: '1. Ingresos', badge: '22 filas' },
  { id: 2, key: 'egresos', name: 'Página 2: Egresos', shortName: '2. Egresos', badge: '4 campos' },
  { id: 3, key: 'retiros', name: 'Página 3: Retiros', shortName: '3. Retiros', badge: 'Cálculo' },
  { id: 4, key: 'determinacion-rli', name: 'Página 4: Determinación RLI', shortName: '4. RLI', badge: '1 campo' },
  { id: 5, key: 'base-imponible', name: 'Página 5: Base Imponible', shortName: '5. Base Imp.', badge: 'Cálculo' },
  { id: 6, key: 'capital-propio', name: 'Página 6: Capital Propio Tributario', shortName: '6. KPT', badge: 'Cálculo' },
  { id: 7, key: 'rre', name: 'Página 7: Registro de Renta Empresarial', shortName: '7. RRE', badge: 'Resumen' },
  { id: 8, key: 'confirmacion', name: 'Página 8: Resumen y Envío de DJ', shortName: '8. Resumen y Envío', badge: 'Cierre' },
];
