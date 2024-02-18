import React from "react";
import Home from "./pages/Home";
import SideMenu from "./components/sideMenu/SideMenu";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Account from "./pages/Account";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Messenger from "./pages/Messenger";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import "./App.css";
import PersonalPost from "./pages/PersonalPost";
import EditProfile from "./pages/EditProfile";

const App = () => {
  return (
    <Router>
      <div className="flex w-full">
        <SideMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messenger" element={<Messenger />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/post/:postId" element={<PersonalPost />} />
          <Route path="/account/:userName" element={<Account />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
