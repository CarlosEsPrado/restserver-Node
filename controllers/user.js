const { request, response } = require('express')
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

// ? Obtener información de los usuarios
const usuariosGet = async (req = request, res = response) => {
    // * Paginado
    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    });
}

// ? Crear usuario
const usuariosPost = async (req = request, res = response) => {
    const { name, email, password, role } = req.body;
    // * Crear un usuario
    const usuario = new Usuario({ name, email, password, role });

    // * Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // * Guardar el usuario en la DB
    await usuario.save();

    // * Regresa el usuario grabado 
    res.json({
        usuario
    });
}

// ? Actualizar usuario
const usuariosPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;
    if (password) {
        // * Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        usuario
    });
}

const usuariosPath = (req = request, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async (req = request, res = response) => {
    const { id } = req.params;
    // * Borrar usuario fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id); // ! No es recomendado porque afecta a la integridad referencial
    // * 'Borrar usuario', cambiando el estado 
    const usuario = await Usuario.findByIdAndUpdate(id, { state: false }); // ? Recomendado

    res.json({
        usuario
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPath
}