const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Router } = require('express');
const path = require('path');
const { unlink } = require('fs-extra');
const router = Router();
const auth = require('../../auth')

// Models
const Product = require('../models/Product');
const User = require('../models/User');

//Routes
router.get('/products', async (req, res) => {
   /*  const products = await Product.find();
    console.log(products);
    res.render("index", { products }) */
     try {
        const products = await Product.find();
        res.json(products)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error obteniendo productos"})
    } 
});


router.post('/registro', (req, res) => {
    bcrypt
        .hash(req.body.contraseña, 10)
        .then((hashedPassword) => {
            const user = new User({
                email: req.body.email,
                contraseña: hashedPassword
            })
        user
            .save()
            .then((result)=> {
                res.status(201).send({
                message: "Usuario creado exitosamente",
                result,
            })
            })
        })
        .catch(err => {
            res.status(500).send({
                message: "error guardando contraseña",
                err,
            })
        })
})

router.post('/administradora', (req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            bcrypt
             .compare(req.body.contraseña, user.contraseña)
             .then((contraseñaCheck) => {
                if (!contraseñaCheck){
                    return res.status(400).send({
                        message: "contraseña incorrecta",
                        error,
                    })
                }
                const token = jwt.sign(
                    {
                      userId: user._id,
                      userEmail: user.email,
                    },
                    "SECRET-ESTHER",
                    { expiresIn: "24h"}
                );
                res.status(200).send({
                    message: "Session iniciada correctamente",
                    email: user.email,
                    token,
                });
             })
             .catch((error) => {
                res.status(400).send({
                    message: 'Error al verificar contraseña.',
                    error,
                });
             });
        })
        .catch((e)=> {
            res.status(404).send({
                message: "email no registrado",
                e,
            })
        })
})

router.get("/administradora", auth, (req, res) => {
    res.json({ message: "Authorizado"})
})

router.post('/productonuevo', async (req, res) => {
    //console.log(req.body);
    //console.log(req.file);
    const product = new Product();
    product.nombre = req.body.nombre;
    product.descripcion = req.body.descripcion;
    product.precio = req.body.precio;
    product.path = 'https://fantasys-esther.onrender.com/img/uploads/' + req.file.filename;
    //probando esta linea
    //por aca creo que hay que cambiar el http://localhost:3000 con el nuevo path despues del deploy 

    console.log(product)
    await product.save();
    res.json({nombre: product.nombre})
    //res.redirect('/');  
});

router.get('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.json(product);
    } catch (error) {
        res.status(404).send("Producto no encontrado")
    } 
});
    

router.get('/product/:id/delete', async (req, res) => {
    res.send('eliminar productos')
   /*  const { id } = req.params;
    const productDeleted = await Product.findByIdAndDelete(id);
    //averigar lo que hace esta linea de abajo
    await unlink(path.resolve('./src/public' + productDeleted.path));
    res.redirect('/') */;
});

module.exports = router;