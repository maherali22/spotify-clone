import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaEllipsisH, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  addtofavourite,
  deletefromfavourite,
  getfavourite,
} from "../../../redux/slice/user/favourateSlice";
import {
  createplaylist,
  deletefromplaylist,
  getuserplaylist,
} from "../../../redux/slice/user/userPlaylistSlice";
import { getplaylist } from "../../../redux/slice/user/playlistSLice";

import { toast } from "react-toastify";
import Marquee from "react-fast-marquee";

const MusicCard = ({ album, songs, image, gradient }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [playlistDropdownIndex, setPlaylistDropdownIndex] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [input, setInput] = useState(false);
  const [name, setName] = useState("");
  const audioRef = useRef(new Audio(songs[0].audioSrc));
  const userplaylist = useSelector((state) => state.userplaylist.userplaylist);
  const favourite = useSelector((state) => state.favourite.favourite);
  const currentuser = localStorage.getItem("current user");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userplaylists } = useParams();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
  useEffect(() => {
    dispatch(getfavourite());
  }, [dispatch]);

  useEffect(() => {
    const liked = songs.filter((song) =>
      favourite.some((fav) => fav._id === song.id)
    );
    setLikedSongs(liked);
  }, [favourite, songs]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handlePlayPause = async (index) => {
    if (currentSongIndex === index) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.pause();
      audioRef.current.src = songs[index].audioSrc;
      setCurrentSongIndex(index);
      setIsPlaying(true);
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  const toggleDropdown = (index) => {
    if (currentuser) {
      setDropdownIndex(dropdownIndex === index ? null : index);
    } else {
      toast.error("please login");
    }
  };

  const togglePlaylistDropdown = (index) => {
    setPlaylistDropdownIndex(playlistDropdownIndex === index ? null : index);
  };

  const addToFavourite = async (songId) => {
    await dispatch(addtofavourite(songId));
    await dispatch(getfavourite());
  };

  const deleteFromFavourite = async (songId) => {
    await dispatch(deletefromfavourite(songId));
    await dispatch(getfavourite());
  };

  const addtoplaylist = async (playlistName, songsId) => {
    await dispatch(createplaylist({ playlistName, songsId }));
    await dispatch(getuserplaylist());
    await dispatch(getplaylist());
  };

  const removefromplaylist = async (playlistid, songId) => {
    await dispatch(deletefromplaylist({ playlistid, songId }));
    await dispatch(getuserplaylist());
    await dispatch(getplaylist());
  };

  const changetoinp = () => {
    setInput(!input);
  };

  const handlesubmit = async (e, playlistName, songsId) => {
    e.preventDefault();
    await dispatch(createplaylist({ playlistName, songsId }));
    await dispatch(getuserplaylist());
    await dispatch(getplaylist());
    setInput(false);
    setName("");
  };

  return (
    <div
      className={`w-full mx-auto p-6 shadow-lg text-white font-sans overflow-y-scroll ${
        gradient || "bg-gradient-to-b from-orange-500 to-black"
      } scrollbar-none`}
      style={{ height: "calc(100vh - 100px)" }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <img
          src={songs[0]?.image || image?.props}
          alt={album.name}
          className="w-40 h-36 rounded-lg object-cover shadow-md"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight">{album.name}</h1>
          <p className="text-lg text-gray-200 mt-1">{songs[0]?.artist}</p>
        </div>
      </div>

      <table className="w-full table-fixed text-gray-200">
        <thead>
          <tr>
            <th className="w-10 py-3 text-left">#</th>
            <th className="py-3 text-left">Title</th>
            <th className="py-3 text-center">⏱</th>
            <th className="py-3 text-center w-10"></th>
            <th className="py-3 text-center w-16">Play</th>
            <th className="py-3 text-center w-10">...</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr
              key={song.id}
              className=" hover:bg-opacity-10  transition-all duration-200"
            >
              <td className="py-2">{index + 1}</td>

              <Link to={`/playcomponent/${song.id}/${album.id}`}>
                <td
                  className={`max-w-20 sm:max-w-full overflow-hidden py-2 ${
                    currentSongIndex === index && isPlaying
                      ? "text-green-500 font-semibold"
                      : ""
                  }`}
                >
                  {isSmallScreen ? (
                    <Marquee speed={25}>{song.title}</Marquee>
                  ) : (
                    song.title // Display title normally on larger screens
                  )}
                </td>
              </Link>
              <td className="py-2 text-center z-30 ">{song.duration}</td>
              <td className="py-2 text-center">
                <button
                  onClick={() =>
                    favourite.some((fav) => fav._id === song.id)
                      ? deleteFromFavourite(song.id)
                      : addToFavourite(song.id)
                  }
                  className={`transition duration-200 ${
                    favourite.some((fav) => fav._id === song.id)
                      ? "text-green-500 hover:text-green-700"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <FaHeart />
                </button>
              </td>
              <td className="py-2 text-center">
                <button
                  onClick={() => {
                    if (currentuser) {
                      handlePlayPause(index);
                    } else {
                      alert("Please login");
                      navigate("/login");
                    }
                  }}
                  className="w-16 h-8 flex items-center justify-center rounded-full transition-all duration-200"
                >
                  {currentSongIndex === index && isPlaying ? (
                    <FaPause className="text-white" />
                  ) : (
                    <FaPlay className="text-white" />
                  )}
                </button>
              </td>

              <td className="py-2 text-center relative">
                <button
                  className="text-gray-300 hover:text-white transition duration-200"
                  onClick={() => toggleDropdown(index)}
                >
                  <FaEllipsisH />
                </button>
                {dropdownIndex === index && currentuser ? (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-black text-white text-sm rounded-md shadow-lg">
                    <button
                      className="block px-4 py-2 hover:bg-gray-700 rounded-md"
                      onClick={() => togglePlaylistDropdown(index)}
                    >
                      Add to playlist
                    </button>
                    {playlistDropdownIndex === index && (
                      <div className="absolute top-12 right-0 mt-2 w-40 bg-black text-white text-sm rounded-md shadow-lg overflow-y-scroll">
                        {input ? (
                          <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition-all duration-200">
                            <form
                              className="flex-grow"
                              onSubmit={(e) => handlesubmit(e, name, song.id)}
                            >
                              <input
                                type="text"
                                placeholder="New Playlist"
                                className="bg-gray-900 text-white rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 h-7"
                                onChange={(e) => setName(e.target.value)}
                              />
                              <button
                                type="submit"
                                className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-all duration-200"
                              >
                                Create new
                              </button>
                            </form>
                          </div>
                        ) : (
                          <button
                            onClick={changetoinp}
                            className="block px-4 py-2 hover:bg-gray-700 rounded-md"
                          >
                            Create New Playlist
                          </button>
                        )}
                        {userplaylist.map((playlist) => (
                          <button
                            key={playlist._id}
                            onClick={() =>
                              addtoplaylist(playlist.name, song.id)
                            }
                            className="block px-4 py-2 hover:bg-gray-700 rounded-md"
                          >
                            {playlist.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MusicCard;
