import multer from "multer";
import path from "node:path";
import { genUUID } from "../uuid.utils.js";
import { existsSync, mkdirSync } from "node:fs";
import { fileFilter } from "./validation.multer.js";
export function localFileUpload({
  customPath = {},
  validation = [],
  fileSize = 5,
} = {}) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const { entity, custom } = customPath;
      if (
        !existsSync(`./uploads/${entity}/${req.user._id.toString()}/${custom}`)
      ) {
        mkdirSync(`./uploads/${customPath}/${req.user._id.toString()}`, {
          recursive: true,
        });
      }
      cb(
        null,
        path.resolve(`./uploads/${customPath}/${req.user._id.toString()}`),
      );
    },
    filename: (req, file, cb) => {
      const path = genUUID() + "_" + file.originalname;
      file.finalPath = `uploads/${customPath}/${path}`;
      cb(null, path);
    },
  });

  return multer({
    fileFilter: fileFilter(validation),
    limits: { fileSize: fileSize * 1024 * 1024 },
    storage,
  });
}
