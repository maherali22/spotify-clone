import React, { useEffect } from "react";
import Searchbar from "../home/searchBar";
import { getAllsongs } from "../../../redux/slice/user/songSlice";
import { useDispatch, useSelector } from "react-redux";

const CreatePlaylist = () => {
  const dispatch = useDispatch();
  const { songs, status } = useSelector((state) => state.song);

  useEffect(() => {
    dispatch(getAllsongs());
  }, []);

  return (
    <div>
      <Searchbar songs={songs} status={status} />
    </div>
  );
};

export default CreatePlaylist;
