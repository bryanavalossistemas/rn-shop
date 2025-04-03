// src/lib/productSocket.ts
import type { Product } from "@/schemas/products";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.PUBLIC_API_URL}/product-updates`);

export function subscribeToProductUpdates(product: Product, callback: (updatedData: Product) => void) {
  // Evento único por producto
  const eventName = `productUpdated:${product.id}`;

  socket.emit("subscribeToProduct", { productId: product.id });
  socket.on(eventName, callback);

  return () => {
    socket.off(eventName, callback);
    socket.emit("unsubscribeFromProduct", { productId: product.id });
  };
}
