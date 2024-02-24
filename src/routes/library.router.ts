import { Router, Response, Request } from "express";
import { authorizeUser } from "../middlewares";
import {
  catchAsync,
  fetchFolderStructure,
  listFilesInFolder,
  listFilesRecursively,
} from "../utils";
import httpStatus from "http-status";
import { Role } from "../enums";
import {
  directoryTreeStructure,
  uploadFile,
} from "../repositories/library.repository";
import { generate_json } from "../utils/folders.util";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileUpload } from "./file-uploader";
import LibraryController from "../controllers/library.controller";
const upload = multer();
const router = Router();

// Route to upload a file to Google Drive
router.get(
  "/getdirectories",
  authorizeUser([Role.teacher, Role.student]),
  catchAsync(async (req: Request, res: Response) => {
    const libraryController = new LibraryController(req);
    const folderStructure = await libraryController.getDirectories(
      req.query.path as string
    );
    res.status(httpStatus.OK).json(folderStructure);
  })
);

router.get(
  "/api/download/",
  authorizeUser([Role.teacher, Role.student]),
  catchAsync(async (req: Request, res: Response) => {
    const path = req.query.path as string;
    // const fullpath = `/Users/ch.sarun/Documents/MyCodes/Code/Projects/S360/s360-server/src/${path}`;
    const libraryController = new LibraryController(req);
    const response = await libraryController.downloadFile(path, res);
    res.status(httpStatus.OK).json(response);
  })
);

// router.post(
//   "/createfolder",
//   authorizeUser([Role.teacher, Role.student]),
//   catchAsync(async (req: Request, res: Response) => {
//     req.body.path;
//     req.body.folderName;
//     const folderStructure = await createFolder(
//       req.body.path,
//       req.body.folderName
//     );
//     res.status(httpStatus.OK).json(folderStructure);
//   })
// );

// Route to upload a file to Google Drive
const THUMBNAILS_DIRECTORY = "./src/thumbnails";
router.post(
  "/uploadfile",
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const folderName: string = req.body.path || "/default/upload/directory";
    const fileName: string = req.file.originalname;
    const folderPath: string = path.join(THUMBNAILS_DIRECTORY, folderName);
    const filePath: string = path.join(folderPath, fileName);
    const fileContent: Buffer = req.file.buffer; // Assuming the file content is in buffer form

    try {
      await uploadFile(folderPath, filePath, fileContent);
      res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
