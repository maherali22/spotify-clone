import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";
import { userLoginValidationSchema } from "../models/joischema/joischema.js";
import dotenv from "dotenv";
dotenv.config();

const admin_Login = async (req, res, next) => {
  const { error, value } = userLoginValidationSchema.validate(req.body);
  if (error) {
    return next(new CustomError("admin not fount", 400));
  }
  const { email, password } = value;
  const adminEmail = process.env.ADMIN_EMAIL;

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email == adminEmail && password == adminPassword) {
    console.log("admin loged in");
    const token = jwt.sign(
      {
        id: "admin",
        isAdmin: true,
      },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
    const refreshmentToken = jwt.sign(
      {
        id: "admin",
        isAdmin: true,
      },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 minute
      sameSite: "none",
    });
    res.cookie("refreshmentToken", refreshmentToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      errorCode: 0,
      status: true,
      msg: "admin login successfully",
      data: {
        token: token,
        isAdmin: true,
        refreshmentToken: refreshmentToken,
        adminname: "maher",
      },
    });
  }
};

const admin_logout = async (req, res, next) => {
  res.clearCookie("token");
  res.clearCookie("refreshmentToken");
  res.status(200).json("successfully logout");
};

export { admin_Login, admin_logout };
