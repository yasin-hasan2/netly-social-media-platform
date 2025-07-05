import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logOutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        toast.success(res.data.message);
        window.location.href = "/login";
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout."
      );
      console.error("Logout failed:", error);
    }
  };

  const sidebarHandler = (label) => {
    if (label === "Logout") {
      logOutHandler();
    } else if (label === "Create") {
      setOpen(true);
    } else if (label === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (label === "Home") {
      navigate("/");
    } else if (label === "Messages") {
      navigate("/chat");
    }
  };

  const items = [
    { label: "Home", icon: <Home size={22} /> },
    { label: "Search", icon: <Search size={22} /> },
    { label: "Explore", icon: <TrendingUp size={22} /> },
    { label: "Messages", icon: <MessageCircle size={22} /> },
    {
      label: "Notifications",
      icon: (
        <div className="relative">
          <Heart size={22} />
          {likeNotification.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center bg-red-600 text-white rounded-full">
              {likeNotification.length}
            </span>
          )}
        </div>
      ),
    },
    { label: "Create", icon: <PlusSquare size={22} /> },
    { label: "Profile", icon: <User size={22} /> },
    { label: "Logout", icon: <LogOut size={22} /> },
  ];

  return (
    <>
      {/* Sidebar for large screens */}
      <div className="hidden lg:flex fixed top-0 left-0 h-screen w-[16%] border-r border-gray-700 bg-tra text-white z-20">
        <div className="flex flex-col w-full p-4">
          <h1 className="mb-10 flex justify-center font-bold text-xl text-white text-center mt-3 ">
            {" "}
            <img
              className="w-20 rounded-xl object-cover  "
              src={
                "https://res.cloudinary.com/dybnirysc/image/upload/v1750504431/jfeykwvqsd4wchdyyofx.jpg"
              }
              alt="logo"
            />
          </h1>
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => sidebarHandler(item.label)}
              className="flex items-center gap-4 p-3 my-2 rounded-lg hover:bg-gray-800 cursor-pointer transition text-gray-300 hover:text-white relative"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>

              {item.label === "Notifications" &&
                likeNotification.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        className="absolute left-[150px] top-[12px] rounded-full bg-red-600 hover:bg-red-700 h-5 w-5 text-[10px]"
                      >
                        {likeNotification.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-gray-900 border border-gray-700 text-white">
                      {likeNotification.map((n, i) => (
                        <div key={i} className="flex items-center gap-2 my-2">
                          <Avatar>
                            <AvatarImage src={n?.userDetails?.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-bold">
                              {n?.userDetails?.username}
                            </span>{" "}
                            liked your post
                          </p>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom navbar for small screens */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-black border-t border-gray-700 z-20 flex justify-around p-2 text-white">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => sidebarHandler(item.label)}
            className="flex flex-col items-center hover:text-yellow-400 cursor-pointer"
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSidebar;
