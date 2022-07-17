const products = require("./products.json");

const getAll = async () => products;

const getById = async (id) => products.find((product) => product.id === id);

module.exports = {
    getAll,
    getById,
};
