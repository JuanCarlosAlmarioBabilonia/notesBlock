import express from 'express';
const nota = express.Router({ mergeParams: true });
import version from "../middleware/versionate.js";
import { getAllNotas, getNotaById, getNotaByTitulo, createNota, deleteNota, updateNota } from '../controllers/notaController.js';


/**
 * GET 
 * ! Version 1.0.0
 */
nota.get('/', version("1.0.0"), getAllNotas);
nota.get('/:id', version("1.0.0"), getNotaById);
nota.get('/search/:titulo', version("1.0.0"), getNotaByTitulo); 

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
