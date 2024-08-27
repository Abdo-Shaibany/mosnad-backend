import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "." + getFileType(file.originalname));
  },
});

// Create the multer instance
export const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      cb(null, true);
    } else {
      console.log("file is not an image to be uploaded");
      cb(null, false);
    }
  },
});

const getFileType = (name: string) => {
  const array = name.split(".");
  return array[array.length - 1];
};
