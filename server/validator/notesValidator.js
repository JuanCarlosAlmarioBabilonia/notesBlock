import { body, validationResult } from 'express-validator';

// Middleware para validación con express-validator
export const schemaNotes = [
    body('titulo').notEmpty().withMessage('El título es requerido'),
    body('descripcion').notEmpty().withMessage('La descripción es requerida'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];