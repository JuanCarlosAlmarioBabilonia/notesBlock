import express from 'express';
const user = express.Router({ mergeParams: true });
import version from "../middleware/versionate.js";
import { createUser } from '../controllers/userController.js';
import { logoutUser, loginUser as loginUserController } from "../controllers/loginController.js";
import authenticateToken from '../middleware/autenticacionToken.js';
import loginRateLimiter from "../limit/loginLimit.js"; // Renombrar la importación del limitador
import createUserLimiter from "../limit/userLimit.js"
import {schemaLogin} from "../validator/loginValidator.js"
import {schemaUsers} from "../validator/userValidator.js"
/**
 * POST
 * ! Version 1.0.0
 */
user.post('/', createUserLimiter, schemaUsers, version("1.0.0"), createUser); 
user.post('/logout', authenticateToken, version("1.0.0"), logoutUser);
user.post('/login', loginRateLimiter, schemaLogin, version("1.0.0"), loginUserController); // Usar el limitador aquí

/**
 * DELETE
 * ! Version 1.0.0
 */

/**
 * PUT
 * ! Version 1.0.0
 */

export default user;
