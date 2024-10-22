import express from 'express';
const versionHistorial = express.Router();
import historial from "../version/historialV1.js"

versionHistorial.use('/v1', historial);

export default versionHistorial;
