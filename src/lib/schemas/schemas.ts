import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, { message: "Empty Field" }),
    password: z.string().min(1, { message: "Empty Field" }),
    websiteId: z.string().min(1),
    key: z.string().min(1),
    type: z.string(),
    overall: z.undefined()
});

export const quickAuthSchema = z.object({
    accessToken: z.string().min(1, { message: "Empty Field" }),
    websiteId: z.string().min(1),
    key: z.string().min(1),
    type: z.string(),
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

export const registerWebsite = z.object({
    url: z.string().min(1, { message: "Empty field" }).url("Invalid url."),
    name: z.string().min(1, { message: "Empty field" }),
    unique: z.string().min(1, { message: "Empty field" }),
    overall: z.undefined()
});