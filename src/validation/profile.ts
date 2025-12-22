import { z } from "zod";

export const profileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "이름은 2글자 이상" })
    .max(30, { message: "이름은 30자 이내" }),
  email: z
    .string()
    .trim()
    .email({ message: "이메일 형식을 확인해주세요." }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
