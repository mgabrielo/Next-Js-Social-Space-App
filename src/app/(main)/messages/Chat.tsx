"use client";
import React, { useState } from "react";
import useInitializedChatClient from "./useInitialChatClient";
import { Loader2 } from "lucide-react";
import { Chat as StreamChat } from "stream-chat-react";
import ChatSideBar from "./ChatSideBar";
import ChatChannel from "./ChatChannel";
import { useTheme } from "next-themes";

type Props = {};

const Chat = (props: Props) => {
  const { resolvedTheme } = useTheme();
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const chatClient = useInitializedChatClient();
  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <main className="relative w-full overflow-hidden rounded-xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
          <ChatSideBar
            open={sideBarOpen}
            onClose={() => setSideBarOpen(false)}
          />
          <ChatChannel
            open={!sideBarOpen}
            openSideBar={() => setSideBarOpen(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
};

export default Chat;
