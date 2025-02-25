import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { songValidationSchema } from "../../redux/validations";
import {
  editSong,
  getAlladminSongs,
} from "../../redux/slice/admin/adminSongSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialSongs = {
  title: "",
  artist: "",
  album: "",
  duration: "",
  type: "",
  audioFile: null,
  imageFile: null,
};

const FormforSong = ({ handleuploadSubmit, oldSong }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    oldSong?.imageFile ? URL.createObjectURL(oldSong.imageFile) : null
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    errors,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: oldSong || initialSongs,
    validationSchema: songValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }
      try {
        console.log(oldSong, "aaa");
        if (oldSong) {
          await dispatch(editSong({ formData, id: oldSong._id }));
          dispatch(getAlladminSongs());
          toast.success("song updated successfully");
          navigate("/admin/songs");
          console.log("sdhfsty");
          console.log("sda:", formData);
        } else {
          console.log("sss");
          await handleuploadSubmit(formData);
        }
      } catch (error) {
        console.error("Error uploading song:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue("imageFile", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue("audioFile", file);
    }
  };

  console.log(oldSong);
  return (
    <div>
      <div className="min-h-screen bg-black flex items-center justify-center p-6 mb-14">
        <div className="w-full max-w-full bg-gray-900 p-6 rounded-lg shadow-lg">
          <h1 className="text-white text-2xl font-bold mb-6 text-center">
            {oldSong ? "Edit Song" : "Add a Song"}
          </h1>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-white mb-2"
              >
                Song Title
              </label>
              <input
                type="text"
                id="title"
                value={values.title}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter song title"
                className="w-full p-3 rounded-md bg-gray-800 text-white focus:ring-spotifyGreen focus:border-spotifyGreen border-gray-700"
              />
              {errors?.title && touched.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            {/* Artist */}
            <div className="mb-4">
              <label
                htmlFor="artist"
                className="block text-sm font-medium text-white mb-2"
              >
                Artist
              </label>
              <input
                type="text"
                id="artist"
                value={values.artist}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter artist name"
                className="w-full p-3 rounded-md bg-gray-800 text-white focus:ring-spotifyGreen focus:border-spotifyGreen border-gray-700"
              />
              {errors?.artist && touched.artist && (
                <p className="text-red-500 text-sm mt-1">{errors.artist}</p>
              )}
            </div>
            {/* Album */}
            <div className="mb-4">
              <label
                htmlFor="album"
                className="block text-sm font-medium text-white mb-2"
              >
                Album
              </label>
              <input
                type="text"
                id="album"
                value={values.album}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter album name"
                className="w-full p-3 rounded-md bg-gray-800 text-white focus:ring-spotifyGreen focus:border-spotifyGreen border-gray-700"
              />
              {errors?.album && touched.album && (
                <p className="text-red-500 text-sm mt-1">{errors.album}</p>
              )}
            </div>
            {/* Duration */}
            <div className="mb-4">
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-white mb-2"
              >
                Duration (in minutes)
              </label>
              <input
                type="number"
                id="duration"
                value={values.duration}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter duration"
                className="w-full p-3 rounded-md bg-gray-800 text-white focus:ring-spotifyGreen focus:border-spotifyGreen border-gray-700"
              />
              {errors?.duration && touched.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
              )}
            </div>
            {/* Image File */}
            <div className="mb-4">
              <label
                htmlFor="imageFile"
                className="block text-sm font-medium text-white mb-2"
              >
                Song Cover Image
              </label>
              <input
                type="file"
                id="imageFile"
                onChange={handleImageChange}
                className="w-full text-white bg-gray-800 p-2 rounded-md focus:outline-none focus:ring-spotifyGreen focus:border-spotifyGreen"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 w-32 h-32 object-cover rounded-md"
                />
              )}
            </div>
            {/* Audio File */}
            <div className="mb-4">
              <label
                htmlFor="audioFile"
                className="block text-sm font-medium text-white mb-2"
              >
                Audio File
              </label>
              <input
                type="file"
                id="audioFile"
                onChange={handleAudioChange}
                className="w-full text-white bg-gray-800 p-2 rounded-md focus:outline-none focus:ring-spotifyGreen focus:border-spotifyGreen"
              />
            </div>
            {/* Song Type */}
            <div className="mb-4">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-white mb-2"
              >
                Song Type
              </label>
              <input
                type="text"
                id="type"
                value={values.type}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter type (e.g., Pop, Jazz)"
                className="w-full p-3 rounded-md bg-gray-800 text-white focus:ring-spotifyGreen focus:border-spotifyGreen border-gray-700"
              />
              {errors?.type && touched.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
              )}
            </div>
            <button
              type="submit"
              className={`w-full font-bold py-3 rounded-md transition ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-spotifyGreen text-white hover:bg-green-500"
              }`}
              disabled={loading}
            >
              {loading ? "Uploading..." : oldSong ? "Update Song" : "Add Song"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormforSong;
