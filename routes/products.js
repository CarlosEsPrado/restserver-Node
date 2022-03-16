const { Router } = require('express');
const { check } = require('express-validator');
const { createProduct,
    productsGet,
    productGet,
    updateProduct,
    deleteProduct
} = require('../controllers/products');
const { productExistsById, categorieExistsByid } = require('../helpers/db-validators');
const { validarJWT,
    validarCampos,
    isAdminRole
} = require('../middlewares')

const router = Router();

// * Obtener todos los productos - público
router.get('/', productsGet)

// * Obtener producto por id - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productExistsById),
    validarCampos
], productGet)

// * Crear producto - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('name', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('category', 'No es un id de Mongo').isMongoId(),
    check('category').custom(categorieExistsByid),
    validarCampos
], createProduct)

// * Actualizar producto por id - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    // check('category', 'No es un id de Mongo').isMongoId(),
    check('category').optional().custom(categorieExistsByid),
    check('id').custom(productExistsById),
    validarCampos
], updateProduct)

// * Borrar producto - Admin
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productExistsById),
    validarCampos
], deleteProduct)

module.exports = router;