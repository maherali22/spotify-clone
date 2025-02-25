import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getplaylist } from "../../../redux/slice/user/playlistSLice";
import Card from "../layout/card";
import CardCarousel from "../layout/cardCarousel";
import { Link } from "react-router-dom";

const Playlist = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.playlist);
  const playlist = useSelector((state) => state.playlist);

  useEffect(() => {
    dispatch(getplaylist()).then(() => {
      console.log("Fetched playlist:", playlist);
    });
  }, [dispatch]);

  if (status === "pending") {
    return <p className="text-white text-center">Loading...</p>;
  }

  if (status === "rejected") {
    return <p className="text-red-500 text-center">Error: {error}</p>;
  }

  // Option 1: If the state is an object with a "playlists" array
  // const playlistArray = Array.isArray(playlist) ? playlist : [playlist];

  // if (playlistArray.length === 0) {
  //   return <p className="text-gray-500 text-center">No playlists available.</p>;
  // }

  // const newplaylist = playlistArray.map((item) => item.playlists);

  return (
    <div className="bg-stone-950 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Playlists</h2>
      <CardCarousel>
        {playlist[0]?.map((playlists) => {
          const firstSong = playlists.songs?.[0];
          const image = firstSong?.image || "default-image-url.jpg";
          return (
            <Link
              key={playlists._id}
              to={`/playlist/playlcomponent/${playlists._id}`}
            >
              <Card
                image={image}
                title={playlists.name}
                artist={firstSong?.artist || "Unknown Artist"}
                id={playlists._id}
              />
            </Link>
          );
        })}
      </CardCarousel>
    </div>
  );
};

export default Playlist;
