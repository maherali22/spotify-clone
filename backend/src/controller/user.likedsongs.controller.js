import CustomError from "../utils/customError.js";
import User from "../models/schema/userSchema.js";
import Song from "../models/schema/songSchema.js";
import dotenv from "dotenv";
dotenv.config();

const addto_likedsong = async (req, res, next) => {
  const id = req.user.id;
  const { songId } = req.body;

  const user = await User.findById(id);
  if (user) {
    const songinfavorite = user.likedSongs.find((song) => song == songId);
    if (songinfavorite) {
      return next(new CustomError("this song allready added to favourite"));
    } else {
      user.likedSongs.push(songId);
      await user.save();
      res.status(200).json(user);
    }
  } else {
    const newlikedsong = new User({
      likedSongs: [songId],
    });
    await newlikedsong.save();

    res.status(200).json(newlikedsong);
  }
};

const get_favourite = async (req, res, next) => {
  const id = req.user.id;

  const user = await User.findById(id).populate("likedSongs");
  if (!user) {
    return next(new CustomError("Liked songs not found", 404));
  }

  const formattedSongs = user.likedSongs.map((song) => ({
    ...song._doc,
    duration: formatDurationToTime(song.duration),
  }));

  res.status(200).json(formattedSongs);
};

const formatDurationToTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const deletesongfrom_favourite = async (req, res) => {
  const id = req.user.id;
  const { songId } = req.body;
  const data = await User.findById(id);
  if (!data) {
    return next(new CustomError("songs not found"));
  }
  data.likedSongs = data.likedSongs.filter((song) => song != songId);
  console.log(data.likedSongs);
  await data.save();
  res.status(200).json("song deleted successfully");
};

const getalbums = async (req, res, next) => {
  // Aggregate songs by album
  const songs = await Song.aggregate([
    {
      $group: {
        _id: "$album",
        songs: { $push: "$$ROOT" },
      },
    },
  ]);

  if (!songs || songs.length === 0) {
    return next(new CustomError("Albums not found", 400));
  }

  // Format the response with converted duration
  const formattedOutput = songs.map((album) => ({
    _id: album._id,
    songs: album.songs.map((song) => ({
      ...song,
      duration: formatSongDuration(song.duration), // Format duration as mm:ss
    })),
  }));

  res.status(200).json(formattedOutput);
};
const formatSongDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`; // Format as mm:ss
};

const artist = async (req, res, next) => {
  const songs = await Song.aggregate([
    {
      $group: {
        _id: "$artist",
        songs: { $push: "$$ROOT" },
      },
    },
  ]);

  if (!songs || songs.length === 0) {
    return next(new CustomError("Artist not found", 400));
  }

  const formattedOutput = songs.map((item) => ({
    artist: item._id,
    songs: item.songs.map((song) => ({
      ...song,
      duration: convertDuration(song.duration),
    })),
  }));

  res.status(200).json(formattedOutput);
};

const convertDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
export {
  addto_likedsong,
  get_favourite,
  deletesongfrom_favourite,
  getalbums,
  artist,
};
