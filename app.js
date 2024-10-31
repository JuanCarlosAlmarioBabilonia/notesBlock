import express from 'express';
// import https from 'https';
// import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { jsonParseErrorHandler } from './server/middleware/errorHandler.js';
import Database from "./server/database/connect.js";
import versionNota from "./server/routes/notaRouter.js";
import versionUser from "./server/routes/userRouter.js";
import sessionMiddleware from "./server/middleware/sessionConfig.js"
import cors from 'cors';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const db = Database.getInstance();

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'https://localhost:5000'], // Permite ambos orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};


app.use(cors(corsOptions)); 

app.use(express.json());
app.use(sessionMiddleware)
app.use(jsonParseErrorHandler);

// Sirve los archivos de la carpeta 'build' en producción
app.use(express.static(path.join(__dirname, 'build')));

// Ruta raíz para el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.use("/notes", versionNota)
app.use("/users", versionUser)

// const privateKey = fs.readFileSync(path.resolve(__dirname, './private.key'));
// const certificate = fs.readFileSync(path.resolve(__dirname, './certificate.crt'));

// const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);

const port = process.env.EXPRESS_PORT || 3000;

// httpsServer.listen(port, () => {
//     console.log(`Servidor HTTPS escuchando en ${process.env.EXPRESS_PROTOCOL}${process.env.EXPRESS_HOST}:${port}`);
// });

app.listen(port, () => {
    console.log(`Servidor escuchando en http://${process.env.EXPRESS_HOST}:${port}`);
});
