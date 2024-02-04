import { google, drive_v3 } from "googleapis";
import * as fs from "fs";
import { Multer } from "multer";
import { Express } from "express";
// Load the service account JSON file
const serviceAccount = require("../../s360-key.json");

// Create an OAuth2 client with the service account credentials
const auth = new google.auth.JWT(
  serviceAccount.client_email,
  undefined,
  serviceAccount.private_key,
  ["https://www.googleapis.com/auth/drive"]
);

// Create a Google Drive API client
const drive = google.drive({ version: "v3", auth });

// Function to list all files and folders recursively in a Google Drive folder
const listFilesRecursively = (folderId: string, depth: number = 0) => {
  // Print indentation based on depth
  const indent = "  ".repeat(depth);

  // List files in the current folder
  drive.files.list(
    {
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType, parents)",
    },
    (err: any, res: any) => {
      if (err) {
        console.error(err);
        return;
      }

      const files = res.data.files;
      if (files && files.length > 0) {
        // Log files in the current folder
        console.log(`${indent}Files in folder ${folderId}:`);
        files.forEach((file: any) => {
          console.log(
            `${indent}- ${file.name} (ID: ${file.id}, Type: ${file.mimeType})`
          );
          if (file.mimeType === "application/vnd.google-apps.folder") {
            // Recursively list files in subfolders
            listFilesRecursively(file.id, depth + 1);
          }
        });
      } else {
        console.log(`${indent}No files found in the folder ${folderId}.`);
      }
    }
  );
};

// Function to list files and folders in a folder
const listFilesInFolder = (folderId: string) => {
  drive.files.list(
    {
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType, parents)",
    },
    (err: any, res: any) => {
      if (err) {
        console.error(err);
      } else {
        const files = res.data.files;
        if (files && files.length > 0) {
          console.log("Files in folder:");
          files.forEach((file: any) => {
            console.log(
              `- ${file.name} (ID: ${file.id}, Type: ${file.mimeType})`
            );
          });
        } else {
          console.log("No files found in the folder.");
        }
      }
    }
  );
};
// Function to upload a file to Google Drive
const uploadFileToDrive = (
  filePath: string,
  fileName: string,
  folderId: string
) => {
  console.log(folderId, "folderId");
  const fileMetadata: drive_v3.Schema$File = {
    name: fileName,
    parents: [folderId],
  };

  const media: any = {
    mimeType: "application/octet-stream",
    body: fs.createReadStream(filePath),
  };

  drive.files.create(
    {
      requestBody: fileMetadata,
      media: media,
    },
    (err: any, file: any) => {
      if (err) {
        console.error(err);
      } else {
        console.log("File Id:", file?.data.id);
      }
    }
  );
};

//function to read the file from google drive
const readFileFromDrive = (fileId: string) => {
  drive.files.get(
    {
      fileId: fileId,
      alt: "media",
    },
    { responseType: "stream" },
    (err: any, res: any) => {
      if (err) {
        console.error(err);
      } else {
        res.data
          .on("end", () => {
            console.log("Done");
          })
          .on("error", (err: any) => {
            console.error("Error", err);
          })
          .pipe(fs.createWriteStream("file.txt"));
      }
    }
  );
};

//function to delete the file from google drive
const deleteFileFromDrive = (fileId: string) => {
  drive.files.delete({ fileId: fileId }, (err: any) => {
    if (err) {
      console.error(err);
    } else {
      console.log("File deleted");
    }
  });
};

//function to create folder in google drive
const createFolderInDrive = (folderName: string) => {
  const fileMetadata: drive_v3.Schema$File = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
  };
  drive.files.create(
    {
      requestBody: fileMetadata,
      fields: "id",
    },
    (err: any, file: any) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Folder Id:", file?.data.id);
      }
    }
  );
};

//function to delete the folder from google drive
const deleteFolderFromDrive = (folderId: string) => {
  drive.files.delete({ fileId: folderId }, (err: any) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Folder deleted");
    }
  });
};

//function to download the file from google drive
const downloadFileFromDrive = (fileId: string) => {
  drive.files.get(
    {
      fileId: fileId,
      alt: "media",
    },
    { responseType: "stream" },
    (err: any, res: any) => {
      if (err) {
        console.error(err);
      } else {
        res.data
          .on("end", () => {
            console.log("Done");
          })
          .on("error", (err: any) => {
            console.error("Error", err);
          })
          .pipe(fs.createWriteStream("file.txt"));
      }
    }
  );
};

// Example usage
const filePath = "/Users/ch.sarun/Downloads/s360-413312-94a96bc24f14.json";
const fileName = "s360-413312-94a96bc24f14.json";
const folderId = "1n8JLji3zjDBMHpdn6rt2RaaCqh3AGPZq";
// Call the function to upload the file
// uploadFileToDrive(filePath, fileName, folderId);

// Call the function to read the file from google drive
// readFileFromDrive("1n8JLji3zjDBMHpdn6rt2RaaCqh3AGPZq");

// Call the function to list files in a folder
// listFilesInFolder("1n8JLji3zjDBMHpdn6rt2RaaCqh3AGPZq");

// Call the function to list files and folders recursively in a folder
// listFilesRecursively("1n8JLji3zjDBMHpdn6rt2RaaCqh3AGPZq");

//call to download the file from google drive
// downloadFileFromDrive("1n8JLji3zjDBMHpdn6rt2RaaCqh3AGPZq");
