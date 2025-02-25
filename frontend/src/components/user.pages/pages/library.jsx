import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaListUl } from "react-icons/fa";
import { CiGrid41 } from "react-icons/ci";
import { getuserplaylist } from "../../../redux/slice/user/userPlaylistSlice";
import { Link } from "react-router-dom";
import { getartist } from "../../../redux/slice/user/artistSlice";
import { getAlbums } from "../../../redux/slice/user/albumSlice";

const Library = () => {
  const dispatch = useDispatch();
  const user = localStorage.getItem("current user");
  const [list, setList] = useState(true);
  const [activeSection, setActiveSection] = useState("all"); // Track active section
  const { artist } = useSelector((state) => state.artist);
  const { albums } = useSelector((state) => state.albums);
  const userplaylist = useSelector((state) => state.userplaylist.userplaylist);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        dispatch(getuserplaylist()),
        dispatch(getartist()),
        dispatch(getAlbums()),
      ]).finally(() => setLoading(false));
    }
  }, [dispatch, user]);

  const handleListToggle = () => {
    setList((prev) => !prev);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section); // Update active section
  };

  if (loading) {
    return <div className="text-white">Loading...</div>; // Add a spinner here for better UX
  }

  return (
    <div className="px-5 py-4 bg-black h-screen relative overflow-y-scroll scrollbar-none">
      <div
        className="absolute top-4 right-4 text-white cursor-pointer"
        onClick={handleListToggle}
      >
        {!list ? <FaListUl size={35} /> : <CiGrid41 size={35} />}
      </div>

      {/* Section Buttons */}
      <div className="flex space-x-5 mb-4">
        <button
          className={`text-white ${activeSection === "all" ? "font-bold" : ""}`}
          onClick={() => handleSectionChange("all")}
        >
          All
        </button>
        <button
          className={`text-white ${
            activeSection === "playlists" ? "font-bold" : ""
          }`}
          onClick={() => handleSectionChange("playlists")}
        >
          Playlists
        </button>
        <button
          className={`text-white ${
            activeSection === "artists" ? "font-bold" : ""
          }`}
          onClick={() => handleSectionChange("artists")}
        >
          Artists
        </button>
        <button
          className={`text-white ${
            activeSection === "albums" ? "font-bold" : ""
          }`}
          onClick={() => handleSectionChange("albums")}
        >
          Albums
        </button>
      </div>

      {/* Content Section */}
      <div className="mt-12">
        {/* Liked Songs (always visible) */}
        <div>
          <h2 className="text-white text-xl font-bold mb-4 ">Liked Songs</h2>
          {list ? (
            <Link to={"/likedsongs"}>
              <div className="p-4 bg-stone-900 text-white rounded-md shadow-md flex items-center space-x-4">
                <div className="w-16 h-16 bg-red-500 flex items-center justify-center rounded-full">
                  <FaHeart className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Liked songs</h3>
                </div>
              </div>
            </Link>
          ) : (
            <Link to={"/likedsongs"}>
              <div className="flex flex-row overflow-x-auto">
                <div className="w-28 rounded overflow-hidden shadow-lg bg-stone-900 text-white">
                  <div className="w-full flex items-center justify-center h-32 bg-red-500">
                    <FaHeart className="text-white text-4xl" />
                  </div>
                  <div className="px-6 py-4">
                    <h5 className="font-bold text-xl mb-2">Liked songs</h5>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Conditional Rendering Based on Active Section */}
        {activeSection === "all" && (
          <>
            {/* User Playlists */}
            <div className="mt-8">
              <h2 className="text-white text-xl font-bold mb-4">Playlists</h2>
              {userplaylist.length === 0 ? (
                <p className="text-gray-500">No playlists found.</p>
              ) : (
                <div
                  className={`flex ${
                    list ? "flex-col" : "flex-row flex-wrap gap-4"
                  }`}
                >
                  {userplaylist.map((playlist, index) =>
                    list ? (
                      <Link
                        key={index}
                        to={`/userplaylist/playcomponent/${playlist._id}`}
                      >
                        <div className="p-4 bg-stone-900 text-white rounded-md shadow-md flex items-center space-x-4">
                          <img
                            src={
                              playlist?.songs?.[0]?.image ||
                              "/default-image.png"
                            }
                            alt={playlist?.name || "Playlist"}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-bold">
                              {playlist?.name || "Untitled Playlist"}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {playlist?.songs?.length || 0} songs
                            </p>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        key={index}
                        to={`/userplaylist/playcomponent/${playlist._id}`}
                      >
                        <div
                          key={index}
                          className="w-28 rounded overflow-hidden shadow-lg bg-stone-900 text-white h-62"
                        >
                          <img
                            className="w-full h-32 object-cover"
                            src={
                              playlist?.songs?.[0]?.image ||
                              "/default-image.png"
                            }
                            alt="Playlist"
                          />
                          <div className="px-6 py-4">
                            <h5 className="font-bold text-xl mb-2">
                              {playlist?.name || "Untitled Playlist"}
                            </h5>
                            <p className="text-gray-400 text-sm">
                              {playlist?.songs?.length || 0} songs
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Artists Section */}
            <div className="mt-8">
              <h2 className="text-white text-xl font-bold mb-4">Artists</h2>
              <div
                className={`flex ${
                  list ? "flex-col" : "flex-row flex-wrap gap-4"
                }`}
              >
                {artist.length === 0 ? (
                  <p className="text-gray-500">No artists found.</p>
                ) : (
                  artist.map((artistItem, index) =>
                    list ? (
                      <Link
                        key={index}
                        to={`/artist/playlcomponent/${artistItem.artist}`}
                      >
                        <div className="p-4 bg-stone-900 text-white rounded-md shadow-md flex items-center space-x-4">
                          <img
                            src={
                              artistItem.songs?.[0]?.image ||
                              "/default-image.png"
                            }
                            alt={artistItem?.artist || "Artist"}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-bold">
                              {artistItem?.artist || "Unknown Artist"}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {artistItem.songs?.length || 0} songs
                            </p>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        key={index}
                        to={`/artist/playlcomponent/${artistItem.artist}`}
                      >
                        <div
                          key={index}
                          className="w-28 rounded overflow-hidden shadow-lg bg-stone-900 text-white"
                        >
                          <img
                            className="w-full h-32 object-cover"
                            src={
                              artistItem.songs[0]?.image || "/default-image.png"
                            }
                            alt="Artist"
                          />
                          <div className="px-6 py-4">
                            <h5 className="font-bold text-xl mb-2">
                              {artistItem?.artist || "Unknown Artist"}
                            </h5>
                            <p className="text-gray-400 text-sm">
                              {artistItem.songs?.length || 0} songs
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  )
                )}
              </div>
            </div>

            {/* Albums Section */}
            <div className="mt-8">
              <h2 className="text-white text-xl font-bold mb-4">Albums</h2>
              <div
                className={`flex ${
                  list ? "flex-col" : "flex-row flex-wrap gap-4"
                }`}
              >
                {albums.length === 0 ? (
                  <p className="text-gray-500">No albums found.</p>
                ) : (
                  albums.map((album, index) =>
                    list ? (
                      <Link
                        key={index}
                        to={`/albums/playlcomponent/${album._id}`}
                      >
                        <div className="p-4 bg-stone-900 text-white rounded-md shadow-md flex items-center space-x-4">
                          <img
                            src={album.songs[0]?.image || "/default-image.png"}
                            alt={album.name || "Album"}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-bold">
                              {album.name || "Untitled Album"}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {album.songs?.length || 0} songs
                            </p>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        key={index}
                        to={`/albums/playlcomponent/${album._id}`}
                      >
                        <div
                          key={index}
                          className="w-28 rounded overflow-hidden shadow-lg bg-stone-900 text-white"
                        >
                          <img
                            className="w-full h-32 object-cover"
                            src={album.songs[0]?.image || "/default-image.png"}
                            alt="Album"
                          />
                          <div className="px-6 py-4">
                            <h5 className="font-bold text-xl mb-2">
                              {album.name || "Untitled Album"}
                            </h5>
                            <p className="text-gray-400 text-sm">
                              {album.songs?.length || 0} songs
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  )
                )}
              </div>
            </div>
          </>
        )}
        {activeSection === "playlists" && (
          <div className="mt-8">
            <h2 className="text-white text-xl font-bold mb-4">Playlists</h2>
            {userplaylist.length === 0 ? (
              <p className="text-gray-500">No playlists found.</p>
            ) : (
              <div
                className={`flex ${
                  list ? "flex-col" : "flex-row flex-wrap gap-4"
                }`}
              >
                {userplaylist.map((playlist, index) =>
                  list ? (
                    <Link
                      key={index}
                      to={`/userplaylist/playcomponent/${playlist._id}`}
                    >
                      <div className="p-4 bg-stone-900 text-white rounded-md shadow-md flex items-center space-x-4">
                        <img
                          src={
                            playlist?.songs[0]?.image || "/default-image.png"
                          }
                          alt={playlist?.name || "Playlist"}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-bold">
                            {playlist?.name || "Untitled Playlist"}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {playlist?.songs?.length || 0} songs
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      key={index}
                      to={`/userplaylist/playcomponent/${playlist._id}`}
                    >
                      <div
                        key={index}
                        className="w-28 rounded overflow-hidden shadow-lg bg-stone-900 text-white h-62"
                      >
                        <img
                          className="w-full h-32 object-cover"
                          src={
                            playlist?.songs?.[0]?.image || "/default-image.png"
                          }
                          alt="Playlist"
                        />
                        <div className="px-6 py-4">
                          <h5 className="font-bold text-xl mb-2">
                            {playlist?.name || "Untitled Playlist"}
                          </h5>
                          <p className="text-gray-400 text-sm">
                            {playlist?.songs?.length || 0} songs
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        )}
        {activeSection === "artists" && (
          <div className="mt-8">
            <h2 className="text-white text-xl font-bold mb-4">Artists</h2>
            <div
              className={`flex ${
                list ? "flex-col" : "flex-row flex-wrap gap-4"
              }`}
            >
              {artist.length === 0 ? (
                <p className="text-gray-500">No artists found.</p>
              ) : (
                artist.map((artistItem, index) =>
                  list ? (
                    <Link
                      key={index}
                      to={`/artist/playlcomponent/${artistItem.artist}`}
                    >
                      <div className="p-4 bg-stone-900 text-white rounded-md shadow-md flex items-center space-x-4">
                        <img
                          src={
                            artistItem.songs[0]?.image || "/default-image.png"
                          }
                          alt={artistItem?.artist || "Artist"}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-bold">
                            {artistItem?.artist || "Unknown Artist"}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {artistItem.songs?.length || 0} songs
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      key={index}
                      to={`/artist/playlcomponent/${artistItem.artist}`}
                    >
                      <div
                        key={index}
                        className="w-28 rounded overflow-hidden shadow-lg bg-stone-900 text-white"
                      >
                        <img
                          className="w-full h-32 object-cover"
                          src={
                            artistItem.songs[0]?.image || "/default-image.png"
                          }
                          alt="Artist"
                        />
                        <div className="px-6 py-4">
                          <h5 className="font-bold text-xl mb-2">
                            {artistItem?.artist || "Unknown Artist"}
                          </h5>
                          <p className="text-gray-400 text-sm">
                            {artistItem.songs?.length || 0} songs
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                )
              )}
            </div>
          </div>
        )}
        {activeSection === "albums" && (
          <div className="mt-8">
            <h2 className="text-white text-xl font-bold mb-4">Albums</h2>
            <div
              className={`flex ${
                list ? "flex-col" : "flex-row flex-wrap gap-4"
              }`}
            >
              {albums.length === 0 ? (
                <p className="text-gray-500">No albums found.</p>
              ) : (
                albums.map((album, index) =>
                  list ? (
                    <Link
                      key={index}
                      to={`/albums/playlcomponent/${album._id}`}
                    >
                      <div className="p-4 bg-stone-900 text-white rounded-md shadow-md flex items-center space-x-4">
                        <img
                          src={album.songs[0]?.image || "/default-image.png"}
                          alt={album.name || "Album"}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-bold">
                            {album.name || "Untitled Album"}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {album.songs?.length || 0} songs
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      key={index}
                      to={`/albums/playlcomponent/${album._id}`}
                    >
                      <div
                        key={index}
                        className="w-28 rounded overflow-hidden shadow-lg bg-stone-900 text-white"
                      >
                        <img
                          className="w-full h-32 object-cover"
                          src={album.songs[0]?.image || "/default-image.png"}
                          alt="Album"
                        />
                        <div className="px-6 py-4">
                          <h5 className="font-bold text-xl mb-2">
                            {album.name || "Untitled Album"}
                          </h5>
                          <p className="text-gray-400 text-sm">
                            {album.songs?.length || 0} songs
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
