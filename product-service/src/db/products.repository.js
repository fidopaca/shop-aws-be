const products = require("./products.json");

export const getAll = async () => products;

export const getById = async (id) => products.find((product) => product.id === id);
