import Feed from "@/components/feed/Feed";
import RightSidebar from "@/components/shared/RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import React from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
  useGetAllPost();

  useGetSuggestedUsers();

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen px-4 md:px-10 py-6 gap-6  text-white">
      {/* Feed Section */}
      <div className="w-full md:w-2/3 lg:w-3/4 mx-auto">
        <Feed />
        <Outlet />
      </div>

      {/* Right Sidebar */}
      <div className="hidden md:block w-full md:w-1/3 lg:w-1/4">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
