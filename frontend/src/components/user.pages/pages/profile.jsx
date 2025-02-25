import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getuserplaylist } from "../../../redux/slice/user/userPlaylistSlice";
import { FaPencilAlt } from "react-icons/fa";
import { edituser } from "../../../redux/slice/user/loginSlice";
import { Link } from "react-router-dom";
import Navbar from "../home/navbar";
import Sidebar from "../home/sidebar";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [name, setName] = useState("");
  const user = useSelector((state) => state.user);
  const playlists = useSelector((state) => state.userplaylist.userplaylist);
  const dispatch = useDispatch();
  const savedProfilePicture = localStorage.getItem("profilepicture");
  console.log("wefh:", user);
  useEffect(() => {
    const savedName = localStorage.getItem("current user");

    if (savedProfilePicture) {
      setProfilePicture(savedProfilePicture);
    }
    if (savedName) {
      setName(savedName);
    }
  }, [user]);

  useEffect(() => {
    dispatch(getuserplaylist());
  }, [dispatch]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (name) {
      formData.append("name", name);
    }
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
    dispatch(edituser(formData));
    setIsEditing(false);
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };
  console.log("ds:", user);
  console.log("image:", profilePicture);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="flex">
        <div className="hidden sm:block fixed h-full w-1/5 bg-black">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="sm:ml-[20%] w-full min-h-screen p-8 bg-gradient-to-b from-gray-900 to-black">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-12 space-y-6">
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-600 hover:border-spotify-green transition-all">
                <img
                  src={user?.profilePicture || "/default-avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaPencilAlt className="text-white text-2xl" />
                </div>
              </div>
            </div>

            {isEditing ? (
              <form
                className="w-full max-w-md space-y-4"
                onSubmit={handleProfileUpdate}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-spotify-green focus:ring-2 focus:ring-spotify-green outline-none text-white"
                    placeholder="Enter new username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    onChange={handlePictureChange}
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-spotify-green file:text-black hover:file:bg-spotify-green-dark"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-spotify-green hover:bg-spotify-green-dark text-black font-bold py-2 px-6 rounded transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-2 text-amber-50">
                  {user?.user?.toUpperCase() || "Username"}
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-spotify-green hover:text-spotify-green-dark text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FaPencilAlt className="text-current" />
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Playlists Section */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-8">Your Playlists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {playlists && playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <Link
                    key={playlist._id}
                    to={`/userplaylist/playcomponent/${playlist._id}`}
                    className="group relative block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="relative aspect-square mb-4 rounded-md overflow-hidden">
                      <img
                        src={
                          playlist.songs[0]?.image || "/default-playlist.png"
                        }
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-lg font-bold">
                          View Playlist
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold truncate">
                      {playlist.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {playlist.songs?.length || 0} songs
                    </p>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">
                    You don't have any playlists yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
