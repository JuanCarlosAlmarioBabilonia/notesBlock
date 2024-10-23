import express from 'express';
const nota = express.Router({ mergeParams: true });
import version from "../middleware/versionate.js";
import { getAllNotas, getNotaById, getNotaByTituloOrDescripcion, createNota, deleteNota, updateNota } from '../controllers/notaController.js';


/**
 * GET 
 * ! Version 1.0.0
 */
nota.get('/:id_usuario', version("1.0.0"), getAllNotas);
nota.get('/:id', version("1.0.0"), getNotaById);
nota.get('/search/:busqueda', version("1.0.0"), getNotaByTituloOrDescripcion); 

/**
 * POST
 * ! Version 1.0.0
 */
nota.post('/', version("1.0.0"), createNota); 

/**
 * DELETE
 * ! Version 1.0.0
 */
nota.delete('/:id', version("1.0.0"), deleteNota); 

/**
 * PUT
 *! Version 1.0.0
 */
nota.put('/:id', version("1.0.0"), updateNota); 


export default nota;
