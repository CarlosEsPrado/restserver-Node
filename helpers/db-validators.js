const { Categorie, Usuario } = require('../models');
const Role = require('../models/role');


const isValidRole = async (role = '') => {
    const existeRole = await Role.findOne({ role });
    if (!existeRole) {
        throw new Error(`El rol ${role} no está registrado en la DB`);
    }
};

const emailExists = async (email = '') => {
    const mailUse = await Usuario.findOne({ email });
    if (mailUse) {
        throw new Error(`El email ${email} ya está en uso`)
    }
};

const userExistsById = async (id) => {
    const userExists = await Usuario.findById(id);
    if (!userExists) {
        throw new Error(`El ID ${id} no existe`);
    }
}

const categorieExistsByid = async (id) => {
    const categorieExists = await Categorie.findById(id);
    if (!categorieExists) {
        throw new Error(`La categoria ${id} no existe`);
    }
}

module.exports = {
    isValidRole,
    emailExists,
    userExistsById,
    categorieExistsByid
}