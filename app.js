import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { jsonParseErrorHandler } from './server/middleware/errorHandler.js';
import Database from "./server/database/connect.js";
import versionUser from "./server/routes/userRouter.js";
import versionNota from "./server/routes/notaRouter.js";
import cors from 'cors';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const db = Database.getInstance();

const app = express();
app.use(cors()); 

app.use(express.json());
app.use(jsonParseErrorHandler);

app.use("/user", versionUser)
app.use("/notes", versionNota)

const privateKey = fs.readFileSync(path.resolve(__dirname, './private.key'));
const certificate = fs.readFileSync(path.resolve(__dirname, './certificate.crt'));

const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);

const port = process.env.EXPRESS_PORT || 3000;

httpsServer.listen(port, () => {
    console.log(`Servidor HTTPS escuchando en ${process.env.EXPRESS_PROTOCOL}${process.env.EXPRESS_HOST}:${port}`);
});
