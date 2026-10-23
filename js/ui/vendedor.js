"use strict";

/* =========================================================
   UI del panel de vendedor (vendedor.html): publicar
   productos y eliminar las propias publicaciones.
   ========================================================= */

const VendedorUI = {
  imagenSeleccionada: null,

  iniciar() {
    porId("form-producto").addEventListener("submit", (e) => this.manejarPublicacion(e));
    porId("prod-imagen").addEventListener("change", (e) => this.previsualizarImagen(e));
    porId("lista-mis-productos").addEventListener("click", (e) => this.alClickMisProductos(e));
    this.render();
  },

  render() {
    const sesion = BinaryShop.sesion;
    const misProductos = BinaryShop.productos.filter((p) => p.idVendedor === sesion.idUsuario);
    const contenedor = porId("lista-mis-productos");

    if (!misProductos.length) {
      contenedor.innerHTML = '<p class="vacio">Aún no has publicado productos.</p>';
      return;
    }

    contenedor.innerHTML = misProductos.map((p) => `
      <div class="fila-mi-producto">
        <img src="${p.imagenUrl}" alt="${escaparHtml(p.titulo)}">
        <div>
          <p class="item-titulo">${escaparHtml(p.titulo)}</p>
          <p class="item-precio">${formatearDinero(p.precio)} · stock: ${p.stock} · ${escaparHtml(p.estado)}</p>
        </div>
        <button type="button" class="btn btn-peligro btn-mini" data-eliminar="${p.idProducto}">Eliminar</button>
      </div>`).join("");
  },

  previsualizarImagen(evento) {
    const archivo = evento.target.files[0];
    if (!archivo) {
      this.imagenSeleccionada = null;
      porId("vista-previa-imagen").classList.add("oculto");
      return;
    }
    const lector = new FileReader();
    lector.onload = () => {
      this.imagenSeleccionada = lector.result;
      porId("previa-imagen").src = lector.result;
      porId("vista-previa-imagen").classList.remove("oculto");
    };
    lector.readAsDataURL(archivo);
  },

  manejarPublicacion(evento) {
    evento.preventDefault();
    const datos = {
      titulo: porId("prod-titulo").value,
      descripcion: porId("prod-descripcion").value,
      precio: porId("prod-precio").value,
      stock: porId("prod-stock").value,
      imagenUrl: this.imagenSeleccionada,
    };
    const resultado = BinaryShop.sesion.publicarProducto(datos);
    if (!resultado.ok) {
      notificar(resultado.mensaje, "error");
      return;
    }
    notificar(`Producto "${resultado.producto.titulo}" publicado con éxito.`);
    porId("form-producto").reset();
    this.imagenSeleccionada = null;
    porId("vista-previa-imagen").classList.add("oculto");
    this.render();
  },

  alClickMisProductos(evento) {
    const boton = evento.target.closest("button[data-eliminar]");
    if (!boton) return;
    const id = Number(boton.dataset.eliminar);
    const producto = BinaryShop.buscarProducto(id);
    if (!producto) return;
    if (!window.confirm(`¿Eliminar tu publicación "${producto.titulo}"?`)) return;

    const resultado = BinaryShop.sesion.eliminarMiProducto(id);
    if (resultado.ok) {
      notificar(`Publicación "${producto.titulo}" eliminada.`);
      Compartido.actualizarCarrito();
      this.render();
    } else {
      notificar(resultado.mensaje, "error");
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Compartido.iniciar({ pagina: "vendedor", roles: ["vendedor"], alListo: () => VendedorUI.iniciar() });
});
