"use strict";

/* =========================================================
   BinaryShop — estado global y persistencia.
   Al ser un sitio multi-página, el estado se guarda en
   sessionStorage para sobrevivir la navegación entre
   vistas (sin usar ninguna base de datos real).
   ========================================================= */

const BinaryShop = {
  usuarios: [],
  productos: [],
  compras: [],
  carrito: null,
  sesion: null,
  secuencia: { usuario: 0, producto: 0, compra: 0, carrito: 0 },

  CLAVE_ESTADO: "binaryshop_estado",

  siguienteId(tipo) {
    this.secuencia[tipo] += 1;
    return this.secuencia[tipo];
  },

  buscarUsuario(idUsuario) {
    return this.usuarios.find((u) => u.idUsuario === idUsuario) || null;
  },

  buscarProducto(idProducto) {
    return this.productos.find((p) => p.idProducto === idProducto) || null;
  },

  /* ---------- persistencia ---------- */

  persistir() {
    const estado = {
      usuarios: this.usuarios,
      productos: this.productos,
      compras: this.compras,
      secuencia: this.secuencia,
      sesionId: this.sesion ? this.sesion.idUsuario : null,
      carrito: this.carrito
        ? this.carrito.items.map((item) => ({
            idProducto: item.producto.idProducto,
            cantidad: item.cantidad,
          }))
        : [],
    };
    sessionStorage.setItem(this.CLAVE_ESTADO, JSON.stringify(estado));
  },

  cargarEstado() {
    try {
      const crudo = sessionStorage.getItem(this.CLAVE_ESTADO);
      if (!crudo) return false;

      const estado = JSON.parse(crudo);
      this.usuarios = estado.usuarios.map(instanciarUsuario);
      this.productos = estado.productos.map((datos) => new Producto(datos));
      this.compras = estado.compras.map((datos) => new Compra(datos));
      this.secuencia = estado.secuencia;
      this.sesion = estado.sesionId ? this.buscarUsuario(estado.sesionId) : null;

      if (this.sesion) {
        this.carrito = new Carrito(this.siguienteId("carrito"), this.sesion.idUsuario);
        const items = (estado.carrito || [])
          .map((item) => {
            const producto = this.buscarProducto(item.idProducto);
            return producto ? { producto, cantidad: item.cantidad } : null;
          })
          .filter(Boolean);
        this.carrito.cargarItems(items);
      }
      return true;
    } catch (error) {
      console.error("No se pudo restaurar el estado de BinaryShop:", error);
      return false;
    }
  },

  /* ---------- inicialización ---------- */

  init() {
    if (this.cargarEstado()) return;

    this.usuarios = DATOS_INICIALES.usuarios.map(instanciarUsuario);
    this.productos = DATOS_INICIALES.productos.map((datos) => new Producto(datos));
    this.secuencia.usuario = Math.max(...this.usuarios.map((u) => u.idUsuario), 0);
    this.secuencia.producto = Math.max(...this.productos.map((p) => p.idProducto), 0);
    this.persistir();
  },
};
