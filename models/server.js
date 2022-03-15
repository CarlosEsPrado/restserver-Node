const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {// * paths de las rutas
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            usuarios: '/api/usuarios',
        }

        // * Conectar a la base de datos
        this.db();

        // * Middlewares
        this.middlewares();

        // * Rutas de mi aplicación
        this.routes();
    }

    async db() {
        await dbConnection();
    }

    middlewares() {
        // * Cors
        this.app.use(cors());
        // * Lectura y parseo del body
        this.app.use(express.json());
        // * Directorio público
        // ? '.use' indica que es un middlewares
        this.app.use(express.static('public'));
    }

    routes() { // * Rutas de la aplicación
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.usuarios, require('../routes/user'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;