// ? module.exports = require('...') | forma de exportación
const Categorie = require('./categorie');
const Product = require('./product');
const Role = require('./role');
const Server = require('./server');
const Usuario = require('./usuario');

module.exports = {
    Categorie,
    Product,
    Role,
    Server,
    Usuario,
}