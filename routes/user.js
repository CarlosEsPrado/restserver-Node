const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPath
} = require('../controllers/user');
const { isValidRole, emailExists, userExistsById } = require('../helpers/db-validators');
const { validarCampos,
    validarJWT,
    isAdminRole,
    tieneRole 
} = require('../middlewares');

const router = Router();

// ? Recuperar datos
router.get('/', usuariosGet);

// ? Enviar datos o información
router.post('/', [
    // * middlewares
    // ? El check prepara los errores a capturar
    check('name', 'El nombre es obligatorio').not().isEmpty(), // ! No tiene que estar vacio
    check('password', 'La contraseña debe tener minimo 6 caracteres y maximo 20').isLength({ min: 6, max: 20 }),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(emailExists),
    // check('role', 'Rol no válido').isIn(['ADMIN_ROLE', 'USER_ROLE']), // ! Existe en...
    check('role').custom(isValidRole),
    validarCampos
], usuariosPost)

// ? Actualizar datos o información
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(userExistsById),
    check('role').custom(isValidRole),
    validarCampos
], usuariosPut)

// ? Modificaciones parciales 
router.patch('/', usuariosPath)

// ? Eliminar datos o información
router.delete('/:id', [
    validarJWT,
    // isAdminRole,
    tieneRole('ADMIN_ROLE', 'SALES_ROLE'), // * Enviar información al middlewares
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(userExistsById),
    validarCampos
], usuariosDelete)


module.exports = router;