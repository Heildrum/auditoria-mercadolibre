
// Se importa la librería Express, que permite crear servidores
// y definir rutas HTTP en Node.js.
const express = require("express");

// Se crea un objeto Router de Express.
// El Router sirve para agrupar rutas relacionadas,
// en este caso, rutas asociadas a MercadoLibre.
const router = express.Router();

// Se define una ruta HTTP GET en la raíz del router ("/").
// Esta ruta se ejecutará cuando alguien acceda a esta sección
// de la API (por ejemplo: /mercadolibre o /api/mercadolibre,
// dependiendo de cómo se monte en app.js).
router.get("/", (req, res) => {

  // Se envía una respuesta simple en texto.
  // Esto se usa normalmente como endpoint de prueba
  // para verificar que la ruta está funcionando correctamente.
  // No realiza ninguna lógica de negocio ni llamadas a la API de MercadoLibre.
  res.send("MercadoLibre OK 🚀");
});

// Se exporta el router para que pueda ser importado
// y utilizado en el archivo principal de la aplicación (app.js),
// donde se asocia a una ruta base.
module.exports = router;
