"use strict";

/* =========================================================
   UI del catálogo (catalogo.html)
   ========================================================= */

const CatalogoUI = {
  iniciar() {
    this.render();
    porId("rejilla-productos").addEventListener("click", (e) => this.alClick(e));
  },

  render() {
    const contenedor = porId("rejilla-productos");
    if (!BinaryShop.productos.length) {
      contenedor.innerHTML = '<p class="vacio">No hay productos publicados por el momento.</p>';
      return;
    }
    contenedor.innerHTML = BinaryShop.productos.map((p) => {
      const vendedor = BinaryShop.buscarUsuario(p.idVendedor);
      return `
      <article class="tarjeta tarjeta-producto">
        <div class="producto-imagen">
          <img src="${p.imagenUrl}" alt="${escaparHtml(p.titulo)}">
          ${p.agotado
            ? '<span class="insignia insignia-agotado">Agotado</span>'
            : '<span class="insignia insignia-disponible">Disponible</span>'}
        </div>
        <div class="producto-cuerpo">
          <h3>${escaparHtml(p.titulo)}</h3>
          <p class="producto-descripcion">${escaparHtml(p.descripcion)}</p>
          <p class="producto-meta">Vendido por ${vendedor ? "@" + escaparHtml(vendedor.nickname) : "BinaryShop"} · Stock: ${p.stock}</p>
          <p class="producto-precio">${formatearDinero(p.precio)}</p>
          <div class="producto-acciones">
            <button type="button" class="btn btn-secundario" data-accion="agregar" data-id="${p.idProducto}" ${p.agotado ? "disabled" : ""}>
              Añadir al carrito
            </button>
            <button type="button" class="btn btn-primario" data-accion="comprar" data-id="${p.idProducto}" ${p.agotado ? "disabled" : ""}>
              Comprar ahora
            </button>
          </div>
        </div>
      </article>`;
    }).join("");
  },

  alClick(evento) {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;
    const producto = BinaryShop.buscarProducto(Number(boton.dataset.id));
    if (!producto) return;
    if (boton.dataset.accion === "agregar") Compartido.agregarAlCarrito(producto);
    if (boton.dataset.accion === "comprar") Compartido.comprarAhora(producto);
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Compartido.iniciar({ pagina: "catalogo", alListo: () => CatalogoUI.iniciar() });
});
