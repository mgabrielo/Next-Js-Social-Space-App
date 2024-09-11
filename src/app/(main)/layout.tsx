import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { SessionProvider } from "./SeesionProvider";
import Navbar from "./components/Navbar";
import MenuBar from "./components/MenuBar";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) {
    redirect("/login");
  }
  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto p-5 max-w-7xl flex w-full grow gap-5">
          <MenuBar
            className={`sticky top-[5.25rem] h-fit hidden sm:block flex-none space-y-3 rounded-xl bg-card px-3 py-5
          lg:px-5 shadow-sm xl:w-80`}
          />
          {children}
        </div>
        <MenuBar
          className={`sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden`}
        />
      </div>
    </SessionProvider>
  );
}
