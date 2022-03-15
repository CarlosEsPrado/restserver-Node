const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categorie, Product } = require("../models");

const permittedCollections = [ // TODO: Actualizar cada vez que se cree una nueva 'collection'
    'usuarios',
    'categories',
    'products',
    'roles'
]

const searchUser = async (term = '', res = response) => {
    // ? Se pude buscar por el nombre, correo o uid del usuario, siempre y cuando el 'state' sea true
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const usuario = await Usuario.findById(term);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(term, 'i'); // * Insensible a las mayúsculas y minúsculas

    const usuarios = await Usuario.find({ // * count, para saber el número de resultados
        // * Propiedad de mongo
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
    });

    res.json({
        results: usuarios
    });
}

const searchCategories = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const categorie = await Categorie.findById(term);
        return res.json({
            results: (categorie) ? [categorie] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const categories = await Categorie.find({ name: regex, state: true });
    res.json({
        categories
    })
}

const searchProducts = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const product = await Product.findById(term)
            .populate('category', 'name')
            .populate('user', 'name')
        return res.json({
            results: (product) ? [product] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const products = await Product.find({ name: regex, state: true, available: true })
        .populate('category', 'name')
        .populate('user', 'name')

    res.json({
        results: products
    })
}

const search = (req = request, res = response) => {
    const { collection, term } = req.params;
    if (!permittedCollections.includes(collection)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${permittedCollections}`
        })
    }

    switch (collection) {
        case 'usuarios':
            searchUser(term, res);
            break;
        case 'categories':
            searchCategories(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        default:
            res.status(500).json({
                msg: 'Opps!, Se me olvido hacer esta búsqueda'
            })
    }

    // res.json({
    //     collection,
    //     term
    // })
}

module.exports = {
    search
}