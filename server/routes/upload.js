const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const fs = require("fs");
const path = require("path");

// modelos
const Usuario = require("../models/usuario");
const Productos = require("../models/producto");

// opciones por defecto
app.use(fileUpload({ useTempFiles: true }));

app.put("/upload/:tipo/:id", function(req, res) {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No hay archivos para cargar"
      }
    });
  }

  // validar tipo
  let tiposValidos = ["productos", "usuarios"];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Los tipos permitidos son ` + tiposValidos.join(", ")
      }
    });
  }

  // En el servicio POST en body la key debe llamarse archivo
  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split(".");
  let extension = nombreCortado[nombreCortado.length - 1];

  // Extensiones permitidas
  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          "Las extensiones prmitidas son" + extensionesValidas.join(", "),
        ext: extension
      }
    });
  }

  // cambiar nombre al archivo
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    // Imagen está cargada: se pasa a actualizar base de datos
    switch (tipo) {
      case "usuarios":
        imagenUsuario(id, res, nombreArchivo);
        break;

      case "productos":
        imagenProducto(id, res, nombreArchivo);
        break;

      default:
        return res.status(400).json({
          ok: false,
          err: {
            message: "Tipo incorrecto en opciones del switch"
          }
        });
    }
  });
});

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borraArchivo(nombreArchivo, "usuario");
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuarioDB) {
      borraArchivo(nombreArchivo, "usuarios");
      return res.status(400).json({
        ok: false,
        err: {
          message: "El usuario no existe"
        }
      });
    }

    borraArchivo(usuarioDB.img, "usuarios");

    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      });
    });
  });
}

function imagenProducto(id, res, nombreArchivo) {
  Productos.findById(id, (err, productoDB) => {
    if (err) {
      borraArchivo(nombreArchivo, "productos");
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoDB) {
      borraArchivo(nombreArchivo, "productos");
      return res.status(400).json({
        ok: false,
        err: {
          message: "Producto no encontrado"
        }
      });
    }

    borraArchivo(productoDB.img, "productos");

    productoDB.img = nombreArchivo;
    productoDB.save((err, productoDB) => {
      res.json({
        ok: true,
        producto: productoDB,
        img: nombreArchivo
      });
    });
  });
}

function borraArchivo(nombreArchivo, tipo) {
  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreArchivo}`
  );

  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;
