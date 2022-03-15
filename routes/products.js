const { Router, response } = require('express');
const { check } = require('express-validator');
const { validarJWT,
    validarCampos,
    isAdminRole
} = require('../middlewares')

const router = Router();

// * Obtener todos los productos - público
router.get('/', (req, res = response) => {
    res.json('Todos los productos')
})

// * Obtener producto por id - público
router.get('/:id', (req, res = response) => {
    res.json('Producto por id')
})

// * Crear producto - privado - cualquier persona con un token válido
router.post('/', (req, res = response) => {
    res.json('Crear producto')
})

// * Actualizar producto por id - privado - cualquiera con token válido
router.put('/:id', (req, res = response) => {
    res.json('Actualizar producto')
})

// * Borrar producto - Admin
router.delete('/:id', (req, res = response) => {
    res.json('Borrar producto')
})

module.exports = router;