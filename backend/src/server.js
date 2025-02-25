import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import ErrorManager from "./middleware/errorManger.js";
import CustomError from "./utils/customError.js";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:4006",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: "GET,POST,PUT,DELETE",
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);

//404 routes
app.all("*", (req, res, next) => {
  next(new CustomError(`can't find ${req.originalUrl} on this server`, 404));
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to mongoose"))
  .catch((err) => console.error(err));

app.use(ErrorManager);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
