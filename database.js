const mongoose = require('mongoose')
require('dotenv').config()

async function dbConnection() {
    mongoose
        .connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log("Database connected"))
        .catch((err) => console.error("No se pudo conectar a Mongodb",err))
}

module.exports = dbConnection