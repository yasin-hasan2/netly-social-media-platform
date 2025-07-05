import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { setAuthUser } from "@/redux/authSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EditProfile = () => {
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio || "",
    gender: user?.gender || "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePhoto: file });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const EditProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto mt-10 px-4">
      <section className="bg-[#1A1A1A] border border-gray-700 rounded-xl p-6 shadow-lg backdrop-blur-sm">
        <h1 className="text-2xl font-semibold mb-6 text-white">Edit Profile</h1>

        {/* Profile photo section */}
        <div className="flex items-center justify-between gap-4 bg-[#2A2A2A] rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-white font-medium text-lg">
                {user?.username}
              </h2>
              <p className="text-gray-400 text-sm">
                {user?.bio || "No bio added"}
              </p>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            accept="image/*"
            className="hidden"
          />
          <Button
            onClick={() => imageRef.current.click()}
            className="bg-[#FBCF28] hover:bg-[#cfb865] h-8 text-black"
          >
            Change Photo
          </Button>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="text-white font-medium text-sm mb-1 block">
            Bio
          </label>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            placeholder="Write something about yourself..."
            className="bg-[#2A2A2A] text-white border-gray-600 focus-visible:ring-transparent"
          />
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="text-white font-medium text-sm mb-1 block">
            Gender
          </label>
          <Select
            defaultValue={input.gender}
            onValueChange={selectChangeHandler}
          >
            <SelectTrigger className="bg-[#2A2A2A] text-white border-gray-600">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-[#2A2A2A] text-white border-gray-700">
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            onClick={EditProfileHandler}
            disabled={loading}
            className="bg-[#FBCF28] hover:bg-[#cfb865] h-10 text-black font-semibold px-6"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
