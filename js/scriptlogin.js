const usuarios = [
    {usuario: "admin",clave: "admin123",nombre: "Administrador",rol: "admin"},
    {usuario: "cliente",clave: "1234",nombre: "Cliente",rol: "cliente"},
    {usuario: "maria",clave: "maria2026",nombre: "Maria Quispe",rol: "cliente"},
    {usuario: "drsetso",clave: "SetsoEsClave",nombre: "Maquina Setso", rol: "cliente"}
];
const CLAVE_SESION = "sesionBuenSabor";
const formulario = document.getElementById("formLogin");
const usuarioInput = document.getElementById("usuario");
const claveInput = document.getElementById("clave");
const mensaje = document.getElementById("mensaje");
const botonVer = document.getElementById("verClave");
// LEER SESION GUARDADA
function leerSesionGuardada() {
    try {
        const sesion = JSON.parse(sessionStorage.getItem(CLAVE_SESION));
        if (sesion && sesion.nombre && sesion.rol) {
            return sesion;
        }
    } catch (error) { }
    try {
        const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION));
        if (sesion && sesion.nombre && sesion.rol) {
            return sesion;
        }
    } catch (error) { }
    return null;
}
// SI YA EXISTE UNA SESION, ENTRAR AL MENU
if (leerSesionGuardada()) {
    window.location.replace(
        new URL("pages/catalogo.html", document.baseURI).href
    );
}
// MOSTRAR Y OCULTAR CONTRASEÑA
botonVer.addEventListener("click", function() {
    const mostrar = claveInput.type === "password";
    claveInput.type = mostrar ? "text" : "password";
    botonVer.textContent = mostrar ? "Ocultar" : "Ver";
    botonVer.setAttribute(
        "aria-label",
        mostrar ? "Ocultar contraseña" : "Mostrar contraseña"
    );
});
// COMPROBAR LOS DATOS
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();
    mensaje.classList.remove("ok");
    const usuario = usuarioInput.value.trim().toLowerCase();
    const clave = claveInput.value;
    if (!usuario || !clave) {
        mensaje.textContent = "Escribe tu usuario y tu contraseña.";
        return;
    }
    const encontrado = usuarios.find(function(persona) {
        return persona.usuario === usuario &&
               persona.clave === clave;
    });
    if (!encontrado) {
        mensaje.textContent = "Los datos no son correctos. Inténtalo otra vez.";
        claveInput.value = "";
        claveInput.focus();
        return;
    }
    // CREAR SESION
    const sesion = {
        nombre: encontrado.nombre,
        rol: encontrado.rol
    };
    let sesionGuardada = false;
    // GUARDAR EN SESSION STORAGE
    try {
        sessionStorage.setItem(
            CLAVE_SESION,
            JSON.stringify(sesion)
        );
        sesionGuardada = true;
    } catch (error) { }
    // RESPALDO CON LOCAL STORAGE
    if (!sesionGuardada) {
        try {
            localStorage.setItem(
                CLAVE_SESION,
                JSON.stringify(sesion)
            );
            sesionGuardada = true;
        } catch (error) { }
    }
    mensaje.classList.add("ok");
    mensaje.textContent = "Ingreso correcto. Abriendo el menú...";
    // DIRECCION DEL CATALOGO
    const destino = new URL(
        "pages/catalogo.html",
        document.baseURI
    );
    // ULTIMO RESPALDO SI EL NAVEGADOR BLOQUEA EL ALMACENAMIENTO
    if (!sesionGuardada) {
        destino.searchParams.set("nombre", sesion.nombre);
        destino.searchParams.set("rol", sesion.rol);
    }
    setTimeout(function() {
        window.location.assign(destino.href);
    }, 350);
});