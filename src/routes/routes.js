const express = require("express");
const Model = require("../models/model");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

//Função para check do token para acessar as rotas.
function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Acesso negado, faça o login para continuar." });
  }

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (error) {
    return res.status(400).json({ msg: "Toke inválido." });
  }
}

//Metodo para post
router.post("/auth/registro", async (req, res) => {
  const { nome, idade, email, senha, confirmarsenha } = req.body;
  //check de campos recebidos
  if (!nome) {
    return res.status(422).json({ msg: "Nome do usuário é obrigatório!" });
  }
  if (!idade) {
    return res.status(422).json({ msg: "A idade do usuário é obrigatório!" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O e-mail do usuário é obrigatório!" });
  }
  if (!senha) {
    return res.status(422).json({ msg: "A senha do usuário é obrigatória!" });
  }
  if (senha !== confirmarsenha) {
    return res.status(422).json({ msg: "As senhas não são iguais!" });
  }

  //check se o usuário já foi registrado
  const usuarioExiste = await Model.findOne({ email: email });

  if (usuarioExiste) {
    return res.status(422).json({ msg: "E-mail já cadastrado." });
  }

  //Criar senha criptografada.
  const salt = await bcrypt.genSalt(12);
  const senhaHash = await bcrypt.hash(senha, salt);

  //Criar usuario

  const usuario = new Model({
    nome,
    idade,
    email,
    senha: senhaHash,
  });

  try {
    const salvarUsuario = await usuario.save();
    res.status(200).json(salvarUsuario);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

//Metodo para login
router.post("/auth/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "O e-mail do usuário é obrigatório!" });
  }
  if (!senha) {
    return res.status(422).json({ msg: "A senha do usuário é obrigatória!" });
  }

  //check se o usuário já foi registrado
  const usuario = await Model.findOne({ email: email });

  if (!usuario) {
    return res.status(404).json({ msg: "Usuário não encontado" });
  }

  const checkSenha = await bcrypt.compare(senha, usuario.senha);

  if (!checkSenha) {
    return res.status(402).json({ msg: "Senha inválida!" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: usuario._id,
      },
      secret
    );

    res.status(200).json({ msg: "Login feito com sucesso ", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro no servidor de auth." });
  }
});

//Metodo para get all com proteção de token
router.get("/get", checkToken, async (req, res) => {
  try {
    const usuario = await Model.find();
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//Metodo para get by id
router.get("/get/:id", checkToken, async (req, res) => {
  try {
    const usuario = await Model.findById(req.params.id);
    res.status(200).send({ msg: "Dados do usuário: ", usuario });
  } catch (error) {
    console.log(error);
    res.status(404).send({ msg: "Usuário não encontrado." });
  }
});

//Update by ID Method
router.patch("/update/:id", checkToken, (req, res) => {
  res.send("Atualizar o user by id");
});

//Metodo para delete by id
router.delete("/delete/:id", checkToken, async (req, res) => {
  try {
    const usuario = await Model.findByIdAndRemove(req.params.id);
    res.status(200).send({ msg: "Usuário apagado: ", usuario });
  } catch (error) {
    console.log(error);
    res.status(404).send({ msg: "Usuário não encontrado." });
  }
});

module.exports = router;
