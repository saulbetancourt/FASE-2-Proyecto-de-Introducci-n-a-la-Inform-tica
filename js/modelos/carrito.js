"use strict";

/* =========================================================
   Clase Carrito (diagrama de clases UML)
   Cada mutación persiste el estado para que sobreviva
   la navegación entre páginas.
   ========================================================= */

class Carrito {
  constructor(idCarrito, idUsuario) {
    this.idCarrito = idCarrito;
    this.idUsuario = idUsuario;
    this.items = [];
  }

  get montoTotal() {
    return this.items.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }

  get cantidadArticulos() {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  agregarProducto(producto, cantidad = 1) {
    const existente = this.items.find((item) => item.producto.idProducto === producto.idProducto);
    if (existente) {
      if (existente.cantidad + cantidad > producto.stock) return false;
      existente.cantidad += cantidad;
    } else {
      if (cantidad > producto.stock) return false;
      this.items.push({ producto, cantidad });
    }
    BinaryShop.persistir();
    return true;
  }

  quitarProducto(idProducto) {
    this.items = this.items.filter((item) => item.producto.idProducto !== idProducto);
    BinaryShop.persistir();
  }

  cambiarCantidad(idProducto, cantidad) {
    const item = this.items.find((i) => i.producto.idProducto === idProducto);
    if (!item) return false;
    if (cantidad <= 0) {
      this.quitarProducto(idProducto);
      return true;
    }
    if (cantidad > item.producto.stock) return false;
    item.cantidad = cantidad;
    BinaryShop.persistir();
    return true;
  }

  contiene(idProducto) {
    return this.items.some((item) => item.producto.idProducto === idProducto);
  }

  cargarItems(items) {
    this.items = items;
  }

  vaciar() {
    this.items = [];
    BinaryShop.persistir();
  }
}
