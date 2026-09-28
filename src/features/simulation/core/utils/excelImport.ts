import * as XLSX from 'xlsx';
import { parseNumero } from '../../../../utils/parsers';
import type { RetiroFilaInput } from '../../pages/retiros/types/retiros';
import { MAPEO_EXCEL_RETIROS } from '../../pages/retiros/data/retirosCatalog';

/** Resultado del parseo del workbook Excel (hojas Vectores, Calculadora y Retiros). */
export interface ExcelImportResult {
  vectores: Record<string, number>;
  externos: Record<string, number>;
  rut: string | null;
  /** Filas de socios de la hoja opcional "Retiros" (vacias si no existe). */
  retiros: RetiroFilaInput[];
  /** Advertencias de formato detectadas en la hoja "Retiros". */
  retirosWarnings: string[];
}

/**
 * Normaliza un encabezado para buscarlo en el mapeo (minusculas, sin tildes
 * ni espacios/guiones). Asi se aceptan variantes como "F1 Fecha" o "f1_fecha".
 */
const normalizarHeader = (header: string): string =>
  header
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_\-]+/g, '');

/** Convierte un valor de celda Excel a fecha "dd/mm/aaaa" (o string vacio). */
const parseFechaExcel = (valor: unknown): string => {
  if (valor == null || valor === '') return '';
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    const dia = String(valor.getDate()).padStart(2, '0');
    const mes = String(valor.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${valor.getFullYear()}`;
  }
  const texto = String(valor).trim();
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(texto)) return texto;
  // Formato compacto DDMMYYYY sin separadores (ej. 03032025). Si Excel quito
  // el cero inicial (3032025), se rellena a 8 digitos.
  const soloDigitos = texto.replace(/\D/g, '');
  if (/^\d{7,8}$/.test(soloDigitos)) {
    const ocho = soloDigitos.padStart(8, '0');
    const dia = Number(ocho.slice(0, 2));
    const mes = Number(ocho.slice(2, 4));
    if (dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12) {
      return `${ocho.slice(0, 2)}/${ocho.slice(2, 4)}/${ocho.slice(4)}`;
    }
    return texto;
  }
  // Serial de Excel (dias desde 1899-12-30)
  const serial = Number(texto);
  if (Number.isFinite(serial) && serial > 20000 && serial < 80000) {
    const base = new Date(1899, 11, 30);
    const fecha = new Date(base.getTime() + serial * 86400000);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${fecha.getFullYear()}`;
  }
  return texto;
};

/**
 * Parsea la hoja opcional "Retiros" (una fila = un socio + una fecha).
 * Solo valida formato (RUT presente, usufructuario 1/2, numeros y fechas);
 * las reglas tributarias las aplica el backend al recalcular.
 */
const parseHojaRetiros = (
  hoja: XLSX.WorkSheet | undefined
): { filas: RetiroFilaInput[]; warnings: string[] } => {
  if (!hoja) return { filas: [], warnings: [] };
  const crudo = XLSX.utils.sheet_to_json<Record<string, unknown>>(hoja, { defval: null });
  const filas: RetiroFilaInput[] = [];
  const warnings: string[] = [];

  crudo.forEach((registro, idx) => {
    const numeroFila = idx + 2;
    const porCampo = {} as Record<string, unknown>;
    Object.entries(registro).forEach(([header, valor]) => {
      const campo = MAPEO_EXCEL_RETIROS[normalizarHeader(header)];
      if (campo && porCampo[campo] == null) porCampo[campo] = valor;
    });

    const rut = String(porCampo.rut ?? '').trim().toUpperCase().replace(/\./g, '');
    if (!rut) {
      warnings.push(`Fila ${numeroFila}: sin RUT, registro omitido.`);
      return;
    }

    const usufructuarioCrudo = porCampo.usufructuario;
    let usufructuario: number | null = null;
    // Valores que significan "sin marca" (no es error): vacio, guion, 0, no, etc.
    const textoUsufructuario = usufructuarioCrudo == null ? '' : String(usufructuarioCrudo).trim().toLowerCase();
    const VACIOS_USUFRUCTUARIO = new Set(['', '-', '–', '—', '0', 'n/a', 'na', 'no', 'ninguno', 's/n']);
    if (!VACIOS_USUFRUCTUARIO.has(textoUsufructuario)) {
      const n = parseNumero(usufructuarioCrudo as string | number);
      if (n === 1 || n === 2) {
        usufructuario = n;
      } else {
        warnings.push(`Fila ${numeroFila} (${rut}): usufructuario invalido, se usa vacio.`);
      }
    }

    filas.push({
      rut,
      usufructuario,
      acciones: parseNumero(porCampo.acciones as string | number | null),
      f1_fecha: parseFechaExcel(porCampo.f1_fecha),
      f1_monto: parseNumero(porCampo.f1_monto as string | number | null),
      f1_isfut_h: parseNumero(porCampo.f1_isfut_h as string | number | null),
      f1_isfut_a: parseNumero(porCampo.f1_isfut_a as string | number | null),
      saldo: parseNumero(porCampo.saldo as string | number | null),
      f2_fecha: parseFechaExcel(porCampo.f2_fecha),
      f2_monto: parseNumero(porCampo.f2_monto as string | number | null),
      f2_isfut_h: parseNumero(porCampo.f2_isfut_h as string | number | null),
      f2_isfut_a: parseNumero(porCampo.f2_isfut_a as string | number | null),
      es_registro_nuevo: true,
    });
  });

  return { filas, warnings };
};

/**
 * Lee el workbook de Excel y extrae las hojas "Vectores" y "Calculadora"
 * (clave `Id` -> `Valor`), la hoja opcional "Retiros" (filas de socios) y
 * detecta el RUT en la primera hoja que lo contenga. Utilidad pura: no toca
 * estado de React.
 */
export const parseExcelWorkbook = async (file: File): Promise<ExcelImportResult> => {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true });

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

  const { filas: retiros, warnings: retirosWarnings } = parseHojaRetiros(workbook.Sheets['Retiros']);

  const rutImportado = workbook.SheetNames.reduce<string | null>((encontrado, nombreHoja) => {
    if (encontrado) return encontrado;
    const filas = XLSX.utils.sheet_to_json<Record<string, unknown>>(
      workbook.Sheets[nombreHoja],
      { defval: null }
    );
    const fila = filas.find((f) => f.RUT != null && String(f.RUT).trim() !== '');
    return fila ? String(fila.RUT).trim() : null;
  }, null);

  return { vectores: vectoresParseados, externos: calculadoraParseada, rut: rutImportado, retiros, retirosWarnings };
};
