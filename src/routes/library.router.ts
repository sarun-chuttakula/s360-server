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
import { directoryTreeStructure } from "../repositories/library.repository";
import { generate_json } from "../utils/folders.util";
import multer from "multer";
import path from "path";
import { fileUpload } from "./file-uploader";
const router = Router();

// Route to upload a file to Google Drive
router.get(
  "/getdirectories",
  // authorizeUser([Role.teacher, Role.student]),
  catchAsync(async (req: Request, res: Response) => {
    const folderStructure = await generate_json(req.query.path as string);
    res.status(httpStatus.OK).json(folderStructure);
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
// router.post("/uploadfile", async (req: Request, res: Response) => {
//   const upload = fileUpload.single("file");
//   upload(req, res, async (err: any) => {
//     if (err) {
//       return res.status(400).json({ error: "File upload failed" });
//     }
//     if (!req.file) {
//       return res.status(400).json({ error: "File upload failed" });
//     }
//     const uploadPath = req.body.path || "/default/upload/directory";
//     const filePath = path.join(uploadPath, req.file.filename);
//     const content = req.file.buffer.toString(); // Assuming the file content is text, adjust if it's binary
//     try {
//       await addFile(filePath, content);
//       res.status(200).json({ message: "File uploaded successfully" });
//     } catch (error) {
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });
// });

export default router;
