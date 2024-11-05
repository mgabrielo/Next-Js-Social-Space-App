"use client";
import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import React, { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";
interface EditProfileBtnProps {
  user: UserData;
}

const EditProfileButton = ({ user }: EditProfileBtnProps) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
      <Button variant={"outline"} onClick={() => setShowDialog(true)}>
        Edit Profile
      </Button>
    </>
  );
};

export default EditProfileButton;
