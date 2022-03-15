const { Router } = require('express');
const { check } = require('express-validator');
const { categoriesGet,
    createCategory,
    categorieGet,
    updateCategory,
    categorieDelete
} = require('../controllers/categories');
const { categorieExistsByid } = require('../helpers/db-validators');
const { validarJWT,
    validarCampos,
    isAdminRole
} = require('../middlewares');

const router = Router();


// * Obtener todas las categorias - público
router.get('/', categoriesGet)

// * Obtener una categoria por id - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(categorieExistsByid),
    validarCampos
], categorieGet)

// * Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('name', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos
], createCategory)

// * Actualizar una categoria por id - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('name', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    // check('id', 'No es un Id válido').isMongoId(),
    check('id').custom(categorieExistsByid),
    validarCampos
], updateCategory)

// * Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom(categorieExistsByid),
    validarCampos
], categorieDelete)

module.exports = router;