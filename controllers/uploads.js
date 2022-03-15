const path = require('path');
const { request, response } = require("express");

const uploadFile = (req = request, res = response) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        res.status(400).json({ msg: 'No hay archivos que subir' });
        return;
    }

    const { file } = req.files;
    const nameCut = file.name.split('.') // * Separar el nombre del archivo y usar el punto como identificador para crear el arreglo
    const extension = nameCut[nameCut.length - 1];

    // * Validar la extension
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'pdf'] // ? Extensiones permitidas
    if (!validExtensions.includes(extension)) {
        return res.status(400).json({
            msg: `La extensión ${extension} no esta permitida. Extensiones permitidas: ${validExtensions}`
        });
    }

    res.json({ extension })

    // const uploadPath = path.join(__dirname, '../uploads/', file.name);

    // file.mv(uploadPath, (err) => {
    //     if (err) {
    //         return res.status(500).json({ err });
    //     }

    //     res.json({
    //         msg: 'El arhivo se guardo en: ' + uploadPath
    //     });
    // });
}

module.exports = {
    uploadFile
}