import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAlbums } from "../../../redux/slice/user/albumSlice";
import CardCarousel from "../layout/cardCarousel";
import Card from "../layout/card";
import { Link } from "react-router-dom";

const Album = () => {
  const dispatch = useDispatch();
  const { albums, status } = useSelector((state) => state.albums);

  useEffect(() => {
    dispatch(getAlbums());
  }, [dispatch]);

  if (status === "pending") {
    return <p className="text-white">Loading...</p>;
  }
  if (status === "rejected") {
    return (
      <p className="text-red-500">Error occurred while fetching albums.</p>
    );
  }
  console.log("album:", albums);
  return (
    <div className="bg-stone-950  text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Albums</h1>
      <CardCarousel>
        {albums.map((album) => (
          <Link key={album._id} to={`/albums/playlcomponent/${album._id}`}>
            <Card
              image={album.songs[0]?.image}
              title={album.songs[0]?.album}
              artist={album.songs[0]?.artist}
            />
          </Link>
        ))}
      </CardCarousel>
    </div>
  );
};

export default Album;
