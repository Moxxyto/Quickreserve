async function registrar() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  // 🔥 VALIDACIÓN
  if (!email || !password) {
    alert("Completa todos los campos ⚠️");
    return;
  }

  // (opcional) validar formato básico de email
  if (!email.includes("@")) {
    alert("Correo inválido ⚠️");
    return;
  }

  let res = await fetch("http://localhost:3000/registro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  let data = await res.json();

  alert(data.mensaje);
  document.getElementById("email").value = "";
document.getElementById("password").value = "";

  if (data.usuario || data.mensaje === "Usuario creado 🔥") {
    window.location.href = "login.html";
  }
}