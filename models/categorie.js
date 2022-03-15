const { Schema, model } = require('mongoose');

const CategorieSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la categoria es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, // * Tiene que ser otr coleccion que este en la DB
        ref: 'Usuario', // * Referencia a la coleccion
        required: true // * Todas las categoria deben tener un usuario que las creo
    }
});

CategorieSchema.methods.toJSON = function() {
    const { __v, state, ...categorie} = this.toObject();
    if (categorie.user._id) {
        categorie.user.uid = categorie.user._id
        delete categorie.user._id
    }
    return categorie;
}

module.exports = model('Categorie', CategorieSchema);