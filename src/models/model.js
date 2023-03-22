const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  nome: {
    required: true,
    type: String,
  },
  idade: {
    required: true,
    type: Number,
  },
  email: {
    required: true,
    type: String,
  },
  senha: String,
});

module.exports = mongoose.model("Usuario", dataSchema);
