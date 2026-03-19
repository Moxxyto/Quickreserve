// server.js - Quickreserve Backend listo para Render 🔥

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

// 🔹 Middleware
app.use(cors({ origin: "*" })); // Permite cualquier frontend
app.use(express.json());

// 🔹 MongoDB Atlas
const uri = "mongodb+srv://moiseudyferreira_db_user:4xjXyAauwY7jraaI@saas-reservas-cluster.kmanzes.mongodb.net/?appName=SaaS-Reservas-Cluster";
const client = new MongoClient(uri);
let db;

async function conectarDB() {
  try {
    await client.connect();
    db = client.db("quickreserve");
    console.log("Conectado a MongoDB 🔥");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
  }
}

conectarDB();

// 🔐 REGISTRO
app.post("/registro", async (req, res) => {
  const { email, password } = req.body;
  const existe = await db.collection("usuarios").findOne({ email });

  if (existe) return res.json({ mensaje: "Usuario ya existe" });

  const nuevoUsuario = await db.collection("usuarios").insertOne({ email, password });

  res.json({
    mensaje: "Usuario creado 🔥",
    usuario: { _id: nuevoUsuario.insertedId.toString(), email }
  });
});

// 🔑 LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const usuario = await db.collection("usuarios").findOne({ email, password });

  if (!usuario) return res.json({ mensaje: "Credenciales incorrectas" });

  res.json({
    mensaje: "Login correcto 🔥",
    usuario: { _id: usuario._id.toString(), email: usuario.email }
  });
});

// 💾 GUARDAR CITA
app.post("/citas", async (req, res) => {
  const { nombre, fecha, hora, usuarioId } = req.body;
  await db.collection("citas").insertOne({
    nombre,
    fecha,
    hora,
    usuarioId: usuarioId.toString()
  });
  res.json({ mensaje: "Cita guardada 🔥" });
});

// 📥 OBTENER CITAS POR USUARIO
app.get("/citas/:usuarioId", async (req, res) => {
  const usuarioId = req.params.usuarioId;
  const citas = await db.collection("citas").find({ usuarioId: usuarioId.toString() }).toArray();
  res.json(citas);
});

// ❌ ELIMINAR CITA
app.delete("/citas/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await db.collection("citas").deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) return res.json({ mensaje: "No se encontró la cita ❌" });

    res.json({ mensaje: "Cita eliminada 🔥" });
  } catch (error) {
    console.error(error);
    res.json({ mensaje: "Error al eliminar ❌" });
  }
});

// 🔹 Rutas demo
app.get("/", (req, res) => {
  res.send(`
    <h1>Quickreserve Backend 🔥</h1>
    <p>Todo funcionando con MongoDB!</p>
    <p>Rutas disponibles:</p>
    <ul>
      <li>/registro</li>
      <li>/login</li>
      <li>/citas (POST)</li>
      <li>/citas/:usuarioId (GET)</li>
      <li>/citas/:id (DELETE)</li>
      <li>/demo</li>
    </ul>
  `);
});

app.get("/demo", (req, res) => {
  res.json({
    mensaje: "Hola! Este es un demo de Quickreserve 👋",
    estado: "Backend conectado y MongoDB funcionando 🔥"
  });
});

// 🔹 Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});