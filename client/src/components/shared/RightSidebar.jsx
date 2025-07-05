import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="hidden lg:block w-[300px] p-4 fixed right-1 top-20 rounded-xl  border border-gray-800 text-white">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-12 h-12 border border-gray-600">
            <AvatarImage src={user?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-semibold text-base leading-none">
            <Link to={`/profile/${user?._id}`} className="hover:underline">
              {user?.username}
            </Link>
          </h1>
          <p className="text-sm text-gray-400">
            {user?.bio || "Bio not available"}
          </p>
        </div>
      </div>

      {/* Suggested Users */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 mb-2">
          Suggested for you
        </h2>
        <SuggestedUsers />
      </div>
    </div>
  );
};

export default RightSidebar;
