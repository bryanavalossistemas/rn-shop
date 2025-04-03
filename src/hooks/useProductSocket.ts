// src/hooks/useProductUpdates.ts
import { useEffect, useState } from "react";
import { subscribeToProductUpdates } from "../lib/productSocket";
import type { Product } from "@/schemas/products";

export function useProductUpdates(initialProduct: Product) {
  const [product, setProduct] = useState(initialProduct);

  useEffect(() => {
    const unsubscribe = subscribeToProductUpdates(initialProduct, (updatedData) => {
      setProduct((prev) => ({ ...prev, ...updatedData }));
    });

    return unsubscribe;
  }, [initialProduct.id]);

  return product;
}
