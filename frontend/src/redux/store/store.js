import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import playlistSlice from "../slice/user/userPlaylistSlice";
import songSlice from "../slice/user/songSlice";
import albumSlice from "../slice/user/albumSlice";
import loginSlice from "../slice/user/loginSlice";
import artistSlice from "../slice/user/artistSlice";
import favouriteSlice from "../slice/user/favourateSlice";
import userplaylistSlice from "../slice/user/userPlaylistSlice";
import adminloginSlice from "../slice/admin/adminLoginSlice";
import adminusersslice from "../slice/admin/adminUserSlice";
import AdminSongSlice from "../slice/admin/adminSongSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["admin", "playlist", "user"],
};

const rootReducer = combineReducers({
  playlist: playlistSlice,
  song: songSlice,
  albums: albumSlice,
  user: loginSlice,
  artist: artistSlice,
  favourite: favouriteSlice,
  userplaylist: userplaylistSlice,
  admin: adminloginSlice,
  allusers: adminusersslice,
  adminSongs: AdminSongSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
