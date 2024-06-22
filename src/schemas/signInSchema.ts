import { z } from "zod";

export const SignInSchema = z.object({
  identifier: z
    .string()
    .min(2, "username must be atleasr 2 char")
    .max(20, "username must be no more than 20 char")
    .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special char"),
  password: z
    .string()
    .min(6, { message: "password must be atleast 6 char" })
    .max(20, { message: "password must not be more than 20 char" }),
});
