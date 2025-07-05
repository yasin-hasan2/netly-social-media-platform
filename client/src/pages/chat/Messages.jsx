import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();

  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 bg-[#12121265] text-white">
      {/* Selected user info */}
      <div className="flex flex-col items-center mb-6">
        <Avatar className="h-20 w-20 mb-3">
          <AvatarImage src={selectedUser?.profilePicture} alt="profilePic" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-lg font-semibold mb-2">
          {selectedUser?.username}
        </span>
        <Link to={`/profile/${selectedUser?._id}`}>
          <Button variant="secondary" className="h-8">
            View Profile
          </Button>
        </Link>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-4 px-2">
        {messages &&
          messages.map((msg) => {
            const isSender = msg.senderId === user?._id;
            return (
              <div
                key={msg._id}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative max-w-xs px-4 py-2 rounded-xl font-sans break-words ${
                    isSender
                      ? "bg-yellow-400 text-black rounded-br-none shadow-md"
                      : "bg-blue-600 text-white rounded-bl-none shadow-md"
                  }`}
                >
                  {msg.content}
                  {/* Optional: small "tail" for chat bubble */}
                  <span
                    className={`absolute bottom-0 w-0 h-0 border-t-8 border-t-transparent ${
                      isSender
                        ? "border-r-8 border-r-yellow-400 border-l-0 right-0 translate-x-1"
                        : "border-l-8 border-l-blue-600 border-r-0 left-0 -translate-x-1"
                    }`}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
