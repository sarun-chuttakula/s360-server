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
// Define a type for fileInfo to handle both files and folders
type FileInfo = {
  name: string;
  id: string;
  mimeType: string;
  contents?: FileInfo[]; // Optional property for folders
};

// Function to list all files and folders recursively in a Google Drive folder
export const listFilesRecursively = (
  folderId: string,
  depth: number = 2,
  callback: (directoryStructure: FileInfo) => void
) => {
  const indent = "  ".repeat(depth);
  const directoryStructure: FileInfo = {
    name: "",
    id: folderId,
    mimeType: "",
    contents: [],
  };

  // List files in the current folder
  drive.files.list(
    {
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType, parents)",
    },
    (err: any, res: any) => {
      if (err) {
        console.error(err);
        callback(directoryStructure); // Return empty directory structure in case of error
        return;
      }

      const files = res.data.files;

      if (files && files.length > 0) {
        files.forEach((file: any) => {
          const fileInfo: FileInfo = {
            name: file.name,
            id: file.id,
            mimeType: file.mimeType,
          };

          if (file.mimeType === "application/vnd.google-apps.folder") {
            // Recursively list files in subfolders
            listFilesRecursively(
              file.id,
              depth + 1,
              (subfolderStructure: FileInfo) => {
                fileInfo.contents = subfolderStructure.contents; // Attach subfolder structure
              }
            );
          }

          directoryStructure!.contents!.push(fileInfo); // Add file/folder info to directory structure
        });
      }

      callback(directoryStructure); // Return the directory structure
    }
  );
};

// Function to list files and folders in a folder
export const listFilesInFolder = (
  folderId: string,
  callback: (data: any) => void
) => {
  console.log(folderId, "folderId");
  console.log(callback, "callback");
  console.log(drive, "drive");
  console.log(drive.files, "drive.files");

  drive.files.list(
    {
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType, parents)",
    },
    (err: any, res: any) => {
      if (err) {
        console.error(err);
        callback({ error: "An error occurred" }); // Send an error response
      } else {
        const files = res.data.files;
        console.log(files, "files");
        if (files && files.length > 0) {
          const fileList = files.map((file: any) => ({
            name: file.name,
            id: file.id,
            mimeType: file.mimeType,
          }));
          callback({ files: fileList }); // Send file list as JSON
        } else {
          callback({ message: "No files found in the folder." }); // Send a message if no files found
        }
      }
    }
  );
};
// Function to upload a file to Google Drive
export const uploadFileToDrive = (
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
export const readFileFromDrive = (fileId: string) => {
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
export const deleteFileFromDrive = (fileId: string) => {
  drive.files.delete({ fileId: fileId }, (err: any) => {
    if (err) {
      console.error(err);
    } else {
      console.log("File deleted");
    }
  });
};

//function to create folder in google drive
export const createFolderInDrive = (folderName: string) => {
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
export const deleteFolderFromDrive = (folderId: string) => {
  drive.files.delete({ fileId: folderId }, (err: any) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Folder deleted");
    }
  });
};

//function to download the file from google drive
export const downloadFileFromDrive = (fileId: string) => {
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
// listFilesRecursively("1o1LfscjBoDzMfRGfK51HSAMcHy8M9mBH");

//call to download the file from google drive
// downloadFileFromDrive("1n8JLji3zjDBMHpdn6rt2RaaCqh3AGPZq");

//check s360-893@s360-413312.iam.gserviceaccount.com this email to the folder shared

// Define an interface for folder and file
interface DriveItem {
  name: string;
  id: string;
  mimeType: string;
  contents?: DriveItem[];
}

// Function to fetch the complete folder structure recursively in tree-like structure
export const fetchFolderStructure = (folderId: string): Promise<DriveItem> => {
  return new Promise((resolve, reject) => {
    // Internal recursive function to build the folder structure
    const buildFolderTree = (parentId: string): Promise<DriveItem> => {
      return new Promise((resolve, reject) => {
        listFilesInFolder(parentId, (data) => {
          if (data.error) {
            reject(data.error);
            return;
          }

          const files = data.files;
          const folderPromises: Promise<DriveItem>[] = [];

          // Check if there are any files in the folder
          if (!files || files.length === 0) {
            resolve({
              name: "",
              id: parentId,
              mimeType: "",
              contents: [], // Empty contents array for folders without files
            });
            return;
          }

          // Iterate through files and folders
          files.forEach((file: any) => {
            const item: DriveItem = {
              name: file.name,
              id: file.id,
              mimeType: file.mimeType,
            };

            if (file.mimeType === "application/vnd.google-apps.folder") {
              // Recursively build the tree for subfolders
              folderPromises.push(
                buildFolderTree(file.id).then((subfolderStructure) => {
                  item.contents = subfolderStructure.contents;
                  return item;
                })
              );
            } else {
              folderPromises.push(Promise.resolve(item));
            }
          });

          // Resolve all promises for subfolders
          Promise.all(folderPromises)
            .then((folderItems) => {
              resolve({
                name: "",
                id: parentId,
                mimeType: "",
                contents: folderItems,
              });
            })
            .catch((error) => {
              reject(error);
            });
        });
      });
    };

    // Start building the folder tree
    buildFolderTree(folderId)
      .then((folderStructure) => {
        resolve(folderStructure);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Example usage to fetch folder structure
const folderIdToFetch = "1o1LfscjBoDzMfRGfK51HSAMcHy8M9mBH"; // Replace with the ID of the folder you want to fetch
// fetchFolderStructure(folderIdToFetch)
//   .then((folderStructure: DriveItem) => {
//     console.log("Folder Structure:", folderStructure);
//     // Now you can use the folder structure as needed in your backend
//   })
//   .catch((error) => {
//     console.error("Error fetching folder structure:", error);
//   });
