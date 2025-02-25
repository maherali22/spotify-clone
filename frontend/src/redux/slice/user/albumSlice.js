import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

export const getAlbums = createAsyncThunk("albums", async () => {
  try {
    const response = await axiosInstance.get("/user/getalbums");
    console.log("album:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

const albumSlice = createSlice({
  name: "albums",
  initialState: {
    albums: [],
    status: "none",
  },
  reducers: {},
  extraReducers: (Builder) => {
    Builder.addCase(getAlbums.pending, (state) => {
      state.status = "pending";
    })
      .addCase(getAlbums.fulfilled, (state, action) => {
        state.albums = action.payload;
        state.status = "fulfilled";
      })
      .addCase(getAlbums.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default albumSlice.reducer;
