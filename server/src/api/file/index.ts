import {Request, Response, Router} from "express";
import {UploadedFile} from "express-fileupload";
import {NotFound} from "http-errors";
import stream from "stream";
import path from "path";

import {asyncHandler} from "../asyncHandler";
import {getRepository} from "../../db";
import {File} from "../../entities/File";

export const fileRouter = Router();

fileRouter.post("/", asyncHandler(async (req: Request, res: Response): Promise<any> => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
    }

    if (!Array.isArray(req.files.file) && req.files.file != undefined) {
        const file: UploadedFile = req.files.file
        const repo = await getRepository(File)
        const payload = {
            fileName: file.name,
            data: file.data,
            size: file.size
        } as any;
        const result = await repo.save(payload);
        res.json({status: "success", fileId: result.id});
    }
    else {
        throw new Error("File upload error");
    }

}));

fileRouter.get("/:id", asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const repo = await getRepository(File)
    const result = await repo.findOneBy({id: req.params.id as any})
    if (result == null) {
        throw new NotFound();
    }
    else {
        res.json(result);
    }
}));

const ContentTypes: Record<string, string> = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg"
};

fileRouter.get("/:id/attachment", asyncHandler(async (req, res) => {
    const repo = await getRepository(File);
    const record = await repo.findOneBy({id: req.params.id as any});
    if (record == null) {
        throw new NotFound();
    }
    else {
        const {fileName, data} = record;
        const ext = path.extname(fileName).toLowerCase();

        const readStream = new stream.PassThrough();
        readStream.end(Buffer.from(data, "base64"));
        res.set("Content-Disposition", `inline; filename=${record.fileName}`);
        res.set("Content-Type", ContentTypes[ext] ?? "application/octet-stream");

        readStream.pipe(res);
    }
}));
