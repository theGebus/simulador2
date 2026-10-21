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

function buscarCliente(cedula) {
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cedula === cedula) {
      return clientes[i];
    }
  }

  return null;
}

function seleccionarCliente(cedula) {
  clienteSeleccionado = buscarCliente(cedula);

  if (clienteSeleccionado !== null) {
    mostrarTextoEnCaja("cedula", clienteSeleccionado.cedula);
    mostrarTextoEnCaja("nombre", clienteSeleccionado.nombre);
    mostrarTextoEnCaja("apellido", clienteSeleccionado.apellido);
    mostrarTextoEnCaja("ingresos", clienteSeleccionado.ingresos);
    mostrarTextoEnCaja("egresos", clienteSeleccionado.egresos);

    // Impedir que se modifique la cédula al actualizar.
    document.getElementById("cedula").readOnly = true;
  }
}

function guardarCliente() {
  // Recuperar los datos usando los utilitarios.
  let cedula = recuperaraTexto("cedula");
  let nombre = recuperaraTexto("nombre");
  let apellido = recuperaraTexto("apellido");
  let ingresos = recuperarFloat("ingresos");
  let egresos = recuperarFloat("egresos");

  let clienteExistente;

  if (clienteSeleccionado !== null) {
    clienteExistente = clienteSeleccionado;
  } else {
    clienteExistente = buscarCliente(cedula);
  }

  if (clienteExistente === null) {
    // Crear un cliente si no existe.
    let cliente = {
      cedula: cedula,
      nombre: nombre,
      apellido: apellido,
      ingresos: ingresos,
      egresos: egresos
    };

    clientes.push(cliente);
  } else {
    // Actualizar el cliente sin modificar su cédula.
    clienteExistente.nombre = nombre;
    clienteExistente.apellido = apellido;
    clienteExistente.ingresos = ingresos;
    clienteExistente.egresos = egresos;
  }

  pintarClientes();
  limpiar();
}

function pintarClientes() {
  let tabla = document.getElementById("tablaClientes");

  // Limpiar las filas anteriores.
  mostrarTexto("tablaClientes", "");

  // Crear una fila por cada cliente.
  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i];
    let fila = document.createElement("tr");

    agregarCeldaTexto(fila, cliente.cedula);
    agregarCeldaTexto(fila, cliente.nombre);
    agregarCeldaTexto(fila, cliente.apellido);
    agregarCeldaTexto(fila, cliente.ingresos);
    agregarCeldaTexto(fila, cliente.egresos);

    let celdaAcciones = document.createElement("td");
    let botonActualizar = document.createElement("button");

    botonActualizar.innerText = "Actualizar";

    // Combinar comillas dobles y simples.
    botonActualizar.setAttribute(
      "onclick",
      "seleccionarCliente('" + cliente.cedula + "')"
    );

    celdaAcciones.appendChild(botonActualizar);
    fila.appendChild(celdaAcciones);
    tabla.appendChild(fila);
  }
}

function limpiar() {
  mostrarTextoEnCaja("cedula", "");
  mostrarTextoEnCaja("nombre", "");
  mostrarTextoEnCaja("apellido", "");
  mostrarTextoEnCaja("ingresos", "");
  mostrarTextoEnCaja("egresos", "");

  clienteSeleccionado = null;

  // Permitir ingresar la cédula de otro cliente.
  document.getElementById("cedula").readOnly = false;
}