import { Router, Response, Request } from "express";
import { authorizeUser } from "../middlewares";
import { catchAsync, listFilesInFolder, listFilesRecursively } from "../utils";
import httpStatus from "http-status";
import { Role } from "../enums";
const router = Router();

// Route to upload a file to Google Drive
router.get(
  "/getdirectories",
  catchAsync(async (req: Request, res: Response) => {
    const folderId = "1xah2mM6Hr4_r1ePzpJLurG-AeLAVp8oR"; // The ID of the folder you want to fetch structure for
    listFilesRecursively(folderId, 2, (directoryStructure) => {
      res.json(directoryStructure);
    });
  })
);

// Define other routes for Google Drive functions as needed

export default router;
