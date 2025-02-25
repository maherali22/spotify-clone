import User from "../models/schema/userSchema.js";
import {
  userLoginValidationSchema,
  userValidationSchema,
} from "../models/joischema/joischema.js";
import CustomError from "../utils/customError.js";
import sendEmail from "../utils/emailService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const user_registration = async (req, res, next) => {
  const { value, error } = userValidationSchema.validate(req.body);
  const { name, email, password, cpassword } = value;
  console.log("val:", value);
  if (error) {
    console.log("Registration error:", error);
    return next(new CustomError("Validation error", 400));
  }
  if (cpassword && password !== cpassword) {
    return next(new CustomError("Passwords do not match", 400));
  }
  const hashpassword = await bcrypt.hash(password, 6);
  const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
  console.log("Generated OTP:", otp);
  const new_user = new User({
    name,
    email,
    password: hashpassword,
    otp,
    isVerified: false,
  });
  await new_user.save();

  const emailTemplate = `
      <div style="font-family: Circular, Helvetica, Arial, sans-serif; background-color: #000000; padding: 40px 20px; text-align: center; color: #FFFFFF;">
  <div style="max-width: 600px; margin: auto; background: #121212; padding: 40px 20px; border-radius: 8px;">
    <!-- Spotify Logo -->
    <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Spotify_New_Full_Logo_RGB_Green.png" 
         alt="Spotify" 
         style="width: 180px; margin-bottom: 40px;"
    />
    
    <h2 style="color: #FFFFFF; margin-bottom: 24px; font-size: 32px; font-weight: bold;">
      Verify your email
    </h2>
    
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 32px; color: #B3B3B3;">
      Hi ${name}, enter this verification code in the app to verify your email address and start enjoying Spotify:
    </p>
    
    <div style="background-color: #282828; padding: 24px; border-radius: 8px; display: inline-block; margin-bottom: 32px;">
      <h1 style="color: #1DB954; font-size: 40px; letter-spacing: 8px; margin: 0; font-weight: bold;">
        ${otp}
      </h1>
    </div>
    
    <p style="font-size: 14px; color: #B3B3B3; margin-bottom: 24px; line-height: 1.5;">
      This code will expire in 30 minutes. If you didn't request this email, you can safely ignore it.
    </p>
    
    <div style="border-top: 1px solid #282828; padding-top: 24px; margin-top: 32px;">
      <p style="font-size: 14px; color: #B3B3B3; margin-bottom: 16px;">
        Need help? Visit <a href="https://support.spotify.com" style="color: #1DB954; text-decoration: none;">Spotify Support</a>
      </p>
      
      <p style="font-size: 12px; color: #6A6A6A; line-height: 1.5;">
        This email was sent to you by Spotify. To learn more about how Spotify processes personal data, please visit our <a href="https://www.spotify.com/privacy" style="color: #1DB954; text-decoration: none;">Privacy Policy</a>.
      </p>
    </div>
  </div>
  
  <div style="margin-top: 24px; color: #6A6A6A; font-size: 12px;">
    Spotify AB, Regeringsgatan 19, 111 53, Stockholm, Sweden
  </div>
</div>`;

  await sendEmail(email, "Verify Your Email with OTP", emailTemplate);
  res.status(200).json({
    errorcode: 0,
    status: true,
    msg: "User registered successfully. Please check your email for the OTP.",
    new_user,
  });
};

const verify_otp = async (req, res, next) => {
  const { otp } = req.body;
  if (!otp) {
    return next(new CustomError(" OTP is required", 400));
  }
  console.log("otp:", otp);
  const user = await User.findOne({ otp });
  console.log("user:", user);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  user.isVerified = true;
  user.otp = null;

  await user.save();

  res.status(200).json({
    errorcode: 0,
    status: true,
    msg: "Email verified successfully.",
  });
};

const user_login = async (req, res, next) => {
  const { value, error } = userLoginValidationSchema.validate(req.body);
  if (error) {
    return next(new CustomError(error.message, 400));
  }

  const { email, password } = value;
  console.log("Login Attempt:", email);

  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError("User not found", 400));
  }

  console.log("User found:", user);

  const isPasswordMatching = await bcrypt.compare(password, user.password);
  console.log("Password Match Status:", isPasswordMatching);

  if (!isPasswordMatching) {
    return next(new CustomError("Invalid email or password", 401));
  }

  if (!user.isVerified) {
    return next(new CustomError("User is not verified", 403));
  }

  // Ensure username is properly serialized
  const token = jwt.sign(
    { id: user._id, username: user.name, email: user.email },
    process.env.JWT_KEY,
    { expiresIn: "1m" }
  );
  const refreshmentToken = jwt.sign(
    { id: user._id, username: user.name, email: user.email },
    process.env.JWT_KEY,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 1000,
    sameSite: "none",
  });
  res.cookie("refreshmentToken", refreshmentToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Login successful",
    data: {
      user: user.name, // No extra quotes
      token: token,
      refreshmentToken: refreshmentToken,
      profilePicture: user.profilePicture,
      admin: user.admin,
    },
  });
};

const edituser = async (req, res, next) => {
  console.log("Request files:", req.files);
  const { value, error } = userValidationSchema.validate(req.body);
  const { name } = value;
  const id = req.user.id;

  if (error) {
    console.log("edit user:", error);
    return next(new CustomError("validation error", 404));
  }

  const updatedFields = {};

  if (name) {
    updatedFields.name = name;
  }

  if (req.files && req.files.profilePicture) {
    updatedFields.profilePicture = req.files.profilePicture[0]?.path;
  }

  const user = await User.findByIdAndUpdate(id, updatedFields, { new: true });
  if (!user) {
    return next(new CustomError("user not found", 404));
  }

  res.status(200).json({ statcode: 0, data: user });
};

const userlog_out = async (req, res, next) => {
  res.clearCookie("token");
  res.clearCookie("refreshmentToken");
  res.status(200).json("successfully logout");
};
export { user_registration, verify_otp, user_login, edituser, userlog_out };
