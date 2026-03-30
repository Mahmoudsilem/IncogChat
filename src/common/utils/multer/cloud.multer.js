import multer from "multer";
import { fileFilter } from "./validation.multer.js";
export function cloudFileUpload({
  validation = [],
  fileSize = 5,
} = {}) {
  const storage = multer.diskStorage({});

  return multer({
    fileFilter: fileFilter(validation),
    limits: { fileSize: fileSize * 1024 * 1024 },
    storage,
  });
}