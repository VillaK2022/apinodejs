import cors from 'cors';
import express from 'express';
import {PORT} from "./config.js";
import Routes from "./routes/routes.js";
import morgan from "morgan";

const app = express()
app.use(cors({
    origin: '*', // ✅ Permite cualquier IP
    optionsSuccessStatus: 200 
})); // Allows all origins

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(Routes);

app.listen(PORT)
console.log('servidor en el puerto', PORT);
