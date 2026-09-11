export interface SiiPageTab {
  id: number;
  /** Clave estable de la pagina (para enrutado y registro de componentes). */
  key: string;
  name: string;
  shortName: string;
}

/** Metadata de las 8 paginas del Simulador (una sola fuente de verdad). */
export const SII_PAGES: SiiPageTab[] = [
  { id: 1, key: 'ingresos', name: 'Página 1: Ingresos por Ventas del Año', shortName: '1. Ingresos' },
  { id: 2, key: 'egresos', name: 'Página 2: Egresos', shortName: '2. Egresos' },
  { id: 3, key: 'retiros', name: 'Página 3: Retiros', shortName: '3. Retiros' },
  { id: 4, key: 'determinacion-rli', name: 'Página 4: Determinación RLI', shortName: '4. RLI' },
  { id: 5, key: 'base-imponible', name: 'Página 5: Base Imponible', shortName: '5. Base Imp.' },
  { id: 6, key: 'capital-propio', name: 'Página 6: Capital Propio Tributario', shortName: '6. KPT' },
  { id: 7, key: 'rre', name: 'Página 7: Registro de Renta Empresarial', shortName: '7. RRE' },
  { id: 8, key: 'confirmacion', name: 'Página 8: Resumen y Envío de DJ', shortName: '8. Resumen y Envío' },
];
