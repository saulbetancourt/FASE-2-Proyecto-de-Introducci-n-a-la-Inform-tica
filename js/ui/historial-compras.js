"use strict";

/* =========================================================
   UI del historial de compras (compras.html)
   ========================================================= */

const HistorialComprasUI = {
  iniciar() {
    this.render();
    porId("lista-compras").addEventListener("click", (e) => this.alClick(e));
  },

  render() {
    const compras = BinaryShop.compras.filter((c) => c.idUsuario === BinaryShop.sesion.idUsuario);
    const contenedor = porId("lista-compras");

    if (!compras.length) {
      contenedor.innerHTML = '<p class="vacio">No has realizado compras todavía.</p>';
      return;
    }

    contenedor.innerHTML = compras.slice().reverse().map((c) => `
      <div class="tarjeta tarjeta-compra">
        <div class="compra-encabezado">
          <div>
            <strong>Compra #${c.idCompra}</strong>
            <span class="compra-fecha">${c.fecha.toLocaleString()}</span>
          </div>
          <span class="insignia-rol ${c.estadoPago === "aprobado" ? "insignia-aprobado" : "insignia-rechazado"}">${escaparHtml(c.estadoPago)}</span>
        </div>
        <ul class="compra-items">
          ${c.items.map((i) => `<li>${i.cantidad} × ${escaparHtml(i.titulo)} — ${formatearDinero(i.precio * i.cantidad)}</li>`).join("")}
        </ul>
        <div class="compra-pie">
          <strong>Total: ${formatearDinero(c.montoTotal)}</strong>
          <button type="button" class="btn btn-secundario btn-mini" data-id="${c.idCompra}">Ver comprobante</button>
        </div>
      </div>`).join("");
  },

  alClick(evento) {
    const boton = evento.target.closest("button[data-id]");
    if (!boton) return;
    const compra = BinaryShop.compras.find((c) => c.idCompra === Number(boton.dataset.id));
    if (compra) Compartido.mostrarComprobante(compra);
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Compartido.iniciar({ pagina: "compras", roles: ["comprador", "vendedor"], alListo: () => HistorialComprasUI.iniciar() });
});
