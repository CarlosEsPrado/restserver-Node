const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const uploadFiles = require('./upload-file');

module.exports = { // * Exportar todas las propiedades que contiene
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...uploadFiles,
}