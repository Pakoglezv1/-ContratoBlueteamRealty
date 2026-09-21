/**
 * Convierte un monto numérico a su representación en letras (español),
 * en el mismo formato usado en los recibos de Blue Team Realty:
 * "Siete mil quinientos dólares 00/100 USD"
 */

const UNIDADES = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
const DIEZ_A_DIECINUEVE = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
const VEINTIALGO = ["veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const DECENAS = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const CENTENAS = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

const MONEDAS = {
  USD: { singular: "dólar", plural: "dólares" },
  MXN: { singular: "peso", plural: "pesos" },
};

function decenasALetras(n) {
  if (n < 10) return UNIDADES[n];
  if (n < 20) return DIEZ_A_DIECINUEVE[n - 10];
  if (n < 30) return VEINTIALGO[n - 20];
  const d = Math.floor(n / 10);
  const u = n % 10;
  return u === 0 ? DECENAS[d] : `${DECENAS[d]} y ${UNIDADES[u]}`;
}

function centenasALetras(n) {
  if (n === 0) return "";
  if (n === 100) return "cien";
  const c = Math.floor(n / 100);
  const resto = n % 100;
  const partes = [];
  if (c > 0) partes.push(CENTENAS[c]);
  if (resto > 0) partes.push(decenasALetras(resto));
  return partes.join(" ");
}

function enteroALetras(num) {
  if (num === 0) return "cero";

  const millones = Math.floor(num / 1000000);
  const miles = Math.floor((num % 1000000) / 1000);
  const cientos = num % 1000;

  const partes = [];

  if (millones > 0) {
    partes.push(millones === 1 ? "un millón" : `${centenasALetras(millones)} millones`);
  }
  if (miles > 0) {
    partes.push(miles === 1 ? "mil" : `${centenasALetras(miles)} mil`);
  }
  if (cientos > 0) {
    partes.push(centenasALetras(cientos));
  }
  return partes.join(" ").trim();
}

function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @param {number} monto - monto con decimales, ej. 7500.00
 * @param {'USD'|'MXN'} moneda
 * @returns {string} ej. "Siete mil quinientos dólares 00/100 USD"
 */
function montoALetras(monto, moneda = "USD") {
  const info = MONEDAS[moneda] || MONEDAS.USD;
  const entero = Math.floor(monto);
  const centavos = Math.round((monto - entero) * 100);
  const nombreMoneda = entero === 1 ? info.singular : info.plural;

  // "uno" se vuelve "un" cuando antecede directamente al sustantivo
  let letras = entero === 1 ? "un" : enteroALetras(entero);
  letras = capitalizar(letras);

  // "de" antes del sustantivo cuando el entero es un múltiplo exacto de un millón
  // (ej. "un millón de dólares", pero "un millón quinientos mil dólares" sin "de")
  const esMillonExacto = entero >= 1000000 && entero % 1000000 === 0;
  const conector = esMillonExacto ? " de " : " ";

  const centavosStr = String(centavos).padStart(2, "0");
  return `${letras}${conector}${nombreMoneda} ${centavosStr}/100 ${moneda}`;
}
