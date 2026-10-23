"use strict";

/* =========================================================
   Clase Compra (diagrama de clases UML)
   ========================================================= */

class Compra {
  constructor({ idCompra, idUsuario, items, montoTotal, fecha = new Date(), estadoPago = "pendiente", idTransaccion = null }) {
    this.idCompra = idCompra;
    this.idUsuario = idUsuario;
    this.items = items;
    this.montoTotal = montoTotal;
    this.fecha = fecha instanceof Date ? fecha : new Date(fecha);
    this.estadoPago = estadoPago;
    this.idTransaccion = idTransaccion;
  }

  procesarPagoConPasarela(datosBancarios) {
    return PasarelaDePagos.solicitarCobro(this.montoTotal, datosBancarios);
  }

  actualizarStock() {
    this.items.forEach((item) => {
      const producto = BinaryShop.buscarProducto(item.idProducto);
      if (producto) {
        producto.actualizarDatos({ stock: Math.max(0, producto.stock - item.cantidad) });
        if (producto.stock <= 0) producto.actualizarDatos({ estado: "agotado" });
      }
    });
  }

  generarComprobante() {
    const usuario = BinaryShop.buscarUsuario(this.idUsuario);
    const lineas = this.items
      .map((item) => `  ${item.cantidad} x ${item.titulo}  ........  $${(item.precio * item.cantidad).toFixed(2)}`)
      .join("\n");
    return [
      "============================================",
      "     BINARYSHOP - COMPROBANTE DE COMPRA",
      "============================================",
      `  N de compra:    ${this.idCompra}`,
      `  Fecha:          ${this.fecha.toLocaleString()}`,
      `  Cliente:        ${usuario ? usuario.nickname : "N/D"}`,
      "--------------------------------------------",
      lineas,
      "--------------------------------------------",
      `  TOTAL PAGADO:   $${this.montoTotal.toFixed(2)}`,
      `  Estado de pago: ${this.estadoPago}`,
      `  Transaccion:    ${this.idTransaccion}`,
      "============================================",
      "     Gracias por comprar en BinaryShop",
    ].join("\n");
  }
}
