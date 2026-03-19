const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://moiseudyferreira_db_user:4xjXyAauwY7jraaI@saas-reservas-cluster.kmanzes.mongodb.net/?appName=SaaS-Reservas-Cluster";

const client = new MongoClient(uri);

let db;

// Conectar a MongoDB
async function conectarDB() {
  try {
    await client.connect();
    db = client.db("quickreserve");
    console.log("Conectado a MongoDB 🔥");
  } catch (error) {
    console.error(error);
  }
}

conectarDB();


// 🔐 REGISTRO
app.post("/registro", async (req, res) => {
  const { email, password } = req.body;

  const existe = await db.collection("usuarios").findOne({ email });

  if (existe) {
    return res.json({ mensaje: "Usuario ya existe" });
  }

  const nuevoUsuario = await db.collection("usuarios").insertOne({ email, password });

  res.json({
    mensaje: "Usuario creado 🔥",
    usuario: {
      _id: nuevoUsuario.insertedId.toString(),
      email
    }
  });
});


// 🔑 LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const usuario = await db.collection("usuarios").findOne({ email, password });

  if (!usuario) {
    return res.json({ mensaje: "Credenciales incorrectas" });
  }

  res.json({
    mensaje: "Login correcto 🔥",
    usuario: {
      _id: usuario._id.toString(),
      email: usuario.email
    }
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

  const citas = await db
    .collection("citas")
    .find({ usuarioId: usuarioId.toString() })
    .toArray();

  res.json(citas);
});


// ❌ ELIMINAR CITA
app.delete("/citas/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const resultado = await db.collection("citas").deleteOne({
      _id: new ObjectId(id)
    });

    if (resultado.deletedCount === 0) {
      return res.json({ mensaje: "No se encontró la cita ❌" });
    }

    res.json({ mensaje: "Cita eliminada 🔥" });
  } catch (error) {
    console.error(error);
    res.json({ mensaje: "Error al eliminar ❌" });
  }
});


app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Quickreserve Backend 🔥</h1>
    <p>Todo funcionando con MongoDB!</p>
    <p>Rutas disponibles:</p>
    <ul>
      <li>/api/reservas</li>
      <li>/api/usuarios</li>
      <!-- agrega aquí las que tengas -->
    </ul>
  `);
});