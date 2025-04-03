import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  image: z.string().nullable(),
});

export type Category = z.infer<typeof CategorySchema>;
