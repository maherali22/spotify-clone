import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  admin: {
    type: Boolean,
    required: false,
    default: false,
  },
  block: {
    type: Boolean,
    required: false,
    default: false,
  },
  otp: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default: "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
  },
  likedSongs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
});

const User = mongoose.model("User", userSchema);
export default User;
