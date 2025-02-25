import User from "../models/schema/userSchema.js";
import CustomError from "../utils/customError.js";
import dotenv from "dotenv";
dotenv.config();

const get_Allusers = async (req, res, next) => {
  const users = await User.find().populate("likedSongs");
  if (!users) {
    return next(new CustomError("users not found"));
  }
  console.log("users:", users);
  res.status(200).json(users);
};

const block_user = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id);
  if (!user) {
    return next(new CustomError("user not found", 400));
  }
  if (user.block === false) {
    user.block = true;
    await user.save();
    res.status(200).json(user);
  } else {
    user.block = false;
    await user.save();
    res.status(200).json(user);
  }
};

export { get_Allusers, block_user };
