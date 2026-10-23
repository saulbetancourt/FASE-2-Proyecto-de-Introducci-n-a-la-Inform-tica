"use strict";

/* =========================================================
   ControladorUsuario (diagrama de secuencia: Registro)
   ========================================================= */

const ControladorUsuario = {
  verificarExistencia(correo) {
    return BinaryShop.usuarios.some((u) => u.correo.toLowerCase() === correo.toLowerCase());
  },

  registrarUsuario(datos) {
    if (this.verificarExistencia(datos.correo)) {
      return { ok: false, mensaje: "El correo ya se encuentra registrado." };
    }
    const usuario = this.crearCuenta(datos);
    return { ok: true, usuario };
  },

  crearCuenta(datos) {
    const comprador = new Comprador({
      idUsuario: BinaryShop.siguienteId("usuario"),
      nombre: datos.nombre,
      apellido: datos.apellido,
      nickname: datos.nickname,
      correo: datos.correo,
      contrasena: datos.contrasena,
      direccion: datos.direccion,
      datosBancarios: datos.datosBancarios,
    });
    BinaryShop.usuarios.push(comprador);
    BinaryShop.persistir();
    return comprador;
  },

  habilitarOpcionVenta(idUsuario) {
    const indice = BinaryShop.usuarios.findIndex((u) => u.idUsuario === idUsuario);
    if (indice === -1) return { ok: false, mensaje: "Usuario no encontrado." };
    const actual = BinaryShop.usuarios[indice];
    if (actual.rol === "vendedor") {
      return { ok: false, mensaje: "La cuenta ya tiene habilitada la opción de venta." };
    }
    const vendedor = new Vendedor({ ...actual });
    BinaryShop.usuarios[indice] = vendedor;
    if (BinaryShop.sesion && BinaryShop.sesion.idUsuario === idUsuario) {
      BinaryShop.sesion = vendedor;
    }
    BinaryShop.persistir();
    return { ok: true, usuario: vendedor };
  },

  eliminarCuenta(idUsuario) {
    const objetivo = BinaryShop.buscarUsuario(idUsuario);
    if (!objetivo) return { ok: false, mensaje: "Usuario no encontrado." };
    if (objetivo.rol === "admin") {
      return { ok: false, mensaje: "No se puede eliminar una cuenta de administrador." };
    }
    BinaryShop.usuarios = BinaryShop.usuarios.filter((u) => u.idUsuario !== idUsuario);
    BinaryShop.persistir();
    return { ok: true };
  },
};
