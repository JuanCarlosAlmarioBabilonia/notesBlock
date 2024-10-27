import express from 'express';
const user = express.Router({ mergeParams: true });
import version from "../middleware/versionate.js";
import { createUser } from '../controllers/userController.js';
import { logoutUser, loginUser } from "../controllers/loginController.js"

/**
 * POST
 * ! Version 1.0.0
 */
user.post('/', version("1.0.0"), createUser); 
user.post('/logout', version("1.0.0"), logoutUser);
user.post('/login', version("1.0.0"), loginUser); 
/**
 * DELETE
 * ! Version 1.0.0
 */

/**
 * PUT
 *! Version 1.0.0
 */


export default user;
