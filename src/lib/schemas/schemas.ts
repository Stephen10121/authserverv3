import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, { message: "Empty Field" }),
    password: z.string().min(1, { message: "Empty Field" }),
    overall: z.undefined()
});

export const signupSchema = z.object({
    name: z.string().min(1, { message: "Empty Field" }),
    email: z.string().email({ message: "Invalid email type" }),
    username: z.string().min(1, { message: "Empty Field" }),
    password: z.string().min(1, { message: "Empty Field" }),
    passwordRepeat: z.string().min(1, { message: "Empty Field" }),
    tfa: z.boolean(),
    overall: z.undefined()
});