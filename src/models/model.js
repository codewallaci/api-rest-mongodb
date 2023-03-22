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
});

module.exports = mongoose.model("Usuario", dataSchema);
