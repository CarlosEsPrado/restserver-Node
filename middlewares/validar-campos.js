const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
    // ? Se resiven los errores del check
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // ? Si hay errores
        return res.status(400).json(errors);
    }
    next();
}

module.exports = {
    validarCampos
}