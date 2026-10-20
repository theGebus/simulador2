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

function guardarCliente() {
  // Recuperar los datos usando los utilitarios.
  let cedula = recuperaraTexto("cedula");
  let nombre = recuperaraTexto("nombre");
  let apellido = recuperaraTexto("apellido");
  let ingresos = recuperarFloat("ingresos");
  let egresos = recuperarFloat("egresos");

  // Crear el objeto cliente.
  let cliente = {
    cedula: cedula,
    nombre: nombre,
    apellido: apellido,
    ingresos: ingresos,
    egresos: egresos
  };

  // Agregar el cliente al arreglo y actualizar la tabla.
  clientes.push(cliente);
  pintarClientes();
}

function pintarClientes() {
  let tabla = document.getElementById("tablaClientes");

  // Limpiar las filas anteriores.
  mostrarTexto("tablaClientes", "");

  // Recorrer el arreglo y crear una fila por cliente.
  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i];
    let fila = document.createElement("tr");

    agregarCeldaTexto(fila, cliente.cedula);
    agregarCeldaTexto(fila, cliente.nombre);
    agregarCeldaTexto(fila, cliente.apellido);
    agregarCeldaTexto(fila, cliente.ingresos);
    agregarCeldaTexto(fila, cliente.egresos);

    // Crear la celda de acciones.
    let celdaAcciones = document.createElement("td");
    let botonActualizar = document.createElement("button");

    botonActualizar.innerText = "Actualizar";

    celdaAcciones.appendChild(botonActualizar);
    fila.appendChild(celdaAcciones);

    // Insertar la fila en el tbody.
    tabla.appendChild(fila);
  }
}