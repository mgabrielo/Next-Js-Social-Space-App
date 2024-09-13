import React from "react";
import LoginForm from "./components/LoginForm";
import Link from "next/link";
import loginImage from "@/assets/login-image.jpg";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
};

const page = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-xl bg-card shadow-2xl">
        <div className="w-full space-y-8 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-2xl text-center font-bold">
            Welcome to Social Space
          </h1>
          <div className="space-y-4">
            <LoginForm />
            <Link
              href={"/signup"}
              className="block text-center hover:underline"
            >{`Don't Have An Account..? Sign Up`}</Link>
          </div>
        </div>
        <Image
          src={loginImage}
          alt="loginImage"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
};

export default page;
