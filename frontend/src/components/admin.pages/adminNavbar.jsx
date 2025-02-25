import React from "react";
import { FaSpotify } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  const admin = useSelector((state) => state.admin);

  return (
    <nav className="bg-spotifyBlack text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-white text-xl font-bold flex items-center">
            <FaSpotify className="text-green-500 mr-2" />
            <span>Spotify Admin</span>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-500 bg-green-500 cursor-pointer">
              <p>{admin?.user[0]?.toUpperCase()}</p>
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
              onClick={() =>
                document
                  .getElementById("mobile-menu")
                  .classList.toggle("hidden")
              }
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Dropdown */}
      <div id="mobile-menu" className="md:hidden hidden">
        <div className="space-y-1 px-4 py-3 bg-spotifyBlack border-t border-gray-700">
          <Link
            to="/admin/dashboard"
            className="block text-white hover:bg-spotifyGreen hover:text-black px-3 py-2 rounded-md text-base font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/settings"
            className="block text-white hover:bg-spotifyGreen hover:text-black px-3 py-2 rounded-md text-base font-medium"
          >
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
