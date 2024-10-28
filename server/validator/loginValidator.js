import { body, validationResult } from 'express-validator';

// Middleware para validación con express-validator
export const schemaLogin = [
    body('username').notEmpty().withMessage('El username es requerido'),
    body('password').notEmpty().withMessage('La password es requerida'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];