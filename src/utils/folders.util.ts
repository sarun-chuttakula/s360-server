import * as fs from "fs";
import * as path from "path";

interface Directory {
  name: string;
  parent: string | null;
  children: Array<Directory | File>;
}

interface File {
  name: string;
  parent: string;
  size: number;
}

export function generate_json(directory: string): Directory {
  const data: Directory = {
    name: getBasename(directory),
    parent: null,
    children: [],
  };

  function getBasename(path: string): string {
    return path.split("/").pop()!;
  }

  function traverse(directoryPath: string, parentName: string | null) {
    const currentDir: Directory = {
      name: getBasename(directoryPath),
      parent: parentName,
      children: [],
    };

    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const filePath = `${directoryPath}/${file}`;
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        traverse(filePath, currentDir.name);
      } else {
        currentDir.children.push({
          name: file,
          parent: currentDir.name,
          size: stats.size,
        });
      }
    }

    data.children.push(currentDir);
  }

  traverse(directory, null);

  return data;
}

export function createFolder(parentPath: string, folderName: string): void {
  const folderPath = path.join(parentPath, folderName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

export function addFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content);
}

export function deleteFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function deleteFolder(folderPath: string): void {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const currentPath = path.join(folderPath, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        deleteFolder(currentPath);
      } else {
        deleteFile(currentPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

// Example usage:
// const directoryPath =
//   "/Users/ch.sarun/Documents/MyCodes/Code/Projects/S360/s360-server/src/thumbnails";
// const result = generate_json(directoryPath);
// console.log(JSON.stringify(result, null, 4));

// // Example usage of additional functions:
// const newFolderName = "test";
// createFolder(directoryPath, newFolderName);

// const newFilePath = path.join(directoryPath, newFolderName, "newFile.txt");
// addFile(newFilePath, "This is a new file.");

// deleteFile(newFilePath);

// deleteFolder(path.join(directoryPath, newFolderName));
