import express from "express";
import tryCatch from "../utils/tryCatch.js";
import { user_auth } from "../middleware/authmiddlware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  user_registration,
  verify_otp,
  user_login,
  userlog_out,
  edituser,
} from "../controller/user.auth.controller.js";
import {
  get_allsongs,
  getSongs_byId,
} from "../controller/user.song.controller.js";
import {
  create_playlist,
  get_playlist,
  delete_playlist,
  getAll_playlist,
  deletesongfrom_playlist,
} from "../controller/user.playlist.controller.js";
import {
  addto_likedsong,
  get_favourite,
  deletesongfrom_favourite,
  getalbums,
  artist,
} from "../controller/user.likedsongs.controller.js";

const Routes = express.Router();

Routes.post("/register", tryCatch(user_registration))
  .put("/verifyotp", tryCatch(verify_otp))
  .post("/login", tryCatch(user_login))
  .put("/edituser", user_auth, upload, tryCatch(edituser))
  .get("/getsongs", tryCatch(get_allsongs))
  .get("/getsongByid/:id", user_auth, tryCatch(getSongs_byId))
  .get("/getalbums", tryCatch(getalbums))
  .get("/artist", tryCatch(artist))
  .post("/createplaylist", user_auth, tryCatch(create_playlist))
  .get("/getplaylist", user_auth, tryCatch(get_playlist))
  .get("/getallplaylist", tryCatch(getAll_playlist))
  .delete("/deletefromplaylist", user_auth, tryCatch(deletesongfrom_playlist))
  .delete("/deleteplaylist/:id", user_auth, tryCatch(delete_playlist))
  .post("/addtofavourite", user_auth, tryCatch(addto_likedsong))
  .get("/getfavourite", user_auth, tryCatch(get_favourite))
  .delete("/deletefromfavourite", user_auth, tryCatch(deletesongfrom_favourite))
  .delete("/userlogut", user_auth, tryCatch(userlog_out));

export default Routes;
