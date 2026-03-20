async function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let res = await fetch("https://quickreserve-back.onrender.com/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  let data = await res.json();

  alert(data.mensaje);

  if (data.usuario) {
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    window.location.href = "index.html";
  }
}
