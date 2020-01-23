const express = require("express");
const {
  verificarToken,
  verificarAdmin_Rol
} = require("../middlewares/autentificacion");

let app = express();
let Producto = require("../models/producto");

// Obtener productos, usar populate para traer la info del usuario y de la categoría
app.get("/producto", verificarToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 5;
  limite = Number(limite);

  Producto.find({})
    .sort("nombre")
    .populate("categoria", "descripcion")
    .populate("usuario", "nombre email")
    .skip(desde)
    .limit(limite)
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      Producto.count({}, (err, conteo) => {
        res.json({
          ok: true,
          productos,
          conteo
        });
      });
    });
});

// Obtener un producto por id

app.get("/producto/:id", verificarToken, (req, res) => {
  let id = req.params.id;

  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "nombre")
    .exec((err, productoDb) => {
      if (err) {
        res.status(500).json({
          ok: false,
          err
        });
      }

      if (!productoDb) {
        res.status(400).json({
          ok: false,
          err: {
            message: "No se encontró el producto"
          }
        });
      }

      res.json({
        ok: true,
        productos: productoDb
      });
    });
});

// crear un producto
app.post("/producto", [verificarToken, verificarAdmin_Rol], (req, res) => {
  let body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: Number(body.precioUni),
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario.id
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      producto: productoDB
    });
  });
});

// actualizar un producto
app.put("/producto/:id", [verificarToken, verificarAdmin_Rol], (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let productoEdit = {
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario: body.usuario
  };

  Producto.findByIdAndUpdate(
    id,
    productoEdit,
    { new: true, runValidators: true },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        producto: productoDB
      });
    }
  );
});

app.delete(
  "/producto/:id",
  [verificarToken, verificarAdmin_Rol],
  (req, res) => {
    let id = req.params.id;

    // Eliminado físico
    /*Producto.findByIdAndRemove(id, (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        productoDB
      });
    });*/

    Producto.findById(id, (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      productoDB.disponible = false;

      productoDB.save((err, productoBorrado) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }

        res.json({
          ok: true,
          producto: productoBorrado,
          mensaje: "Producto borrado"
        });
      });
    });
  }
);

// buscar productos
app.get("/producto/buscar/:termino", verificarToken, (req, res) => {
  let termino = req.params.termino;

  let regex = new RegExp(termino, "i");

  Producto.find({ nombre: regex })
    .populate("categoria", "nombre")
    .exec((err, productos) => {
      if (err) {
        res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        productos
      });
    });
});

module.exports = app;
