import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllusers } from "../../redux/slice/admin/adminUserSlice";
import { getAlladminSongs } from "../../redux/slice/admin/adminSongSlice";
import { getplaylist } from "../../redux/slice/user/playlistSLice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.allusers.allusers);
  const songs = useSelector((state) => state.adminSongs.adminSongs);
  const playlist = useSelector((state) => state.playlist?.playlist || { playlists: [] });
  const currentUserCount = 2;
  const previousUserCount = users.length;
  const labels = [
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan 2025",
  ];

  const data = labels.map((label, index) => {
    const newUsers =
      index === labels.length - 1
        ? previousUserCount
        : currentUserCount + index; // Last element gets previous year count
    return { month: label, newUsers };
  });

  const melodySongs = songs.filter((song) => song.type === "melody");
  const rockSongs = songs.filter((song) => song.type === "rock");
  const rapSongs = songs.filter((song) => song.type === "rap");
  const danceSongs = songs.filter((song) => song.type === "dance");
  const totalSongs =
    melodySongs.length + rockSongs.length + rapSongs.length + danceSongs.length;

  // Calculate and round percentages
  const piedata = [
    {
      name: "Melody",
      value: Math.round((melodySongs.length / totalSongs) * 100),
    },
    { name: "Rock", value: Math.round((rockSongs.length / totalSongs) * 100) },
    { name: "Rap", value: Math.round((rapSongs.length / totalSongs) * 100) },
    {
      name: "Dance",
      value: Math.round((danceSongs.length / totalSongs) * 100),
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    dispatch(getAllusers());
    dispatch(getAlladminSongs());
    dispatch(getplaylist());
  }, [dispatch]);

  // Custom Tooltip for Pie Chart
  const renderTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white border border-gray-300 p-2 rounded">
          <p className="label text-black">{`${payload[0].name} : ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col bg-black">
      <main className="flex-grow w-full p-4">
        <h2 className="text-xl font-bold mb-4 text-white">
          Engagement Overview
        </h2>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-900 p-4 shadow-lg rounded text-white">
            <h2 className="text-lg font-bold">Total Users</h2>
            <p className="text-2xl font-semibold mt-2">{users.length}</p>
          </div>
          <div className="bg-green-900 p-4 shadow-lg rounded text-white">
            <h2 className="text-lg font-bold">Playlists</h2>
            <p className="text-2xl font-semibold mt-2">
              {playlist.playlists.length}
            </p>
          </div>
          <div className="bg-green-900 p-4 shadow-lg rounded text-white">
            <h2 className="text-lg font-bold">Songs Uploaded</h2>
            <p className="text-2xl font-semibold mt-2">{songs.length}</p>
          </div>
        </section>
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-white">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-900 p-4 shadow-lg rounded text-white">
              <h3 className="text-lg font-bold">User Management</h3>
              <Link to={"/admin/users"}>
                <button className="bg-green-500 text-black mt-4 px-4 py-2 rounded hover:bg-green-600">
                  {" "}
                  View Users{" "}
                </button>
              </Link>
            </div>
            {/* <div className="bg-green-900 p-4 shadow-lg rounded text-white">
                            <h3 className="text-lg font-bold">Playlist Management</h3>
                            <button className="bg-green-500 text-black mt-4 px-4 py-2 rounded hover:bg-green-600"> Manage Playlists </button>
                        </div> */}
            <div className="bg-green-900 p-4 shadow-lg rounded text-white">
              <h3 className="text-lg font-bold">Song Management</h3>
              <Link to={"/admin/songs"}>
                <button className="bg-green-500 text-black mt-4 px-4 py-2 rounded hover:bg-green-600">
                  {" "}
                  Manage Songs{" "}
                </button>
              </Link>
            </div>
          </div>
        </section>
        <section className="mt-8 mb-14 flex">
          <div className="w-3/4 pr-4">
            {/* LineChart Section */}
            <h2 className="text-xl font-bold mb-4 text-white">
              User Growth Over the Last Year
            </h2>
            <div className="bg-green-900 p-4 shadow-lg rounded text-white">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#000" />
                  <YAxis stroke="#000" />
                  <Tooltip content={renderTooltip} />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#75c8c8"
                    fill="#75c8c8"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-1/4">
            {/* PieChart Section */}
            <h2 className="text-xl font-bold mb-4 text-white">
              Song Genre Distribution
            </h2>
            <div className="bg-green-900 p-4 shadow-lg rounded text-white">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={piedata}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {piedata.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={renderTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
