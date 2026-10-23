"use strict";

/* =========================================================
   UI de autenticación (index.html): pestañas, login y
   registro simulado.
   ========================================================= */

const AuthUI = {
  iniciar() {
    BinaryShop.init();

    if (BinaryShop.sesion) {
      window.location.href = "catalogo.html";
      return;
    }

    porId("pestana-login").addEventListener("click", () => this.mostrarFormulario("login"));
    porId("pestana-registro").addEventListener("click", () => this.mostrarFormulario("registro"));
    porId("form-login").addEventListener("submit", (e) => this.manejarLogin(e));
    porId("form-registro").addEventListener("submit", (e) => this.manejarRegistro(e));
  },

  mostrarFormulario(cual) {
    porId("pestana-login").classList.toggle("activo", cual === "login");
    porId("pestana-registro").classList.toggle("activo", cual === "registro");
    porId("form-login").classList.toggle("oculto", cual !== "login");
    porId("form-registro").classList.toggle("oculto", cual !== "registro");
  },

  manejarLogin(evento) {
    evento.preventDefault();
    const identificador = porId("login-identificador").value.trim();
    const password = porId("login-password").value;

    const resultado = Autenticador.autenticar(identificador, password);
    if (!resultado.ok) {
      notificar(resultado.mensaje, "error");
      return;
    }
    notificar(`Sesión iniciada. Bienvenido, ${BinaryShop.sesion.nombre}.`);
    window.location.href = "catalogo.html";
  },

  manejarRegistro(evento) {
    evento.preventDefault();
    const datos = {
      nombre: porId("reg-nombre").value.trim(),
      apellido: porId("reg-apellido").value.trim(),
      nickname: porId("reg-nickname").value.trim(),
      correo: porId("reg-correo").value.trim(),
      contrasena: porId("reg-password").value,
      direccion: porId("reg-direccion").value.trim(),
      datosBancarios: porId("reg-bancarios").value.trim(),
    };
    if (!datos.nombre || !datos.nickname || !datos.correo || !datos.contrasena) {
      notificar("Completa al menos nombre, nickname, correo y contraseña.", "error");
      return;
    }
    const resultado = ControladorUsuario.registrarUsuario(datos);
    if (!resultado.ok) {
      notificar(resultado.mensaje, "error");
      return;
    }
    porId("form-registro").reset();
    notificar("Registro exitoso. Ahora puedes iniciar sesión.");
    this.mostrarFormulario("login");
    porId("login-identificador").value = datos.correo;
  },
};

document.addEventListener("DOMContentLoaded", () => AuthUI.iniciar());
