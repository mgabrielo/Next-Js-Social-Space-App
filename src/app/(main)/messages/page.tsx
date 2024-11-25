import { Metadata } from "next";
import React from "react";
import Chat from "./Chat";

type Props = {};
export const metadata: Metadata = {
  title: "Messages",
};

const page = (props: Props) => {
  return <Chat />;
};

export default page;
