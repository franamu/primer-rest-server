const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let uniqueValidator = require("mongoose-unique-validator");

let categoriasSchema = new Schema({
  descripcion: {
    type: String,
    unique: true,
    required: [true, "La descripción es obligatoria"]
  },
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario" }
});

categoriasSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser único"
});
module.exports = mongoose.model("Categoria", categoriasSchema);
