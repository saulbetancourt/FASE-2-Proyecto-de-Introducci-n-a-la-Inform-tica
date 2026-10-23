"use strict";

/* =========================================================
   UI del historial de ventas (ventas.html)
   ========================================================= */

const HistorialVentasUI = {
  iniciar() {
    this.render();
  },

  render() {
    const sesion = BinaryShop.sesion;
    const ventas = sesion.consultarHistorialVentas();
    const contenedor = porId("lista-ventas");

    if (!ventas.length) {
      contenedor.innerHTML = '<p class="vacio">No tienes ventas registradas todavía.</p>';
      return;
    }

    contenedor.innerHTML = ventas.slice().reverse().map((c) => {
      const misItems = c.items.filter((i) => i.idVendedor === sesion.idUsuario);
      const monto = misItems.reduce((total, i) => total + i.precio * i.cantidad, 0);
      return `
      <div class="tarjeta tarjeta-compra">
        <div class="compra-encabezado">
          <div>
            <strong>Venta en compra #${c.idCompra}</strong>
            <span class="compra-fecha">${c.fecha.toLocaleString()}</span>
          </div>
          <span class="insignia-rol ${c.estadoPago === "aprobado" ? "insignia-aprobado" : "insignia-rechazado"}">${escaparHtml(c.estadoPago)}</span>
        </div>
        <ul class="compra-items">
          ${misItems.map((i) => `<li>${i.cantidad} × ${escaparHtml(i.titulo)} — ${formatearDinero(i.precio * i.cantidad)}</li>`).join("")}
        </ul>
        <div class="compra-pie"><strong>Total vendido: ${formatearDinero(monto)}</strong></div>
      </div>`;
    }).join("");
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Compartido.iniciar({ pagina: "ventas", roles: ["vendedor"], alListo: () => HistorialVentasUI.iniciar() });
});
