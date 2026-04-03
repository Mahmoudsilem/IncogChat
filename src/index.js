import express from "express";
import { globleErrorHandelr } from "./Middlewares/globle-error-handelr.middleware.js";
import { connection } from "./DB/index.js";
import { connectRedis } from "./DB/index.js";
import {
  authController,
  massageController,
  userController,
} from "./modules/index.js";
import cors from "cors";
import { resolve } from "path";
const app = express();
const port = 3000;

app.use(cors("*"));
app.use("/uploads", express.static(resolve("./uploads/")));
app.use(express.json());
app.use("/auth", authController);
app.use("/users", userController);
app.use("/massages", massageController);

app.use("{/*dummy}", (req, res, next) => {
  next(new Error("API Not Found", { cause: { status: 404 } }));
});
app.use(globleErrorHandelr);

app.listen(port, () => {
  console.log("App is runing on port ", port);
});
