"use client";
import Image from "next/image";
import signUpImage from "@/assets/signup-image.jpg";
import Link from "next/link";
import { SignUpForm } from "./components/SignUpForm";

export default function SignUp() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-xl overflow-hidden bg-card shadow-xl">
        <div className="md:w-1/2 w-full space-y-10 overflow-y-auto p-10">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold">Sign Up to Social Space</h1>
            <p className="text-muted-foreground">
              A place <span className="italic">you</span> can truly socialize
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href={"/login"} className="block text-center hover:underline">
              Already Have an Account...? Log In
            </Link>
          </div>
        </div>
        <Image
          src={signUpImage}
          alt="sign-up-img"
          className="hidden md:block w-1/2 object-cover"
          priority
        />
      </div>
    </main>
  );
}
