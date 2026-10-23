"use strict";

/* =========================================================
   Autenticador (diagrama de secuencia: Login)
   ========================================================= */

const Autenticador = {
  autenticar(identificador, password) {
    const usuario = this.validarCredenciales(identificador, password);
    if (!usuario) {
      return { ok: false, mensaje: "Credenciales incorrectas. Verifica tu correo o nickname y tu contraseña." };
    }
    BinaryShop.sesion = usuario;
    BinaryShop.carrito = new Carrito(BinaryShop.siguienteId("carrito"), usuario.idUsuario);
    BinaryShop.persistir();
    return { ok: true, rol: usuario.rol };
  },

  validarCredenciales(identificador, password) {
    return (
      BinaryShop.usuarios.find(
        (u) => (u.correo === identificador || u.nickname === identificador) && u.contrasena === password
      ) || null
    );
  },

  cerrarSesion() {
    BinaryShop.sesion = null;
    BinaryShop.carrito = null;
    BinaryShop.persistir();
  },
};
