import express from 'express';
import { getAllHistoriales } from '../controllers/historialController.js';

const historial = express.Router();

historial.get('/', getAllHistoriales);

export default historial;
