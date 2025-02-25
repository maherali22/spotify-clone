import { useEffect, useState } from "react";
import { FaSpotify, FaSearch, FaHome, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../redux/slice/user/loginSlice";
import Searchbar from "./searchBar";
import { adminlogout } from "../../../redux/slice/admin/adminLoginSlice";
import { getAllusers } from "../../../redux/slice/admin/adminUserSlice";
import { persistor } from "../../../redux/store/store";
import { getAllsongs } from "../../../redux/slice/user/songSlice";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const localuser = localStorage.getItem("current user");

  const admin = useSelector((state) => state.admin.user);
  const { songs, status } = useSelector((state) => state.song);

  const [isDropdown, setIsDropdown] = useState(false);
  const [click, setClick] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setIsDropdown(!isDropdown);
  };
  useEffect(() => {
    dispatch(getAllusers());
    dispatch(getAllsongs());
  }, []);

  const handleLogout = () => {
    if (user) {
      dispatch(logout());
      persistor.purge().then(() => {
        localStorage.clear();
        console.log("Persisted state and localStorage cleared.");
      });
    } else if (admin) {
      dispatch(adminlogout());
      persistor.purge().then(() => {
        localStorage.clear();
        console.log("Persisted state and localStorage cleared for admin.");
      });
    }
    navigate("/");
  };

  return (
    <nav className="bg-black px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
      {/* Left Section - Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <FaSpotify className="text-spotify-green text-3xl" />
        <span className="text-white font-bold text-xl hidden sm:block">
          Spotify
        </span>
      </Link>

      {/* Center Section - Navigation */}
      <div className="flex-1 flex items-center justify-center mx-4 max-w-3xl">
        <div className="hidden md:flex items-center gap-6 w-full">
          <Link
            to="/"
            className="text-gray-300 hover:text-white flex items-center gap-2 p-2 rounded-full transition-colors"
          >
            <FaHome className="text-xl" />
            <span className="text-sm font-medium">Home</span>
          </Link>

          <div className="w-full max-w-xl">
            <Searchbar songs={songs} status={status} />
          </div>
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={() => setClick(!click)}
          className="md:hidden ml-2 p-2 text-gray-400 hover:text-white rounded-full"
        >
          <FaSearch className="text-xl" />
        </button>
      </div>

      {/* Right Section - User Controls */}
      <div className="flex items-center gap-4">
        {localuser ? (
          <div className="relative group">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 hover:bg-gray-800 p-1 pr-3 rounded-full transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-400 text-lg" />
                )}
              </div>
              <span className="text-white font-medium text-sm hidden lg:block">
                {user?.user || "User"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isDropdown && (
              <div className="absolute right-0 top-12 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <FaUser className="text-lg" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/register"
              className="text-gray-300 hover:text-white text-sm font-medium hidden sm:block"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-spotify-green hover:bg-spotify-green-dark text-black font-medium px-6 py-2 rounded-full transition-colors text-sm"
            >
              Log In
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Search Overlay */}
      {click && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 md:hidden p-4">
          <div className="flex items-center justify-between mb-6">
            <FaSpotify className="text-spotify-green text-2xl" />
            <button
              onClick={() => setClick(false)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              &times;
            </button>
          </div>
          <Searchbar songs={songs} status={status} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
