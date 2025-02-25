import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

export const getAllusers = createAsyncThunk("getAllusers", async () => {
  try {
    const response = await axiosInstance.get("/admin/getallusers");
    console.log("getAllusers:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const blockuser = createAsyncThunk("blockuser", async (userid) => {
  try {
    const response = await axiosInstance.put(`/admin/blockuser/${userid}`);
    console.log("block user:", response.data);
    return response.data;
  } catch (error) {
    console.log("block user:", error);
  }
});

const adminUsersSlice = createSlice({
  name: "all users",
  initialState: {
    allusers: [],
    status: "none",
  },
  reducers: {},
  extraReducers: (Builder) => {
    Builder.addCase(getAllusers.pending, (state) => {
      state.status = "pending";
    })
      .addCase(getAllusers.fulfilled, (state, action) => {
        state.allusers = action.payload;
        state.status = "fulfilled";
      })
      .addCase(getAllusers.rejected, (state) => {
        state.status = "rejected";
      })

      .addCase(blockuser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(blockuser.fulfilled, (state) => {
        state.status = "fulfilled";
      })

      .addCase(blockuser.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default adminUsersSlice.reducer;
