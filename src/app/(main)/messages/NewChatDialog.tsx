"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";
import { useToast } from "@/components/ui/use-toast";
import { getSession } from "../SeesionProvider";
import useDebounce from "@/hooks/useDebounce";
import { UserResponse } from "stream-chat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2, SearchIcon, X } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import LoadingButton from "@/components/LoadingButton";

interface Props {
  onOpenChange: (open: boolean) => void;
  onChatCreated: () => void;
}

const NewChatDialog = ({ onOpenChange, onChatCreated }: Props) => {
  const { client, setActiveChannel } = useChatContext();
  const { toast } = useToast();
  const { user: loggedInUser } = getSession();
  const [searchInput, setSearchInput] = useState("");
  const searchInputDebounce = useDebounce(searchInput);
  const [selectedUsers, setSelectedUsers] = useState<
    UserResponse<DefaultStreamChatGenerics>[]
  >([]);
  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["stream-users", searchInputDebounce],
    queryFn: async () =>
      client.queryUsers(
        {
          id: { $ne: loggedInUser.id },
          role: { $ne: "admin" },
          ...(searchInputDebounce
            ? {
                $or: [
                  { name: { $autocomplete: searchInputDebounce } },
                  { username: { $autocomplete: searchInputDebounce } },
                ],
              }
            : {}),
        },
        {
          name: 1,
          username: 1,
        },
        {
          limit: 15,
        }
      ),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const channel = client.channel("messaging", {
        members: [loggedInUser.id, ...selectedUsers.map((u) => u.id)],
        name:
          selectedUsers.length > 1
            ? loggedInUser.displayName +
              ", " +
              selectedUsers.map((u) => u.name).join(", ")
            : undefined,
      });
      await channel.create();
      return channel;
    },
    onSuccess: (channel) => {
      setActiveChannel(channel);
      onChatCreated();
    },
    onError: (err) => {
      console.error("Error Starting Chat", err);
      toast({
        variant: "destructive",
        description: "Error Starting Chat...Try Again",
      });
    },
  });
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="bg-card p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>{""}</DialogDescription>
        </DialogHeader>
        <div>
          <div className="group relative">
            <SearchIcon className="absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary" />
            <input
              type="text"
              className="h-12 w-full pe-4 ps-14 focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Users..."
            />
          </div>

          {selectedUsers.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 p-2">
              {selectedUsers.map((user) => (
                <SelectedUserTags
                  key={user.id}
                  user={user}
                  onRemove={() =>
                    setSelectedUsers((prev) =>
                      prev.filter((u) => u.id !== user.id)
                    )
                  }
                />
              ))}
            </div>
          )}
          {isSuccess && !data.users.length && (
            <p className="my-3 text-center text-muted-foreground">
              No users found...Try Another Name
            </p>
          )}
          {isFetching && <Loader2 className="mx-auto animate-spin my-3" />}
          {isError && (
            <p className="my-3 text-center text-destructive">
              {"An Error Occured Finding Users"}
            </p>
          )}
          <hr />

          <div className="h-96 overflow-y-auto">
            {isSuccess &&
              data.users.map((user) => (
                <UserResult
                  key={user.id}
                  user={user}
                  selected={selectedUsers.some((u) => u.id === user.id)}
                  onClick={() => {
                    setSelectedUsers((prev) =>
                      prev.some((u) => u.id === user.id)
                        ? prev.filter((u) => u.id !== user.id)
                        : [...prev, user]
                    );
                  }}
                />
              ))}
          </div>
        </div>
        <DialogFooter className="px-6 pb-6">
          <LoadingButton
            disabled={!selectedUsers.length}
            loading={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Start Chat
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface UserResultProps {
  user: UserResponse<DefaultStreamChatGenerics>;
  selected: boolean;
  onClick: () => void;
}

const UserResult = ({ user, selected, onClick }: UserResultProps) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-2">
        <UserAvatar avatarUrl={user.image} />
        <div className="flex flex-col text-start">
          <p className="font-bold">{user.name}</p>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      {selected && <Check className="size-5 text-green-500" />}
    </button>
  );
};

interface SelectedUserTagProps {
  user: UserResponse<DefaultStreamChatGenerics>;
  onRemove: () => void;
}

const SelectedUserTags = ({ user, onRemove }: SelectedUserTagProps) => {
  return (
    <button
      onClick={onRemove}
      className="flex items-center gap-2 rounded-full p-1 hover:bg-muted/50"
    >
      <UserAvatar avatarUrl={user.image} size={24} />
      <p className="font-bold">{user.name}</p>
      <X className="mx-2 size-5 text-muted-foreground" />
    </button>
  );
};

export default NewChatDialog;
