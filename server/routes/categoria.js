const express = require("express");
const { verificarToken } = require("../middlewares/autentificacion");
const app = express();
const Categoria = require("../models/categoria");

// Servicio que se encarga de mostrar todas las categorias
app.get("/categoria", (req, res) => {});

// mostrar una categoria por id
app.get("/categoria/:id", (req, res) => {});

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

// actualizar nombre de la categoria
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
        categoriaDB
      });
    }
  );
});

app.delete("/categoria/:id", (req, resp) => {
  // solo un admin puede borrar categoria
});

module.exports = app;
