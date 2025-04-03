import type { OrderDetail } from "@/schemas/orderDetails";
import { atom } from "nanostores";

export const cart = atom<OrderDetail[]>([]);

export function addToCart(newOrderDetail: OrderDetail, quantity: number = 1) {
  const current = cart.get();
  const existing = current.find((orderDetail) => orderDetail.id === newOrderDetail.id);

  cart.set(
    existing
      ? current.map((orderDetail) =>
          orderDetail.id === newOrderDetail.id ? { ...orderDetail, quantity: orderDetail.quantity + quantity } : orderDetail
        )
      : [...current, newOrderDetail]
  );
}

export function removeFromCart(ordetDeatilId: OrderDetail["id"]) {
  cart.set(cart.get().filter((orderDetail) => orderDetail.id !== ordetDeatilId));
}

export function updateQuantity(ordetDeatilId: OrderDetail["id"], quantity: number) {
  cart.set(cart.get().map((orderDetail) => (orderDetail.id === ordetDeatilId ? { ...orderDetail, quantity } : orderDetail)));
}

export function clearCart() {
  cart.set([]);
}
