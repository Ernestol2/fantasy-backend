const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    nombre: {type: String},
    descripcion: {type: String},
    precio: {type: String},
    path: {type: String},

});

module.exports = model('Product', productSchema);