import express from "express";
import cors from "cors";
import {apiRouter} from "./api";
import fileUpload from 'express-fileupload';

const app = express();

app.use(express.json());
app.use(fileUpload({
    defCharset: 'utf8',
    defParamCharset: 'utf8',
    useTempFiles : false,
    tempFileDir : '/tmp/'
}));
app.use(cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: (o, fn) => fn(null, o),
    credentials: true,
}))

app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

app.use("/api", apiRouter);

const PORT = process.env["PORT"] || 4567;

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
});
