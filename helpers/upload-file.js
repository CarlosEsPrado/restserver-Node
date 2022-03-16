const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ext = ['png', 'jpg', 'jpeg', 'gif']; // ? Extensiones permitidas
const uploadFiles = (files, validExtensions = ext, folder = '') => {
    return new Promise((resolve, reject) => {
        const { file } = files;
        const nameCut = file.name.split('.') // * Separar el nombre del archivo y usar el punto como identificador para crear el arreglo
        const extension = nameCut[nameCut.length - 1];

        // * Validar la extension 
        if (!validExtensions.includes(extension)) {
            return reject(`La extensión ${extension} no esta permitida. Extensiones permitidas: ${validExtensions}`)
        }

        const temporaryFileName = uuidv4() + '.' + extension; // * Generar un nombre unico
        const uploadPath = path.join(__dirname, '../uploads/', folder, temporaryFileName);

        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve({
                name: temporaryFileName
            });
        });

    })
}

module.exports = {
    uploadFiles
}