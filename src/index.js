const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const routes = require("./routes/routes");

//CONEXÃO COM O BANCO DE DADOS
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;
database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Conexão feita com o banco de dados");
});

const app = express();
app.use(express.json());
app.use("/api", routes);

//INICIANDO SERVIDOR
app.listen(3000, () => {
  console.log(`Servidor iniciando na porta: ${3000}`);
});
