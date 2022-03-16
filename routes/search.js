const { Router } = require('express');
const { search } = require('../controllers/search');

const router = Router();

router.get('/:collection/:term', search);

// TODO: Busqueda de todos los productos de una coleccion (DB/PRODUCTS: {category: ObjectId('id')})
// TODO: Busqueda de los productos de una persona (DB/PRODUCTS: {user: ObjectId('id')})

module.exports = router;