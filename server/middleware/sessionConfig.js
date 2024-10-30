import session from "express-session";
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

export const sessionMiddleware = session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // Cambia manualmente si estás en producción
        maxAge: 1800000 // 30 minutos
    }
});

export default sessionMiddleware;
