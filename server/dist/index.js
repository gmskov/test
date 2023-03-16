"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const api_1 = require("./api");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, express_fileupload_1.default)({
    defCharset: 'utf8',
    defParamCharset: 'utf8',
    useTempFiles: false,
    tempFileDir: '/tmp/'
}));
app.use((0, cors_1.default)({
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: (o, fn) => fn(null, o),
    credentials: true,
}));
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});
app.use("/api", api_1.apiRouter);
const PORT = process.env["PORT"] || 4567;
app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
});
