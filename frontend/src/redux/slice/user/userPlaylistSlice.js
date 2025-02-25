import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";
import { toast } from "react-toastify";

export const getuserplaylist = createAsyncThunk(
  "playlist/getuser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/getplaylist");
      if (!response.data) {
        throw new Error("No data received");
      }
      console.log("playlist data:", response.data);
      return response.data;
    } catch (error) {
      console.error("API error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch playlists"
      );
    }
  }
);

export const createplaylist = createAsyncThunk(
  "addtoplaylist",
  async ({ playlistName, songsId }) => {
    try {
      const response = await axiosInstance.post("/user/createplaylist", {
        playlistName,
        songsId,
      });
      console.log("createplaylist:", response.data);
      toast.success(`song adde to ${playlistName} `);
    } catch (error) {
      console.log("create playlist:", error);
    }
  }
);

export const deletefromplaylist = createAsyncThunk(
  "remove from playlist",
  async ({ playlistid, songId }) => {
    try {
      const response = await axiosInstance.delete("/user/deletefromplaylist", {
        data: {
          playlistid,
          songId,
        },
      });
      console.log("remove from playlist:", response.data);
    } catch (error) {
      console.log("remove from playlist:", error.message);
    }
  }
);

export const deleteplaylist = createAsyncThunk(
  "delete playlist",
  async ({ playlistId }) => {
    try {
      console.log("aaa:", playlistId);
      const response = await axiosInstance.delete(
        `/user/deleteplaylist/${playlistId}`
      );
      console.log("delete playlist:", response);
    } catch (error) {
      console.log("delete playlist:", error);
    }
  }
);

const userplaylistslice = createSlice({
  name: "userplaylist",
  initialState: {
    userplaylist: [],
    status: "none",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getuserplaylist.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(getuserplaylist.fulfilled, (state, action) => {
        state.userplaylist = action.payload;
        state.status = "fulfilled";
        state.error = null;
      })
      .addCase(getuserplaylist.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || "Failed to fetch playlists";
      });
  },
});

export default userplaylistslice.reducer;
