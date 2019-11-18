const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express('express');
const Usuario = require('../models/usuario');


app.post('/login', (req, res) => {

	let body = req.body;
	Usuario.findOne({ email: body.email}, (err, usuarioDB) => {

		// Se valida si hubo un error en la base de datos
		if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    // Se valida si usuarioDB es nullo
    if (!usuarioDB) {
    	return res.status(400).json({
        ok: false,
        err: {
        	message: '(Usuario) o contraseña incorrectos'
        }
      })
    }

    // Se valida que la contraseña sea igual. Si no es igual entra en el if
    if (!bcrypt.compareSync( body.password, usuarioDB.password)) {
    	return res.status(400).json({
    		ok: false,
    		err: {
    			message: 'Usuario o (contraseña) incorrectos'
    		}
    	});
    }

    // Generar token
    let token = jwt.sign({
        usuario: usuarioDB
    }, process.env.SEMILLA, {expiresIn: process.env.CADUCIDAD_TOKEN});

    // Si el usuario existe y la contraseña es igual se devuelve el token
    res.json({
    	ok: true,
    	usuario: usuarioDB,
    	token
    });

	});

});

module.exports = app;