"use strict";

/* =========================================================
   Compartido — lógica común de las páginas con sesión:
   guard de autenticación y rol, cabecera, carrito
   desplegable, pago y modal.
   ========================================================= */

const Compartido = {
  iniciar(opciones) {
    BinaryShop.init();

    if (!BinaryShop.sesion) {
      this.redirigir("index.html");
      return false;
    }

    const rolesPermitidos = opciones.roles || ["comprador", "vendedor", "admin"];
    if (!rolesPermitidos.includes(BinaryShop.sesion.rol)) {
      this.redirigir("catalogo.html");
      return false;
    }

    this.configurarCabecera();
    this.enlazarCarrito();
    this.enlazarModal();
    this.actualizarCarrito();

    if (typeof opciones.alListo === "function") opciones.alListo();
    return true;
  },

  redirigir(pagina) {
    window.location.href = pagina;
  },

  /* ---------- cabecera ---------- */

  configurarCabecera() {
    const sesion = BinaryShop.sesion;

    porId("etiqueta-usuario").textContent =
      `${sesion.nombreCompleto} · @${sesion.nickname} · ${sesion.rol}`;

    porId("enlace-vendedor").classList.toggle("oculto", sesion.rol !== "vendedor");
    porId("enlace-ventas").classList.toggle("oculto", sesion.rol !== "vendedor");
    porId("enlace-compras").classList.toggle("oculto", sesion.rol === "admin");
    porId("enlace-admin").classList.toggle("oculto", sesion.rol !== "admin");
    porId("btn-habilitar-venta").classList.toggle("oculto", sesion.rol !== "comprador");

    porId("btn-cerrar-sesion").addEventListener("click", () => {
      Autenticador.cerrarSesion();
      this.redirigir("index.html");
    });

    porId("btn-habilitar-venta").addEventListener("click", () => {
      const resultado = BinaryShop.sesion.habilitarOpcionVenta();
      if (resultado.ok) {
        notificar("Opción de venta habilitada. ¡Ya puedes publicar productos!");
        this.redirigir("vendedor.html");
      } else {
        notificar(resultado.mensaje, "error");
      }
    });
  },

  /* ---------- modal ---------- */

  enlazarModal() {
    porId("btn-cerrar-modal").addEventListener("click", cerrarModal);
    porId("modal").addEventListener("click", (e) => {
      if (e.target === porId("modal")) cerrarModal();
    });
  },

  /* ---------- carrito ---------- */

  enlazarCarrito() {
    porId("btn-carrito").addEventListener("click", (e) => {
      e.stopPropagation();
      porId("desplegable-carrito").classList.toggle("oculto");
    });

    document.addEventListener("click", (e) => {
      const desplegable = porId("desplegable-carrito");
      if (
        !desplegable.classList.contains("oculto") &&
        !desplegable.contains(e.target) &&
        !porId("btn-carrito").contains(e.target)
      ) {
        desplegable.classList.add("oculto");
      }
    });

    porId("desplegable-carrito").addEventListener("click", (e) => this.alClickCarrito(e));
  },

  actualizarCarrito() {
    const carrito = BinaryShop.carrito;
    if (!carrito) return;
    porId("contador-carrito").textContent = carrito.cantidadArticulos;

    const lista = porId("lista-carrito");
    if (!carrito.items.length) {
      lista.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
    } else {
      lista.innerHTML = carrito.items.map((item) => `
        <div class="item-carrito">
          <img src="${item.producto.imagenUrl}" alt="${escaparHtml(item.producto.titulo)}">
          <div class="item-info">
            <p class="item-titulo">${escaparHtml(item.producto.titulo)}</p>
            <p class="item-precio">${formatearDinero(item.producto.precio)} c/u</p>
            <div class="item-controles">
              <button type="button" data-accion="disminuir" data-id="${item.producto.idProducto}" aria-label="Disminuir cantidad">&minus;</button>
              <span>${item.cantidad}</span>
              <button type="button" data-accion="aumentar" data-id="${item.producto.idProducto}" aria-label="Aumentar cantidad">+</button>
              <button type="button" class="btn-quitar" data-accion="quitar" data-id="${item.producto.idProducto}">Eliminar</button>
            </div>
          </div>
          <p class="item-subtotal">${formatearDinero(item.producto.precio * item.cantidad)}</p>
        </div>`).join("");
    }

    porId("pie-carrito").innerHTML = `
      <div class="carrito-total">
        <span>Total (${carrito.cantidadArticulos} artículo${carrito.cantidadArticulos === 1 ? "" : "s"})</span>
        <strong>${formatearDinero(carrito.montoTotal)}</strong>
      </div>
      <button type="button" class="btn btn-primario btn-bloque" data-accion="pagar" ${carrito.items.length ? "" : "disabled"}>
        Pagar
      </button>`;
  },

  alClickCarrito(evento) {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;
    const carrito = BinaryShop.carrito;
    const accion = boton.dataset.accion;

    if (accion === "pagar") {
      this.pagar();
      return;
    }

    const id = Number(boton.dataset.id);
    const item = carrito.items.find((i) => i.producto.idProducto === id);
    if (!item) return;

    if (accion === "aumentar") {
      if (!carrito.cambiarCantidad(id, item.cantidad + 1)) {
        notificar("No hay más stock disponible de este producto.", "error");
      }
    } else if (accion === "disminuir") {
      carrito.cambiarCantidad(id, item.cantidad - 1);
    } else if (accion === "quitar") {
      carrito.quitarProducto(id);
    }
    this.actualizarCarrito();
  },

  agregarAlCarrito(producto, silencioso = false) {
    const sesion = BinaryShop.sesion;
    const agregado =
      sesion instanceof Comprador
        ? sesion.agregarAlCarrito(producto)
        : BinaryShop.carrito.agregarProducto(producto);
    if (!agregado) {
      notificar(`Stock insuficiente de "${producto.titulo}".`, "error");
      return false;
    }
    if (!silencioso) notificar(`"${producto.titulo}" añadido al carrito.`);
    this.actualizarCarrito();
    return true;
  },

  comprarAhora(producto) {
    if (!BinaryShop.carrito.contiene(producto.idProducto)) {
      if (!this.agregarAlCarrito(producto, true)) return;
    }
    porId("desplegable-carrito").classList.add("oculto");
    this.pagar();
  },

  /* ---------- pago (diagrama de secuencia: ProcesoCompra) ---------- */

  async pagar() {
    const sesion = BinaryShop.sesion;
    if (!BinaryShop.carrito || !BinaryShop.carrito.items.length) return;

    porId("desplegable-carrito").classList.add("oculto");
    abrirModal(`
      <div class="pago-centrado">
        <div class="spinner"></div>
        <h3>Procesando pago</h3>
        <p>Conectando con la pasarela de pagos…</p>
        <p class="pago-monto">${formatearDinero(BinaryShop.carrito.montoTotal)}</p>
      </div>`);

    const resultado =
      sesion instanceof Comprador
        ? await sesion.realizarCompra()
        : await ControladorCompra.procesarCompra(sesion.idUsuario, BinaryShop.carrito.items, sesion.datosBancarios);

    if (resultado.ok) {
      BinaryShop.carrito.vaciar();
      this.actualizarCarrito();
      abrirModal(`
        <div class="pago-centrado">
          <h3 class="titulo-exito">Compra exitosa</h3>
          <p>Tu pago fue aprobado y se generó el comprobante.</p>
          <pre class="comprobante">${escaparHtml(resultado.comprobante)}</pre>
        </div>`);
      notificar("Compra realizada con éxito.");
    } else {
      abrirModal(`
        <div class="pago-centrado">
          <h3 class="titulo-error">No se pudo completar la compra</h3>
          <p>${escaparHtml(resultado.mensaje)}</p>
        </div>`);
      notificar(resultado.mensaje, "error");
    }
  },

  mostrarComprobante(compra) {
    abrirModal(`
      <div class="pago-centrado">
        <h3>Comprobante de compra #${compra.idCompra}</h3>
        <pre class="comprobante">${escaparHtml(compra.generarComprobante())}</pre>
      </div>`);
  },
};
