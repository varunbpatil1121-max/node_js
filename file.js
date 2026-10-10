const fs = require("fs");

// 1. Copying a file
fs.copyFileSync("./test.txt", "./copy.txt");
console.log("File copied to copy.txt!");

// 2. Checking file stats (details like size, creation date)
const stats = fs.statSync("./test.txt");
console.log("Is File?", stats.isFile());
console.log("File Size (bytes):", stats.size);

// 3. Deleting a file (unlink)
fs.unlinkSync("./copy.txt");
console.log("copy.txt deleted!");

// 4. Creating a directory / folder
fs.mkdirSync("my-docs/a/b", { recursive: true });
console.log("Folder structure my-docs/a/b created!");