const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, // * Relacionar con otra coleccion
        ref: 'Usuario', // * Referencia a la coleccion
        required: true 
    },
    price : {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categorie', // * Referencia a la coleccion
        required: true
    },
    description: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
});

ProductSchema.methods.toJSON = function() {
    const { __v, state, ...categorie} = this.toObject();
    if (categorie.user._id) {
        categorie.user.uid = categorie.user._id
        delete categorie.user._id
    }
    return categorie;
}

module.exports = model('Product', ProductSchema);