import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAlladminSongs } from "../../redux/slice/admin/adminSongSlice";

import FormforSong from "./formForSong";
import AdminSidebar from "./adminSidebar";
import AdminNavbar from "./adminNavbar";

const Editsongs = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const songs = useSelector((state) => state.adminSongs.adminSongs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      await dispatch(getAlladminSongs());
      setLoading(false);
    };
    fetchSongs();
  }, [dispatch]);

  const oldSong = songs.find((song) => song._id === id);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!oldSong) {
    return <div>Song not found!</div>;
  }

  return (
    <div className="h-screen bg-black ">
      <AdminNavbar />
      <div className="flex fixed w-full">
        <div className="h-screen">
          <AdminSidebar />
        </div>
        <div className="w-3/4 overflow-y-scroll h-screen">
          <FormforSong oldSong={oldSong} />
        </div>
      </div>
    </div>
  );
};

export default Editsongs;
