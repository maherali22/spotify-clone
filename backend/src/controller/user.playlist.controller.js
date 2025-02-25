import CustomError from "../utils/customError.js";
import Playlist from "../models/schema/playlistSchema.js";
import dotenv from "dotenv";
dotenv.config();

const create_playlist = async (req, res, next) => {
  console.log(req.user);

  const { playlistName, songsId } = req.body;
  console.log("name:", playlistName, songsId);

  const findplaylist = await Playlist.findOne({
    user: req.user.id,
    name: playlistName,
  });

  if (findplaylist) {
    const songInPlaylist = findplaylist.songs.find(
      (song) => song.toString() === songsId
    );

    if (songInPlaylist) {
      return next(new CustomError("This song is already in the playlist", 400));
    } else {
      findplaylist.songs.push(songsId);
      await findplaylist.save();

      return res.status(200).json(findplaylist);
    }
  } else {
    const playlist = new Playlist({
      user: req.user.id,
      name: playlistName,
      songs: [songsId],
    });

    await playlist.save();

    return res.status(201).json(playlist);
  }
};

const get_playlist = async (req, res, next) => {
  const id = req.user.id;
  const playlist = await Playlist.find({ user: id }).populate("songs");
  if (!playlist) {
    return next(new CustomError("playlist not found", 400));
  }
  res.status(200).json(playlist);
};

const getAll_playlist = async (req, res, next) => {
  try {
    const playlists = await Playlist.find().populate("songs");

    if (!playlists) {
      return next(new CustomError("Playlist not found", 400));
    }

    const formattedPlaylists = playlists.map((playlist) => ({
      ...playlist.toObject(),
      songs: playlist.songs.map((song) => ({
        ...song.toObject(),
        duration: formatDuration(song.duration),
      })),
    }));

    res.status(200).json({ playlists: formattedPlaylists });
  } catch (error) {
    next(error);
  }
};

const formatDuration = (seconds) => {
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [mins, secs].map((val) => val.toString().padStart(2, "0")).join(":");
};

const deletesongfrom_playlist = async (req, res, next) => {
  const id = req.user.id;
  const { playlistid, songId } = req.body;

  console.log("Deleting song from playlist:", playlistid, songId);

  const playlist = await Playlist.findOne({
    user: id,
    _id: playlistid,
  }).populate("songs");

  if (!playlist) {
    return next(new CustomError("Playlist not found", 404));
  }

  const songIndex = playlist.songs.findIndex((song) => song._id.equals(songId)); // Use .equals() for ObjectId comparison

  if (songIndex === -1) {
    return next(new CustomError("Song not found in playlist", 404));
  }
  playlist.songs.splice(songIndex, 1);
  await playlist.save();

  res.status(200).json(playlist);
};

const delete_playlist = async (req, res) => {
  const { id } = req.params;
  await Playlist.findByIdAndDelete(id);
  res.status(200).json("playlist deleted successfully");
};

export {
  create_playlist,
  get_playlist,
  getAll_playlist,
  deletesongfrom_playlist,
  delete_playlist,
};
