import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { blockuser, getAllusers } from "../../redux/slice/admin/adminUserSlice";
import { getplaylist } from "../../redux/slice/user/playlistSLice";
import AdminSidebar from "./adminSidebar";
import AdminNavbar from "./adminNavbar";
import { toast } from "react-toastify";

const AdminUserprofile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Get users and playlist state from Redux
  const users = useSelector((state) => state.allusers.allusers);
  const {
    playlists,
    status: playlistStatus,
    error: playlistError,
  } = useSelector((state) => state.playlist);

  useEffect(() => {
    dispatch(getAllusers());
    dispatch(getplaylist()); // Fetch all playlists when component mounts
  }, [dispatch]);

  // Find the current user
  const user = users.find((userr) => userr._id === id);

  // Filter playlists for this user
  const userplaylist = (playlists || []).filter(
    (play) => play.user?._id === id // Handle populated user object from API
  );

  // Loading and error states
  if (playlistStatus === "pending") {
    return <div className="text-white">Loading playlists...</div>;
  }

  if (playlistError) {
    return <div className="text-white">Error: {playlistError}</div>;
  }

  if (!users || !user) {
    return <div className="text-white">User not found</div>;
  }

  const { name, email, profilePicture, likedSongs, block } = user;

  const handleblock = async () => {
    try {
      await dispatch(blockuser(id));
      dispatch(getAllusers());
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="bg-black h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex flex-grow overflow-hidden">
        <div className="bg-black">
          <AdminSidebar />
        </div>

        <div className="w-3/4 overflow-y-scroll bg-black p-6 text-white">
          {/* User Details Section */}
          <div className="flex items-center mb-8">
            <img
              src={profilePicture}
              alt={`${name}'s profile`}
              className="w-16 h-16 rounded-full mr-4 bg-white"
            />
            <div>
              <h2 className="text-2xl font-bold">{name}</h2>
              <p className="text-sm">{email}</p>
              <button
                className="bg-green-700 text-white mt-5 w-20 h-6 rounded-md hover:bg-green-300"
                onClick={handleblock}
                aria-label={block ? "Unblock user" : "Block user"}
              >
                {block ? "Unblock" : "Block"}
              </button>
            </div>
          </div>

          {/* Liked Songs Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Liked Songs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {likedSongs?.length > 0 ? (
                likedSongs.map((song, index) => (
                  <div
                    key={index}
                    className="bg-green-800 p-4 rounded shadow hover:shadow-lg transition-all flex flex-col items-center"
                  >
                    <img
                      src={song.image || "https://via.placeholder.com/150"}
                      alt={song.title}
                      className="w-32 h-32 rounded mb-4"
                    />
                    <h4 className="text-lg font-bold">{song.title}</h4>
                    <p className="text-sm">{song.artist}</p>
                    <p className="text-sm italic">{song.album}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm">No liked songs</p>
              )}
            </div>
          </div>

         
        
        </div>
      </div>
    </div>
  );
};

export default AdminUserprofile;
