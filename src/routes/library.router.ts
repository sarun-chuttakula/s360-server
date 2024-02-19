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
const router = Router();

// Route to upload a file to Google Drive
// router.get(
//   "/getdirectories",
//   catchAsync(async (req: Request, res: Response) => {
//     const folderId = "1xah2mM6Hr4_r1ePzpJLurG-AeLAVp8oR"; // The ID of the folder you want to fetch structure for
//     listFilesRecursively(folderId, 2, (directoryStructure) => {
//       res.json(directoryStructure);
//     });
//   })
// );

// router.get("/getstructure/", async (req: Request, res: Response) => {
//   try {
//     const folderId = "1xah2mM6Hr4_r1ePzpJLurG-AeLAVp8oR";
//     const folderStructure = await fetchFolderStructure(folderId);
//     res.json(folderStructure);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Define other routes for Google Drive functions as needed

router.get(
  "/getdirectories",
  // authorizeUser([Role.ADMIN, Role.USER]),
  catchAsync(async (req: Request, res: Response) => {
    const files = await directoryTreeStructure();
    res.json(files);
  })
);

export default router;
