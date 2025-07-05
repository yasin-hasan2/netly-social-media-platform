import Masonry from "@/components/design/Masonary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  useGetUserProfile(id);
  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => setActiveTab(tab);

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Profile Left Section */}
        <div className="flex flex-col items-center md:items-start gap-4 col-span-1">
          <Avatar className="w-32 h-32 ring-2 ring-[#FBCF28] shadow-lg">
            <AvatarImage src={userProfile?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-xl font-bold">{userProfile?.username}</h1>
            <Badge
              variant="secondary"
              className="mt-1 flex items-center gap-1 w-fit"
            >
              <AtSign size={14} /> {userProfile?.username}
            </Badge>
            <p className="mt-3 text-sm text-gray-400">
              {userProfile?.bio || "Bio here..."}
            </p>
          </div>
        </div>

        {/* Profile Right Section */}
        <div className="col-span-2 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            {isLoggedInUserProfile ? (
              <>
                <Link to={`/account/edit`}>
                  <Button variant="secondary" className="h-8">
                    Edit Profile
                  </Button>
                </Link>
                <Button variant="secondary" className="h-8">
                  View Archive
                </Button>
                <Button variant="secondary" className="h-8">
                  Ad Tools
                </Button>
              </>
            ) : isFollowing ? (
              <>
                <Button variant="secondary" className="h-8">
                  Unfollow
                </Button>
                <Button variant="secondary" className="h-8">
                  Message
                </Button>
              </>
            ) : (
              <Button className="bg-[#FBCF28] hover:bg-[#e5cf64] text-black h-8">
                Follow
              </Button>
            )}
          </div>

          <div className="flex gap-6 text-sm text-gray-300">
            <p>
              <span className="font-semibold">{userProfile?.posts.length}</span>{" "}
              posts
            </p>
            <p>
              <span className="font-semibold">
                {userProfile?.followers.length}
              </span>{" "}
              followers
            </p>
            <p>
              <span className="font-semibold">
                {userProfile?.following.length}
              </span>{" "}
              following
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-700 mt-10 pt-4">
        <div className="flex justify-center gap-10 text-sm text-gray-400">
          {["posts", "saved", "reels", "tags"].map((tab) => (
            <span
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`cursor-pointer pb-2 ${
                activeTab === tab
                  ? "border-b-2 border-[#FBCF28] font-semibold text-white"
                  : ""
              }`}
            >
              {tab.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Posts Masonry Grid */}
        <div className="mt-6">
          <Masonry
            items={displayedPost?.map((post) => ({
              id: post._id,
              img: post.image,
              url: `/post/${post._id}`,
              height: Math.floor(Math.random() * 200) + 250,
              likes: post.likes.length,
              comments: post.comments.length,
            }))}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
