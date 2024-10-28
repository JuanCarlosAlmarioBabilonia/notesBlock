import express from 'express';
const nota = express.Router({ mergeParams: true });
import version from "../middleware/versionate.js";
import { getAllNotas, getNotaById, getNotaByTituloOrDescripcion, createNota, deleteNota, updateNota } from '../controllers/notaController.js';
import authenticateToken from '../middleware/autenticacionToken.js';
import {getAllNotasLimiter, getNotaByIdLimiter, getNotaByTituloOrDescripcionLimiter ,createNotaLimiter, deleteNotaLimiter, updateNotaLimiter} from "../limit/notaLimit.js"
import { schemaNotes } from "../validator/notesValidator.js"
/**
 * GET 
 * ! Version 1.0.0
 */
nota.get('/', getAllNotasLimiter, authenticateToken, version("1.0.0"), getAllNotas);
nota.get('/:id', getNotaByIdLimiter, authenticateToken, version("1.0.0"), getNotaById);
nota.get('/search/:busqueda', getNotaByTituloOrDescripcionLimiter, version("1.0.0"), getNotaByTituloOrDescripcion); 

/**
 * POST
 * ! Version 1.0.0
 */
nota.post('/', createNotaLimiter, authenticateToken, schemaNotes, version("1.0.0"), createNota); 

/**
 * DELETE
 * ! Version 1.0.0
 */
nota.delete('/:id', deleteNotaLimiter, authenticateToken, version("1.0.0"), deleteNota); 

/**
 * PUT
 *! Version 1.0.0
 */
nota.put('/:id', updateNotaLimiter, version("1.0.0"), updateNota); 


export default nota;
