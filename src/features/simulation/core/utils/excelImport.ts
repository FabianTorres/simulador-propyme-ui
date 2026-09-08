import * as XLSX from 'xlsx';
import { parseNumero } from '../../../../utils/parsers';

/** Resultado del parseo del workbook Excel (hojas Vectores y Calculadora). */
export interface ExcelImportResult {
  vectores: Record<string, number>;
  externos: Record<string, number>;
  rut: string | null;
}

/**
 * Lee el workbook de Excel y extrae las hojas "Vectores" y "Calculadora"
 * (clave `Id` -> `Valor`), ademas de detectar el RUT en la primera hoja que
 * lo contenga. Es una utilidad pura: no toca estado de React.
 */
export const parseExcelWorkbook = async (file: File): Promise<ExcelImportResult> => {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });

  const hojaVectores = workbook.Sheets['Vectores'];
  const hojaCalculadora = workbook.Sheets['Calculadora'];

  if (!hojaVectores || !hojaCalculadora) {
    throw new Error('El archivo no contiene las hojas "Vectores" y/o "Calculadora".');
  }

  const vectoresParseados = XLSX.utils
    .sheet_to_json<{ Id: string; Valor: string | number }>(hojaVectores)
    .reduce<Record<string, number>>((acumulador, fila) => {
      acumulador[fila.Id] = parseNumero(fila.Valor);
      return acumulador;
    }, {});

  const calculadoraParseada = XLSX.utils
    .sheet_to_json<{ Id: string; Valor: string | number }>(hojaCalculadora)
    .reduce<Record<string, number>>((acumulador, fila) => {
      acumulador[fila.Id] = parseNumero(fila.Valor);
      return acumulador;
    }, {});

  const rutImportado = workbook.SheetNames.reduce<string | null>((encontrado, nombreHoja) => {
    if (encontrado) return encontrado;
    const filas = XLSX.utils.sheet_to_json<Record<string, unknown>>(
      workbook.Sheets[nombreHoja],
      { defval: null }
    );
    const fila = filas.find((f) => f.RUT != null && String(f.RUT).trim() !== '');
    return fila ? String(fila.RUT).trim() : null;
  }, null);

  return { vectores: vectoresParseados, externos: calculadoraParseada, rut: rutImportado };
};
