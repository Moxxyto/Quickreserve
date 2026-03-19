// 🔐 Verificar sesión
let usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
  window.location.href = "login.html";
}


// 📌 GUARDAR CITA
async function reservar() {
  let nombre = document.getElementById("nombre").value;
  let fecha = document.getElementById("fecha").value;
  let hora = document.getElementById("hora").value;

  // ✅ VALIDACIÓN
  if (!nombre || !fecha || !hora) {
    alert("Completa todos los campos ⚠️");
    return;
  }

  let cita = {
    nombre,
    fecha,
    hora,
    usuarioId: usuario._id.toString()
  };

  await fetch("http://localhost:3000/citas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cita)
  });

  alert("Cita guardada 🔥");

  // limpiar inputs
  document.getElementById("nombre").value = "";
  document.getElementById("fecha").value = "";
  document.getElementById("hora").value = "";

  cargarCitas();
}


// 📥 CARGAR CITAS
async function cargarCitas() {
  let res = await fetch("http://localhost:3000/citas/" + usuario._id);
  let citas = await res.json();

  let lista = document.getElementById("listaCitas");
  lista.innerHTML = "<h3>Reservas</h3>";

  citas.forEach(cita => {
    lista.innerHTML += `
      <div class="cita">
        ${cita.nombre} - ${cita.fecha} - ${cita.hora}
        <button class="delete" onclick="eliminarCita('${cita._id}')">❌</button>
      </div>
    `;
  });
}


// ❌ ELIMINAR CITA
async function eliminarCita(id) {
  await fetch("http://localhost:3000/citas/" + id, {
    method: "DELETE"
  });

  alert("Cita eliminada");

  cargarCitas();
}


// 🔓 LOGOUT
function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}


// 🚀 INICIAR
cargarCitas();