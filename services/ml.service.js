
// Se define una función llamada fetch usando una importación dinámica.
// Esto permite usar el paquete "node-fetch" en proyectos Node.js
// que utilizan CommonJS (require / exports).
// La función recibe todos los argumentos (...args) y los pasa a fetch.
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Se obtiene el ACCESS_TOKEN desde las variables de entorno del sistema.
// Este token se utiliza para autenticar las peticiones a la API de MercadoLibre.
// Usar variables de entorno evita exponer credenciales en el código.
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// Se exporta una función asíncrona llamada obtenerProducto,
// para que pueda ser utilizada desde otros archivos.
// La función recibe como parámetro el id del producto (ej: MLA123456789).
exports.obtenerProducto = async (id) => {

  // Se realiza una petición HTTP GET a la API de MercadoLibre
  // usando fetch. La URL consulta un ítem específico usando su ID.
  // Se envía el header Authorization con el token Bearer,
  // que es requerido por la API para acceder a ciertos datos.
  const res = await fetch(`https://api.mercadolibre.com/items/${id}`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`
    }
  });

  // Se convierte la respuesta HTTP en un objeto JavaScript
  // usando el método .json(). Esto permite acceder fácilmente
  // a los datos devueltos por la API.
  const data = await res.json();

  // Se retorna un objeto con solo los datos relevantes del producto.
  // En lugar de devolver toda la respuesta de MercadoLibre,
  // se seleccionan y renombran los campos necesarios.
  return {
    // Precio del producto obtenido desde la API
    price: data.price,

    // SKU personalizado del vendedor.
    // Si no existe (undefined o vacío), se devuelve null.
    sku: data.seller_custom_field || null,

    // Se usa el título del producto como descripción.
    // El comentario indica que puede mejorarse más adelante.
    description: data.title // luego lo mejoramos
  };
};
