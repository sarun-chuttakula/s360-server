// fileUploader.ts
import multer from "multer";
import { Request } from "express";
import { mkdir } from "fs/promises";
import { extname } from "path";
import { randomUUID } from "crypto";

const storage = multer.diskStorage({
  destination: async function (
    _req: any,
    _file: Express.Multer.File,
    callback: Function
  ) {
    console.log(_req["uploadPath"]);
    const uploadPath = _req["uploadPath"] || "/default/upload/directory";
    try {
      await mkdir(uploadPath, { recursive: true });
      callback(null, uploadPath);
    } catch (err) {
      callback(err);
    }
  },
  filename: function (
    _req: Request,
    file: Express.Multer.File,
    callback: Function
  ) {
    const extension = extname(file.originalname);
    const uniqueId = randomUUID();
    const newFilename = `${uniqueId}${extension}`;
    callback(null, newFilename);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: Function) => {
  cb(null, true); // Accept all files
};

export const fileUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
