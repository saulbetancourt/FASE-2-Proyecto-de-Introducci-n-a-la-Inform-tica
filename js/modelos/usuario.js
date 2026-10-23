"use strict";

/* =========================================================
   Clases de usuario (diagrama de clases UML)
   ========================================================= */

class Usuario {
  constructor({ idUsuario, nombre, apellido = "", direccion = "", nickname, correo, contrasena, datosBancarios = "" }) {
    this.idUsuario = idUsuario;
    this.nombre = nombre;
    this.apellido = apellido;
    this.direccion = direccion;
    this.nickname = nickname;
    this.correo = correo;
    this.contrasena = contrasena;
    this.datosBancarios = datosBancarios;
  }

  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`.trim();
  }

  registrarse() {
    return ControladorUsuario.registrarUsuario(this);
  }

  iniciarSesion() {
    return Autenticador.autenticar(this.correo, this.contrasena);
  }
}

class Comprador extends Usuario {
  constructor(datos) {
    super(datos);
    this.rol = "comprador";
  }

  agregarAlCarrito(producto) {
    return BinaryShop.carrito.agregarProducto(producto);
  }

  realizarCompra() {
    return ControladorCompra.procesarCompra(
      this.idUsuario,
      BinaryShop.carrito.items,
      this.datosBancarios
    );
  }

  habilitarOpcionVenta() {
    return ControladorUsuario.habilitarOpcionVenta(this.idUsuario);
  }
}

class Vendedor extends Usuario {
  constructor(datos) {
    super(datos);
    this.rol = "vendedor";
  }

  publicarProducto(producto) {
    return ControladorProducto.publicarProducto(this.idUsuario, producto);
  }

  eliminarMiProducto(idProducto) {
    return ControladorProducto.removerProductoPropio(this.idUsuario, idProducto);
  }

  consultarHistorialVentas() {
    return BinaryShop.compras.filter((compra) =>
      compra.items.some((item) => item.idVendedor === this.idUsuario)
    );
  }
}

class Administrador extends Usuario {
  constructor(datos) {
    super(datos);
    this.rol = "admin";
  }

  eliminarCuenta(idUsuario) {
    return ControladorUsuario.eliminarCuenta(idUsuario);
  }

  removerProducto(idProducto) {
    return ControladorProducto.removerProducto(idProducto);
  }
}

function instanciarUsuario(datos) {
  switch (datos.rol) {
    case "admin":
      return new Administrador(datos);
    case "vendedor":
      return new Vendedor(datos);
    default:
      return new Comprador(datos);
  }
}
