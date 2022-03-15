const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const paylod = { uid };
        // * Firmar un JWT
        jwt.sign(paylod, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h' // ? Duración del JWT en dias (d), horas (h)
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            }else {
                resolve(token);
            }
        })
    })
}

module.exports = {
    generarJWT
}