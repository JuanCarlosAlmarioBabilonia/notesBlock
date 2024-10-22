import express from 'express';
import { getAllNotas } from '../controllers/notaController.js';

const nota = express.Router();

nota.get('/', getAllNotas);

export default nota;
