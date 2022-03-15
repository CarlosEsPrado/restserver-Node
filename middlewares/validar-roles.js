const { response, request } = require('express');

const isAdminRole = (req = request, res = response, next) => {
    if (!req.usuario) { // * Si no se ejecuta validarJWT, retornara el error
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    const { role, name } = req.usuario;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} no es administrador`
        });
    }

    next();
}

const tieneRole = (...roles) => { // * Todo lo que se envie se almacena en role
    return (req = request, res = response, next) => {
        if (!req.usuario) { // * Si no se ejecuta validarJWT, retornara el error
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            });
        }

        if (!roles.includes(req.usuario.role)) { // * Si el rol del usuario no esta incluido en los roles que se reciben, retorna el error
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }

        next();
    }
}

module.exports = {
    isAdminRole,
    tieneRole
}