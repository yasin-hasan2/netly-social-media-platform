import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "../ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "../ui/badge";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes?.includes(user?._id) || false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:5000/api/v1/post/${post._id}/${action}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setPostLike(liked ? postLike - 1 : postLike + 1);
        setLiked(!liked);
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Like/Dislike failed.");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Comment failed.");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/post/delete/${post._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedPosts = posts.filter((p) => p._id !== post._id);
        dispatch(setPosts(updatedPosts));
        setOpen(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed.");
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/post/${post._id}/bookmark`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const captionWords = post.caption ? post.caption.split(/\s+/) : [];
  const isLongCaption = captionWords.length > 20;
  const displayedCaption =
    isLongCaption && !showFullCaption
      ? captionWords.slice(0, 20).join(" ") + "..."
      : post.caption;

  return (
    <div className="bg-transparent transition-all duration-300 hover:bg-[#1A1A1A]/80 border border-gray-700 rounded-xl p-4 mb-6 shadow-md w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="user" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-white">
              {post.author?.username}
            </h1>
            {user?._id === post.author._id && (
              <Badge variant="secondary" className="text-xs">
                Author
              </Badge>
            )}
          </div>
        </div>

        {/* Options */}
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer text-gray-400" />
          </DialogTrigger>
          <DialogContent className="bg-[#222] text-white border-gray-600">
            {post?.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className="text-yellow-400 hover:text-yellow-300"
              >
                Unfollow
              </Button>
            )}
            <Button variant="ghost" className="hover:text-white">
              Add to favorites
            </Button>
            <div className="flex justify-center items-center w-full">
              {user && user?._id === post?.author?._id && (
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-300 w-full"
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="text-center bg-[#222] text-white">
                      <h4 className="text-lg font-semibold mb-2">
                        Delete post?
                      </h4>
                      <p>Are you sure you want to delete this post?</p>
                      <Button
                        onClick={deletePostHandler}
                        variant="destructive"
                        className="w-full mt-3"
                      >
                        Confirm
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Image */}
      <img
        className="w-full h-auto rounded-md my-4 border border-gray-700 object-cover"
        src={post.image}
        alt="post"
      />

      {/* Interactions */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-3 items-center text-gray-400">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={20}
              className="text-yellow-400 cursor-pointer"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={20}
              className="hover:text-yellow-400 cursor-pointer"
            />
          )}
          <MessageCircle
            size={20}
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="hover:text-yellow-400 cursor-pointer"
          />
          <Send size={20} className="hover:text-yellow-400 cursor-pointer" />
        </div>
        <Bookmark
          onClick={bookmarkHandler}
          className="hover:text-yellow-400 cursor-pointer text-gray-400"
        />
      </div>

      {/* Likes */}
      <span className="text-sm font-medium text-white">{postLike} likes</span>

      {/* Caption */}
      <p className="text-sm text-gray-300 mt-1">
        <span className="font-semibold text-white">
          @{post.author?.username}:{" "}
        </span>
        {displayedCaption}
        {isLongCaption && (
          <button
            className="ml-2 text-yellow-400 text-xs underline"
            onClick={() => setShowFullCaption((prev) => !prev)}
          >
            {showFullCaption ? "See less" : "See more"}
          </button>
        )}
      </p>

      {/* View Comments */}
      {comment.length > 0 && (
        <p
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="text-sm text-gray-500 mt-1 hover:underline cursor-pointer"
        >
          View all {comment.length} comments
        </p>
      )}

      {/* Comment Dialog */}
      <CommentDialog open={open} setOpen={setOpen} />

      {/* Add Comment */}
      <div className="flex items-center mt-3 gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="bg-[#2A2A2A] text-white text-sm px-3 py-2 w-full rounded-md outline-none"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-yellow-400 font-semibold text-sm cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
