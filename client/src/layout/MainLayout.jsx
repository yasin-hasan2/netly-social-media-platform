import LeftSidebar from "@/components/shared/LeftSidebar";
import Threads from "@/components/design/Threads";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div style={{ width: "100%", height: "600px", position: "relative" }}>
      <Threads
        style={{ zIndex: 1, position: "fixed" }}
        amplitude={1}
        distance={0}
        enableMouseInteraction={false}
      />
      <div className="sticky z-10">
        <LeftSidebar />
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
