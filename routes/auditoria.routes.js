
// Se importa el framework Express, que se utiliza para crear
// servidores web y APIs REST en Node.js.
const express = require("express");

// Se crea una instancia del Router de Express.
// El Router permite definir rutas de forma modular,
// para luego montarlas en el archivo principal (app.js).
const router = express.Router();

// Se define una ruta HTTP de tipo GET en la raíz del router ("/").
// Esta ruta responde cuando un cliente hace una petición GET
// al endpoint donde esté montado este router.
router.get("/", (req, res) => {

  // Se envía una respuesta simple en formato texto.
  // Este endpoint se usa generalmente como prueba
  // para verificar que la ruta está funcionando correctamente.
  // No procesa datos, no recibe JSON y no se comunica con otras APIs.
  res.send("Auditorias funcionando ✅");
});

// Se exporta el router para que pueda ser utilizado
// en el archivo principal de la aplicación (por ejemplo, app.js).
// Normalmente se monta así:
// app.use("/auditorias", require("./routes/auditorias"));
module.exports = router;
``
