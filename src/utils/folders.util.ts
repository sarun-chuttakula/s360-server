import fs from "fs";
import path from "path";

interface Directory {
  name: string;
  parent: string | null;
  type: "directory";
  children: (Directory | File)[];
}

interface File {
  name: string;
  parent: string;
  type: "file";
  size: number;
}

export function generate_json(directory: string): Directory {
  const data: Directory = {
    name: getBasename(directory),
    parent: null,
    type: "directory",
    children: [],
  };

  function getBasename(path: string): string {
    return path.split("/").pop()!;
  }

  function traverse(directoryPath: string, parentName: string | null) {
    const currentDir: Directory = {
      name: getBasename(directoryPath),
      parent: parentName,
      type: "directory",
      children: [],
    };

    const items = fs.readdirSync(directoryPath);

    for (const item of items) {
      const itemPath = `${directoryPath}/${item}`;
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        const subDirectory: Directory = {
          name: item,
          parent: currentDir.name,
          type: "directory",
          children: [],
        };
        currentDir.children.push(subDirectory);
        traverse(itemPath, currentDir.name);
      } else {
        const file: File = {
          name: item,
          parent: currentDir.name,
          type: "file",
          size: stats.size,
        };
        currentDir.children.push(file);
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
