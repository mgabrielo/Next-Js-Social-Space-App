"use client";
import React, { useCallback, useEffect, useState } from "react";
import { getSession } from "../SeesionProvider";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewProps,
  useChatContext,
} from "stream-chat-react";
import { Button } from "@/components/ui/button";
import { MailPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import NewChatDialog from "./NewChatDialog";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ChatSideBar = (props: Props) => {
  const { user } = getSession();
  const queryClient = useQueryClient();
  const { channel } = useChatContext();
  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries({
        queryKey: ["unread-messages-count"],
      });
    }
  }, [channel?.id, queryClient]);
  const ChannelPreviewCustom = useCallback(
    (channelpreviewprops: ChannelPreviewProps) => {
      return (
        <ChannelPreviewMessenger
          {...channelpreviewprops}
          onSelect={() => {
            channelpreviewprops.setActiveChannel?.(
              channelpreviewprops.channel,
              channelpreviewprops.watchers
            );
            props.onClose();
          }}
        />
      );
    },
    [props.onClose]
  );
  return (
    <div
      className={cn(
        "size-full flex-col border-e md:w-72 md:flex",
        props.open ? "flex" : "hidden"
      )}
    >
      <MenuHeader onClose={props.onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: {
            $in: [user.id],
          },
        }}
        showChannelSearch
        options={{
          state: true,
          presence: true,
          limit: 8,
        }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: {
                members: { $in: [user.id] },
              },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
};

export default ChatSideBar;

interface MenuHeaderProps {
  onClose: () => void;
}

const MenuHeader = ({ onClose }: MenuHeaderProps) => {
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  return (
    <>
      {showNewChatDialog && (
        <NewChatDialog
          onOpenChange={setShowNewChatDialog}
          onChatCreated={() => {
            setShowNewChatDialog(false);
            onClose();
          }}
        />
      )}
      <div className=" flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          <Button size={"icon"} variant={"ghost"} onClick={() => onClose()}>
            <X className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
        <Button
          size={"icon"}
          variant={"ghost"}
          title="Start New Chat"
          onClick={() => setShowNewChatDialog(true)}
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
    </>
  );
};
