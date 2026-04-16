

require("dotenv").config();

const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

app.get("/__probe__", (req, res) => {
  res.send("PROBE OK ✅");
});

// Node 18+ / Render: fetch nativo
// no se necesita node-fetch

// ================================
// 🔥 IMPORTAR RUTAS
// ================================
const auditoriasRoutes = require("./routes/auditoria.routes");
const mercadolibreRoutes = require("./routes/mercadolibre.routes");
const authMercadoLibreRoutes =
  require("./routes/auth/mercadolibreAuth.routes");

const app = express();

// ================================
// MIDDLEWARE BASICO
// ================================
app.use(cors());
app.use(express.json());

// ================================
// FRONTEND (INDEX.HTML)
// ================================
// ✅ public/ está en la MISMA carpeta que app.js
const PUBLIC_PATH = path.join(__dirname, "public");

// Servir archivos estáticos
app.use(express.static(PUBLIC_PATH));

// Forzar ruta raíz (evita "extraviado")
app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, "index.html"));
});

// ================================
// RUTAS MODULARES API
// ================================
app.use("/auditoria", auditoriasRoutes);
app.use("/mercadolibre", mercadolibreRoutes);
app.use("/auth", authMercadoLibreRoutes);

// ================================
// MULTER (UPLOAD)
// ================================
const upload = multer({ dest: "uploads/" });

// ================================
// ⚠️ TOKEN (TEMPORAL)
// ================================
// NOTA IMPORTANTE:
// - Esto funciona solo para pruebas
// - En producción debes usar el token DEL CLIENTE
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// ================================
// NORMALIZAR TEXTO
// ================================
const limpiarTexto = (texto) => {
  if (!texto) return "";
  return texto
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
};

// ================================
// LÓGICA AUDITORÍA
// ================================
const procesarAuditoria = async (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  const resultados = [];

  for (let item of data) {
    try {
      const itemId = item.id;
      if (!itemId) continue;

      const response = await fetch(
        `https://api.mercadolibre.com/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
          }
        }
      );

      const mlData = await response.json();

      const skuExcel = item.sku || null;
      const skuML = mlData.seller_custom_field || null;

      const priceExcel = item.price || 0;
      const priceML = mlData.price || 0;

      const descExcelRaw = item.description || "";
      const descMLRaw = mlData.title || "";

      const descExcel = limpiarTexto(descExcelRaw);
      const descML = limpiarTexto(descMLRaw);

      const errorSKU = skuExcel !== skuML;
      const errorPrice = Math.abs(priceExcel - priceML) > 0;
      const errorDesc = descExcel !== descML;

      resultados.push({
        id: itemId,
        sku_excel: skuExcel,
        sku_ml: skuML,
        price_excel: priceExcel,
        price_ml: priceML,
        desc_excel: descExcelRaw,
        desc_ml: descMLRaw,
        error_sku: errorSKU,
        error_price: errorPrice,
        error_desc: errorDesc,
        error: errorSKU || errorPrice || errorDesc
      });

    } catch (err) {
      resultados.push({
        id: item.id || "ERROR",
        error: true,
        mensaje: "Error consultando Mercado Libre"
      });
    }
  }

  return resultados;
};

// ================================
// RUTA FRONT (FORM HTML)
// ================================
app.post("/auditar", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "Sin archivo"
      });
    }

    const resultados = await procesarAuditoria(req.file.path);
    fs.unlinkSync(req.file.path);

    res.json({ ok: true, resultados });

  } catch (error) {
    console.error("Error real:", error);
    res.status(500).json({
      ok: false,
      message: error.message
    });
  }
});

// ================================
// API REST (JSON)
// ================================
app.post("/api/auditar", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "Sin archivo"
      });
    }

    const resultados = await procesarAuditoria(req.file.path);
    fs.unlinkSync(req.file.path);

    res.json({ ok: true, resultados });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
});

// ================================
// 🚀 SERVER
// ================================
app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Servidor escuchando");
});
