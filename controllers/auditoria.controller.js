const excelService = require("../services/excel.service");
const mlService = require("../services/ml.service");
const fs = require("fs");

exports.auditar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: "Sin archivo" });
    }

    const filePath = req.file.path;

    // 1. leer Excel
    const data = excelService.leerExcel(filePath);

    const resultados = [];

    // 2. recorrer productos
    for (let item of data) {
      const mlData = await mlService.obtenerProducto(item.id);

      resultados.push({
        id: item.id,
        sku_excel: item.sku,
        sku_ml: mlData.sku,
        price_excel: item.price,
        price_ml: mlData.price,
        desc_excel: item.description,
        desc_ml: mlData.description,
        error:
          item.price != mlData.price ||
          item.sku != mlData.sku ||
          item.description != mlData.description
      });
    }

    fs.unlinkSync(filePath);

    res.json({ ok: true, resultados });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
};