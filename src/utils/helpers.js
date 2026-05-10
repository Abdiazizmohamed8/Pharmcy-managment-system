export const fmt = (number) => {
  return `$${Number(number).toFixed(
    2
  )}`;
};

export const today = () => {
  return new Date()
    .toISOString()
    .split("T")[0];
};

export const genId = () => {
  return Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();
};

export const lowStockCheck = (
  stock,
  minStock
) => {
  return stock <= minStock;
};

export const expiryCheck = (
  expiry
) => {
  const expDate = new Date(
    expiry + "-01"
  );

  const currentDate =
    new Date();

  const diffMonths =
    (expDate - currentDate) /
    (1000 *
      60 *
      60 *
      24 *
      30);

  return diffMonths <= 2;
};