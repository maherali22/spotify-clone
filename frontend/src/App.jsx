import React from "react";
import AdminLogin from "./components/admin.pages/adminLogin";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminHome from "./components/admin.pages/adminHome";
import AdminUsers from "./components/admin.pages/adminUsers";
import Adminsong from "./components/admin.pages/adminSongs";
import AdminUserprofile from "./components/admin.pages/adminUserProfile";
import Addsong from "./components/admin.pages/adminAddSong";
import Editsongs from "./components/admin.pages/adminEditSong";
import Login from "./components/user.pages/auth/login";
import Otp from "./components/user.pages/auth/otp";
import Register from "./components/user.pages/auth/register";
import Home from "./components/user.pages/home/home";
import PlaylistComponent from "./components/user.pages/music/playlistComponents";
import Likedsong from "./components/user.pages/pages/likedSongs";
import MusicController from "./components/user.pages/music/musicplayer";
import Profile from "./components/user.pages/pages/profile";
import Library from "./components/user.pages/pages/library";

function App() {
  const isAdmin = useSelector((state) => state.admin.admin);
  return (
    <div>
      {!isAdmin || isAdmin == null ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/playlist/playlcomponent/:id"
            element={<PlaylistComponent />}
          />
          <Route
            path="/artist/playlcomponent/:artist"
            element={<PlaylistComponent />}
          />
          <Route
            path="/albums/playlcomponent/:albumid"
            element={<PlaylistComponent />}
          />
          <Route path="/likedsongs" element={<Likedsong />} />
          <Route path="/searchbar/:id1" element={<MusicController />} />
          <Route
            path="/userplaylist/playcomponent/:userplaylists"
            element={<PlaylistComponent />}
          />
          <Route
            path="/playcomponent/:id1/:id2"
            element={<MusicController />}
          />
          <Route
            path="/artist/playcomponent/:id1/:id2"
            element={<MusicController />}
          />
          <Route
            path="/albums/playcomponent/:id1/:id2"
            element={<MusicController />}
          />

          <Route path="/profile" element={<Profile />} />

          <Route path="/library" element={<Library />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/songs" element={<Adminsong />} />
          <Route path="/admin/userprofile/:id" element={<AdminUserprofile />} />
          <Route path="/admin/songs/addsongs" element={<Addsong />} />
          <Route path="/admin/songs/editsong/:id" element={<Editsongs />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
