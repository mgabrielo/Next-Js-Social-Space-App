import { type } from "os";
import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid Email Address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only Letters, Numbers, - and _ allowed"
  ),
  password: requiredString.min(6, "Must be at least 6 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const logInSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LogInValues = z.infer<typeof logInSchema>;

export const createPostSchema = z.object({
  content: requiredString,
});

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(400, "must be at most 400 characters"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

export const createCommentSchema = z.object({
  content: requiredString,
});
