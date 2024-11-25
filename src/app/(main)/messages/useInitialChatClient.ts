import { useEffect, useState } from "react";
import { getSession } from "../SeesionProvider";
import { StreamChat } from "stream-chat";
import kyInstance from "@/lib/ky";

export default function useInitializedChatClient() {
  const { user } = getSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const client = StreamChat.getInstance(
      process.env.NEXT_PUBLIC_GET_STREAM_KEY!
    );
    client
      .connectUser(
        {
          id: user.id,
          username: user.username,
          name: user.displayName,
          image: user.avatarUrl,
        },
        async () =>
          kyInstance
            .get(`/api/get-stream-token`)
            .json<{ token: string }>()
            .then((data) => data.token)
      )
      .catch((error) => console.error("Could Not Connect to Stream", error))
      .then(() => setChatClient(client));
    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((err) => {
          console.error("failed to disconnect stream user", err);
        })
        .then(() => {
          console.log("Stream Connection Closed");
        });
    };
  }, [user.id, user.username, user.displayName, user.avatarUrl]);

  return chatClient;
}
