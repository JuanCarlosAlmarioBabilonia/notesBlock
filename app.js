import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { jsonParseErrorHandler } from './middleware/errorHandler.js';

// Cargar las variables de entorno
dotenv.config();

const app = express();

app.use(express.json());
app.use(jsonParseErrorHandler);

app.post("/", (req, res) => {
    res.status(200).json(req.body);
});

const privateKey = fs.readFileSync(path.resolve('./private.key'));
const certificate = fs.readFileSync(path.resolve('./certificate.crt'));

const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);

const port = process.env.EXPRESS_PORT; 

httpsServer.listen(port, () => {
    console.log(`Servidor HTTPS escuchando en ${process.env.EXPRESS_PROTOCOL}${process.env.EXPRESS_HOST}:${port}`);
});
