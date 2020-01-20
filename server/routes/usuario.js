const express = require("express");

const bcrypt = require("bcrypt");
const _ = require("underscore");

const app = express();
const Usuario = require("../models/usuario");
const {
  verificarToken,
  verificarAdmin_Rol
} = require("../middlewares/autentificacion");

app.get("/usuario", verificarToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  /*
   * traer solo los registro con estado true
   * { estado: true}
   */
  //skip salta los primeros 5 registros
  //limit determina cuantos registros va a agarrar
  //exec ejecuta la consulta
<<<<<<< HEAD
  Usuario.find({}, "nombre email role estado google img")
=======
  Usuario.find({ estado: true }, "nombre email role estado google img")
>>>>>>> 264632df7defac6712072735c42cae653471ebc3
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

<<<<<<< HEAD
      Usuario.count({}, (err, conteo) => {
=======
      Usuario.count({ estado: true }, (err, conteo) => {
>>>>>>> 264632df7defac6712072735c42cae653471ebc3
        res.json({
          ok: true,
          usuarios,
          cuantos: conteo
        });
      });
    });
});

app.post("/usuario", [verificarToken, verificarAdmin_Rol], function(req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    //usuarioDB.password = null;

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
});

app.put("/usuario/:id", [verificarToken, verificarAdmin_Rol], function(
  req,
  res
) {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB
      });
    }
  );
<<<<<<< HEAD

  /*res.json({
  	id
  })*/
=======
>>>>>>> 264632df7defac6712072735c42cae653471ebc3
});

app.delete("/usuario/:id", [verificarToken, verificarAdmin_Rol], function(
  req,
  res
) {
  let id = req.params.id;

<<<<<<< HEAD
  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
=======
  // Eliminado físico
  /*Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
>>>>>>> 264632df7defac6712072735c42cae653471ebc3
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no encontrado"
        }
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBorrado
    });
<<<<<<< HEAD
  });
=======
  });*/

  // Eliminar registro cambiando estado
  let cambiaEstado = {
    estado: false
  };

  Usuario.findByIdAndUpdate(
    id,
    cambiaEstado,
    { new: true },
    (err, usuarioBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        usuarioBorrado,
        message: "Usuario eliminado correctamente"
      });
    }
  );
>>>>>>> 264632df7defac6712072735c42cae653471ebc3
});

module.exports = app;
