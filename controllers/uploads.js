const path = require('path');
const fs = require('fs');
const { request, response } = require("express");
const { uploadFiles } = require('../helpers');
const { Usuario, Product } = require('../models');

const uploadFile = async (req = request, res = response) => {
    try {
        // const name = await uploadFiles(req.files, ['txt', 'md'], 'textos');
        const name = await uploadFiles(req.files, undefined, 'imgs');
        res.json({ name })

    } catch (msg) {
        res.status(400).json({ msg })
    }
}

const updateImg = async (req = request, res = response) => {
    const { id, collection } = req.params;
    let model;

    switch (collection) {
        case 'usuarios':
            model = await Usuario.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Opps!, Se me olvidó validar esto' });
    }

    // * Limpiar imágenes previas
    if (model.img) { // ? Si la imagen existe en el modelo
        // * Borrar la imagen del servidor
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImg)) { // ? Si la imagen existe en la colección
            fs.unlinkSync(pathImg);
        }
    }

    const { name } = await uploadFiles(req.files, undefined, collection);
    model.img = name;

    await model.save();

    res.json(model);
}

const displayImage = async (req = request, res = response) => {
    const { id, collection } = req.params;
    let model;

    switch (collection) {
        case 'usuarios':
            model = await Usuario.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Opps!, Se me olvidó validar esto' });
    }

    // * Limpiar imágenes previas
    if (model.img) { // ? Si la imagen existe en el modelo
        // * Borrar la imagen del servidor
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImg)) { // ? Si la imagen existe en la colección
            return res.sendFile(pathImg) // * Retornar la imagen
        }
    }

    const pathNoImage = path.join(__dirname, '../assets/no-image.jpg')
    res.sendFile(pathNoImage);
}

module.exports = {
    uploadFile,
    updateImg,
    displayImage
}