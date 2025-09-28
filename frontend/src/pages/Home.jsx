import React from "react";
import HomeContent from "../components/home/HomeContent";
import SmallSidebar from "../components/SmallSidebar";

const Home = () => {
  return (
    <div className="min-h-screen max-w-full px-2 sm:pl-0">
      <div className="flex ">
        {/* Sidebar */}
        <SmallSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden">
          <HomeContent />
        </div>
      </div>
    </div>
  );
};

export default Home;
