import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ReactAudioPlayer from "react-audio-player";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../home/navbar";
import Sidebar from "../home/sidebar";
import {
  addtofavourite,
  deletefromfavourite,
  getfavourite,
} from "../../../redux/slice/user/favourateSlice";

const MusicController = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { id1, id2 } = useParams();
  const [songs, setSongs] = useState([]);
  const audioPlayerRef = useRef(null);
  const dispatch = useDispatch();

  const artist = useSelector((state) => state.artist.artist);
  const albums = useSelector((state) => state.albums.albums);
  const Playlist = useSelector((state) => state.playlist.playlist);
  const favourite = useSelector((state) => state.favourite.favourite);
  const allsongs = useSelector((state) => state.song.songs);

  useEffect(() => {
    const filteredArtist = artist?.find((item) => item.artist === id2);
    const filteredAlbums = albums?.find((alb) => alb._id === id2);
    const filteredPlaylist = Playlist.playlists?.find(
      (item) => item._id === id2
    );
    const filteredsong = [];
    filteredsong.push(allsongs.find((song) => song._id == id1));

    const songsForPlay =
      (filteredPlaylist && filteredPlaylist.songs) ||
      (filteredArtist && filteredArtist.songs) ||
      (filteredAlbums && filteredAlbums.songs) ||
      (filteredsong && filteredsong) ||
      (favourite && favourite.length > 0 ? favourite : []) ||
      [];
    setSongs(songsForPlay);
  }, [artist, albums, Playlist, favourite, id2, allsongs, id1]);

  useEffect(() => {
    const songIndex = songs.findIndex((song) => song._id === id1);
    if (songIndex >= 0) {
      setCurrentSongIndex(songIndex);
      setIsPlaying(true);
    }
  }, [id1, songs]);

  useEffect(() => {
    if (isPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.audioEl.current.play();
    }
  }, [currentSongIndex, isPlaying]);

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === songs.length - 1 ? 0 : prevIndex + 1
    );
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
    setIsPlaying(true);
  };

  const handleSongEnd = () => {
    handleNext();
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.audioEl.current.pause();
      } else {
        audioPlayerRef.current.audioEl.current.play();
      }
    }
  };

  const liked =
    songs[currentSongIndex] &&
    favourite.some((song) => song._id === songs[currentSongIndex]._id);

  const addToFavourite = async (songId) => {
    await dispatch(addtofavourite(songId));
    await dispatch(getfavourite());
  };

  const removeFromFavourite = async (songId) => {
    await dispatch(deletefromfavourite(songId));
    await dispatch(getfavourite());
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col">
      {/* Navbar at the top */}
      <Navbar />

      <div className="flex flex-grow">
        {/* Sidebar for navigation (hidden on small screens) */}
        <div className="hidden sm:block">
          <Sidebar />
        </div>

        {/* Main Player Section */}
        <div className="flex-grow flex justify-center items-center p-4">
          <Card
            sx={{
              backgroundColor: "#181818",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
              width: "100%",
              maxWidth: "720px",
              color: "#fff",
            }}
            className="flex flex-col items-center p-6"
          >
            {songs.length > 0 && songs[currentSongIndex] ? (
              <>
                <img
                  src={songs[currentSongIndex].image}
                  alt={songs[currentSongIndex].title}
                  className="w-full max-h-80 object-cover rounded-xl mb-4"
                />
                <Typography
                  variant="h4"
                  component="div"
                  className="text-white font-bold mb-1"
                >
                  {songs[currentSongIndex].title}
                </Typography>
                <Typography variant="subtitle1" className="text-gray-400 mb-4">
                  {songs[currentSongIndex].artist}
                </Typography>

                <ReactAudioPlayer
                  ref={audioPlayerRef}
                  src={songs[currentSongIndex].fileUrl}
                  autoPlay={isPlaying}
                  controls
                  className="w-full mt-4"
                  onEnded={handleSongEnd}
                />

                <div className="flex justify-center items-center mt-6 space-x-6">
                  <IconButton onClick={handlePrevious} sx={{ color: "#fff" }}>
                    <SkipPreviousIcon fontSize="large" />
                  </IconButton>
                  <IconButton onClick={togglePlayPause} sx={{ color: "#fff" }}>
                    {isPlaying ? (
                      <PauseIcon fontSize="large" />
                    ) : (
                      <PlayArrowIcon fontSize="large" />
                    )}
                  </IconButton>
                  <IconButton onClick={handleNext} sx={{ color: "#fff" }}>
                    <SkipNextIcon fontSize="large" />
                  </IconButton>
                  <IconButton
                    onClick={async () => {
                      if (liked) {
                        await removeFromFavourite(songs[currentSongIndex]._id);
                      } else {
                        await addToFavourite(songs[currentSongIndex]._id);
                      }
                    }}
                    sx={{ color: liked ? "#1DB954" : "#fff" }}
                  >
                    <FavoriteBorderIcon fontSize="large" />
                  </IconButton>
                </div>
              </>
            ) : (
              <Typography variant="body1" className="text-gray-400">
                No songs available.
              </Typography>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MusicController;
