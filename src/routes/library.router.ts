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
    const response = await listFilesRecursively(
      "1o1LfscjBoDzMfRGfK51HSAMcHy8M9mBH"
      // (data) => {
      //   res.json(data); // Send the data as JSON to the client
      // }
    );
    // res.send(response);
  })
);

// Define other routes for Google Drive functions as needed

export default router;
