let clientes = [];
let creditos = [];

let tasaInteres = 15;
let clienteSeleccionado = null;
// Separar la edición de clientes de la búsqueda para créditos.
let clienteCredito = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;

function ocultarSecciones() {
  document.getElementById("parametros").classList.remove("activa");
  document.getElementById("clientes").classList.remove("activa");
  document.getElementById("creditos").classList.remove("activa");
  document.getElementById("listaCreditos").classList.remove("activa");
}

function mostrarSeccion(id) {
  ocultarSecciones();
  document.getElementById(id).classList.add("activa");
  if (id === "listaCreditos") {
    mostrarTextoEnCaja("buscarCedulaListado", "");
    pintarCreditos(creditos);
  }
}

function guardarTasa() {
  let tasaIngresada = recuperarFloat("tasaInteres");

  if (tasaIngresada >= 10 && tasaIngresada <= 20) {
    tasaInteres = tasaIngresada;
    limpiarResultadoCredito();

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

  cedula = cedula.trim();
  nombre = nombre.trim();
  apellido = apellido.trim();
  if (!cedula || !nombre || !apellido ||
      !Number.isFinite(ingresos) || !Number.isFinite(egresos) ||
      ingresos < 0 || egresos < 0) {
    alert("Complete los datos del cliente con ingresos y egresos válidos, mayores o iguales a cero.");
    return;
  }

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
  limpiarBusquedaCredito();
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
    botonActualizar.onclick = function () {
      seleccionarCliente(cliente.cedula);
    };

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


// PARTE 2: búsqueda y simulación del crédito.
function limpiarResultadoCredito() {
  cuotaCalculada = 0;
  montoCalculado = 0;
  plazoCalculado = 0;
  creditoAprobado = false;
  mostrarTexto("resultadoCredito", "");
  document.getElementById("resultadoCredito").className = "";
  document.getElementById("btnAsignarCredito").disabled = true;
}

function limpiarBusquedaCredito() {
  clienteCredito = null;
  mostrarTexto("datosClienteCredito", "");
  limpiarResultadoCredito();
}

function buscarClienteCredito() {
  limpiarBusquedaCredito();
  let cedula = recuperaraTexto("buscarCedulaCredito").trim();
  if (cedula === "") {
    mostrarTexto("datosClienteCredito", "Ingrese una cédula para buscar.");
    return;
  }
  clienteCredito = buscarCliente(cedula);
  if (clienteCredito === null) {
    mostrarTexto("datosClienteCredito", "Cliente no encontrado. Regístrelo en la sección Clientes.");
    return;
  }
  mostrarDatosClienteCredito();
}

function mostrarDatosClienteCredito() {
  let datosClienteCredito = document.getElementById("datosClienteCredito");
  datosClienteCredito.innerHTML = `
    <h3>Datos del Cliente</h3>
    <p><strong>Cédula:</strong> ${escaparHTML(clienteCredito.cedula)}</p>
    <p><strong>Nombre:</strong> ${escaparHTML(clienteCredito.nombre)}</p>
    <p><strong>Apellido:</strong> ${escaparHTML(clienteCredito.apellido)}</p>
    <p><strong>Ingresos:</strong> $${clienteCredito.ingresos.toFixed(2)}</p>
    <p><strong>Egresos:</strong> $${clienteCredito.egresos.toFixed(2)}</p>
  `;
}

// Funciones separadas para reutilizar los cálculos del simulador.
// El material adjunto no incluye las funciones del simulador anterior.
function calcularCapacidadPago(ingresos, egresos) {
  return ingresos - egresos;
}

// Interés simple aplicado una vez al monto solicitado.
function calcularTotalPagar(monto, tasa) {
  return monto + monto * tasa / 100;
}

function calcularCuotaMensual(total, plazo) {
  return total / plazo;
}

function evaluarCredito(capacidad, cuota) {
  return cuota <= capacidad;
}

function calcularCredito() {
  limpiarResultadoCredito();
  if (clienteCredito === null) {
    mostrarTexto("resultadoCredito", "Primero busque un cliente registrado.");
    return;
  }
  let monto = Number(recuperaraTexto("montoCredito"));
  let plazo = Number(recuperaraTexto("plazoCredito"));
  if (!Number.isFinite(monto) || monto <= 0 ||
      !Number.isSafeInteger(plazo) || plazo <= 0) {
    mostrarTexto("resultadoCredito", "Ingrese un monto mayor a cero y un plazo entero de meses mayor a cero.");
    return;
  }
  let capacidadPago = calcularCapacidadPago(clienteCredito.ingresos, clienteCredito.egresos);
  let totalPagar = calcularTotalPagar(monto, tasaInteres);
  let cuotaMensual = calcularCuotaMensual(totalPagar, plazo);
  if (!Number.isFinite(totalPagar) || !Number.isFinite(cuotaMensual)) {
    mostrarTexto("resultadoCredito", "El monto es demasiado grande. Ingrese un valor válido.");
    return;
  }
  creditoAprobado = evaluarCredito(capacidadPago, cuotaMensual);
  montoCalculado = monto;
  plazoCalculado = plazo;
  cuotaCalculada = cuotaMensual;
  let resultadoCredito = document.getElementById("resultadoCredito");
  resultadoCredito.innerHTML = `
    Capacidad de pago: $${capacidadPago.toFixed(2)}<br>
    Total a pagar: $${totalPagar.toFixed(2)}<br>
    Cuota mensual: $${cuotaMensual.toFixed(2)}<br>
    RESULTADO: ${creditoAprobado ? "APROBADO" : "RECHAZADO"}
  `;
  if (creditoAprobado) {
    resultadoCredito.className = "aprobado";
  } else {
    resultadoCredito.className = "rechazado";
  }
  document.getElementById("btnAsignarCredito").disabled = !creditoAprobado;
}

// Registrar una sola asignación por cada cálculo aprobado.
function asignarCredito() {
  if (!creditoAprobado || clienteCredito === null) {
    return;
  }
  creditos.push({
    cedula: clienteCredito.cedula,
    nombre: clienteCredito.nombre,
    apellido: clienteCredito.apellido,
    monto: montoCalculado,
    plazo: plazoCalculado,
    cuota: cuotaCalculada,
    tasa: tasaInteres
  });
  document.getElementById("resultadoCredito").innerHTML += "<br>Crédito asignado correctamente.";
  document.getElementById("btnAsignarCredito").disabled = true;
  creditoAprobado = false;
}

function buscarCreditos(cedula) {
  let encontrados = [];
  for (let i = 0; i < creditos.length; i++) {
    if (creditos[i].cedula === cedula) {
      encontrados.push(creditos[i]);
    }
  }
  return encontrados;
}

function pintarCreditos(creditos) {
  let tabla = document.getElementById("tablaCreditos");
  mostrarTexto("tablaCreditos", "");
  for (let i = 0; i < creditos.length; i++) {
    let credito = creditos[i];
    let fila = document.createElement("tr");
    agregarCeldaTexto(fila, credito.cedula);
    agregarCeldaTexto(fila, credito.nombre);
    agregarCeldaTexto(fila, credito.apellido);
    agregarCeldaTexto(fila, "$" + credito.monto.toFixed(2));
    agregarCeldaTexto(fila, credito.tasa + "%");
    agregarCeldaTexto(fila, credito.plazo + " meses");
    agregarCeldaTexto(fila, "$" + credito.cuota.toFixed(2));
    tabla.appendChild(fila);
  }
  mostrarTexto("mensajeHistorial", creditos.length === 0
    ? "No se encontraron créditos registrados."
    : "Créditos encontrados: " + creditos.length);
}

function buscarCreditosCliente() {
  let cedula = recuperaraTexto("buscarCedulaListado").trim();
  let encontrados = buscarCreditos(cedula);
  pintarCreditos(encontrados);
}
