"use strict";

/* =========================================================
   UI del panel de administrador (admin.html): eliminar
   cuentas de usuario y publicaciones.
   ========================================================= */

const AdminUI = {
  iniciar() {
    this.render();
    this.mostrarPestana("usuarios");
    porId("pestana-admin-usuarios").addEventListener("click", () => this.mostrarPestana("usuarios"));
    porId("pestana-admin-productos").addEventListener("click", () => this.mostrarPestana("productos"));
    porId("panel-admin-usuarios").addEventListener("click", (e) => this.alClickUsuarios(e));
    porId("panel-admin-productos").addEventListener("click", (e) => this.alClickProductos(e));
  },

  render() {
    porId("tabla-usuarios").innerHTML = `
      <thead>
        <tr><th>ID</th><th>Nombre</th><th>Nickname</th><th>Correo</th><th>Rol</th><th>Acción</th></tr>
      </thead>
      <tbody>
        ${BinaryShop.usuarios.map((u) => `
          <tr>
            <td>${u.idUsuario}</td>
            <td>${escaparHtml(u.nombreCompleto)}</td>
            <td>@${escaparHtml(u.nickname)}</td>
            <td>${escaparHtml(u.correo)}</td>
            <td><span class="insignia-rol insignia-${escaparHtml(u.rol)}">${escaparHtml(u.rol)}</span></td>
            <td>${u.rol === "admin"
              ? '<button type="button" class="btn btn-mini" disabled title="No se puede eliminar un administrador">Eliminar</button>'
              : `<button type="button" class="btn btn-peligro btn-mini" data-id="${u.idUsuario}">Eliminar</button>`}</td>
          </tr>`).join("")}
      </tbody>`;

    porId("tabla-publicaciones").innerHTML = `
      <thead>
        <tr><th>ID</th><th>Imagen</th><th>Producto</th><th>Vendedor</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acción</th></tr>
      </thead>
      <tbody>
        ${BinaryShop.productos.map((p) => {
          const vendedor = BinaryShop.buscarUsuario(p.idVendedor);
          return `
          <tr>
            <td>${p.idProducto}</td>
            <td><img class="miniatura" src="${p.imagenUrl}" alt=""></td>
            <td>${escaparHtml(p.titulo)}</td>
            <td>${vendedor ? "@" + escaparHtml(vendedor.nickname) : "—"}</td>
            <td>${formatearDinero(p.precio)}</td>
            <td>${p.stock}</td>
            <td>${escaparHtml(p.estado)}</td>
            <td><button type="button" class="btn btn-peligro btn-mini" data-id="${p.idProducto}">Eliminar</button></td>
          </tr>`;
        }).join("")}
      </tbody>`;
  },

  mostrarPestana(cual) {
    porId("pestana-admin-usuarios").classList.toggle("activo", cual === "usuarios");
    porId("pestana-admin-productos").classList.toggle("activo", cual === "productos");
    porId("panel-admin-usuarios").classList.toggle("oculto", cual !== "usuarios");
    porId("panel-admin-productos").classList.toggle("oculto", cual !== "productos");
  },

  alClickUsuarios(evento) {
    const boton = evento.target.closest("button[data-id]");
    if (!boton) return;
    const id = Number(boton.dataset.id);
    const objetivo = BinaryShop.buscarUsuario(id);
    if (!objetivo) return;
    if (!window.confirm(`¿Eliminar la cuenta de @${objetivo.nickname}?`)) return;

    const resultado = BinaryShop.sesion.eliminarCuenta(id);
    if (resultado.ok) {
      notificar(`Cuenta @${objetivo.nickname} eliminada.`);
      this.render();
    } else {
      notificar(resultado.mensaje, "error");
    }
  },

  alClickProductos(evento) {
    const boton = evento.target.closest("button[data-id]");
    if (!boton) return;
    const id = Number(boton.dataset.id);
    const objetivo = BinaryShop.buscarProducto(id);
    if (!objetivo) return;
    if (!window.confirm(`¿Eliminar la publicación "${objetivo.titulo}"?`)) return;

    const resultado = BinaryShop.sesion.removerProducto(id);
    if (resultado.ok) {
      notificar(`Publicación "${objetivo.titulo}" eliminada.`);
      this.render();
    } else {
      notificar(resultado.mensaje, "error");
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Compartido.iniciar({ pagina: "admin", roles: ["admin"], alListo: () => AdminUI.iniciar() });
});
