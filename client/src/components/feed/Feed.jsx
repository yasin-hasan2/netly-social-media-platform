import React from "react";
import Posts from "../shared/Posts";

const Feed = () => {
  return (
    <div className="flex-1 my-8 flex flex-col items-center lg:pl-[20%]">
      <Posts />
    </div>
  );
};

export default Feed;
