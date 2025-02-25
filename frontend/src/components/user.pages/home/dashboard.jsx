import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getfavourite } from "../../../redux/slice/user/favourateSlice";
import { getplaylist } from "../../../redux/slice/user/playlistSLice";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();

  const user = localStorage.getItem("current user");

  useEffect(() => {
    if (user) {
      dispatch(getfavourite());
      dispatch(getplaylist());
    }
  }, [dispatch, user]);

  const { favourite } = useSelector((state) => state.favourite);
  const { playlist } = useSelector((state) => state.playlist);

  return (
    <div className="bg-stone-950 text-white rounded-lg sm:max-w-full md:max-w-5/6 lg:max-w-4/5 mx-auto mt-12 shadow-lg">
      <div className="bg-gradient-to-b from-violet-950 to-gray-700 sm:p-0 md:p-4 max-w-full min-h-[25vh] rounded-lg p-2 shadow-md">
        {/* Grid Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
          {/* Liked Songs */}
          <Link to="/likedsongs">
            <div className="bg-stone-900 rounded-lg flex items-center p-3 gap-2 hover:scale-105 hover:bg-stone-800 transition">
              <img
                src={favourite[0]?.image || "default-image-url.jpg"}
                alt="Liked Songs"
                className="h-10 w-10 object-cover rounded-lg"
              />
              <h1 className="text-xs font-medium truncate">Liked Songs</h1>
            </div>
          </Link>
          {/* Playlists */}
          {playlist?.playlists?.slice(0, 5).map((pl) => (
            <Link key={pl._id} to={`/playlist/playlcomponent/${pl._id}`}>
              <div className="bg-stone-900 rounded-lg flex items-center p-3 gap-2 hover:scale-105 hover:bg-stone-800 transition">
                <img
                  src={pl.songs[0]?.image || "default-image-url.jpg"}
                  alt={pl.name}
                  className="h-10 w-10 object-cover rounded-lg"
                />
                <h1 className="text-xs font-normal truncate">{pl.name}</h1>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
