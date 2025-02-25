import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSongs,
  getAlladminSongs,
} from "../../redux/slice/admin/adminSongSlice";
import AdminSidebar from "./adminSidebar";
import AdminNavbar from "./adminNavbar";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Adminsong = () => {
  const dispatch = useDispatch();
  const songs = useSelector((state) => state.adminSongs.adminSongs);
  console.log("sss:", songs);

  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    dispatch(getAlladminSongs());
  }, [dispatch]);

  const handledeleteSongs = async (songId) => {
    try {
      await dispatch(deleteSongs(songId));
      await dispatch(getAlladminSongs());
      toast.success("song deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("an error occured");
    }
  };

  const filteredSongs = selectedType
    ? songs.filter((song) => song.type == selectedType)
    : songs;
  console.log("hf:", selectedType);
  return (
    <div className="flex flex-col bg-black fixed w-screen h-screen">
      <AdminNavbar />
      <div className="flex flex-1 w-full">
        <AdminSidebar />
        <div className="bg-black text-white p-4 w-full overflow-hidden">
          <h1 className="text-2xl font-bold mb-4">Songs</h1>
          <div className="flex justify-between items-center">
            <Link to={"/admin/songs/addsongs"}>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4">
                Add song
              </button>
            </Link>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              <option value="">All Types</option>

              <option value="melody">Melody</option>
              <option value="rap">Rap</option>
              <option value="dance">Dance</option>
              <option value="rock">Rock</option>
            </select>
          </div>
          <div className="h-[calc(100vh-64px)] overflow-y-scroll">
            {filteredSongs && filteredSongs.length > 0 ? (
              <div className="overflow-x-auto mb-40 -mt-1">
                <table className="min-w-full bg-gray-800 border border-gray-700">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-700 px-4 py-2 text-center">
                        Image
                      </th>
                      <th className="border-b border-gray-700 px-4 py-2 text-center">
                        Title
                      </th>
                      <th className="border-b border-gray-700 px-4 py-2 text-center">
                        Artist
                      </th>
                      <th className="border-b border-gray-700 px-4 py-2 text-center">
                        Album
                      </th>
                      <th className="border-b border-gray-700 px-4 py-2 text-center">
                        Duration
                      </th>
                      <th className="border-b border-gray-700 px-4 py-2 text-center">
                        Type
                      </th>
                      <th className="border-b border-gray-700 px-4 py-2 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSongs.map((song) => (
                      <tr key={song._id} className="hover:bg-gray-700">
                        <td className="border-b border-gray-600 px-4 py-2 text-center">
                          <img
                            src={song.image}
                            alt={song.title}
                            className="h-16 w-16 object-cover mx-auto"
                          />
                        </td>
                        <td className="border-b border-gray-600 px-4 py-2 text-center">
                          {song.title}
                        </td>
                        <td className="border-b border-gray-600 px-4 py-2 text-center">
                          {song.artist}
                        </td>
                        <td className="border-b border-gray-600 px-4 py-2 text-center">
                          {song.album}
                        </td>
                        <td className="border-b border-gray-600 px-4 py-2 text-center">
                          {song.duration}
                        </td>
                        <td className="border-b border-gray-600 px-4 py-2 text-center">
                          {song.type}
                        </td>
                        <td className="border-b border-gray-600 px-4 py-2 text-center">
                          <Link to={`/admin/songs/editsong/${song._id}`}>
                            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                              Edit
                            </button>
                          </Link>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                            onClick={() => handledeleteSongs(song._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No songs found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adminsong;
