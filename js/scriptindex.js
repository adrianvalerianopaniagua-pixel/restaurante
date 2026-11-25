// PROTECCION DE LA PAGINA
const CLAVE_SESION = "sesionBuenSabor";
let sesion = null;
// REVISAR SESSION STORAGE
try {
    sesion = JSON.parse(
        sessionStorage.getItem(CLAVE_SESION)
    );
} catch (error) { }
// REVISAR LOCAL STORAGE
if (!sesion) {
    try {
        sesion = JSON.parse(
            localStorage.getItem(CLAVE_SESION)
        );
    } catch (error) { }
}
// ULTIMO RESPALDO DE LA SESION
if (!sesion) {
    const parametros = new URLSearchParams(
        window.location.search
    );
    const nombre = parametros.get("nombre");
    const rol = parametros.get("rol");
    if (nombre && (rol === "admin" || rol === "cliente")) {
        sesion = {
            nombre: nombre,
            rol: rol
        };
        try {
            sessionStorage.setItem(
                CLAVE_SESION,
                JSON.stringify(sesion)
            );
        } catch (error) { }
    }
}
// SI NO EXISTE SESION, VOLVER AL LOGIN
if (!sesion || !sesion.nombre || !sesion.rol) {
    window.location.replace("../index.html");
    sesion = {
        nombre: "Invitado",
        rol: "cliente"
    };
}
// PRODUCTOS DEL MENU
const productos = [
    {
        id: 1,
        nombre: "Pollo broaster",
        categoria: "pollo",
        descripcion: "Pollo dorado y crujiente, preparado al momento.",
        imagen: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=85",
        etiqueta: "Favorito",
        tamanos: [
            { nombre: "Pequeña", precio: 25 },
            { nombre: "Mediana", precio: 38 },
            { nombre: "Grande", precio: 50 }
        ]
    },
    {
        id: 2,
        nombre: "Alitas broaster",
        categoria: "pollo",
        descripcion: "Alitas crocantes para compartir.",
        imagen: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=85",
        etiqueta: "Crujientes",
        tamanos: [
            { nombre: "Pequeña", precio: 22 },
            { nombre: "Mediana", precio: 32 },
            { nombre: "Grande", precio: 45 }
        ]
    },
    {
        id: 3,
        nombre: "Nuggets de pollo",
        categoria: "pollo",
        descripcion: "Bocaditos de pollo con cubierta doradita.",
        imagen: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=85",
        etiqueta: "Para picar",
        tamanos: [
            { nombre: "Pequeña", precio: 18 },
            { nombre: "Mediana", precio: 28 },
            { nombre: "Grande", precio: 38 }
        ]
    },
    {
        id: 4,
        nombre: "Combo familiar",
        categoria: "combos",
        descripcion: "Una opción para compartir en familia.",
        imagen: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=900&q=85",
        etiqueta: "Para compartir",
        tamanos: [
            { nombre: "Pequeña", precio: 45 },
            { nombre: "Mediana", precio: 65 },
            { nombre: "Grande", precio: 85 }
        ]
    },
    {
        id: 5,
        nombre: "Papas fritas",
        categoria: "acompanamientos",
        descripcion: "Papas doradas, ideales para acompañar.",
        imagen: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
        etiqueta: "Acompañamiento",
        tamanos: [
            { nombre: "Pequeña", precio: 10 },
            { nombre: "Mediana", precio: 15 },
            { nombre: "Grande", precio: 20 }
        ]
    },
    {
        id: 6,
        nombre: "Salchipapa",
        categoria: "acompanamientos",
        descripcion: "Papas fritas con salchicha en trozos.",
        imagen: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=85",
        etiqueta: "Un clásico",
        tamanos: [
            { nombre: "Pequeña", precio: 18 },
            { nombre: "Mediana", precio: 25 },
            { nombre: "Grande", precio: 32 }
        ]
    },
    {
        id: 7,
        nombre: "Coca-Cola",
        categoria: "bebidas",
        descripcion: "Una bebida fría para acompañar tu comida.",
        imagen: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=900&q=85",
        etiqueta: "Bebida",
        tamanos: [
            { nombre: "Personal", precio: 7 },
            { nombre: "500 ml", precio: 10 },
            { nombre: "2 litros", precio: 18 }
        ]
    },
    {
        id: 8,
        nombre: "Fanta",
        categoria: "bebidas",
        descripcion: "Gaseosa sabor naranja, bien fría.",
        imagen: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=900&q=85",
        etiqueta: "Bebida",
        tamanos: [
            { nombre: "Personal", precio: 7 },
            { nombre: "500 ml", precio: 10 },
            { nombre: "2 litros", precio: 18 }
        ]
    }
];
// TITULOS DE LAS CATEGORIAS
const titulos = {
    todos: "Todo el menú",
    pollo: "Pollo broaster",
    combos: "Combos",
    acompanamientos: "Acompañamientos",
    bebidas: "Bebidas"
};
// VARIABLES
const CLAVE_CARRITO = "pedidoBuenSabor";
let carrito = [];
let filtroActual = "todos";
let temporizadorAviso;
// RECUPERAR EL CARRITO GUARDADO
try {
    const guardado = JSON.parse(
        localStorage.getItem(CLAVE_CARRITO) || "[]"
    );
    if (Array.isArray(guardado)) {
        carrito = guardado.filter(function(item) {
            return item &&
                Number.isInteger(item.id) &&
                typeof item.nombre === "string" &&
                typeof item.tamano === "string" &&
                Number.isFinite(item.precio) &&
                Number.isInteger(item.cantidad) &&
                item.cantidad > 0;
        });
    }
} catch (error) {
    carrito = [];
}
// ELEMENTOS DEL HTML
const contProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("listaCarrito");
const totalEl = document.getElementById("total");
const tituloEl = document.getElementById("tituloCategoria");
const contadorProductos = document.getElementById("contadorProductos");
const buscador = document.getElementById("buscador");
const sinResultados = document.getElementById("sinResultados");
const contadorCarrito = document.getElementById("contadorCarrito");
const cantidadTitulo = document.getElementById("cantidadTitulo");
const subtotalProductos = document.getElementById("subtotalProductos");
const carritoVacio = document.getElementById("carritoVacio");
const btnVaciar = document.getElementById("btnVaciar");
const btnFinalizar = document.getElementById("btnFinalizar");
const menu = document.getElementById("menuLateral");
const fondo = document.getElementById("fondo");
const btnMenu = document.getElementById("btnMenu");
const modalPedido = document.getElementById("modalPedido");
const resumenPedido = document.getElementById("resumenPedido");
const totalConfirmacion = document.getElementById("totalConfirmacion");
const notificacion = document.getElementById("notificacion");
// MOSTRAR EL NOMBRE DEL USUARIO
const nombreRol = sesion.rol === "admin"
    ? "Administrador"
    : "Cliente";
document.getElementById("saludo").textContent =
    "Hola, " + sesion.nombre + " · " + nombreRol;
// FUNCIONES GENERALES
function guardarCarrito() {
    try {
        localStorage.setItem(
            CLAVE_CARRITO,
            JSON.stringify(carrito)
        );
    } catch (error) {
        mostrarAviso("No se pudo guardar el pedido en este navegador.");
    }
}
function mostrarAviso(mensaje) {
    notificacion.textContent = mensaje;
    notificacion.classList.add("visible");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(function() {
        notificacion.classList.remove("visible");
    }, 2600);
}
function normalizar(texto) {
    return texto.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
function totalDelCarrito() {
    return carrito.reduce(function(suma, item) {
        return suma + item.precio * item.cantidad;
    }, 0);
}
function cantidadTotal() {
    return carrito.reduce(function(suma, item) {
        return suma + item.cantidad;
    }, 0);

}
// MENU LATERAL
function abrirMenu() {
    menu.classList.add("abierto");
    fondo.hidden = false;
    btnMenu.setAttribute("aria-expanded", "true");
}
function cerrarMenu() {
    menu.classList.remove("abierto");
    fondo.hidden = true;
    btnMenu.setAttribute("aria-expanded", "false");
}
btnMenu.addEventListener("click", abrirMenu);
document.getElementById("btnCerrar").addEventListener("click", cerrarMenu);
fondo.addEventListener("click", cerrarMenu);
document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape") {
        cerrarMenu();
    }
});
// FILTROS DEL MENU
function cambiarFiltro(filtro) {
    filtroActual = titulos[filtro] ? filtro : "todos";
    document.querySelectorAll("[data-filtro]").forEach(function(enlace) {
        enlace.classList.toggle(
            "activo",
            enlace.dataset.filtro === filtroActual
        );
    });
    tituloEl.textContent = titulos[filtroActual];
    mostrarProductos();
}
document.querySelectorAll("[data-filtro]").forEach(function(elemento) {
    elemento.addEventListener("click", function(evento) {
        evento.preventDefault();
        cambiarFiltro(elemento.dataset.filtro);
        cerrarMenu();
        document.getElementById("catalogo").scrollIntoView({
            behavior: "smooth"
        });
    });
});
// BUSCADOR
buscador.addEventListener("input", mostrarProductos);
// MOSTRAR PRODUCTOS
function mostrarProductos() {
    const palabra = normalizar(buscador.value.trim());
    const lista = productos.filter(function(producto) {
        const coincideCategoria =
            filtroActual === "todos" ||
            producto.categoria === filtroActual;
        const textoProducto = normalizar(
            producto.nombre + " " +
            producto.descripcion + " " +
            producto.categoria
        );
        const coincideBusqueda = textoProducto.includes(palabra);
        return coincideCategoria && coincideBusqueda;
    });
    tituloEl.textContent = titulos[filtroActual];
    contadorProductos.textContent =
        lista.length +
        (lista.length === 1 ? " producto" : " productos");
    sinResultados.hidden = lista.length !== 0;
    contProductos.innerHTML = lista.map(function(producto) {
        const opciones = producto.tamanos.map(function(tamano, indice) {
            return `
                <option value="${indice}">
                    ${tamano.nombre} · Bs ${tamano.precio}
                </option>
            `;
        }).join("");
        const desde = Math.min(
            ...producto.tamanos.map(function(tamano) {
                return tamano.precio;
            })
        );
        const textoTamano = producto.categoria === "bebidas"
            ? "Presentación"
            : "Tamaño";
        return `
            <article class="producto">
                <div class="producto-imagen">
                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                        loading="lazy"
                    >
                    <span class="producto-etiqueta">
                        ${producto.etiqueta}
                    </span>
                </div>
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p class="descripcion">
                        ${producto.descripcion}
                    </p>
                    <p class="producto-precio">
                        Desde Bs ${desde}
                        <small>/ ${textoTamano.toLowerCase()}</small>
                    </p>
                    <select class="selector-tamano"
                        aria-label="Elegir tamaño de ${producto.nombre}">
                        ${opciones}

                    </select>
                    <button type="button"
                        class="agregar"
                        data-id="${producto.id}">
                        Agregar al pedido +
                    </button>
                </div>
            </article>
        `;
    }).join("");
    // SI UNA FOTO NO CARGA, MOSTRAR UN EMOJI
    contProductos.querySelectorAll(".producto-imagen img").forEach(function(imagen) {
        imagen.addEventListener("error", function() {
            imagen.hidden = true;
            imagen.parentElement.classList.add("sin-imagen");
        }, { once: true });
    });
}
// AGREGAR PRODUCTOS AL PEDIDO
contProductos.addEventListener("click", function(evento) {
    const boton = evento.target.closest("button[data-id]");
    if (!boton) return;
    const id = Number(boton.dataset.id);
    const producto = productos.find(function(item) {
        return item.id === id;
    });
    if (!producto) return;
    const tarjeta = boton.closest(".producto");
    const selector = tarjeta.querySelector(".selector-tamano");
    const tamanoElegido =
        producto.tamanos[Number(selector.value)];
    if (!tamanoElegido) return;
    const existente = carrito.find(function(item) {
        return item.id === id &&
               item.tamano === tamanoElegido.nombre;
    });
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            tamano: tamanoElegido.nombre,
            precio: tamanoElegido.precio,
            cantidad: 1
        });
    }
    actualizarCarrito();
    mostrarAviso(producto.nombre + " agregado al pedido.");
});
// MOSTRAR CARRITO Y TOTALES
function mostrarCarrito() {
    const cantidad = cantidadTotal();
    const total = totalDelCarrito();
    contadorCarrito.textContent = cantidad;
    cantidadTitulo.textContent = cantidad;
    subtotalProductos.textContent = cantidad;
    totalEl.textContent = "Bs " + total;
    carritoVacio.hidden = carrito.length !== 0;
    btnVaciar.disabled = carrito.length === 0;
    btnFinalizar.disabled = carrito.length === 0;
    listaCarrito.innerHTML = carrito.map(function(item, indice) {
        return `
            <li class="item-carrito">
                <div>
                    <span class="item-carrito__nombre">
                        ${item.nombre}
                    </span>
                    <span class="item-carrito__tamano">
                        ${item.tamano} · Bs ${item.precio} c/u
                    </span>
                </div>
                <div class="item-carrito__precio">
                    Bs ${item.precio * item.cantidad}
                </div>
                <div class="controles-cantidad">

                    <button type="button"
                        class="cantidad-btn"
                        data-accion="restar"
                        data-indice="${indice}">
                        −
                    </button>
                    <span class="cantidad-numero">
                        ${item.cantidad}
                    </span>
                    <button type="button"
                        class="cantidad-btn"
                        data-accion="sumar"
                        data-indice="${indice}">
                        +
                    </button>
                    <button type="button"
                        class="quitar-item"
                        data-accion="eliminar"
                        data-indice="${indice}">
                        Quitar
                    </button>
                </div>
            </li>
        `;
    }).join("");
}
// ACTUALIZAR CARRITO
function actualizarCarrito() {
    guardarCarrito();
    mostrarCarrito();
}
// BOTONES DE MAS, MENOS Y QUITAR
listaCarrito.addEventListener("click", function(evento) {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;
    const indice = Number(boton.dataset.indice);
    const producto = carrito[indice];
    if (!producto) return;
    if (boton.dataset.accion === "sumar") {
        producto.cantidad++;
    } else if (boton.dataset.accion === "restar") {
        producto.cantidad--;
        if (producto.cantidad <= 0) {
            carrito.splice(indice, 1);
        }
    } else if (boton.dataset.accion === "eliminar") {
        carrito.splice(indice, 1);
    }
    actualizarCarrito();
});
// VACIAR TODO EL PEDIDO
btnVaciar.addEventListener("click", function() {
    if (carrito.length === 0) return;
    const confirmar = window.confirm(
        "¿Seguro que quieres vaciar todo el pedido?"
    );
    if (!confirmar) return;
    carrito = [];
    actualizarCarrito();
    mostrarAviso("El pedido quedó vacío.");
});
// ABRIR RESUMEN DEL PEDIDO
function abrirResumen() {
    if (carrito.length === 0) return;
    resumenPedido.innerHTML = carrito.map(function(item) {
        return `
            <li>
                <span>
                    ${item.cantidad} × ${item.nombre} (${item.tamano})
                </span>
                <strong>
                    Bs ${item.precio * item.cantidad}
                </strong>
            </li>
        `;
    }).join("");
    totalConfirmacion.textContent =
        "Bs " + totalDelCarrito();
    modalPedido.showModal();
}
btnFinalizar.addEventListener("click", abrirResumen);
// CERRAR VENTANA
document.getElementById("btnCerrarModal").addEventListener("click", function() {
    modalPedido.close();
});
document.getElementById("btnSeguirComprando").addEventListener("click", function() {
    modalPedido.close();
});
// CONFIRMAR PEDIDO
document.getElementById("btnConfirmar").addEventListener("click", function() {
    if (carrito.length === 0) {
        modalPedido.close();
        return;
    }
    const numeroPedido = Math.floor(
        1000 + Math.random() * 9000
    );
    carrito = [];
    actualizarCarrito();
    modalPedido.close();
    mostrarAviso(
        "Pedido de demostración N.º " +
        numeroPedido +
        " confirmado. ¡Gracias!"
    );
});
// CERRAR SESION
document.getElementById("btnSalir").addEventListener("click", function() {
    try {
        sessionStorage.removeItem(CLAVE_SESION);
    } catch (error) { }
    try {
        localStorage.removeItem(CLAVE_SESION);
    } catch (error) { }
    window.location.replace("../index.html");
});
// INICIAR LA PAGINA
mostrarProductos();
mostrarCarrito();