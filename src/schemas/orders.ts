import { OrderDetailSchema } from "@/schemas/orderDetails";
import { z } from "zod";

export const OrderSchema = z.object({
  id: z.number().int(),
  orderDetails: z.array(OrderDetailSchema),
});

export type Order = z.infer<typeof OrderSchema>;
