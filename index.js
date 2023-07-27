const express = require('express')
const path = require('path')
const morgan = require('morgan')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')

//Initializations
const app = express()
const dbConnection = require('./database')
dbConnection();

//Settings
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs');
const port = process.env.PORT || 3000;

//Middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false}))
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname))
    }
})
app.use(multer({storage}).single('image'))

//Routes
app.use(require('./src/routes/index'))

//Static files
app.use(express.static(path.join(__dirname, 'public')))

//Start the server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})