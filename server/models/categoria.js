const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let categoriasSchema = new Schema({
  descripcion: {
    type: String,
    required: false
  },
  usuario: {
    type: String,
    required: [true, "El usuario es necesario"]
  }
});

module.exports = mongoose.model("Categoria", categoriasSchema);
