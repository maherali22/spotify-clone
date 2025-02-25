import mongoose from "mongoose";
const Schema = mongoose.Schema;

const songSchema = new Schema({
  title: {
    type: String,
  },
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
  },
  fileUrl: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
});

const Song = mongoose.model("Song", songSchema);
export default Song;
