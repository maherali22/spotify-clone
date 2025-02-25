import React from "react";
import { FaHome, FaMusic, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { adminlogout } from "../../redux/slice/admin/adminLoginSlice";

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeStyle = (path) =>
    window.location.pathname === path
      ? "bg-green-500 text-black"
      : "hover:bg-green-500 hover:text-black";
  const handleLogout = () => {
    try {
      dispatch(adminlogout());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-[550px] bg-black text-white flex flex-col w-16 sm:w-16 md:w-64 transition-all duration-300">
      {/* Navigation Links */}
      <nav className="flex-1 p-2">
        <ul className="space-y-4">
          <li>
            <Link
              to="/admin"
              className={`flex items-center justify-center md:justify-start space-x-3 p-2 rounded ${activeStyle(
                "/admin/dashboard"
              )} transition`}
            >
              <FaHome size={24} />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/songs"
              className={`flex items-center justify-center md:justify-start space-x-3 p-2 rounded ${activeStyle(
                "/admin/songs"
              )} transition`}
            >
              <FaMusic size={24} />
              <span className="hidden md:inline">Manage Songs</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className={`flex items-center justify-center md:justify-start space-x-3 p-2 rounded ${activeStyle(
                "/admin/users"
              )} transition`}
            >
              <FaUsers size={24} />
              <span className="hidden md:inline">Manage Users</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="p-2 border-t border-gray-700">
        <button
          aria-label="Logout"
          onClick={() =>
            confirm("Are you sure you want to log out?") && handleLogout()
          }
          className="flex items-center justify-center md:justify-start space-x-3 p-2 rounded w-full hover:bg-red-500 hover:text-white transition"
        >
          <FaSignOutAlt size={24} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
