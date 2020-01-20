/*
 * Puerto
 */
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

/*
 * Base de datos
 */
let urlDB;

// =============================
// Vencimiento del token
// 30 días
// =============================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =============================
// Semilla de atentificación
// =============================

process.env.SEMILLA = process.env.SEMILLA || "semilla-desarrollo";

// =========================================================
// Definimos base de datos en base al entorno  dev o prod
// Si es dev se usa mongo local si es prod se usa:
// https://cloud.mongodb.com/
// =========================================================

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB = "mongodb+srv://fran:1of8aQ1PAcuih7BN@cluster0-k1dhu.mongodb.net/cafe";
}

process.env.URLDB = urlDB;

// =============================
// Google Client id
// =============================

process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "593495730565-1uj9b84683c4tddcaiqm7h45ughu9lim.apps.googleusercontent.com";
