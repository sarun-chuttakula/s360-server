import { randomUUID } from "crypto";
import { Request } from "express";
import multer from "multer";
import { promisify } from "util";
import fs from "fs";

const getExtension = (file: Express.Multer.File): string => {
  const splitArray = file.originalname.split(".");
  return splitArray?.length ? splitArray[splitArray.length - 1] : "";
};

const fileUploadStorage = multer.diskStorage({
  filename: function (
    _req: Request,
    file: Express.Multer.File,
    callback: Function
  ) {
    const extension = getExtension(file);
    const newFilename = `temp-${Date.now()}.${extension}`;
    callback(null, newFilename);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: Function) => {
  const extension = getExtension(file);
  if (["png", "jpeg", "jpg", "mp4", "docx", "xlsx"].includes(extension)) {
    cb(null, true);
  } else {
    cb("".replace("extension", extension), false);
  }
};

export const fileUpload = multer({
  storage: fileUploadStorage,
  fileFilter: fileFilter,
});
