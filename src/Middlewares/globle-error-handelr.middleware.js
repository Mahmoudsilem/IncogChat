import { MulterError } from "multer";

export function globleErrorHandelr(err, req, res, next) {
  if(err.errorResponse) return res.status(500).send(err.errorResponse.errmsg);
  if(err instanceof MulterError){
    return res.status(400).json({ massege: err.message || "Internal Server Error", success: false,err });
  }
  // console.log(err);
  return res
    .status(err?.cause?.status || 500)
    .json({ massege: err.message || "Internal Server Error", success: false,err });
}
