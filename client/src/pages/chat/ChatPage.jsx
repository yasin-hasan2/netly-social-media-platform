import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setSelectedUser } from "@/redux/authSlice";
import { MessageCircleCode, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import { toast } from "sonner";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    if (!receiverId) {
      toast.error("No user selected");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  return (
    <div className="flex lg:ml-[16%] flex-col lg:flex-row h-screen">
      {/* Suggested Users Modal Toggle */}
      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <Button
          variant="secondary"
          className="bg-[#2a2a2a] hover:bg-[#333333] text-white"
          onClick={() => setShowModal(!showModal)}
        >
          <Users className="w-5 h-5" />
        </Button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-70 flex justify-center items-center p-4">
          <div className="bg-[#1a1a1a] rounded-lg p-4 w-full max-w-md overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-bold text-lg">Suggested Users</h2>
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
            <div className="space-y-3">
              {suggestedUsers.map((suggestedUser) => {
                const isOnline = onlineUsers.includes(suggestedUser?._id);
                return (
                  <div
                    key={suggestedUser?._id}
                    onClick={() => {
                      dispatch(setSelectedUser(suggestedUser));
                      setShowModal(false);
                    }}
                    className="flex items-center gap-4 p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#333333] cursor-pointer transition-all"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={suggestedUser?.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="text-white">
                      <h2 className="font-medium text-sm">
                        {suggestedUser?.username}
                      </h2>
                      <p
                        className={`text-xs font-semibold ${
                          isOnline ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar for large screen */}
      <aside className="hidden lg:block lg:w-1/4 border-r border-gray-700  p-4 overflow-y-auto sticky top-0 h-screen">
        <h1 className="text-xl font-bold text-white mb-4">{user?.username}</h1>
        <hr className="border-gray-600 mb-4" />
        <div className="space-y-3">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser?._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex items-center gap-4 p-3  rounded-lg hover:bg-[#333333] cursor-pointer transition-all"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="text-white">
                  <h2 className="font-medium text-sm">
                    {suggestedUser?.username}
                  </h2>
                  <p
                    className={`text-xs font-semibold ${
                      isOnline ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Chat Section */}
      <main className="flex-1 bg-[#12121271] text-white relative">
        {selectedUser ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <header className="flex items-center gap-4 px-4 py-3 border-b border-gray-700 bg-[#1f1f1f] sticky top-0 z-10">
              <Avatar>
                <AvatarImage src={selectedUser?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-sm font-semibold">
                  {selectedUser?.username}
                </h2>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <Messages selectedUser={selectedUser} />
            </div>

            {/* Input */}
            <footer className="p-4 mb-10 lg:mb-0 border-t border-gray-700 bg-[#1f1f1f]">
              <div className="flex items-center gap-3">
                <Input
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 sticky bg-[#2a2a2a] text-white border-gray-600"
                />
                <Button
                  disabled={!textMessage.trim()}
                  onClick={() => sendMessageHandler(selectedUser?._id)}
                  className="bg-[#FBCF28] hover:bg-[#d4ba50] text-black"
                >
                  Send
                </Button>
              </div>
            </footer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircleCode className="w-20 h-20 mb-4" />
            <h2 className="text-xl font-semibold">Your Messages</h2>
            <p>Start a chat by selecting a user from the sidebar.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
