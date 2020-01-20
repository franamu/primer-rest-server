const express = require("express");
const {
  verificarToken,
  verificarAdmin_Rol
} = require("../middlewares/autentificacion");
const app = express();
const Categoria = require("../models/categoria");

// Servicio que se encarga de mostrar todas las categorias
app.get("/categoria", verificarToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Categoria.find({})
    .sort("descripcion")
    .populate("usuario", "nombre email")
    .skip(desde)
    .limit(limite)
    .exec((err, categorias) => {
      if (err) {
        return req.status(500).json({
          ok: false,
          err
        });
      }

      Categoria.count({}, (err, conteo) => {
        res.json({
          ok: true,
          categorias,
          cuantos: conteo
        });
      });
    });
});

// mostrar una categoria por id
app.get("/categoria/:id", verificarToken, (req, res) => {
  let id = req.params.id;

  Categoria.findById(id, "descripcion usuario").exec((err, categoriaDB) => {
    if (err) {
      return req.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB) {
      return req.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

// crear nueva categoria
app.post("/categoria", verificarToken, (req, res) => {
  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

// ============================
// Mostrar todas las categorias
// ============================
app.put("/categoria/:id", verificarToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let descCategoria = {
    descripcion: body.descripcion
  };

  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        categoria: categoriaDB
      });
    }
  );
});

app.delete(
  "/categoria/:id",
  [verificarToken, verificarAdmin_Rol],
  (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!categoriaBorrada) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Categoria no encontrado"
          }
        });
      }

      res.json({
        ok: true,
        categoriaBorrada
      });
    });
  }
);

module.exports = app;
