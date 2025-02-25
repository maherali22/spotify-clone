import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../axiosinstance";

export const adminlogin = createAsyncThunk(
  "adminlogin",
  async (userdata, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/admin/login", userdata);
      console.log("Response admin:", response.data.data);
      return response.data.data;
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data.message);
        return rejectWithValue(error.response.data.message);
      }
      console.error("Login error:", error.message);
      return rejectWithValue("An unknown error occurred.");
    }
  }
);

const activeUser = (() => {
  const userString = localStorage.getItem("adminUser");
  if (userString) {
    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing adminUser:", error);
      return null;
    }
  }
  return null;
})();

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    user: activeUser?.user || null,
    status: activeUser ? "fulfilled" : null,
    token: activeUser?.token || null,
    refreshmentToken: activeUser?.refreshmentToken || null,
    profilePicture: activeUser?.profilePicture || null,
    error: null,
    admin: activeUser?.admin || null,
  },
  reducers: {
    adminlogout: (state) => {
      state.user = null;
      state.status = null;
      state.token = null;
      state.refreshmentToken = null;
      state.profilePicture = null;
      state.admin = null;
      localStorage.removeItem("adminUser");
      localStorage.removeItem("persist:root");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminlogin.pending, (state) => {
        state.user = null;
        state.status = "pending";
        state.error = null;
      })
      .addCase(adminlogin.fulfilled, (state, action) => {
        const { adminname, token, refreshmentToken, isAdmin } = action.payload;

        const userData = {
          user: adminname,
          token,
          refreshmentToken,
          admin: isAdmin,
        };

        state.user = adminname;
        state.status = "fulfilled";
        state.token = token;
        state.refreshmentToken = refreshmentToken;
        state.admin = isAdmin;

        localStorage.setItem("adminUser", JSON.stringify(userData));
      })
      .addCase(adminlogin.rejected, (state, action) => {
        state.user = null;
        state.status = "rejected";
        state.error = action.payload || "Login failed.";
      });
  },
});

export const { adminlogout } = adminSlice.actions;
export default adminSlice.reducer;
