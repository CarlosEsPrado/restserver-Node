const validarCampos = require("./validar-campos");
const validarJWT = require("./validar-jwt");
const validarRoles = require("./validar-roles");
const validateFile = require("./validar-file");

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validateFile
}