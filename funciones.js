/* Variables principales del desbloqueo
  pinCorrecto es el PIN de demostración
  pinIngresado guarda lo que el usuario va escribiendo.*/

let pinCorrecto = "1234";
let pinIngresado = "";

/*Variables para seguridad.
  intentosFallidos cuenta cuántas veces se equivocó el usuario.
  celularBloqueado indica si el celular está bloqueado temporalmente.
*/
let intentosFallidos = 0;
let celularBloqueado = false;
let tiempoBloqueo = 0;
let alertasSeguridad = [];
let usuarioActivo = "Admin";
let usuarioLogin = "Admin";
let mensajeLogin = "Inicia sesion para cambiar los permisos.";

/* usuarios y claves guardadas con cifrado simple educativo. */
const usuariosSeguridad = {
  Admin: cifrarContrasena("admin123"),
  Invitado: cifrarContrasena("invitado123")
};

/* guardamos elementos del html para usarlos fácilmente en JavaScript. */
const horaBarra = document.getElementById("horaBarra");
const horaBloqueo = document.getElementById("horaBloqueo");
const fechaBloqueo = document.getElementById("fechaBloqueo");

const mensajeDesbloqueo = document.getElementById("mensajeDesbloqueo");
const mensajeBloqueoTemporal = document.getElementById("mensajeBloqueoTemporal");

const botonesTeclado = document.querySelectorAll(".teclado-pin button");
const puntosPin = document.querySelectorAll(".puntos-pin span");

//bloquea el celular otra vez
const botonBloquear = document.getElementById("botonBloquear");
const botonesApps = document.querySelectorAll(".icono-app");
const botonVolverInicio = document.getElementById("botonVolverInicio");
const botonCerrarApp = document.getElementById("botonCerrarApp");
const tituloApp = document.getElementById("tituloApp");
const subtituloApp = document.getElementById("subtituloApp");
const contenidoApp = document.getElementById("contenidoApp");
const appsInstaladasInicio = document.getElementById("appsInstaladasInicio");

/* procesos simulados que siempre están activos en el iPhone. */
const procesosSistema = [
  { nombre: "securityd", descripcion: "Seguridad y permisos", memoria: 45, prioridad: 2, estado: "Ejecucion" },
  { nombre: "mediaserverd", descripcion: "Audio, video y camara", memoria: 85, prioridad: 3, estado: "Ejecucion" },
  { nombre: "wifid", descripcion: "Conexion WiFi", memoria: 50, prioridad: 3, estado: "Ejecucion" },
  { nombre: "powerd", descripcion: "Bateria y energia", memoria: 35, prioridad: 2, estado: "Ejecucion" },
  { nombre: "notifyd", descripcion: "Notificaciones del sistema", memoria: 30, prioridad: 3, estado: "Listo" },
  { nombre: "backboardd", descripcion: "Toque, botones y pantalla", memoria: 65, prioridad: 1, estado: "Ejecucion" },
  { nombre: "bluetoothd", descripcion: "Conexion Bluetooth", memoria: 42, prioridad: 3, estado: "Listo" },
  { nombre: "locationd", descripcion: "Ubicacion GPS", memoria: 55, prioridad: 3, estado: "Ejecucion" }
];

let intervaloProcesos = null;
let turnoPlanificador = 0;
let procesoEnCpu = "Preparando CPU";
let cicloProcesoTemporal = 0;
let prioridadCpuActual = 1;
let explicacionPlanificador = "Prioridad 1 tiene mas turnos por ser del sistema.";
let turnosCpuProcesos = {};

/* proceso temporal para mostrar todos los estados del ciclo de vida. */
const procesoTemporal = { nombre: "installd", descripcion: "Instalacion del sistema", memoria: 18, prioridad: 2, estado: "Nuevo" };

/* subtareas de la Camara que trabajan como hilos. */
const subtareasCamara = [
  { nombre: "Capturar imagen", descripcion: "Recibe datos del sensor", estado: "Listo", turnos: 0 },
  { nombre: "Procesar color", descripcion: "Ajusta luz y color", estado: "Listo", turnos: 0 },
  { nombre: "Guardar archivo", descripcion: "Escribe la foto en Archivos", estado: "Listo", turnos: 0 }
];

/* dispositivos para simular conexiones del iPhone. */
const dispositivosEntradaSalida = [
  { id: "audifonos", icono: "🎧", nombre: "AirPods", tipo: "Salida de audio", proceso: "bluetoothd", conectado: false },
  { id: "controlXbox", icono: "🎮", nombre: "Control de Xbox", tipo: "Control inalambrico", proceso: "bluetoothd", conectado: false },
  { id: "impresora", icono: "🖨️", nombre: "Impresora", tipo: "Impresion por WiFi", proceso: "wifid", conectado: false },
  { id: "smartwatch", icono: "⌚", nombre: "Smartwatch", tipo: "Accesorio Bluetooth", proceso: "bluetoothd", conectado: false }
];

/* guarda el ultimo cambio mostrado en dispositivos. */
let mensajeEntradaSalida = "Selecciona un dispositivo para conectarlo.";

/* fotos tomadas con la camara y carpeta que se esta viendo. */
let fotosCamara = [];
let fotosEliminadas = [];
let numeroFoto = 0;
let carpetaArchivosActual = "inicio";
let mensajeCamara = "Apunta y toca el boton para tomar una foto.";
let fotoArchivoSeleccionada = -1;
let carpetaAnteriorArchivo = "camara";
let mensajeArchivos = "";
let albumFotosActual = "biblioteca";

/* notas guardadas en iCloud o localmente en el iPhone. */
let notasGuardadas = {
  icloud: [],
  iphone: []
};
let carpetaNotasActual = "inicio";

/* documentos creados en la app descargada. */
let documentosGuardados = [];
let documentosEliminados = [];
let documentoActual = -1;
let vistaDocumentos = "lista";
let mensajeDocumentos = "";

/* apps simuladas disponibles en la App Store. */
const appsTienda = [
  { id: "instagram", nombre: "Instagram", gb: 3.5, ram: 480, color: "#ff375f" },
  { id: "spotify", nombre: "Spotify", gb: 2.8, ram: 420, color: "#30d158" },
  { id: "notas", nombre: "Notas", gb: 0.7, ram: 180, color: "#ffd60a" },
  { id: "documentos", nombre: "Documentos", gb: 0.9, ram: 220, color: "#ff9500" },
  { id: "banco", nombre: "Banco", gb: 1.2, ram: 260, color: "#0a84ff" }
];

/* arreglo donde se guardan las apps instaladas. */
let appsInstaladas = [];

/* guarda el proceso visual de instalar, eliminar o actualizar. */
let appsCargando = {};

/* historial de apps que se han abierto. */
let appsRecientes = [];

/* guarda la app activa y las que pasan a memoria virtual. */
let appActual = null;
let appsEnMemoriaVirtual = [];
const marcosRamApps = 3;
let eventoLru = "Abre cuatro apps para activar la paginacion.";

/* memoria usada por cada app del simulador. */
const memoriaApps = {
  appstore: 420,
  procesos: 260,
  memoria: 300,
  archivos: 210,
  camara: 360,
  fotos: 240,
  notas: 180,
  documentos: 220,
  entradaSalida: 190,
  seguridad: 230,
  ajustes: 250,
  instagram: 480,
  spotify: 420,
  banco: 260
};

/* datos base del almacenamiento del iPhone. */
const almacenamientoBase = [
  { nombre: "Fotos", gb: 32, color: "#ff375f" },
  { nombre: "Sistema iOS", gb: 12, color: "#8e8e93" },
  { nombre: "Multimedia", gb: 9, color: "#ff9f0a" },
  { nombre: "Documentos", gb: 6, color: "#30d158" }
];

/* capacidad total y espacio usado por apps base del sistema. */
const capacidadTotal = 128;
const appsBaseGb = 24;


/* funcion que obtiene el nombre visible de una app. */
function obtenerNombreApp(idApp) {
  const nombresApps = {
    appstore: "App Store",
    procesos: "Procesos",
    memoria: "Diagnostico",
    archivos: "Archivos",
    camara: "Camara",
    fotos: "Fotos",
    notas: "Notas",
    documentos: "Documentos",
    entradaSalida: "Dispositivos",
    seguridad: "Seguridad",
    ajustes: "Ajustes",
    recientes: "Recientes"
  };

  const appInstalada = appsTienda.find(function (app) {
    return app.id === idApp;
  });

  if (appInstalada) {
    return appInstalada.nombre;
  }

  return nombresApps[idApp] || "App";
}

/* funcion que pone las apps descargadas en el inicio. */
function dibujarAppsInstaladasInicio() {
  let appsHtml = "";

  appsInstaladas.forEach(function (idApp) {
    const app = appsTienda.find(function (appTienda) {
      return appTienda.id === idApp;
    });

    if (app) {
      appsHtml += "<button class='icono-app' data-app-instalada='" + app.id + "'>" +
        "<span class='burbuja-app' style='background:" + app.color + "'>" + app.nombre.slice(0, 2) + "</span>" +
        "<span>" + app.nombre + "</span>" +
      "</button>";
    }
  });

  appsInstaladasInicio.innerHTML = appsHtml;

  document.querySelectorAll("[data-app-instalada]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      abrirApp(boton.dataset.appInstalada);
    });
  });
}

/* funcion que guarda la app abierta en recientes. */
function registrarAppReciente(idApp) {
  appActual = idApp;
  appsRecientes = appsRecientes.filter(function (app) {
    return app !== idApp;
  });

  /* coloca primero la ultima app abierta. */
  appsRecientes.unshift(idApp);

  if (appsRecientes.length > 6) {
    appsRecientes.pop();
  }

  actualizarMemoriaVirtual();
}

/* funcion que decide que apps pasan a memoria virtual. */
function actualizarMemoriaVirtual() {
  const virtualAnterior = appsEnMemoriaVirtual.slice();
  appsEnMemoriaVirtual = [];

  /* solo tres apps quedan en RAM; desde la cuarta pasan a virtual. */
  if (appsRecientes.length > marcosRamApps) {
    appsEnMemoriaVirtual = appsRecientes.slice(marcosRamApps);
  }

  const appMovida = appsEnMemoriaVirtual.find(function (idApp) {
    return !virtualAnterior.includes(idApp);
  });

  if (appMovida) {
    eventoLru = obtenerNombreApp(appMovida) + " era la menos usada y paso a memoria virtual.";
  } else if (appsEnMemoriaVirtual.length === 0) {
    eventoLru = "Abre cuatro apps para activar la paginacion.";
  }
}

/* funcion que devuelve el estado de una app reciente. */
function obtenerEstadoApp(idApp) {
  if (idApp === appActual) {
    return "Ejecucion";
  }

  if (appsEnMemoriaVirtual.includes(idApp)) {
    return "Memoria virtual";
  }

  return "Segundo plano";
}

/* funcion que calcula la memoria de una app segun su estado. */
function obtenerMemoriaApp(idApp, estado) {
  const memoriaBase = memoriaApps[idApp] || 180;

  if (estado === "Ejecucion" || estado === "Memoria virtual") {
    return memoriaBase;
  }

  return Math.round(memoriaBase * 0.55);
}

/* funcion que actualiza la hora y fecha usando el dispositivo. */
function actualizarReloj() {
  const ahora = new Date();
  const hora = ahora.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  const fecha = ahora.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });

  horaBarra.textContent = hora;
  horaBloqueo.textContent = hora;
  fechaBloqueo.textContent = fecha;
}

/* funcion que cambia los procesos usando prioridades. */
function actualizarProcesosSistema() {
  const ordenPrioridades = [1, 1, 2, 1, 2, 3];
  const prioridadCpu = ordenPrioridades[turnoPlanificador % ordenPrioridades.length];
  prioridadCpuActual = prioridadCpu;
  turnoPlanificador++;

  procesosSistema.forEach(function (proceso) {
    proceso.estado = "Listo";

    /* WiFi se bloquea cuando espera datos de entrada o salida. */
    if (proceso.nombre === "wifid" && turnoPlanificador % 6 === 0) {
      proceso.estado = "Bloqueado";
    }

    proceso.memoria = proceso.memoria + Math.floor(Math.random() * 7) - 3;
    proceso.memoria = Math.max(25, Math.min(95, proceso.memoria));
  });

  /* los procesos de dispositivos conectados reciben actividad. */
  dispositivosEntradaSalida.forEach(function (dispositivo) {
    const proceso = procesosSistema.find(function (servicio) {
      return servicio.nombre === dispositivo.proceso;
    });

    if (dispositivo.conectado && proceso) {
      proceso.estado = "Ejecucion";
    }
  });

  const candidatos = procesosSistema.filter(function (proceso) {
    return proceso.prioridad === prioridadCpu && proceso.estado === "Listo";
  });
  const procesoElegido = candidatos[turnoPlanificador % candidatos.length] || procesosSistema[5];

  procesoElegido.estado = "Ejecucion";
  procesoEnCpu = procesoElegido.nombre + " - Prioridad " + procesoElegido.prioridad;
  turnosCpuProcesos[procesoElegido.nombre] = (turnosCpuProcesos[procesoElegido.nombre] || 0) + 1;
  explicacionPlanificador = "Se eligio prioridad " + prioridadCpu +
    " porque los procesos importantes reciben mas turnos.";
  actualizarProcesoTemporal();
  actualizarSubtareasCamara();
}
/* funcion que cambia el estado del proceso temporal. */
function actualizarProcesoTemporal() {
  const estados = ["Nuevo", "Listo", "Ejecucion", "Bloqueado", "Listo", "Ejecucion", "Terminado"];
  procesoTemporal.estado = estados[cicloProcesoTemporal % estados.length];
  cicloProcesoTemporal++;
}

/* funcion que simula las subtareas de la app Camara. */
function actualizarSubtareasCamara() {
  const indiceActivo = (turnoPlanificador - 1) % subtareasCamara.length;

  subtareasCamara.forEach(function (subtarea, indice) {
    subtarea.estado = indice === indiceActivo ? "Ejecucion" : "Listo";
  });

  subtareasCamara[indiceActivo].turnos++;
}

/* funcion que pone color diferente a cada estado. */
function claseEstadoProceso(estado) {
  return estado.toLowerCase().replace(" ", "-");
}

/* Esta funcion pinta los puntos del PIN escrito. */
function actualizarPuntosPin() {
  puntosPin.forEach(function (punto, indice) {
    punto.classList.toggle("relleno", indice < pinIngresado.length);
  });
}

/* funcion que maneja cada tecla del PIN. */
function manejarTeclaPin(tecla) {
  if (celularBloqueado) {
    return;
  }

  if (tecla === "limpiar") {
    pinIngresado = "";
  } else if (tecla === "borrar") {
    pinIngresado = pinIngresado.slice(0, -1);
  } else if (pinIngresado.length < 4) {
    pinIngresado += tecla;
  }

  actualizarPuntosPin();

  if (pinIngresado.length === 4) {
    validarPin();
  }
}

/* funcion que revisa si el PIN ingresado es correcto. */
function validarPin() {
  if (pinIngresado === pinCorrecto) {
    mensajeDesbloqueo.textContent = "PIN correcto. Celular desbloqueado.";
    desbloquearCelular();
  } else {
    mensajeDesbloqueo.textContent = "PIN incorrecto.";
    pinIngresado = "";
    actualizarPuntosPin();
    registrarIntentoFallido();
  }
}

/* funcion que cambia de bloqueo a pantalla de inicio. */
function desbloquearCelular() {
  document.getElementById("pantallaBloqueo").classList.remove("pantalla-activa");
  document.getElementById("pantallaInicio").classList.add("pantalla-activa");
  pinIngresado = "";
  actualizarPuntosPin();
  intentosFallidos = 0;
  celularBloqueado = false;
  tiempoBloqueo = 0;
  mensajeDesbloqueo.textContent = "PIN demo: 1234";
  mensajeBloqueoTemporal.textContent = "";
}

/* funcion que suma intentos y aplica bloqueo temporal. */
function registrarIntentoFallido() {
  intentosFallidos++;
  registrarAlertaSeguridad("Intento fallido de PIN");
  mensajeBloqueoTemporal.textContent = "Intentos fallidos: " + intentosFallidos;

  if (intentosFallidos === 3) {
    bloquearCelularTemporalmente(15);
  } else if (intentosFallidos === 5) {
    bloquearCelularTemporalmente(30);
  } else if (intentosFallidos === 7) {
    bloquearCelularTemporalmente(60);
  }
}

/* funcion que bloquea el celular y muestra el contador. */
function bloquearCelularTemporalmente(segundos) {
  celularBloqueado = true;
  tiempoBloqueo = segundos;
  mensajeDesbloqueo.textContent = "iPhone bloqueado temporalmente.";
  mensajeBloqueoTemporal.textContent = "Intenta de nuevo en " + tiempoBloqueo + " segundos.";
  registrarAlertaSeguridad("iPhone bloqueado por seguridad");

  const intervaloBloqueo = setInterval(function () {
    tiempoBloqueo--;
    mensajeBloqueoTemporal.textContent = "Intenta de nuevo en " + tiempoBloqueo + " segundos.";

    if (tiempoBloqueo <= 0) {
      clearInterval(intervaloBloqueo);
      celularBloqueado = false;
      pinIngresado = "";
      actualizarPuntosPin();
      mensajeDesbloqueo.textContent = "PIN demo: 1234";
      mensajeBloqueoTemporal.textContent = "Puedes intentar de nuevo.";
    }
  }, 1000);
}

/* cambia la barra de estado para pantallas blancas. */
function barraEstadoOscura() {
  document.querySelector(".barra-estado").classList.add("oscura");
}

/* cambia la barra de estado para el fondo del inicio. */
function barraEstadoClara() {
  document.querySelector(".barra-estado").classList.remove("oscura");
}

/* funcion que guarda alertas de seguridad recientes. */
function registrarAlertaSeguridad(mensaje) {
  alertasSeguridad.unshift(mensaje);
  alertasSeguridad = alertasSeguridad.slice(0, 5);
}

/* funcion que transforma una contraseña para no compararla directa. */
function cifrarContrasena(contrasena) {
  let resultado = 0;

  for (let indice = 0; indice < contrasena.length; indice++) {
    resultado = (resultado * 31 + contrasena.charCodeAt(indice)) % 1000000;
  }

  return "C-" + String(resultado).padStart(6, "0");
}

/* funcion que valida el usuario y su contraseña cifrada. */
function iniciarSesionSeguridad() {
  const contrasena = document.getElementById("contrasenaSeguridad").value;
  const claveCifrada = cifrarContrasena(contrasena);

  if (claveCifrada === usuariosSeguridad[usuarioLogin]) {
    usuarioActivo = usuarioLogin;
    mensajeLogin = "Sesion iniciada como " + usuarioActivo + ". Clave verificada: " + claveCifrada + ".";
  } else {
    mensajeLogin = "Contraseña incorrecta. Acceso denegado.";
    registrarAlertaSeguridad("Login incorrecto para " + usuarioLogin + ".");
  }

  abrirAppSeguridad();
}

/* funcion que muestra seguridad y permisos instalados. */
function abrirAppSeguridad() {
  let permisosHtml = "";
  let alertasHtml = "";
  const permisoArchivos = usuarioActivo === "Admin" ? "Permitido" : "Denegado";

  appsInstaladas.forEach(function (idApp) {
    permisosHtml += "<article class='fila-seguridad'><span>" + obtenerNombreApp(idApp) + "</span><strong>Permitido</strong></article>";
  });

  alertasSeguridad.forEach(function (alerta) {
    alertasHtml += "<article class='fila-seguridad'><span>" + alerta + "</span><strong>Alerta</strong></article>";
  });

  tituloApp.textContent = "Seguridad";
  subtituloApp.textContent = "Privacidad";
  contenidoApp.innerHTML =
    "<section class='tarjeta'><h3>Estado de seguridad</h3>" +
      "<article class='fila-seguridad'><span>Usuario activo</span><strong>" + usuarioActivo + "</strong></article>" +
      "<article class='fila-seguridad'><span>Codigo</span><strong>Activo</strong></article>" +
      "<article class='fila-seguridad'><span>Intentos fallidos</span><strong>" + intentosFallidos + "</strong></article></section>" +
    "<section class='tarjeta login-seguridad'><h3>Inicio de sesion</h3>" +
      "<div class='selector-usuario'>" +
        "<button data-login-usuario='Admin' class='" + (usuarioLogin === "Admin" ? "activo" : "") + "'>Admin</button>" +
        "<button data-login-usuario='Invitado' class='" + (usuarioLogin === "Invitado" ? "activo" : "") + "'>Invitado</button>" +
      "</div>" +
      "<input id='contrasenaSeguridad' type='password' placeholder='Contraseña'>" +
      "<button id='iniciarSesionSeguridad' class='boton-principal'>Iniciar sesion</button>" +
      "<p class='mensaje-login'>" + mensajeLogin + "</p>" +
      "<small>Demo: Admin / admin123 | Invitado / invitado123</small>" +
      "<small>Claves cifradas: Admin " + usuariosSeguridad.Admin + " | Invitado " + usuariosSeguridad.Invitado + "</small>" +
    "</section>" +
    "<section class='tarjeta'><h3>Matriz de acceso</h3>" +
      "<article class='fila-seguridad'><span>Leer fotos</span><strong>Permitido</strong></article>" +
      "<article class='fila-seguridad'><span>Eliminar fotos</span><strong>" + permisoArchivos + "</strong></article>" +
      "<article class='fila-seguridad'><span>Restaurar archivos</span><strong>" + permisoArchivos + "</strong></article>" +
    "</section>" +
    "<section class='tarjeta'><h3>Permisos de apps</h3>" + (permisosHtml || "<p class='alerta'>No hay apps instaladas.</p>") + "</section>" +
    "<section class='tarjeta'><h3>Alertas</h3>" + (alertasHtml || "<p class='alerta'>No se encontraron amenazas.</p>") + "</section>";

  document.querySelectorAll("[data-login-usuario]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      usuarioLogin = boton.dataset.loginUsuario;
      abrirAppSeguridad();
    });
  });

  document.getElementById("iniciarSesionSeguridad").addEventListener("click", function () {
    iniciarSesionSeguridad();
  });
}

/* funcion que abre una app desde el inicio. */
function abrirApp(nombreApp) {
  if (nombreApp !== "recientes") {
    registrarAppReciente(nombreApp);
  }

  document.getElementById("pantallaInicio").classList.remove("pantalla-activa");
  document.getElementById("vistaApp").classList.add("pantalla-activa");
  barraEstadoOscura();
  clearInterval(intervaloProcesos);

  if (nombreApp === "recientes") {
    abrirAppsRecientes();
  } else if (nombreApp === "procesos") {
    abrirAppProcesos();
  } else if (nombreApp === "memoria") {
    abrirAppDiagnostico();
  } else if (nombreApp === "archivos") {
    abrirAppArchivos();
  } else if (nombreApp === "camara") {
    abrirAppCamara();
  } else if (nombreApp === "fotos") {
    abrirAppFotos();
  } else if (nombreApp === "notas") {
    abrirAppNotas();
  } else if (nombreApp === "documentos") {
    abrirAppDocumentos();
  } else if (nombreApp === "entradaSalida") {
    abrirAppEntradaSalida();
  } else if (nombreApp === "seguridad") {
    abrirAppSeguridad();
  } else if (nombreApp === "ajustes") {
    abrirAppAjustes();
  } else if (nombreApp === "appstore") {
    abrirAppStore();
  } else {
    tituloApp.textContent = obtenerNombreApp(nombreApp);
    subtituloApp.textContent = "Simulador iOS";
    contenidoApp.innerHTML = "<section class='tarjeta'><h3>" + obtenerNombreApp(nombreApp) + "</h3><p class='alerta'>Esta app esta abierta dentro del simulador.</p></section>";
  }
}

/* funcion que abre la camara del simulador. */
function abrirAppCamara() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Camara";
  subtituloApp.textContent = "Foto";
  dibujarCamara();
}

/* funcion que dibuja el visor y el boton para tomar foto. */
function dibujarCamara() {
  const ultimaFoto = fotosCamara[0];
  const miniatura = ultimaFoto ?
    "<button id='abrirFotoGuardada' class='miniatura-foto foto-" + ultimaFoto.fondo + "'><span>" + ultimaFoto.nombre + "</span></button>" :
    "<div class='miniatura-vacia'></div>";

  contenidoApp.innerHTML =
    "<section class='camara-contenido'>" +
      "<div class='visor-camara'>" +
        "<div class='cielo-camara'></div>" +
        "<div class='sol-camara'></div>" +
        "<div class='montana-camara una'></div>" +
        "<div class='montana-camara dos'></div>" +
        "<div class='piso-camara'></div>" +
        "<div class='enfoque-camara'></div>" +
      "</div>" +
      "<p class='mensaje-camara'>" + mensajeCamara + "</p>" +
      "<div class='controles-camara'>" +
        miniatura +
        "<button id='botonTomarFoto' class='boton-tomar-foto' title='Tomar foto'></button>" +
        "<button class='boton-cambiar-camara' title='Cambiar camara'>↻</button>" +
      "</div>" +
    "</section>";

  document.getElementById("botonTomarFoto").addEventListener("click", function () {
    tomarFoto();
  });

  if (ultimaFoto) {
    document.getElementById("abrirFotoGuardada").addEventListener("click", function () {
      abrirApp("fotos");
    });
  }
}

/* funcion que crea una foto y la guarda dentro de Fotos. */
function tomarFoto() {
  const ahora = new Date();
  const numero = String(numeroFoto + 1).padStart(4, "0");
  const fondos = ["amanecer", "azul", "rosa"];

  numeroFoto++;
  fotosCamara.unshift({
    nombre: "IMG_" + numero + ".HEIC",
    fecha: ahora.toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
    hora: ahora.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    tamano: "3.8 MB",
    fondo: fondos[(numeroFoto - 1) % fondos.length]
  });

  mensajeCamara = "Foto guardada en la app Fotos.";
  dibujarCamara();
}

/* funcion que abre la galeria de fotos del iPhone. */
function abrirAppFotos() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Fotos";
  subtituloApp.textContent = "Biblioteca";
  dibujarFotos();
}

/* funcion que dibuja la biblioteca o los eliminados. */
function dibujarFotos() {
  const fotosAlbum = albumFotosActual === "biblioteca" ? fotosCamara : fotosEliminadas;
  let fotosHtml = "";

  fotosAlbum.forEach(function (foto) {
    fotosHtml += "<article class='foto-galeria foto-" + foto.fondo + "'>" +
      "<span>" + foto.nombre + "</span>" +
    "</article>";
  });

  contenidoApp.innerHTML =
    "<section class='app-fotos'>" +
      "<div class='selector-album'>" +
        "<button data-album='biblioteca' class='" + (albumFotosActual === "biblioteca" ? "activo" : "") + "'>Biblioteca</button>" +
        "<button data-album='eliminados' class='" + (albumFotosActual === "eliminados" ? "activo" : "") + "'>Eliminados</button>" +
      "</div>" +
      "<section class='tarjeta resumen-fotos'><h3>" + (albumFotosActual === "biblioteca" ? "Todas las fotos" : "Eliminados recientemente") + "</h3>" +
        "<p>" + fotosAlbum.length + " foto(s)</p></section>" +
      "<div class='cuadricula-fotos'>" +
        (fotosHtml || "<section class='tarjeta galeria-vacia'><strong>No hay fotos.</strong><p>Toma una foto desde Camara.</p></section>") +
      "</div>" +
    "</section>";

  document.querySelectorAll("[data-album]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      albumFotosActual = boton.dataset.album;
      subtituloApp.textContent = albumFotosActual === "biblioteca" ? "Biblioteca" : "Eliminados";
      dibujarFotos();
    });
  });
}

/* funcion que abre Notas y sus carpetas disponibles. */
function abrirAppNotas() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Notas";
  subtituloApp.textContent = "Carpetas";
  dibujarNotas();
}

/* funcion que evita que el texto escrito cambie el codigo HTML. */
function protegerTexto(texto) {
  return texto.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}

/* funcion que dibuja las carpetas, notas o el editor. */
function dibujarNotas() {
  let contenido = "";

  if (carpetaNotasActual === "inicio") {
    contenido =
      "<section class='tarjeta encabezado-notas'><h3>Carpetas</h3><p>Selecciona una ubicacion</p></section>" +
      "<button class='fila-nota-carpeta' data-notas-carpeta='icloud'><span>☁️</span><div><strong>iCloud</strong><p>Notas sincronizadas</p></div><small>" + notasGuardadas.icloud.length + "</small><b>›</b></button>" +
      "<button class='fila-nota-carpeta' data-notas-carpeta='iphone'><span>📱</span><div><strong>En mi iPhone</strong><p>Notas guardadas localmente</p></div><small>" + notasGuardadas.iphone.length + "</small><b>›</b></button>";
  } else if (carpetaNotasActual === "editor-icloud" || carpetaNotasActual === "editor-iphone") {
    const destino = carpetaNotasActual === "editor-icloud" ? "icloud" : "iphone";
    const tituloDestino = destino === "icloud" ? "iCloud" : "En mi iPhone";

    contenido =
      "<button class='ruta-volver' data-notas-carpeta='" + destino + "'>‹ " + tituloDestino + "</button>" +
      "<section class='editor-nota'>" +
        "<input id='tituloNota' class='titulo-nota' type='text' placeholder='Titulo' maxlength='42'>" +
        "<textarea id='contenidoNota' class='contenido-nota' placeholder='Empieza a escribir...' maxlength='260'></textarea>" +
        "<button id='guardarNota' class='boton-guardar-nota'>Guardar nota</button>" +
      "</section>";
  } else {
    const destino = carpetaNotasActual;
    const tituloDestino = destino === "icloud" ? "iCloud" : "En mi iPhone";
    let notasHtml = "";

    notasGuardadas[destino].forEach(function (nota) {
      notasHtml += "<article class='tarjeta-nota'><strong>" + protegerTexto(nota.titulo) + "</strong>" +
        "<p>" + protegerTexto(nota.texto) + "</p><small>" + nota.fecha + "</small></article>";
    });

    contenido =
      "<button class='ruta-volver' data-notas-carpeta='inicio'>‹ Carpetas</button>" +
      "<section class='barra-notas'><div><h3>" + tituloDestino + "</h3><p>Notas</p></div>" +
      "<button class='boton-nueva-nota' data-nueva-nota='" + destino + "'>+</button></section>" +
      (notasHtml || "<section class='tarjeta nota-vacia'><strong>No hay notas</strong><p>Presiona + para crear una.</p></section>");
  }

  contenidoApp.innerHTML = "<section class='app-notas'>" + contenido + "</section>";

  document.querySelectorAll("[data-notas-carpeta]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      carpetaNotasActual = boton.dataset.notasCarpeta;
      dibujarNotas();
    });
  });

  document.querySelectorAll("[data-nueva-nota]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      carpetaNotasActual = "editor-" + boton.dataset.nuevaNota;
      dibujarNotas();
    });
  });

  if (document.getElementById("guardarNota")) {
    document.getElementById("guardarNota").addEventListener("click", function () {
      guardarNota();
    });
  }
}

/* funcion que guarda una nota dentro de su carpeta seleccionada. */
function guardarNota() {
  const destino = carpetaNotasActual === "editor-icloud" ? "icloud" : "iphone";
  const tituloEscrito = document.getElementById("tituloNota").value.trim();
  const textoEscrito = document.getElementById("contenidoNota").value.trim();
  const ahora = new Date();

  if (textoEscrito === "") {
    return;
  }

  notasGuardadas[destino].unshift({
    titulo: tituloEscrito || "Nueva nota",
    texto: textoEscrito,
    fecha: ahora.toLocaleDateString("es-MX", { day: "numeric", month: "short" })
  });

  carpetaNotasActual = destino;
  dibujarNotas();
}

/* funcion que abre la app Documentos descargada. */
function abrirAppDocumentos() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Documentos";
  subtituloApp.textContent = "En mi iPhone";
  dibujarDocumentos();
}

/* funcion que muestra la lista o el editor de documentos. */
function dibujarDocumentos() {
  let contenido = "";

  if (vistaDocumentos === "editor") {
    const documento = documentoActual >= 0 ? documentosGuardados[documentoActual] : null;

    contenido =
      "<button id='volverDocumentos' class='ruta-volver'>‹ Documentos</button>" +
      "<section class='editor-documento'>" +
        "<input id='tituloDocumento' class='titulo-nota' type='text' placeholder='Nombre del archivo' maxlength='45' value='" + protegerTexto(documento ? documento.titulo : "") + "'>" +
        "<textarea id='textoDocumento' class='contenido-documento' placeholder='Escribe el contenido del documento...' maxlength='1200'>" + protegerTexto(documento ? documento.texto : "") + "</textarea>" +
        "<button id='guardarDocumento' class='boton-principal'>Guardar documento</button>" +
      "</section>";
  } else {
    let documentosHtml = "";

    documentosGuardados.forEach(function (documento, indice) {
      documentosHtml += "<article class='tarjeta-documento'>" +
        "<div><strong>" + protegerTexto(documento.titulo) + "</strong><p>" + protegerTexto(documento.texto.slice(0, 55)) + "</p><small>" + documento.fecha + " - " + documento.tamano + "</small></div>" +
        "<div class='acciones-documento'>" +
          "<button data-editar-documento='" + indice + "'>Editar</button>" +
          "<button class='eliminar' data-eliminar-documento='" + indice + "'>Eliminar</button>" +
        "</div>" +
      "</article>";
    });

    contenido =
      "<section class='barra-documentos'><div><h3>Documentos</h3><p>Archivos editables</p></div>" +
        "<button id='nuevoDocumento' class='boton-nuevo-documento'>+</button></section>" +
      (mensajeDocumentos ? "<p class='mensaje-archivo'>" + mensajeDocumentos + "</p>" : "") +
      (documentosHtml || "<section class='tarjeta documento-vacio'><strong>No hay documentos.</strong><p>Presiona + para crear uno.</p></section>");
  }

  contenidoApp.innerHTML = "<section class='app-documentos'>" + contenido + "</section>";

  if (document.getElementById("nuevoDocumento")) {
    document.getElementById("nuevoDocumento").addEventListener("click", function () {
      documentoActual = -1;
      vistaDocumentos = "editor";
      mensajeDocumentos = "";
      dibujarDocumentos();
    });
  }

  if (document.getElementById("volverDocumentos")) {
    document.getElementById("volverDocumentos").addEventListener("click", function () {
      vistaDocumentos = "lista";
      dibujarDocumentos();
    });
  }

  if (document.getElementById("guardarDocumento")) {
    document.getElementById("guardarDocumento").addEventListener("click", function () {
      guardarDocumento();
    });
  }

  document.querySelectorAll("[data-editar-documento]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      documentoActual = Number(boton.dataset.editarDocumento);
      vistaDocumentos = "editor";
      dibujarDocumentos();
    });
  });

  document.querySelectorAll("[data-eliminar-documento]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      eliminarDocumento(Number(boton.dataset.eliminarDocumento));
    });
  });
}

/* funcion que crea o actualiza un documento. */
function guardarDocumento() {
  const titulo = document.getElementById("tituloDocumento").value.trim() || "Documento sin titulo";
  const texto = document.getElementById("textoDocumento").value.trim();
  const ahora = new Date();
  const documento = {
    titulo: titulo,
    texto: texto,
    fecha: ahora.toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
    tamano: Math.max(1, Math.ceil((titulo.length + texto.length) / 20)) + " KB"
  };

  if (documentoActual >= 0) {
    documentosGuardados[documentoActual] = documento;
    mensajeDocumentos = "Documento actualizado.";
  } else {
    documentosGuardados.unshift(documento);
    mensajeDocumentos = "Documento guardado en Archivos > En mi iPhone > Documentos.";
  }

  documentoActual = -1;
  vistaDocumentos = "lista";
  dibujarDocumentos();
}

/* funcion que envia un documento a eliminados. */
function eliminarDocumento(indice) {
  if (usuarioActivo !== "Admin") {
    mensajeDocumentos = "Acceso denegado. Invitado no puede eliminar documentos.";
    registrarAlertaSeguridad("Invitado intento eliminar un documento.");
    dibujarDocumentos();
    return;
  }

  documentosEliminados.unshift(documentosGuardados.splice(indice, 1)[0]);
  mensajeDocumentos = "Documento enviado a Eliminados recientemente.";
  dibujarDocumentos();
}

/* funcion que abre la estructura de carpetas del iPhone. */
function abrirAppArchivos() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Archivos";
  subtituloApp.textContent = "Explorar";
  dibujarArchivos();
}

/* funcion que dibuja las fotos que estan dentro de una carpeta. */
function crearListaFotosArchivos() {
  let fotosHtml = "";

  fotosCamara.forEach(function (foto, indice) {
    fotosHtml += "<button class='archivo-foto' data-foto='" + indice + "'>" +
      "<div class='vista-foto foto-" + foto.fondo + "'></div>" +
      "<div><strong>" + foto.nombre + "</strong><p>" + foto.fecha + " - " + foto.hora + "</p><small>" + foto.tamano + "</small></div>" +
      "<span>›</span>" +
    "</button>";
  });

  return fotosHtml || "<section class='tarjeta archivo-vacio'><strong>No hay fotos.</strong><p>Toma una foto desde la app Camara.</p></section>";
}

/* funcion que dibuja los documentos guardados en Archivos. */
function crearListaDocumentosArchivos() {
  let documentosHtml = "";

  documentosGuardados.forEach(function (documento) {
    documentosHtml += "<article class='archivo-documento'>" +
      "<span class='icono-documento'>&#128196;</span>" +
      "<div><strong>" + protegerTexto(documento.titulo) + "</strong><p>" + documento.fecha + "</p><small>" + documento.tamano + "</small></div>" +
    "</article>";
  });

  return documentosHtml || "<section class='tarjeta archivo-vacio'><strong>No hay documentos.</strong><p>Crea uno desde la app Documentos.</p></section>";
}

/* funcion que dibuja archivos enviados a eliminados. */
function crearListaFotosEliminadas() {
  let elementosHtml = "";

  fotosEliminadas.forEach(function (foto, indice) {
    elementosHtml += "<article class='archivo-eliminado'>" +
      "<div class='archivo-foto'>" +
        "<div class='vista-foto foto-" + foto.fondo + "'></div>" +
        "<div><strong>" + foto.nombre + "</strong><p>" + foto.fecha + " - " + foto.hora + "</p><small>" + foto.tamano + "</small></div>" +
      "</div>" +
      "<div class='acciones-eliminado'>" +
        "<button data-restaurar-foto='" + indice + "'>Restaurar</button>" +
        "<button class='eliminar' data-borrar-foto='" + indice + "'>Eliminar definitivamente</button>" +
      "</div>" +
    "</article>";
  });

  documentosEliminados.forEach(function (documento, indice) {
    elementosHtml += "<article class='archivo-eliminado'>" +
      "<div class='archivo-documento sin-borde'>" +
        "<span class='icono-documento'>&#128196;</span>" +
        "<div><strong>" + protegerTexto(documento.titulo) + "</strong><p>" + documento.fecha + "</p><small>" + documento.tamano + "</small></div>" +
      "</div>" +
      "<div class='acciones-eliminado'>" +
        "<button data-restaurar-documento='" + indice + "'>Restaurar</button>" +
        "<button class='eliminar' data-borrar-documento='" + indice + "'>Eliminar definitivamente</button>" +
      "</div>" +
    "</article>";
  });

  return elementosHtml || "<section class='tarjeta archivo-vacio'><strong>No hay archivos.</strong><p>Los archivos eliminados apareceran aqui.</p></section>";
}

/* funcion que muestra el permiso y las acciones de una foto. */
function dibujarDetalleFoto() {
  const foto = fotosCamara[fotoArchivoSeleccionada];

  if (!foto) {
    carpetaArchivosActual = "camara";
    return "";
  }

  return "<button class='ruta-volver' data-carpeta='" + carpetaAnteriorArchivo + "'>‹ Volver</button>" +
    "<section class='tarjeta detalle-archivo'>" +
      "<div class='vista-foto grande foto-" + foto.fondo + "'></div>" +
      "<h3>" + foto.nombre + "</h3>" +
      "<p>" + foto.fecha + " - " + foto.hora + " | " + foto.tamano + "</p>" +
    "</section>" +
    "<section class='tarjeta permiso-archivo'>" +
      "<h3>Permisos</h3>" +
      "<p>Usuario activo: " + usuarioActivo + ".</p>" +
      "<p>Camara puede guardar y modificar este archivo.</p>" +
      "<small>" + (usuarioActivo === "Admin" ? "Permiso para eliminar: permitido." : "Permiso para eliminar: denegado.") + "</small>" +
    "</section>" +
    "<div class='acciones-archivo'>" +
      "<button data-accion-archivo='compartir'>Compartir</button>" +
      "<button class='eliminar' data-accion-archivo='eliminar'>Eliminar</button>" +
    "</div>" +
    (mensajeArchivos ? "<p class='mensaje-archivo'>" + mensajeArchivos + "</p>" : "");
}

/* funcion que ejecuta una accion sobre la foto seleccionada. */
function manejarAccionArchivo(accion) {
  if (accion === "compartir") {
    mensajeArchivos = "Menu de compartir abierto para esta foto.";
  }

  if (accion === "eliminar") {
    if (usuarioActivo !== "Admin") {
      mensajeArchivos = "Acceso denegado. Invitado no puede eliminar fotos.";
      registrarAlertaSeguridad("Invitado intento eliminar una foto.");
      dibujarArchivos();
      return;
    }

    const fotoEliminada = fotosCamara.splice(fotoArchivoSeleccionada, 1)[0];
    fotosEliminadas.unshift(fotoEliminada);
    fotoArchivoSeleccionada = -1;
    carpetaArchivosActual = "camara";
    mensajeArchivos = "La foto fue enviada a Eliminados recientemente.";
  }

  dibujarArchivos();
}

/* funcion que restaura o borra una foto de eliminados. */
function manejarFotoEliminada(accion, indice) {
  if (usuarioActivo !== "Admin") {
    mensajeArchivos = "Acceso denegado. Invitado no puede modificar eliminados.";
    registrarAlertaSeguridad("Invitado intento modificar eliminados.");
    dibujarArchivos();
    return;
  }

  if (accion === "restaurar") {
    fotosCamara.unshift(fotosEliminadas.splice(indice, 1)[0]);
    mensajeArchivos = "La foto fue restaurada en Camara.";
  }

  if (accion === "borrar") {
    fotosEliminadas.splice(indice, 1);
    mensajeArchivos = "La foto fue eliminada definitivamente.";
  }

  dibujarArchivos();
}

/* funcion que restaura o borra un documento eliminado. */
function manejarDocumentoEliminado(accion, indice) {
  if (usuarioActivo !== "Admin") {
    mensajeArchivos = "Acceso denegado. Invitado no puede modificar eliminados.";
    registrarAlertaSeguridad("Invitado intento modificar eliminados.");
    dibujarArchivos();
    return;
  }

  if (accion === "restaurar") {
    documentosGuardados.unshift(documentosEliminados.splice(indice, 1)[0]);
    mensajeArchivos = "Documento restaurado en En mi iPhone.";
  }

  if (accion === "borrar") {
    documentosEliminados.splice(indice, 1);
    mensajeArchivos = "Documento eliminado definitivamente.";
  }

  dibujarArchivos();
}

/* funcion que dibuja la carpeta en la que se encuentra el usuario. */
function dibujarArchivos() {
  let contenido = "";

  if (carpetaArchivosActual === "inicio") {
    contenido =
      "<div class='buscador-archivos'>&#128269; Buscar</div>" +
      "<h3 class='titulo-grupo-archivos'>Favoritos</h3>" +
      "<section class='grupo-archivos'>" +
        "<button class='fila-carpeta' data-carpeta='descargas'><span class='icono-carpeta'>&#11015;</span><div><strong>Descargas</strong><p>0 elementos</p></div><span>›</span></button>" +
        "<button class='fila-carpeta' data-carpeta='camara'><span class='icono-carpeta'>&#128247;</span><div><strong>Camara</strong><p>" + fotosCamara.length + " foto(s)</p></div><span>›</span></button>" +
      "</section>" +
      "<h3 class='titulo-grupo-archivos'>Ubicaciones</h3>" +
      "<section class='grupo-archivos'>" +
        "<button class='fila-carpeta' data-carpeta='icloud'><span class='icono-carpeta nube'>&#9729;</span><div><strong>iCloud Drive</strong><p>Sin archivos recientes</p></div><span>›</span></button>" +
        "<button class='fila-carpeta' data-carpeta='iphone'><span class='icono-carpeta'>&#128241;</span><div><strong>En mi iPhone</strong><p>Archivos guardados localmente</p></div><span>›</span></button>" +
        "<button class='fila-carpeta' data-carpeta='eliminados'><span class='icono-carpeta protegido'>&#128465;</span><div><strong>Eliminados recientemente</strong><p>" + (fotosEliminadas.length + documentosEliminados.length) + " elemento(s)</p></div><span>›</span></button>" +
      "</section>" +
      "<h3 class='titulo-grupo-archivos'>Etiquetas</h3>" +
      "<section class='grupo-archivos'>" +
        "<div class='fila-etiqueta'><span class='punto-etiqueta rojo'></span><strong>Rojo</strong><span>›</span></div>" +
        "<div class='fila-etiqueta'><span class='punto-etiqueta naranja'></span><strong>Naranja</strong><span>›</span></div>" +
        "<div class='fila-etiqueta'><span class='punto-etiqueta amarillo'></span><strong>Amarillo</strong><span>›</span></div>" +
        "<div class='fila-etiqueta'><span class='punto-etiqueta verde'></span><strong>Verde</strong><span>›</span></div>" +
        "<div class='fila-etiqueta'><span class='punto-etiqueta azul'></span><strong>Azul</strong><span>›</span></div>" +
        "<div class='fila-etiqueta'><span class='punto-etiqueta morado'></span><strong>Morado</strong><span>›</span></div>" +
        "<div class='fila-etiqueta'><span class='punto-etiqueta gris'></span><strong>Gris</strong><span>›</span></div>" +
        "<div class='fila-etiqueta'><span class='punto-etiqueta personal'></span><strong>Trabajo</strong><span>›</span></div>" +
        "<div class='fila-etiqueta'><span class='punto-etiqueta personal'></span><strong>Inicio</strong><span>›</span></div>" +
        "<div class='fila-etiqueta'><span class='punto-etiqueta personal'></span><strong>Importante</strong><span>›</span></div>" +
      "</section>";
  } else if (carpetaArchivosActual === "iphone") {
    contenido =
      "<button class='ruta-volver' data-carpeta='inicio'>‹ Explorar</button>" +
      "<section class='tarjeta cabecera-archivos'><h3>En mi iPhone</h3><p>Carpetas</p></section>" +
      "<button class='fila-carpeta' data-carpeta='camara'><span class='icono-carpeta'>&#128193;</span><div><strong>Camara</strong><p>" + fotosCamara.length + " foto(s)</p></div><span>›</span></button>" +
      "<button class='fila-carpeta' data-carpeta='documentos'><span class='icono-carpeta'>&#128193;</span><div><strong>Documentos</strong><p>" + documentosGuardados.length + " archivo(s)</p></div><span>›</span></button>" +
      "<button class='fila-carpeta' data-carpeta='descargas'><span class='icono-carpeta'>&#128193;</span><div><strong>Descargas</strong><p>0 elementos</p></div><span>›</span></button>" +
      "<button class='fila-carpeta' data-carpeta='protegidos'><span class='icono-carpeta protegido'>&#128274;</span><div><strong>Datos de apps protegidos</strong><p>Notas y datos privados</p></div><span>›</span></button>";
  } else if (carpetaArchivosActual === "camara") {
    contenido =
      "<button class='ruta-volver' data-carpeta='inicio'>‹ Explorar</button>" +
      "<section class='tarjeta cabecera-archivos'><h3>Camara</h3><p>Fotos tomadas en el simulador</p></section>" +
      (mensajeArchivos ? "<p class='mensaje-archivo'>" + mensajeArchivos + "</p>" : "") +
      crearListaFotosArchivos();
  } else if (carpetaArchivosActual === "documentos") {
    contenido =
      "<button class='ruta-volver' data-carpeta='iphone'>‹ En mi iPhone</button>" +
      "<section class='tarjeta cabecera-archivos'><h3>Documentos</h3><p>Archivos creados desde la app</p></section>" +
      crearListaDocumentosArchivos();
  } else if (carpetaArchivosActual === "detalle") {
    contenido = dibujarDetalleFoto();
  } else if (carpetaArchivosActual === "protegidos") {
    contenido =
      "<button class='ruta-volver' data-carpeta='iphone'>‹ En mi iPhone</button>" +
      "<section class='tarjeta carpeta-protegida'>" +
        "<span>&#128274;</span>" +
        "<h3>Acceso restringido</h3>" +
        "<p>Las notas pertenecen al almacenamiento privado de la app Notas.</p>" +
        "<small>Permiso denegado: Archivos no puede leer estos datos.</small>" +
      "</section>";
  } else if (carpetaArchivosActual === "eliminados") {
    contenido =
      "<button class='ruta-volver' data-carpeta='inicio'>‹ Explorar</button>" +
      "<section class='tarjeta cabecera-archivos'><h3>Eliminados recientemente</h3><p>Archivos que puedes recuperar o borrar</p></section>" +
      (mensajeArchivos ? "<p class='mensaje-archivo'>" + mensajeArchivos + "</p>" : "") +
      crearListaFotosEliminadas();
  } else {
    const esIcloud = carpetaArchivosActual === "icloud";
    contenido =
      "<button class='ruta-volver' data-carpeta='inicio'>‹ Explorar</button>" +
      "<section class='tarjeta carpeta-informativa'>" +
        "<span>" + (esIcloud ? "&#9729;" : "&#128193;") + "</span>" +
        "<h3>" + (esIcloud ? "iCloud Drive" : "Descargas") + "</h3>" +
        "<p>No hay archivos en esta ubicacion.</p>" +
        "<small>Permiso: lectura y escritura permitidas.</small>" +
      "</section>";
  }

  contenidoApp.innerHTML = "<section class='explorador-archivos'>" + contenido + "</section>";

  document.querySelectorAll("[data-carpeta]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      carpetaArchivosActual = boton.dataset.carpeta;
      mensajeArchivos = "";
      dibujarArchivos();
    });
  });

  document.querySelectorAll("[data-foto]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      fotoArchivoSeleccionada = Number(boton.dataset.foto);
      carpetaAnteriorArchivo = carpetaArchivosActual;
      carpetaArchivosActual = "detalle";
      mensajeArchivos = "";
      dibujarArchivos();
    });
  });

  document.querySelectorAll("[data-accion-archivo]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      manejarAccionArchivo(boton.dataset.accionArchivo);
    });
  });

  document.querySelectorAll("[data-restaurar-foto]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      manejarFotoEliminada("restaurar", Number(boton.dataset.restaurarFoto));
    });
  });

  document.querySelectorAll("[data-borrar-foto]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      manejarFotoEliminada("borrar", Number(boton.dataset.borrarFoto));
    });
  });

  document.querySelectorAll("[data-restaurar-documento]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      manejarDocumentoEliminado("restaurar", Number(boton.dataset.restaurarDocumento));
    });
  });

  document.querySelectorAll("[data-borrar-documento]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      manejarDocumentoEliminado("borrar", Number(boton.dataset.borrarDocumento));
    });
  });
}

/* funcion que muestra los dispositivos conectables. */
function abrirAppEntradaSalida() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Dispositivos";
  subtituloApp.textContent = "Conexiones";
  dibujarEntradaSalida();
}

/* funcion que dibuja cada dispositivo y el proceso que lo atiende. */
function dibujarEntradaSalida() {
  let dispositivosHtml = "";

  dispositivosEntradaSalida.forEach(function (dispositivo) {
    const estado = dispositivo.conectado ? "Conectado" : "Desconectado";
    const claseEstado = dispositivo.conectado ? "conectado" : "desconectado";
    const accion = dispositivo.conectado ? "Desconectar" : "Conectar";

    dispositivosHtml += "<article class='fila-dispositivo'>" +
      "<span class='icono-dispositivo'>" + dispositivo.icono + "</span>" +
      "<div><strong>" + dispositivo.nombre + "</strong><p>" + dispositivo.tipo + "</p>" +
      "<small>Controlador: " + dispositivo.proceso + "</small></div>" +
      "<span class='estado-dispositivo " + claseEstado + "'>" + estado + "</span>" +
      "<button class='boton-conexion' data-dispositivo='" + dispositivo.id + "'>" + accion + "</button>" +
    "</article>";
  });

  contenidoApp.innerHTML =
    "<section class='tarjeta'>" +
      "<h3>Dispositivos</h3>" +
      "<p class='alerta'>" + mensajeEntradaSalida + "</p>" +
    "</section>" +
    "<section class='lista-vertical'>" + dispositivosHtml + "</section>" +
    "<section class='tarjeta'>" +
      "<h3>Controladores</h3>" +
      "<p class='texto-dispositivo'>Cuando conectas un dispositivo, su proceso aparece activo en la app Procesos.</p>" +
    "</section>";

  document.querySelectorAll("[data-dispositivo]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      cambiarConexionDispositivo(boton.dataset.dispositivo);
    });
  });
}

/* funcion que conecta o desconecta un dispositivo simulado. */
function cambiarConexionDispositivo(idDispositivo) {
  const dispositivo = dispositivosEntradaSalida.find(function (item) {
    return item.id === idDispositivo;
  });

  if (!dispositivo) {
    return;
  }

  dispositivo.conectado = !dispositivo.conectado;

  if (dispositivo.conectado) {
    mensajeEntradaSalida = dispositivo.nombre + " conectado. " + dispositivo.proceso + " lo reconocio.";
  } else {
    mensajeEntradaSalida = dispositivo.nombre + " desconectado.";
  }

  dibujarEntradaSalida();
}

/* funcion que muestra las apps abiertas recientemente. */
function abrirAppsRecientes() {
  tituloApp.textContent = "Recientes";
  subtituloApp.textContent = "Multitarea";
  dibujarAppsRecientes();
}

/* funcion que dibuja y permite cerrar apps recientes. */
function dibujarAppsRecientes() {
  let recientesHtml = "";

  appsRecientes.forEach(function (idApp) {
    const estado = obtenerEstadoApp(idApp);
    const memoria = obtenerMemoriaApp(idApp, estado);

    recientesHtml += "<article class='tarjeta-reciente'><div><strong>" + obtenerNombreApp(idApp) + "</strong><p>" + estado + " - " + memoria + " MB</p></div>" +
      "<button class='boton-cerrar-reciente' data-cerrar-reciente='" + idApp + "'>Cerrar</button></article>";
  });

  contenidoApp.innerHTML = "<section class='tarjeta'><h3>Apps recientes</h3><p class='alerta'>Cierra una app para liberar memoria.</p></section>" +
    "<section class='lista-vertical'>" + (recientesHtml || "<article class='tarjeta'><strong>No hay apps abiertas.</strong></article>") + "</section>";

  document.querySelectorAll("[data-cerrar-reciente]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      cerrarAppReciente(boton.dataset.cerrarReciente);
    });
  });
}

/* funcion que elimina una app del historial reciente. */
function cerrarAppReciente(idApp) {
  appsRecientes = appsRecientes.filter(function (app) {
    return app !== idApp;
  });

  if (appActual === idApp) {
    appActual = null;
  }

  actualizarMemoriaVirtual();
  dibujarAppsRecientes();
}
/* funcion que muestra la app de procesos del sistema. */
function abrirAppProcesos() {
  tituloApp.textContent = "Procesos";
  subtituloApp.textContent = "CPU y planificador";
  cicloProcesoTemporal = 0;
  procesoTemporal.estado = "Nuevo";
  procesoEnCpu = "Preparando CPU";
  turnoPlanificador = 0;
  turnosCpuProcesos = {};
  subtareasCamara.forEach(function (subtarea) {
    subtarea.estado = "Listo";
    subtarea.turnos = 0;
  });
  actualizarProcesosSistema();
  dibujarProcesos();

  clearInterval(intervaloProcesos);
  intervaloProcesos = setInterval(function () {
    actualizarProcesosSistema();
    dibujarProcesos();
  }, 1200);
}

/* funcion que dibuja los procesos en la pantalla. */
function dibujarProcesos() {
  let procesosHtml = "";
  let subtareasHtml = "";

  procesosSistema.forEach(function (proceso) {
    const dispositivosActivos = dispositivosEntradaSalida.filter(function (dispositivo) {
      return dispositivo.conectado && dispositivo.proceso === proceso.nombre;
    }).map(function (dispositivo) {
      return dispositivo.nombre;
    }).join(", ");

    const informacionDispositivo = dispositivosActivos ? " - Atiende: " + dispositivosActivos : "";

    procesosHtml += "<article class='fila-proceso'>" +
      "<div><strong>" + proceso.nombre + "</strong><p>" + proceso.descripcion + "</p></div>" +
      "<span class='estado-proceso " + claseEstadoProceso(proceso.estado) + "'>" + proceso.estado + "</span>" +
      "<small>Prioridad " + proceso.prioridad + " - " + proceso.memoria + " MB - Turnos CPU " + (turnosCpuProcesos[proceso.nombre] || 0) + informacionDispositivo + "</small>" +
    "</article>";
  });

  subtareasCamara.forEach(function (subtarea) {
    subtareasHtml += "<article class='fila-subtarea'>" +
      "<div><strong>" + subtarea.nombre + "</strong><p>" + subtarea.descripcion + "</p></div>" +
      "<span class='estado-proceso " + claseEstadoProceso(subtarea.estado) + "'>" + subtarea.estado + "</span>" +
      "<small>Turnos recibidos: " + subtarea.turnos + "</small>" +
    "</article>";
  });

  let appsHtml = "";

  appsRecientes.forEach(function (idApp, indice) {
    const estadoApp = obtenerEstadoApp(idApp);
    const memoriaApp = obtenerMemoriaApp(idApp, estadoApp);
    const claseEstado = estadoApp === "Memoria virtual" ? " virtual" : "";

    appsHtml += "<article class='fila-proceso'>" +
      "<div><strong>" + obtenerNombreApp(idApp) + "</strong><p>App reciente del usuario</p></div>" +
      "<span class='estado-proceso" + claseEstado + "'>" + estadoApp + "</span>" +
      "<small>Prioridad " + (indice + 4) + " - " + memoriaApp + " MB</small>" +
    "</article>";
  });

  if (appsHtml === "") {
    appsHtml = "<article class='fila-proceso'><div><strong>Sin apps recientes</strong><p>Abre una app para verla aqui</p></div><span class='estado-proceso listo'>Listo</span></article>";
  }

  contenidoApp.innerHTML =
    "<section class='tarjeta'>" +
      "<p class='alerta'>Los estados cambian automaticamente.</p>" +
      "<div class='cpu-actual'><small>CPU actual</small><strong>" + procesoEnCpu + "</strong></div>" +
      "<div class='dato-planificador'><strong>Prioridad atendida: " + prioridadCpuActual + "</strong><p>" + explicacionPlanificador + "</p></div>" +
      "<div class='leyenda-estados'><span class='nuevo'>Nuevo</span><span class='listo'>Listo</span><span class='ejecucion'>Ejecucion</span><span class='bloqueado'>Bloqueado</span><span class='terminado'>Terminado</span></div>" +
    "</section>" +
    "<section class='tarjeta'><h3>Procesos del sistema</h3></section>" +
    "<section class='lista-vertical'>" + procesosHtml + "</section>" +
    "<section class='tarjeta'><h3>Subtareas de Camara</h3><p class='alerta'>Una app se divide en tareas que reciben turnos de CPU.</p></section>" +
    "<section class='lista-vertical'>" + subtareasHtml + "</section>" +
    "<section class='tarjeta'><h3>Proceso temporal</h3><p class='alerta'>Este proceso muestra el ciclo completo desde que inicia hasta que termina.</p></section>" +
    "<section class='lista-vertical'><article class='fila-proceso'><div><strong>" + procesoTemporal.nombre + "</strong><p>" + procesoTemporal.descripcion + "</p></div><span class='estado-proceso " + claseEstadoProceso(procesoTemporal.estado) + "'>" + procesoTemporal.estado + "</span><small>Prioridad " + procesoTemporal.prioridad + " - " + procesoTemporal.memoria + " MB</small></article></section>" +
    "<section class='tarjeta'><h3>Apps recientes</h3><p class='alerta'>Las apps abiertas permanecen en segundo plano o memoria virtual.</p></section>" +
    "<section class='lista-vertical'>" + appsHtml + "</section>";
}
/* función que muestra la memoria interna del simulador. */
function abrirAppDiagnostico() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Diagnostico";
  subtituloApp.textContent = "Memoria RAM";

  let ramTotal = 6144;
  let virtualTotal = 2048;
  let ramUsada = 0;
  let virtualUsada = 0;

  /* calcula RAM y memoria virtual con procesos y apps recientes. */
  let procesosHtml = "";
  let marcosHtml = "";
  let paginasHtml = "";
  let ordenLruHtml = "";

  procesosSistema.forEach(function (proceso) {
    ramUsada += proceso.memoria;

    procesosHtml += "<article class='fila-proceso'>" +
      "<div><strong>" + proceso.nombre + "</strong><p>RAM usada por el proceso</p></div>" +
      "<span class='estado-proceso'>" + proceso.memoria + " MB</span>" +
      "<small>Prioridad " + proceso.prioridad + " - Estado " + proceso.estado + "</small>" +
    "</article>";
  });

  /* separa las apps que consumen RAM de las que usan memoria virtual. */
  appsRecientes.forEach(function (idApp) {
    const estado = obtenerEstadoApp(idApp);
    const memoria = obtenerMemoriaApp(idApp, estado);

    if (estado === "Memoria virtual") {
      virtualUsada += memoria;
    } else {
      ramUsada += memoria;
    }

  });

  appsRecientes.forEach(function (idApp, indice) {
    const clase = appsEnMemoriaVirtual.includes(idApp) ? " virtual" : "";
    const texto = indice === 0 ? "Mas reciente" : "Uso " + (indice + 1);

    ordenLruHtml += "<span class='chip-lru" + clase + "'>" + texto + ": " + obtenerNombreApp(idApp) + "</span>";
  });

  for (let marco = 0; marco < marcosRamApps; marco++) {
    const idApp = appsRecientes[marco];

    if (idApp) {
      const estado = obtenerEstadoApp(idApp);
      const memoria = obtenerMemoriaApp(idApp, estado);

      marcosHtml += "<article class='marco-memoria ocupado'>" +
        "<small>Marco RAM " + (marco + 1) + "</small>" +
        "<strong>" + obtenerNombreApp(idApp) + "</strong>" +
        "<p>" + estado + " - " + memoria + " MB</p>" +
      "</article>";
    } else {
      marcosHtml += "<article class='marco-memoria libre'>" +
        "<small>Marco RAM " + (marco + 1) + "</small>" +
        "<strong>Libre</strong>" +
      "</article>";
    }
  }

  appsEnMemoriaVirtual.forEach(function (idApp, indice) {
    const memoria = obtenerMemoriaApp(idApp, "Memoria virtual");

    paginasHtml += "<article class='pagina-virtual'>" +
      "<small>Pagina " + (indice + 1) + "</small>" +
      "<strong>" + obtenerNombreApp(idApp) + "</strong>" +
      "<p>" + memoria + " MB</p>" +
    "</article>";
  });

  contenidoApp.innerHTML =
    "<section class='tarjeta'>" +
      "<h3>Monitor de memoria</h3>" +
      "<p class='texto-memoria'>RAM fisica: " + ramUsada + " MB / " + ramTotal + " MB (6 GB)</p>" +
      "<div class='barra-almacenamiento'><span style='width:" + ((ramUsada / ramTotal) * 100) + "%; background:#0a84ff'></span></div>" +
      "<p class='texto-memoria'>Memoria virtual: " + virtualUsada + " MB / " + virtualTotal + " MB</p>" +
      "<div class='barra-almacenamiento'><span style='width:" + ((virtualUsada / virtualTotal) * 100) + "%; background:#ff9f0a'></span></div>" +
    "</section>" +
    "<section class='tarjeta politica-lru'>" +
      "<h3>Politica LRU</h3>" +
      "<p class='alerta'>La RAM guarda 3 apps recientes. Al abrir otra, la menos usada pasa a memoria virtual.</p>" +
      "<div class='orden-lru'>" + (ordenLruHtml || "<span class='chip-lru'>Sin apps abiertas</span>") + "</div>" +
      "<p class='evento-lru'>" + eventoLru + "</p>" +
    "</section>" +
    "<section class='tarjeta'><h3>Marcos de RAM</h3><div class='mapa-marcos'>" + marcosHtml + "</div></section>" +
    "<section class='tarjeta'><h3>Paginacion</h3><p class='texto-memoria'>Apps movidas desde RAM a almacenamiento virtual.</p>" +
      "<div class='mapa-paginas'>" + (paginasHtml || "<p class='pagina-vacia'>No hay paginas virtuales.</p>") + "</div></section>" +
    "<section class='tarjeta'><h3>Procesos del sistema</h3></section>" +
    "<section class='lista-vertical'>" + procesosHtml + "</section>";
}
/* función que muestra la tienda para instalar apps. */
function abrirAppStore() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "App Store";
  subtituloApp.textContent = "Instalar apps";
  dibujarAppStore();
}

/* función que dibuja las apps de la tienda. */
function dibujarAppStore() {
  let appsHtml = "";

  appsTienda.forEach(function (app) {
    const instalada = appsInstaladas.includes(app.id);
    const cargando = appsCargando[app.id];
    const progreso = cargando ? "<div class='progreso-tienda'><span></span></div>" : "";
    let botones = "";

    /* cambia los botones segun el estado de la app. */
    if (cargando) {
      botones = "<button class='boton-gris' disabled>" + cargando + "</button>";
    } else if (instalada) {
      botones = "<div class='acciones-tienda'>" +
        "<button class='boton-principal' data-actualizar='" + app.id + "'>Actualizar</button>" +
        "<button class='boton-gris' data-instalar='" + app.id + "'>Eliminar</button>" +
      "</div>";
    } else {
      botones = "<button class='boton-principal' data-instalar='" + app.id + "'>Obtener</button>";
    }

    appsHtml += "<article class='fila-tienda'>" +
      "<span class='icono-tienda' style='background:" + app.color + "'>" + app.nombre.charAt(0) + "</span>" +
      "<div><strong>" + app.nombre + "</strong><p>" + app.gb + " GB</p>" + progreso + "</div>" +
      botones +
    "</article>";
  });

  contenidoApp.innerHTML =
    "<section class='tarjeta'>" +
      "<h3>App Store</h3>" +
      "<p class='alerta'>Al instalar o desinstalar apps cambia el almacenamiento en Ajustes.</p>" +
    "</section>" +
    "<section class='lista-vertical'>" + appsHtml + "</section>";

  document.querySelectorAll("[data-instalar]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      iniciarCambioInstalacion(boton.dataset.instalar);
    });
  });

  document.querySelectorAll("[data-actualizar]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      actualizarApp(boton.dataset.actualizar);
    });
  });
}

/* función que simula el proceso de instalar o desinstalar. */
function iniciarCambioInstalacion(idApp) {
  const instalada = appsInstaladas.includes(idApp);
  appsCargando[idApp] = instalada ? "Eliminando..." : "Instalando...";
  dibujarAppStore();

    /* espera para simular el tiempo de descarga o eliminacion. */
  setTimeout(function () {
    cambiarInstalacionApp(idApp);
    delete appsCargando[idApp];
    dibujarAppsInstaladasInicio();
    dibujarAppStore();
  }, 1400);
}

/* función que simula una actualización de la app. */
function actualizarApp(idApp) {
  appsCargando[idApp] = "Actualizando...";
  dibujarAppStore();

    /* la actualizacion conserva la app instalada. */
  setTimeout(function () {
    delete appsCargando[idApp];
    dibujarAppStore();
  }, 1400);
}

/* función que instala o desinstala una app. */
function cambiarInstalacionApp(idApp) {
  if (appsInstaladas.includes(idApp)) {
    appsInstaladas = appsInstaladas.filter(function (app) {
      return app !== idApp;
    });
    appsRecientes = appsRecientes.filter(function (app) {
      return app !== idApp;
    });
    actualizarMemoriaVirtual();
  } else {
    appsInstaladas.push(idApp);
  }
}
/* función que calcula el almacenamiento actual. */
function calcularAlmacenamiento() {
  let appsGb = appsBaseGb;
  let categorias = [];
  let usado = 0;

    /* suma el espacio de cada app descargada. */
  appsInstaladas.forEach(function (idApp) {
    const app = appsTienda.find(function (appTienda) {
      return appTienda.id === idApp;
    });

    if (app) {
      appsGb += app.gb;
    }
  });

  categorias.push({ nombre: "Apps", gb: appsGb, color: "#0a84ff" });

  almacenamientoBase.forEach(function (categoria) {
    categorias.push(categoria);
  });

  categorias.forEach(function (categoria) {
    usado += categoria.gb;
  });

  categorias.push({ nombre: "Libre", gb: capacidadTotal - usado, color: "#d7dce5" });

  return categorias;
}

/* función que muestra las opciones principales de Ajustes. */
function abrirAppAjustes() {
  clearInterval(intervaloProcesos);
  tituloApp.textContent = "Ajustes";
  subtituloApp.textContent = "iPhone";

  contenidoApp.innerHTML =
    "<section class='lista-ajustes'>" +
      "<article class='fila-ajuste perfil-ajuste'><div><strong>Admin</strong><p>Cuenta de Apple, iCloud+ y más.</p></div></article>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste naranja'>✈️</span>Modo de vuelo</div><strong class='switch-ajuste'></strong></article>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste azul'>📶</span>WiFi</div><strong>IZZI-C3CE</strong></article>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste azul'>🔵</span>Bluetooth</div><strong>Activado</strong></article>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste verde'>📡</span>Red celular</div><strong></strong></article>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste verde'>🔗</span>Compartir Internet</div><strong></strong></article>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste verde'>🔋</span>Bateria</div><strong></strong></article>" +
      "<button class='fila-ajuste boton-ajuste' id='abrirGeneral'><div><span class='icono-ajuste gris'>⚙️</span>General</div><strong></strong></button>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste azul'>🔒</span>Privacidad y seguridad</div><strong>Codigo activo</strong></article>" +
    "</section>";

  document.getElementById("abrirGeneral").addEventListener("click", function () {
    abrirGeneral();
  });
}


/* función que muestra las opciones de General. */
function abrirGeneral() {
  tituloApp.textContent = "General";
  subtituloApp.textContent = "Configuracion";

  contenidoApp.innerHTML =
    "<section class='lista-ajustes'>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste gris'>ℹ️</span>Informacion</div><strong></strong></article>" +
      "<article class='fila-ajuste'><div><span class='icono-ajuste gris'>🔄</span>Actualizacion de hardware</div><strong></strong></article>" +
      "<button class='fila-ajuste boton-ajuste' id='abrirAlmacenamiento'><div><span class='icono-ajuste gris'>💾</span>Almacenamiento del iPhone</div><strong></strong></button>" +
    "</section>";

  document.getElementById("abrirAlmacenamiento").addEventListener("click", function () {
    abrirAlmacenamiento();
  });
}
/* función que muestra el detalle de almacenamiento. */
function abrirAlmacenamiento() {
  tituloApp.textContent = "Almacenamiento";
  subtituloApp.textContent = "iPhone";

  let total = capacidadTotal;
  let usado = 0;
  let barras = "";
  let detalles = "";
    /* obtiene el espacio actualizado de las apps instaladas. */
  const almacenamientoActual = calcularAlmacenamiento();

  almacenamientoActual.forEach(function (categoria) {
    if (categoria.nombre !== "Libre") {
      usado += categoria.gb;
    }
  });

  almacenamientoActual.forEach(function (categoria) {
    const porcentaje = (categoria.gb / total) * 100;

    barras += "<span style='width:" + porcentaje + "%; background:" + categoria.color + "'></span>";

    detalles += "<article class='fila-almacenamiento'>" +
      "<div><span class='punto-almacenamiento' style='background:" + categoria.color + "'></span>" + categoria.nombre + "</div>" +
      "<strong>" + categoria.gb.toFixed(1) + " GB</strong>" +
    "</article>";
  });

  contenidoApp.innerHTML =
    "<section class='tarjeta'>" +
      "<h3>Almacenamiento del iPhone</h3>" +
      "<p class='alerta'>Capacidad: " + total + " GB. Usado: " + usado.toFixed(1) + " GB. Disponible: " + (total - usado).toFixed(1) + " GB.</p>" +
      "<div class='barra-almacenamiento'>" + barras + "</div>" +
    "</section>" +
    "<section class='lista-vertical'>" + detalles + "</section>";
}

/* función que regresa de una app a la pantalla de inicio. */
function volverInicio() {
  appActual = null;
  document.getElementById("vistaApp").classList.remove("pantalla-activa");
  document.getElementById("pantallaInicio").classList.add("pantalla-activa");
  barraEstadoClara();
  clearInterval(intervaloProcesos);
}

/* función que bloquea nuevamente el celular desde la pantalla de inicio. */
function bloquearCelular() {
  appActual = null;
  clearInterval(intervaloProcesos);
  document.getElementById("pantallaInicio").classList.remove("pantalla-activa");
  document.getElementById("vistaApp").classList.remove("pantalla-activa");
  document.getElementById("pantallaBloqueo").classList.add("pantalla-activa");
  barraEstadoClara();

  pinIngresado = "";
  actualizarPuntosPin();
  celularBloqueado = false;
  tiempoBloqueo = 0;

  mensajeDesbloqueo.textContent = "PIN demo: 1234";
  mensajeBloqueoTemporal.textContent = "";
}

/* 
  Eventos del teclado numérico.
*/
botonesTeclado.forEach(function (boton) {
  boton.addEventListener("click", function () {
    manejarTeclaPin(boton.dataset.tecla);
  });
});

/* Eventos de las apps del inicio. */
botonesApps.forEach(function (boton) {
  boton.addEventListener("click", function () {
    abrirApp(boton.dataset.app);
  });
});

/* Evento para regresar al inicio desde una app. */
botonVolverInicio.addEventListener("click", function () {
  volverInicio();
});

/* Evento para cerrar una app y regresar al inicio. */
botonCerrarApp.addEventListener("click", function () {
  volverInicio();
});

/* Evento del botón Lock para volver a bloquear el celular. */
botonBloquear.addEventListener("click", function () {
  bloquearCelular();
});


/*  reloj en tiempo real. */
dibujarAppsInstaladasInicio();
actualizarReloj();
setInterval(actualizarReloj, 1000);
