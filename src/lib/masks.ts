/**
 * Utilitários para máscaras de input
 */

/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param value - Valor numérico
 * @returns String formatada como moeda (ex: "R$ 50.000,00")
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Formata um valor de input para moeda (sem o símbolo R$)
 * @param value - String do input
 * @returns String formatada (ex: "50.000,00")
 */
export function formatCurrencyInput(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  if (!numbers) return "";

  // Converte para número e formata
  const amount = parseFloat(numbers) / 100;

  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Remove a formatação de moeda e retorna o valor numérico
 * @param value - String formatada
 * @returns Valor numérico
 */
export function parseCurrencyInput(value: string): number {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  if (!numbers) return 0;

  // Converte centavos para reais
  return parseFloat(numbers) / 100;
}

/**
 * Formata quilometragem com separador de milhares
 * @param value - Valor numérico
 * @returns String formatada (ex: "50.000 km")
 */
export function formatMileage(value: number): string {
  return value.toLocaleString("pt-BR") + " km";
}

/**
 * Formata input de quilometragem
 * @param value - String do input
 * @returns String formatada (ex: "50.000")
 */
export function formatMileageInput(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  if (!numbers) return "";

  // Converte para número e formata
  const amount = parseInt(numbers);

  return amount.toLocaleString("pt-BR");
}

/**
 * Remove a formatação de quilometragem e retorna o valor numérico
 * @param value - String formatada
 * @returns Valor numérico
 */
export function parseMileageInput(value: string): number {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  if (!numbers) return 0;

  return parseInt(numbers);
}

/**
 * Formata ano (apenas números, máximo 4 dígitos)
 * @param value - String do input
 * @returns String formatada (ex: "2024")
 */
export function formatYearInput(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Limita a 4 dígitos
  return numbers.slice(0, 4);
}
