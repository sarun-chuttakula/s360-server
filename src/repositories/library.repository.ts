import fs from "fs";
import path from "path";

const THUMBNAILS_DIRECTORY = "./src/thumbnails"; //!use src/thumbnails

export const createFolder = async (folderName: string) => {
  const fullPath = path.join(THUMBNAILS_DIRECTORY, folderName);
  console.log(fullPath);
  try {
    await fs.promises.mkdir(fullPath);
    console.log(`Folder '${fullPath}' created successfully.`);
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

// export const getFolderContents = async (folderName: string) => {
//   const fullPath = path.join(THUMBNAILS_DIRECTORY, folderName);
//   try {
//     const contents = await fs.promises.readdir(fullPath);
//     console.log(`Contents of '${fullPath}':`, contents);
//     return contents;
//   } catch (error) {
//     console.error("Error reading folder contents:", error);
//     throw error;
//   }
// };

export const deleteFolder = async (folderName: string) => {
  const fullPath = path.join(THUMBNAILS_DIRECTORY, folderName);
  try {
    await fs.promises.rmdir(fullPath, { recursive: true });
    console.log(`Folder '${fullPath}' deleted successfully.`);
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
};

export async function uploadFile(
  folderPath: string,
  filePath: string,
  fileContent: Buffer
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create directory if it doesn't exist
    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating directory:", err);
        return reject(err);
      }

      // Write the file content to the specified path
      fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return reject(err);
        }
        console.log(
          `File '${path.basename(
            filePath
          )}' uploaded successfully to '${folderPath}'`
        );
        resolve();
      });
    });
  });
}

export const downloadFile = async (folderName: string, fileName: string) => {
  const fullPath = path.join(THUMBNAILS_DIRECTORY, folderName, fileName);
  try {
    const fileContent = await fs.promises.readFile(fullPath, "utf-8");
    console.log(`File '${fullPath}' downloaded successfully.`);
    return fileContent;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

export const directoryTreeStructure = async (
  dirPath = __dirname,
  indent = 0
) => {
  const thumbnailsPath = path.join(dirPath);
  try {
    const contents = await fs.promises.readdir(thumbnailsPath, {
      withFileTypes: true,
    });
    if (!contents) {
      return [];
    }
    const folders = [];
    const files = [];
    for (const item of contents) {
      const itemPath = path.join(thumbnailsPath, item.name);
      if (item.isDirectory()) {
        folders.push(item.name);
        await directoryTreeStructure(itemPath, indent + 1);
      } else {
        files.push(item.name);
      }
    }
    const indentation = "  ".repeat(indent);
    console.log(`${indentation}└── thumbnails`);
    if (files.length > 0) {
      console.log(`${indentation + "    "}Files: ${files.join(", ")}`);
    } else {
      console.log(`${indentation + "    "}No files`);
    }
  } catch (error) {
    console.error("Error reading thumbnails folder contents:", error);
    throw error;
  }
};
export const getFolderContents = async (folderPath: any) => {
  try {
    const contents = await fs.promises.readdir(folderPath, {
      withFileTypes: true,
    });
    return contents.map((item) => ({
      type: item.isDirectory() ? "folder" : "file",
      name: item.name,
    }));
  } catch (error) {
    console.error(`Error reading folder contents of ${folderPath}:`, error);
    throw error;
  }
};
