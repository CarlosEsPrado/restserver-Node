const { response, request } = require('express');
const { Product } = require('../models');

const productsGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        products
    })
}

const productGet = async (req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate('user', 'name')
        .populate('category', 'name')

    res.json({
        product
    })
}

const createProduct = async (req = request, res = response) => {
    const { state, user, ...body } = req.body;
    const name = body.name.toUpperCase();

    const productDB = await Product.findOne({ name });
    if (productDB) {
        return res.status(400).json({
            msg: `El producto ${productDB.name}, ya existe`
        });
    };

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.usuario._id
    }

    const product = new Product(data);

    await product.save();

    res.status(201).json({
        product
    });
}

const updateProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const { state, user, ...data } = req.body;

    if (data.name) {
        data.name = data.name.toUpperCase();
    }

    data.user = req.usuario._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true })
        .populate('category', 'name');

    res.json({
        product
    })
}

const deleteProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { state: false }, { new: true });

    res.json({
        product
    })
}

module.exports = {
    createProduct,
    productsGet,
    productGet,
    updateProduct,
    deleteProduct
}