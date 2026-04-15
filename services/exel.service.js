
// Se importa la librería "xlsx", que permite leer y manipular archivos Excel
// (.xlsx, .xls) desde una aplicación Node.js.
const XLSX = require("xlsx");

// Se exporta la función leerExcel para que pueda ser utilizada
// desde otros archivos del proyecto (por ejemplo, desde un endpoint REST).
// La función recibe como parámetro filePath,
// que corresponde a la ruta del archivo Excel en el servidor.
exports.leerExcel = (filePath) => {

  // Se lee el archivo Excel desde el sistema de archivos usando la ruta recibida.
  // Esto carga todo el archivo en memoria y lo convierte en un objeto "workbook".
  const workbook = XLSX.readFile(filePath);

  // Se obtiene la primera hoja del archivo Excel.
  // workbook.SheetNames es un arreglo con los nombres de todas las hojas,
  // y [0] indica la primera hoja.
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  // Se transforma el contenido de la hoja seleccionada a formato JSON.
  // Cada fila del Excel se convierte en un objeto,
  // y el resultado final es un arreglo de objetos JavaScript.
  // Este JSON será usado posteriormente por un endpoint REST
  // para procesar o enviar los datos (por ejemplo, a la API de MercadoLibre).
  return XLSX.utils.sheet_to_json(sheet);
};
