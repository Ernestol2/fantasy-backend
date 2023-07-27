const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Ingresa un correo valido!"],
        unique: [true, "El correo ya existe!"]
    },
    contraseña: {
        type: String,
        required: [true, "Ingrese una contraseña!"],
        unique: false 
    }
})

module.exports = mongoose.model("User", UserSchema)