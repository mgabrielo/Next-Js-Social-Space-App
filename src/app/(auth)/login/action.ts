"use server";

import prisma from "@/lib/prisma";
import { LogInValues, logInSchema } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/auth";
import { redirect } from "next/navigation";

export async function login(
  credentials: LogInValues
): Promise<{ error: string }> {
  try {
    const { username, password } = logInSchema.parse(credentials);
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });
    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Not Allowed to Sign In With Incorrect Details",
      };
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      return {
        error: "Not Allowed to Sign In With Incorrect Details",
      };
    }
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      error: "Something Went Wrong During User Login",
    };
  }
}
