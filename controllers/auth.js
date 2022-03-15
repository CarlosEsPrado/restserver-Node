const bcryptjs = require("bcryptjs");
const { response, request, json } = require("express");

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const Usuario = require('../models/usuario');

const login = async (req = require, res = response) => {
    const { email, password } = req.body;

    try {
        // * Verificar si el correo existe
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario o Contraseña invalidas'
            })
        }

        // * Verificar si el usuario esta activo
        if (!usuario.state) {
            return res.status(400).json({
                msg: 'El usuario ha sido eliminado'
            });
        }

        // * Velirificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario o Contraseña invalidas - contraseña'
            })
        }

        // * Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Opps!, algo salio mal'
        })
    }

}

const googleSignIn = async (req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { name, picture, email } = await googleVerify(id_token);
        let usuario = await Usuario.findOne({ email });

        if (!usuario) {
            // * Crear el usuario
            const data = {
                name,
                email,
                password: '123456',
                picture,
                google: true,
                role: 'USER_ROLE'
            };

            usuario = new Usuario(data);
            await usuario.save();
        } // ? Si ya exite se podria hacer la actualización (opcional)

        if (!usuario.state) { // * Si el usuario esta elminido 
            return res.status(401).json({
                msg: 'Usuario bloqueado'
            })
        }

        // * Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}