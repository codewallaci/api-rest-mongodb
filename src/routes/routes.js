const express = require("express");
const Model = require("../models/model");

const router = express.Router();

//Metodo para post
router.post("/post", async (req, res) => {
  const usuario = new Model({
    nome: req.body.nome,
    idade: req.body.idade,
  });

  try {
    const salvarUsuario = await usuario.save();
    res.status(200).json(salvarUsuario);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

//Metodo para get all
router.get("/get", async (req, res) => {
  try {
    const usuario = await Model.find();
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//Metodo para get by id
router.get("/get/:id", async (req, res) => {
  try {
    const usuario = await Model.findById(req.params.id);
    res.status(200).send({ msg: "Dados do usuário: ", usuario });
  } catch (error) {
    console.log(error);
    res.status(404).send({ msg: "Usuário não encontrado." });
  }
});

//Update by ID Method
router.patch("/update/:id", (req, res) => {
  res.send("Atualizar o user by id");
});

//Metodo para delete by id
router.delete("/delete/:id", async (req, res) => {
  try {
    const usuario = await Model.findByIdAndRemove(req.params.id);
    res.status(200).send({ msg: "Usuário apagado: ", usuario });
  } catch (error) {
    console.log(error);
    res.status(404).send({ msg: "Usuário não encontrado." });
  }
});

module.exports = router;
