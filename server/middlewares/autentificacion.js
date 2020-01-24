const jwt = require("jsonwebtoken");

// ======================
// Verificar Token
// ======================

let verificarToken = (req, res, next) => {
  // el get es por q traigo los headers
  let token = req.get("Authorization");

  jwt.verify(token, process.env.SEMILLA, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no válido"
        }
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};

// ======================
// Verifica Token para imágen
// ======================

let verificarTokenImg = (req, res, next) => {
  let token = req.query.token;

  jwt.verify(token, process.env.SEMILLA, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no válido"
        }
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};

// ======================
// Verificar Rol Admin
// ======================

let verificarAdmin_Rol = (req, res, next) => {
  let usuario = req.usuario;

  if (usuario.role === "ADMIN_ROLE") {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: "El usuario no es administrador"
      }
    });
  }
};

module.exports = {
  verificarToken,
  verificarAdmin_Rol,
  verificarTokenImg
};
