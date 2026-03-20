// 🔐 Verificar sesión
let usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
  window.location.href = "login.html";
}

// 🔔 TOAST
function mostrarMensaje(msg, tipo = "ok") {
  let toast = document.getElementById("toast");
  toast.innerText = msg;

  toast.className = "show";
  if (tipo === "error") toast.classList.add("error");

  setTimeout(() => {
    toast.className = "";
  }, 3000);
}

// 📌 GUARDAR CITA
async function reservar() {
  let nombre = document.getElementById("nombre").value.trim();
  let fecha = document.getElementById("fecha").value;
  let hora = document.getElementById("hora").value;
  let boton = document.querySelector("button");

  if (!nombre || !fecha || !hora) {
    mostrarMensaje("Completa todos los campos ⚠️", "error");
    return;
  }

  let hoy = new Date().toISOString().split("T")[0];
  if (fecha < hoy) {
    mostrarMensaje("Fecha inválida ❌", "error");
    return;
  }

  boton.disabled = true;
  boton.innerText = "Guardando...";

  try {
    await fetch("https://quickreserve-back.onrender.com/citas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre,
        fecha,
        hora,
        usuarioId: usuario._id
      })
    });

    mostrarMensaje("Cita guardada ✅");

    document.getElementById("nombre").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("hora").value = "";

    cargarCitas();

  } catch (error) {
    mostrarMensaje("Error al guardar ❌", "error");
  }

  boton.disabled = false;
  boton.innerText = "Reservar";
}

// 📥 CARGAR CITAS
async function cargarCitas() {
  let res = await fetch("https://quickreserve-back.onrender.com/citas/" + usuario._id);
  let citas = await res.json();

  let lista = document.getElementById("listaCitas");
  lista.innerHTML = "<h3>Tus citas</h3>";

  citas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  citas.forEach(cita => {
    lista.innerHTML += `
      <div class="cita">
        ${cita.nombre} - ${cita.fecha} - ${cita.hora}
        <button class="delete" onclick="eliminarCita('${cita._id}')">❌</button>
      </div>
    `;
  });
}

// ❌ ELIMINAR
async function eliminarCita(id) {
  if (!confirm("¿Eliminar esta cita?")) return;

  await fetch("https://quickreserve-back.onrender.com/citas/" + id, {
    method: "DELETE"
  });

  mostrarMensaje("Cita eliminada");
  cargarCitas();
}

// 🔓 LOGOUT
function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}

// 🚀 INICIAR
cargarCitas();