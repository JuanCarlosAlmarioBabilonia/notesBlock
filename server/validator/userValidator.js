import { body, validationResult } from 'express-validator';


export const schemaUsers = [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('apellido').notEmpty().withMessage('El apellido es requerida'),
    body('email').notEmpty().withMessage('El email es requerida'),
    body('username').notEmpty().withMessage('El username es requerida'),
    body('password').notEmpty().withMessage('La password es requerida'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];