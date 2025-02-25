import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getfavourite } from "../../../redux/slice/user/favourateSlice";
import MusicCard from "../layout/musicCard";
import Navbar from "../home/navbar";
import Sidebar from "../home/sidebar";
import { FaHeart } from "react-icons/fa";

const Likedsong = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getfavourite());
  }, [dispatch]);

  const { favourite } = useSelector((state) => state.favourite);

  console.log("liked:", favourite);

  const songs = favourite.map((song) => ({
    image: (
      <FaHeart
        size={40}
        className="w-40 h-40 text-white bg-gradient-to-t from-blue-700 to-blue-100"
      />
    ),
    title: song.title,
    duration: song.duration || "N/A",
    audioSrc: song.fileUrl,
    id: song._id,
  }));

  return (
    <div className="flex flex-col fixed w-screen h-screen bg-gradient-to-r from-black to-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/5 shadow-lg h-screen overflow-y-auto scrollbar-none hidden sm:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 h-screen w-5/6 fixed overflow-y-scroll scrollbar-none">
          {songs.length > 0 ? (
            <MusicCard
              album={{
                name: "Likedsongs",
                id: "Liked Songs",
              }}
              songs={songs}
              image={
                <FaHeart
                  size={160}
                  className="text-white bg-gradient-to-t from-blue-700 to-blue-100 rounded-lg"
                />
              }
              gradient="bg-gradient-to-t from-blue-800 to-blue-950"
            />
          ) : (
            <p className="text-white text-center mt-4">No liked songs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Likedsong;
