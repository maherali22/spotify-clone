import express from "express";
import tryCatch from "../utils/tryCatch.js";
import {
  admin_Login,
  admin_logout,
} from "../controller/admin.auth.controller.js";
import { admin_auth } from "../middleware/authmiddlware.js";
import {
  addSongs,
  editSong,
  // get_song,
  delete_song,
} from "../controller/admin.song.controller.js";
import {
  get_Allusers,
  block_user,
} from "../controller/admin.user.controller.js";
import upload from "../middleware/uploadMiddleware.js";
import { get_allsongs } from "../controller/user.song.controller.js";

const Routes = express.Router();
Routes.post("/login", admin_Login)

  .post("/addsong", admin_auth, upload, tryCatch(addSongs))
  .get("/getallsongs", admin_auth, tryCatch(get_allsongs))
  .put("/editsong/:id", admin_auth, upload, tryCatch(editSong))
  .put("/blockuser/:id", admin_auth, tryCatch(block_user))
  .delete("/deletesong/:id", admin_auth, tryCatch(delete_song))
  .delete("/adminlogout", admin_auth, tryCatch(admin_logout))
  .get("/getallusers", admin_auth, tryCatch(get_Allusers));
export default Routes;
