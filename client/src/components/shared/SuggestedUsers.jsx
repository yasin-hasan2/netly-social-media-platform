import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-400">
          Suggested for you
        </h2>
        <span className="text-xs text-[#FBCF28] hover:underline cursor-pointer font-medium">
          See All
        </span>
      </div>

      {/* List */}
      <div className="space-y-4">
        {suggestedUsers?.map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            {/* Left: Avatar + Info */}
            <div className="flex items-center gap-3">
              <Link to={`/profile/${user?._id}`}>
                <Avatar className="w-9 h-9 border border-gray-700">
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={user?.username}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>

              <div>
                <Link
                  to={`/profile/${user?._id}`}
                  className="text-sm font-semibold text-white hover:underline"
                >
                  {user?.username}
                </Link>
                <p className="text-xs text-gray-500 truncate w-[160px]">
                  {user?.bio || "No bio available"}
                </p>
              </div>
            </div>

            {/* Follow Button */}
            <button className="text-xs font-bold text-[#FBCF28] hover:text-[#c5af63] transition">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
