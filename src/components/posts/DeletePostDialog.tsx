import React from "react";
import { postData } from "@/lib/types";
import { useDeletePostMutation } from "./mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";

interface DeletePostDialogProps {
  post: postData;
  open: boolean;
  onClose: () => void;
}

const DeletePostDialog = ({ post, open, onClose }: DeletePostDialogProps) => {
  const mutation = useDeletePostMutation();
  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post..?</DialogTitle>
          <DialogDescription>
            Are you sure you want to Delete this post, Action is Irreversible
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant={"destructive"}
            onClick={() =>
              mutation.mutate(post.id, {
                onSuccess: () => onClose(),
              })
            }
            loading={mutation.isPending}
          >
            Delete
          </LoadingButton>
          <Button
            onClick={() => onClose()}
            variant={"outline"}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostDialog;
