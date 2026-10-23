"use strict";

/* =========================================================
   Clase Producto (diagrama de clases UML)
   ========================================================= */

class Producto {
  constructor({ idProducto, titulo, descripcion, precio, imagenUrl, stock = 1, estado = "activo", idVendedor }) {
    this.idProducto = idProducto;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.precio = precio;
    this.imagenUrl = imagenUrl;
    this.stock = stock;
    this.estado = estado;
    this.idVendedor = idVendedor;
  }

  actualizarDatos(datos) {
    Object.assign(this, datos);
  }

  get agotado() {
    return this.stock <= 0 || this.estado === "agotado";
  }
}
