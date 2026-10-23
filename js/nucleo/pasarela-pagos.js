"use strict";

/* =========================================================
   Pasarela de pagos (simulación sin cobro real)
   ========================================================= */

const PasarelaDePagos = {
  solicitarCobro(montoTotal, datosBancarios) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          aprobado: true,
          idTransaccion:
            "TXN-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random() * 900 + 100),
        });
      }, 1600);
    });
  },
};
