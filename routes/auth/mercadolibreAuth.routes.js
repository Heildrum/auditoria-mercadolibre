
const express = require("express");
const router = express.Router();

// ✅ Callback OAuth de MercadoLibre
router.get("/mercadolibre/callback", async (req, res) => {

  // MercadoLibre envía este "code" por query string
  const { code } = req.query;

  // Validación básica
  if (!code) {
    return res.status(400).json({
      ok: false,
      message: "No se recibió el code de MercadoLibre"
    });
  }

  // Por ahora solo confirmamos que llegó correctamente
  // Luego este code se intercambia por el access_token
  res.status(200).json({
    ok: true,
    message: "Callback recibido correctamente",
    code
  });
});

module.exports = router;
