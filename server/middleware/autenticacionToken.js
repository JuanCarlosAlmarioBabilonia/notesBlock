import jwt from "jsonwebtoken";

// Lista negra temporal para tokens
export let tokenBlacklist = [];

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log('Token recibido:', token); // Log del token

    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    if (tokenBlacklist.includes(token)) {
        return res.status(401).json({ message: "Token inválido o sesión expirada" });
    }

    const SECRET_KEY = process.env.JWT_SECRET;
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log('Error en la verificación:', err);
            return res.status(401).json({ message: "El usuario no está autenticado" });
        }
        console.log('Decodificado:', decoded); // Agregar log para ver el contenido
        req.userId = decoded.userId;
        console.log('ID de usuario decodificado:', req.userId); // Log del  
        next();
    });
};

export default authenticateToken;
