/**
 * Format a number as a currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Calculate tax amount (assuming 10% tax rate)
 */
export const calculateTax = (subtotal: number): number => {
  const TAX_RATE = 0.1;
  return subtotal * TAX_RATE;
};

/**
 * Calculate total amount including tax
 */
export const calculateTotal = (subtotal: number): number => {
  return subtotal + calculateTax(subtotal);
};

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/**
 * Generate a unique order ID
 */
export const generateOrderId = (): string => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
