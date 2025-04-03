import { ProductSchema } from "@/schemas/products";
import { z } from "zod";

export const OrderDetailSchema = z.object({
  id: z.number().int(),
  product: ProductSchema,
  quantity: z.number(),
});

export type OrderDetail = z.infer<typeof OrderDetailSchema>;
