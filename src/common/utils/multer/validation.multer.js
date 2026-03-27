import { SYS_MESSAGES } from "../../constants/messages.constants.js";
import { InvalidFileException } from "../error.utils.js";

export const fileValidationFields = {
  image: ["image/png", "image/jpeg", "image/jpg"],
  pdf: ["application/pdf"],
  video: ["video/mp4", "video/webm", "video/ogg"],
};
export function fileFilter(validation = []) {
  return (req, file, cb) => {    
    if (!validation.includes(file.mimetype)) {
        cb(new InvalidFileException(SYS_MESSAGES.file.invalidFileType));
    }
    return cb(null, true);
  };
}
