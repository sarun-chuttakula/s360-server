import * as fs from "fs";
import * as path from "path";

type FileTreeValue = {
  type: "directory" | "file";
  name: string;
  extra?: string;
  files?: FileTreeValue[];
};

export function generate_json(directory: string): FileTreeValue {
  const data: FileTreeValue = {
    type: "directory", // Root node is always a directory
    name: path.basename(directory),
    files: [], // Ensure files is initialized as an empty array
  };

  function traverse(rootPath: string, parentNode: FileTreeValue) {
    const files = fs.readdirSync(rootPath, { withFileTypes: true });
    files.forEach((file) => {
      const currentPath = path.join(rootPath, file.name);
      if (file.isDirectory()) {
        const directoryNode: FileTreeValue = {
          type: "directory",
          name: file.name,
          files: [], // Ensure files is initialized as an empty array
        };
        if (parentNode.files)
          // Check if parentNode.files is defined before pushing
          parentNode.files.push(directoryNode);
        traverse(currentPath, directoryNode);
      } else if (file.isFile()) {
        const fileNode: FileTreeValue = {
          type: "file",
          name: file.name,
          extra: `Size: ${fs.statSync(currentPath).size}`,
        };
        if (parentNode.files)
          // Check if parentNode.files is defined before pushing
          parentNode.files.push(fileNode);
      }
    });
  }

  traverse(directory, data);
  return data;
}
