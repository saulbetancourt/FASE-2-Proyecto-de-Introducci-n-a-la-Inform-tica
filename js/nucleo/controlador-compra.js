"use strict";

/* =========================================================
   ControladorCompra (diagrama de secuencia: ProcesoCompra)
   ========================================================= */

const ControladorCompra = {
  async procesarCompra(idUsuario, itemsCarrito, datosBancarios) {
    if (!itemsCarrito.length) {
      return { ok: false, mensaje: "El carrito está vacío." };
    }

    const disponibilidad = ControladorProducto.verificarDisponibilidad(itemsCarrito);
    if (!disponibilidad.ok) return disponibilidad;

    const items = itemsCarrito.map((item) => ({
      idProducto: item.producto.idProducto,
      titulo: item.producto.titulo,
      precio: item.producto.precio,
      cantidad: item.cantidad,
      idVendedor: item.producto.idVendedor,
    }));
    const montoTotal = items.reduce((total, item) => total + item.precio * item.cantidad, 0);

    const compra = new Compra({
      idCompra: BinaryShop.siguienteId("compra"),
      idUsuario,
      items,
      montoTotal,
    });

    const cobro = await compra.procesarPagoConPasarela(datosBancarios);
    if (!cobro.aprobado) {
      compra.estadoPago = "rechazado";
      BinaryShop.compras.push(compra);
      BinaryShop.persistir();
      return { ok: false, mensaje: "La pasarela de pagos rechazó el cobro. Intenta con otro medio de pago." };
    }

    compra.estadoPago = "aprobado";
    compra.idTransaccion = cobro.idTransaccion;
    BinaryShop.compras.push(compra);
    compra.actualizarStock();
    BinaryShop.persistir();

    return { ok: true, comprobante: compra.generarComprobante(), compra };
  },
};
