import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

export const getfavourite = createAsyncThunk("favourite", async () => {
  try {
    const response = await axiosInstance.get("/user/getfavourite");
    console.log("favouriteyycfy:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const addtofavourite = createAsyncThunk(
  "addtofavourite",
  async (songId) => {
    try {
      const response = await axiosInstance.post("/user/addtofavourite", {
        songId,
      });

      console.log("Added to favorites:", response);
    } catch (error) {
      console.error("Error while updating favorites:", error);
    }
  }
);

export const deletefromfavourite = createAsyncThunk(
  "deletefromfavourite",
  async (songId) => {
    try {
      const response = await axiosInstance.delete("/user/deletefromfavourite", {
        data: { songId },
      });
      console.log("Removed from favorites:", response);
    } catch (error) {
      console.error("Error while deleting from favorites:", error);
    }
  }
);

const favouriteSlice = createSlice({
  name: "favourite",
  initialState: {
    favourite: [],
    status: "none",
  },
  reducers: {},
  extraReducers: (Builder) => {
    Builder.addCase(getfavourite.pending, (state) => {
      state.status = "pending";
    })
      .addCase(getfavourite.fulfilled, (state, action) => {
        state.favourite = action.payload;
        state.status = "fulfilled";
      })
      .addCase(getfavourite.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default favouriteSlice.reducer;
