"use strict";

/* =========================================================
   Datos predefinidos de BinaryShop (simulación sin base de
   datos) y generador de imágenes SVG embebidas.
   ========================================================= */

function escaparXml(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function generarImagenProducto(titulo, color1, color2) {
  const inicial = (titulo.trim().charAt(0) || "B").toUpperCase();
  const tituloSeguro = escaparXml(titulo);
  let bits = "";
  for (let i = 0; i < 16; i += 1) bits += Math.random() > 0.5 ? "1" : "0";
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320">` +
    `<defs><linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${color1}"/><stop offset="1" stop-color="${color2}"/>` +
    `</linearGradient></defs>` +
    `<rect width="480" height="320" fill="url(#fondo)"/>` +
    `<text x="24" y="300" font-family="monospace" font-size="16" fill="rgba(255,255,255,0.22)" letter-spacing="3">${bits}</text>` +
    `<circle cx="240" cy="132" r="70" fill="rgba(255,255,255,0.14)"/>` +
    `<text x="240" y="164" font-family="Arial, sans-serif" font-size="84" font-weight="bold" fill="#ffffff" text-anchor="middle">${inicial}</text>` +
    `<text x="240" y="242" font-family="Arial, sans-serif" font-size="20" fill="#ffffff" text-anchor="middle">${tituloSeguro}</text>` +
    `</svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

const DATOS_INICIALES = {
  usuarios: [
    {
      rol: "comprador",
      idUsuario: 1,
      nombre: "Saul",
      apellido: "Betancourt",
      nickname: "comprador1",
      correo: "comprador@binaryshop.com",
      contrasena: "compra123",
      datosBancarios: "4111 1111 1111 1111",
      direccion: "Av. Central 123",
    },
    {
      rol: "vendedor",
      idUsuario: 2,
      nombre: "Diego",
      apellido: "Morales",
      nickname: "vendedor1",
      correo: "vendedor@binaryshop.com",
      contrasena: "venta123",
      datosBancarios: "4222 2222 2222 2222",
      direccion: "Jr. Comercio 456",
    },
    {
      rol: "admin",
      idUsuario: 3,
      nombre: "Administrador",
      apellido: "BinaryShop",
      nickname: "admin",
      correo: "admin@binaryshop.com",
      contrasena: "admin123",
      datosBancarios: "",
      direccion: "",
    },
  ],

  productos: [
    {
      idProducto: 1,
      titulo: 'Laptop Pro 14"',
      descripcion: "Laptop ultraligera con procesador de última generación, 16 GB de RAM y SSD de 512 GB.",
      precio: 3499.9,
      stock: 5,
      idVendedor: 2,
      imagenUrl: generarImagenProducto("Laptop Pro 14", "#1e3a8a", "#3b82f6"),
    },
    {
      idProducto: 2,
      titulo: "Smartphone X10",
      descripcion: "Pantalla OLED de 6.5 pulgadas, cámara de 108 MP y batería de larga duración.",
      precio: 1899.0,
      stock: 8,
      idVendedor: 2,
      imagenUrl: generarImagenProducto("Smartphone X10", "#065f46", "#10b981"),
    },
    {
      idProducto: 3,
      titulo: "Audífonos Bluetooth",
      descripcion: "Cancelación activa de ruido, 30 horas de batería y carga rápida USB-C.",
      precio: 249.9,
      stock: 15,
      idVendedor: 2,
      imagenUrl: generarImagenProducto("Audífonos BT", "#7c2d12", "#f97316"),
    },
    {
      idProducto: 4,
      titulo: "Teclado Mecánico RGB",
      descripcion: "Switches intercambiables, retroiluminación RGB y estructura de aluminio.",
      precio: 399.0,
      stock: 10,
      idVendedor: 2,
      imagenUrl: generarImagenProducto("Teclado RGB", "#581c87", "#a855f7"),
    },
    {
      idProducto: 5,
      titulo: 'Monitor 27" 4K',
      descripcion: "Resolución 4K UHD, 144 Hz, panel IPS con 99% de cobertura sRGB.",
      precio: 1299.0,
      stock: 6,
      idVendedor: 2,
      imagenUrl: generarImagenProducto("Monitor 4K", "#0c4a6e", "#0ea5e9"),
    },
    {
      idProducto: 6,
      titulo: "Mouse Gamer",
      descripcion: "16 000 DPI, 8 botones programables y diseño ergonómico con iluminación.",
      precio: 179.9,
      stock: 20,
      idVendedor: 2,
      imagenUrl: generarImagenProducto("Mouse Gamer", "#831843", "#ec4899"),
    },
    {
      idProducto: 7,
      titulo: "Webcam Full HD",
      descripcion: "Video 1080p a 60 FPS con enfoque automático y micrófonos duales integrados.",
      precio: 219.0,
      stock: 12,
      idVendedor: 2,
      imagenUrl: generarImagenProducto("Webcam HD", "#713f12", "#eab308"),
    },
    {
      idProducto: 8,
      titulo: "SSD NVMe 1TB",
      descripcion: "Lecturas de hasta 7000 MB/s, ideal para gaming y edición de video profesional.",
      precio: 499.9,
      stock: 3,
      idVendedor: 2,
      imagenUrl: generarImagenProducto("SSD 1TB", "#134e4a", "#14b8a6"),
    },
  ],
};
