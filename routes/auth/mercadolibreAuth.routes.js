
const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

// ✅ Callback OAuth COMPLETO de MercadoLibre
router.get("/mercadolibre/callback", async (req, res) => {
  const { code } = req.query;

  // 1️⃣ Validación básica
  if (!code) {
    return res.status(400).json({
      ok: false,
      message: "No se recibió el code de MercadoLibre"
    });
  }

  try {
    // 2️⃣ Intercambio code → access_token
    const response = await fetch(
      "https://api.mercadolibre.com/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: code,
          redirect_uri:
            "https://auditoria-mercadolibre-4.onrender.com/auth/mercadolibre/callback"
        })
      }
    );

    const data = await response.json();

    // 3️⃣ Manejo de error OAuth
    if (data.error) {
      return res.status(400).json({
        ok: false,
        error: data.error,
        description: data.error_description || data.message,
        data
      });
    }

    // ✅ 4️⃣ ÉXITO: tokens recibidos
    return res.json({
      ok: true,
      message: "Access token generado correctamente",
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      user_id: data.user_id
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al conectar con MercadoLibre",
      error: error.message
    });
  }
});

module.exports = router;


