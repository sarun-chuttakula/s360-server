import * as fs from "fs";
import * as path from "path";

interface FileNode {
  name: string;
  parent: string | null;
  size?: number;
  children: FileNode[];
}

export function generate_json(directory: string): FileNode {
  const data: FileNode = {
    name: path.basename(directory),
    parent: null,
    children: [],
  };

  function traverse(rootPath: string, parentNode: FileNode) {
    const files = fs.readdirSync(rootPath, { withFileTypes: true });
    files.forEach((file) => {
      const currentPath = path.join(rootPath, file.name);
      if (file.isDirectory()) {
        const directoryNode: FileNode = {
          name: file.name,
          parent: parentNode.name,
          children: [],
        };
        parentNode.children.push(directoryNode);
        traverse(currentPath, directoryNode);
      } else if (file.isFile()) {
        parentNode.children.push({
          name: file.name,
          parent: parentNode.name,
          size: fs.statSync(currentPath).size,
          children: [],
        });
      }
    });
  }

  traverse(directory, data);
  return data;
}

// Example usage:
// const directoryPath = "/home/xelpmoc/Documents/Code/OWN/s360-client/src";
// const result = generateJson(directoryPath);
// console.log(JSON.stringify(result, null, 4));
