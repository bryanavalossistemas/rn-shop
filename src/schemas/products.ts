import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.object({
    id: z.number().int(),
    name: z.string(),
  }),
  stock: z.number().int(),
  showInEcommerce: z.boolean(),
  ecommercePercentageDiscount: z.number().int(),
  ecommerceSalePrice: z.number(),
  images: z.array(z.object({ id: z.number().int(), path: z.string() })),
});

export type Product = z.infer<typeof ProductSchema>;
