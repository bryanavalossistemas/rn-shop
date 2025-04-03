import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/store/cart";
import type { OrderDetail } from "@/schemas/orderDetails";

interface AddToCartProps {
  product: OrderDetail["product"];
  quantity: OrderDetail["quantity"];
  className?: string;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  disabled?: boolean;
}

export default function AddToCart({ product, quantity, size, className, disabled = false }: AddToCartProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newOrderDetail: OrderDetail = {
      id: Date.now(),
      product: product,
      quantity: quantity,
    };
    addToCart(newOrderDetail);
  };

  return (
    <Button className={`w-full bg-green-600 hover:bg-green-700 ${className}`} size={size} onClick={handleAddToCart} disabled={disabled}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      Añadir al Carrito
    </Button>
  );
}
