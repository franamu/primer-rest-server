const express = require("express");

let { verificarToken } = require("../middlewares/autentificacion");

let app = express();

let Categoria = require("../models/categoria");

// Servicio que se encarga de mostrar todas las categorias
app.get("/categoria", (req, res) => {});

// mostrar una categoria por id
app.get("categoria/:id", (req, res) => {});

// crear nueva categoria
app.post("categoria", verificarToken, (req, res) => {
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

// actualizar nombre de la categoria
app.put("/categoria/:id", (req, res) => {});

app.delete("/categoria/:id", (req, resp) => {
  // solo un admin puede borrar categoria
});

module.exports = app;
