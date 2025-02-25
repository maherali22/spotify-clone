import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";

const user_auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    const refreshmentToken = req.cookies?.refreshmentToken;

    if (!refreshmentToken) {
      return next(
        new CustomError("No access or refreshment token provided", 400)
      );
    }

    const decoded = jwt.verify(refreshmentToken, process.env.JWT_KEY);
    

    const newToken = jwt.sign(
      { id: decoded.id, username: decoded.username, email: decoded.email },
      process.env.JWT_KEY,
      { expiresIn: "1m" }
    );
    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 60 * 1000,
      sameSite: "none",
    });

    req.user = decoded;
    return next();
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      req.user = decoded;
      return next();
    } catch (error) {
      const refreshmentToken = req.cookies?.refreshmentToken;
      if (!refreshmentToken) {
        return next(
          new CustomError("No access or refreshment token provided", 400)
        );
      }
      const decoded = jwt.verify(refreshmentToken, process.env.JWT_KEY);
      const newToken = jwt.sign(
        { id: decoded.id, username: decoded.username, email: decoded.email },
        process.env.JWT_KEY,
        { expiresIn: "1m" }
      );

      res.cookie("token", newToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1 * 60 * 1000,
        sameSite: "none",
      });

      req.user = decoded;
      return next();
    }
  }
};

const admin_auth = (req, res, next) => {
  console.log("Admin Auth Middleware");

  user_auth(req, res, () => {
    if (req.user && req.user.id === "admin") {
      return next();
    } else {
      throw new Error("access denied");
    }
  });
};

export { user_auth, admin_auth };
