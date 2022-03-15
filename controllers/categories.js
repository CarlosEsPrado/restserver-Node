const { response, request } = require("express");
const { Categorie } = require("../models");

const categoriesGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };

    const [total, categories] = await Promise.all([
        Categorie.countDocuments(query),
        Categorie.find(query)
            .populate('user', 'name') // * Conectar con otras colecciones
            .skip(Number(desde))
            .limit(Number(limite))

    ])

    res.json({
        total,
        categories
    })
}

const categorieGet = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categorie.findById(id).populate('user', 'name');

    res.json({
        categoria
    })
}


const createCategory = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    const categorieDB = await Categorie.findOne({ name });
    if (categorieDB) {
        return res.status(400).json({
            msg: `La categoria ${categorieDB.name}, ya existe`
        });
    };

    // * Generar la data a guardar
    const data = {
        name,
        user: req.usuario._id
    }

    // * Crear nueva categoria
    const categorie = new Categorie(data);

    // * Guardar DB
    await categorie.save();

    res.status(201).json(categorie);
}

const updateCategory = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, state, user, ...data } = req.body

    data.name = data.name.toUpperCase();
    data.user = req.usuario._id; // * Usuario dueño del token
    const categorie = await Categorie.findByIdAndUpdate(id, data, { new: true })
    res.json({
        categorie
    })
}

// ! borrarCategoria - state: false
const categorieDelete = async (req = request, res = response) => {
    const { id } = req.params;
    const categorie = await Categorie.findByIdAndUpdate(id, { state: false }, { new: true });

    res.json({
        categorie
    })
}

module.exports = {
    categoriesGet,
    categorieGet,
    createCategory,
    updateCategory,
    categorieDelete
}