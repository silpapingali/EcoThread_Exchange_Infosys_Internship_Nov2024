import multer from "multer";

// Configuring multer to store files in memory
const storage = multer.memoryStorage();

// Creating a multer instance with the configured storage
const upload = multer({ storage });

export default upload;
