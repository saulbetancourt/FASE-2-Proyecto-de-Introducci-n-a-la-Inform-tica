"use strict";

/* =========================================================
   Utilidades compartidas de la interfaz
   ========================================================= */

function porId(id) {
  return document.getElementById(id);
}

function escaparHtml(valor) {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatearDinero(valor) {
  return "$" + Number(valor).toFixed(2);
}

function notificar(mensaje, tipo = "exito") {
  const contenedor = porId("contenedor-toasts");
  const aviso = document.createElement("div");
  aviso.className = "toast toast-" + tipo;
  aviso.textContent = mensaje;
  contenedor.appendChild(aviso);
  requestAnimationFrame(() => aviso.classList.add("visible"));
  setTimeout(() => {
    aviso.classList.remove("visible");
    setTimeout(() => aviso.remove(), 350);
  }, 3600);
}

function abrirModal(html) {
  porId("contenido-modal").innerHTML = html;
  porId("modal").classList.remove("oculto");
}

function cerrarModal() {
  porId("modal").classList.add("oculto");
}
