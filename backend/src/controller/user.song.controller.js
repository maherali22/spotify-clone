import CustomError from "../utils/customError.js";
import Song from "../models/schema/songSchema.js";
import dotenv from "dotenv";
dotenv.config();

const get_allsongs = async (req, res, next) => {
  try {
    const songs = await Song.find();

    if (!songs || songs.length === 0) {
      return next(new CustomError("Songs not found", 400));
    }

    const formattedSongs = songs.map((song) => {
      const minutes = Math.floor(song.duration / 60);
      const seconds = song.duration % 60; // Get seconds
      const formattedDuration = `${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;

      return {
        ...song.toObject(),
        duration: formattedDuration,
      };
    });

    res.status(200).json(formattedSongs);
  } catch (error) {
    next(error); // Handle any errors
  }
};

const getSongs_byId = async (req, res, next) => {
  const { id } = req.params;
  const song = await Song.findById(id);
  if (!song) {
    return next(new CustomError("this song not found", 400));
  }

  res.status(200).json(song);
};
export { get_allsongs, getSongs_byId };
