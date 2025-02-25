import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

export const getAlladminSongs = createAsyncThunk("songs", async () => {
  try {
    const response = await axiosInstance.get("/admin/getallsongs");
    console.log("songdata:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const deleteSongs = createAsyncThunk("deletesongs", async (songId) => {
  try {
    const response = await axiosInstance.delete(`/admin/deletesong/${songId}`);
    console.log("deletesong:", response.data);
    return response.data;
  } catch (error) {
    console.log("delete song:", error);
  }
});

export const addSongs = createAsyncThunk("addsongs", async (data) => {
  try {
    const response = await axiosInstance.post("/admin/addsong", data);
    console.log("add songs:", response.data);
    return response.data;
  } catch (error) {
    console.log("add songs:", error);
  }
});

export const editSong = createAsyncThunk(
  "edit song",
  async ({ formData, id }) => {
    try {
      const response = await axiosInstance.put(
        `/admin/editsong/${id}`,
        formData
      );
      console.log("edit song:", response.data);
      return response.data;
    } catch (error) {
      console.log("edit song:", error);
    }
  }
);

const AdminSongSlice = createSlice({
  name: "adminSongs",
  initialState: {
    adminSongs: [],
    status: "none",
  },
  reducers: {},
  extraReducers: (Builder) => {
    Builder.addCase(getAlladminSongs.pending, (state) => {
      state.status = "pending";
    })
      .addCase(getAlladminSongs.fulfilled, (state, action) => {
        state.adminSongs = action.payload;
        state.status = "fulfilled";
      })
      .addCase(getAlladminSongs.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(deleteSongs.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteSongs.fulfilled, (state) => {
        state.status = "fulfilled";
      })
      .addCase(deleteSongs.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(addSongs.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addSongs.fulfilled, (state, action) => {
        state.adminSongs.push(action.payload);
        state.status = "fulfilled";
      })
      .addCase(addSongs.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(editSong.pending, (state) => {
        state.status = "pending";
      })
      .addCase(editSong.fulfilled, (state) => {
        state.status = "fulfilled";
      })
      .addCase(editSong.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default AdminSongSlice.reducer;
