// middleware/auth.js
import jwt from "jsonwebtoken";

// Lista negra temporal para tokens
export let tokenBlacklist = [];

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    if (tokenBlacklist.includes(token)) {
        return res.status(401).json({ message: "Token inválido o sesión expirada" });
    }

    const SECRET_KEY = process.env.JWT_SECRET;
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "El usuario no está autenticado" });
        }
        req.userId = decoded.userId; // Asegúrate de que estás usando el campo correcto
        next(); // Llama a next() para continuar con la siguiente función
    });
};

export default authenticateToken;
