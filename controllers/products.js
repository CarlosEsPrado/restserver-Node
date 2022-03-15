const { response, request } = require('express');
const { Product } = require('../models');

const productsGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        products
    })
}

const createProduct = (req = request, res = response) => {
    const name = req.body.name.toTitleCase();

    const productDB = await Product.findOne({ name });
    if (productDB) {
        return res.status(400).json({
            msg: `El producto ${productDB.name}, ya existe`
        });
    };

    const data = {
        name,
        user: req.usuario._id
    }

    const product = new Product(data);

    await product.save();
    
    res.status(201).json(product);
}

module.exports = {
    createProduct,
    productsGet
}