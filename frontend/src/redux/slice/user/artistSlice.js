import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

export const getartist = createAsyncThunk("artist", async () => {
  try {
    const response = await axiosInstance.get("/user/artist");
    console.log("dataaaa:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

const artistSlice = createSlice({
  name: "artist",
  initialState: {
    artist: [],
    status: "none",
  },
  reducers: {},
  extraReducers: (Builder) => {
    Builder.addCase(getartist.pending, (state) => {
      state.status = "pending";
    })
      .addCase(getartist.fulfilled, (state, action) => {
        state.artist = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
        state.status = "none";
      })
      .addCase(getartist.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default artistSlice.reducer;
