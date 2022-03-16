const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFile, updateImg, displayImage } = require('../controllers/uploads');
const { permittedCollections } = require('../helpers');
const { validarCampos, validateFile } = require('../middlewares');

const router = Router();

router.post('/', validateFile, uploadFile);

router.put('/:collection/:id', [
    validateFile,
    check('id', 'El id no es válido').isMongoId(),
    check('collection').custom(c => permittedCollections(c, ['usuarios', 'products'])),
    validarCampos
], updateImg)

router.get('/:collection/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('collection').custom(c => permittedCollections(c, ['usuarios', 'products'])),
    validarCampos
], displayImage)

module.exports = router;