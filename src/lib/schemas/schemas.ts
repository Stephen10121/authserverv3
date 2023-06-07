import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, { message: "Empty Field" }),
    password: z.string().min(1, { message: "Empty Field" }),
    overall: z.undefined()
});