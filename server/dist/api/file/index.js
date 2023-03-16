"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileRouter = void 0;
const express_1 = require("express");
const http_errors_1 = require("http-errors");
const stream_1 = __importDefault(require("stream"));
const path_1 = __importDefault(require("path"));
const asyncHandler_1 = require("../asyncHandler");
const db_1 = require("../../db");
const File_1 = require("../../entities/File");
exports.fileRouter = (0, express_1.Router)();
exports.fileRouter.post('/', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    if (!Array.isArray(req.files.file) && req.files.file != undefined) {
        const file = req.files.file;
        const repo = yield (0, db_1.getRepository)(File_1.File);
        const payload = {
            fileName: file.name,
            data: file.data,
            size: file.size
        };
        const result = yield repo.save(payload);
        res.json({ status: 'success', fileId: result.id });
    }
    else {
        throw new Error('File upload error');
    }
})));
exports.fileRouter.get('/:id', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repo = yield (0, db_1.getRepository)(File_1.File);
    const result = yield repo.findOneBy({ id: req.params.id });
    if (result == null) {
        throw new http_errors_1.NotFound();
    }
    else {
        res.json(result);
    }
})));
const ContentTypes = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg"
};
exports.fileRouter.get("/:id/attachment", (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const repo = yield (0, db_1.getRepository)(File_1.File);
    const record = yield repo.findOneBy({ id: req.params.id });
    if (record == null) {
        throw new http_errors_1.NotFound();
    }
    else {
        const { fileName, data } = record;
        const ext = path_1.default.extname(fileName).toLowerCase();
        const readStream = new stream_1.default.PassThrough();
        readStream.end(Buffer.from(data, "base64"));
        res.set("Content-Disposition", `inline; filename=${record.fileName}`);
        res.set("Content-Type", (_a = ContentTypes[ext]) !== null && _a !== void 0 ? _a : "application/octet-stream");
        readStream.pipe(res);
    }
})));
