import { StreamChat } from "stream-chat";

const streamServerClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_GET_STREAM_KEY!,
  process.env.GET_STREAM_SECRET
);

export default streamServerClient;
