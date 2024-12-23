import { CommentData } from "@/lib/types";
import React from "react";
import { useDeleteCommentMutation } from "./mutation";
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

interface DeleteCommentDialogProps {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
}

const DeleteCommentDialog = ({
  comment,
  open,
  onClose,
}: DeleteCommentDialogProps) => {
  const mutation = useDeleteCommentMutation();
  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Comment..?</DialogTitle>
          <DialogDescription>
            Are you sure you want to Delete this Comment, Action is Irreversible
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant={"destructive"}
            onClick={() =>
              mutation.mutate(comment.id, {
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

export default DeleteCommentDialog;
