import express from 'express';
const versionNota = express.Router();
import nota from "../version/notaV1.js"

versionNota.use('/v1', nota);

export default versionNota;
