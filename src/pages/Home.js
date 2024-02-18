import React from "react";
import ScrollPosts from "../components/scrollPosts/ScrollPosts";
import Suggestions from "../components/suggestion/Suggestions";

const Home = () => {
  return (
    <div className="w-full flex justify-center gap-14 h-screen overflow-y-auto">
      <ScrollPosts />
      <div>
        <Suggestions />
      </div>
    </div>
  );
};

export default Home;
