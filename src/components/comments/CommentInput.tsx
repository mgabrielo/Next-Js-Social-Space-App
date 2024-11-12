import React, { useState } from "react";
import { postData } from "@/lib/types";
import { useSubmitCommentMutation } from "./mutation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, SendHorizonal } from "lucide-react";

interface CommentInputProps {
  post: postData;
}

const CommentInput = ({ post }: CommentInputProps) => {
  const [input, setInput] = useState("");
  const mutation = useSubmitCommentMutation(post.id);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input) {
      return;
    }
    mutation.mutate(
      {
        post,
        content: input,
      },
      {
        onSuccess: () => setInput(""),
      }
    );
  }
  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder="Add a Comment"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />

      <Button
        type="submit"
        variant={"ghost"}
        size={"icon"}
        disabled={!input.trim() || mutation.isPending}
      >
        {!mutation.isPending ? (
          <SendHorizonal className="text-primary" />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </form>
  );
};

export default CommentInput;
