import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import getEnv from "./config";
import WebSocket from 'ws';
import { createLogRouter } from './routes/log_routes';

const app = express();
const wss = new WebSocket.Server({ port: 8080 });

const env = getEnv();
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
);
app.use('/api/logs', createLogRouter(wss));

wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.on('close', () => console.log('Client disconnected'));
});

app.listen(env.PORT, () => {
    console.log(`Server listening at ${env.PORT}`);
})