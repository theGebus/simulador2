let clientes = [];
let creditos = [];

let tasaInteres = 15;
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;

function ocultarSecciones() {
  document.getElementById("parametros").classList.remove("activa");
  document.getElementById("clientes").classList.remove("activa");
}

function mostrarSeccion(id) {
  ocultarSecciones();
  document.getElementById(id).classList.add("activa");
}

function guardarTasa() {
  let tasaIngresada = recuperarFloat("tasaInteres");

  if (tasaIngresada >= 10 && tasaIngresada <= 20) {
    tasaInteres = tasaIngresada;
    mostrarTexto(
      "mensajeTasa",
      "Tasa configurada correctamente: " + tasaInteres + "%"
    );
  } else {
    mostrarTexto(
      "mensajeTasa",
      "La tasa debe estar entre 10% y 20%"
    );
  }
}