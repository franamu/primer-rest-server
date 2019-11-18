const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuraciónes de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
 
}

app.post('/google', async (req, res) => {

    let token = req.body.idtoken;
 
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Este email debe ingresar por autenticación normal'
                    }
                })
            } else {
                // Generar token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEMILLA, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {

            // Si el usuario no existe en la base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                };

                // Generar token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEMILLA, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            })
        }

    })

})

module.exports = app;