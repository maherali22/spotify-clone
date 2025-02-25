import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

export const getAllsongs = createAsyncThunk("songs", async () => {
  try {
    const response = await axiosInstance.get("/user/getsongs");
    console.log("songdata:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

const songSlice = createSlice({
  name: "songs",
  initialState: {
    songs: [],
    status: "none",
  },
  reducers: {},
  extraReducers: (Builder) => {
    Builder.addCase(getAllsongs.pending, (state) => {
      state.status = "pending";
    })
      .addCase(getAllsongs.fulfilled, (state, action) => {
        state.songs = action.payload;
        state.status = "fulfilled";
      })
      .addCase(getAllsongs.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default songSlice.reducer;
