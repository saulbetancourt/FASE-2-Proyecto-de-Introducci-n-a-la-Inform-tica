"use strict";

/* =========================================================
   ControladorProducto (diagrama de secuencia: Publicar)
   ========================================================= */

const ControladorProducto = {
  publicarProducto(idVendedor, datos) {
    const validacion = this.validarDatos(datos);
    if (!validacion.ok) return validacion;

    const producto = new Producto({
      idProducto: BinaryShop.siguienteId("producto"),
      titulo: datos.titulo.trim(),
      descripcion: (datos.descripcion || "").trim(),
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      imagenUrl: datos.imagenUrl || generarImagenProducto(datos.titulo, "#065f46", "#10b981"),
      idVendedor,
    });
    BinaryShop.productos.unshift(producto);
    BinaryShop.persistir();
    return { ok: true, idProducto: producto.idProducto, producto };
  },

  validarDatos(datos) {
    if (!datos.titulo || !datos.titulo.trim()) {
      return { ok: false, mensaje: "El nombre del producto es obligatorio." };
    }
    const precio = Number(datos.precio);
    if (Number.isNaN(precio) || precio <= 0) {
      return { ok: false, mensaje: "El precio debe ser un número mayor a 0." };
    }
    const stock =
      datos.stock === "" || datos.stock === undefined || datos.stock === null
        ? NaN
        : Number(datos.stock);
    if (Number.isNaN(stock) || stock < 0) {
      return { ok: false, mensaje: "El stock debe ser un número mayor o igual a 0." };
    }
    return { ok: true };
  },

  removerProducto(idProducto) {
    const existe = BinaryShop.productos.some((p) => p.idProducto === idProducto);
    if (!existe) return { ok: false, mensaje: "Publicación no encontrada." };
    BinaryShop.productos = BinaryShop.productos.filter((p) => p.idProducto !== idProducto);
    if (BinaryShop.carrito) BinaryShop.carrito.quitarProducto(idProducto);
    BinaryShop.persistir();
    return { ok: true };
  },

  removerProductoPropio(idVendedor, idProducto) {
    const producto = BinaryShop.buscarProducto(idProducto);
    if (!producto) return { ok: false, mensaje: "Publicación no encontrada." };
    if (producto.idVendedor !== idVendedor) {
      return { ok: false, mensaje: "Solo puedes eliminar tus propias publicaciones." };
    }
    return this.removerProducto(idProducto);
  },

  verificarDisponibilidad(itemsCarrito) {
    for (const item of itemsCarrito) {
      const producto = BinaryShop.buscarProducto(item.producto.idProducto);
      if (!producto) {
        return { ok: false, mensaje: `El producto "${item.producto.titulo}" ya no está disponible.` };
      }
      if (producto.stock < item.cantidad) {
        return {
          ok: false,
          mensaje: `Stock insuficiente para "${producto.titulo}" (disponible: ${producto.stock}).`,
        };
      }
    }
    return { ok: true };
  },
};
