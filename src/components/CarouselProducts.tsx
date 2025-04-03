import { Carousel, CarouselContent, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import type { Product } from "@/schemas/products";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import AddToCart from "@/components/AddToCart";
import { formatCurrency } from "@/lib/utils";

interface CarouselProductsProps {
  products: Product[];
}

export default function CarouselProducts({ products: initialProducts }: CarouselProductsProps) {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    const socket = io(`${import.meta.env.PUBLIC_API_URL}/product-updates`);

    const handleProductUpdate = ({ id, changes }: { id: number; changes: Product }) => {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
    };

    socket.on("productListUpdated", handleProductUpdate);

    return () => {
      socket.off("productListUpdated", handleProductUpdate);
      socket.disconnect();
    };
  }, []);

  return (
    <Carousel className="w-full max-w-5xl mx-auto">
      <CarouselContent>
        {products
          .filter((p) => p.showInEcommerce)
          .filter((p) => p.ecommercePercentageDiscount > 0)
          .map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="p-0">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="relative w-full h-48 mb-4">
                      <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-sm font-bold rounded-bl-lg">SALE</div>
                      <img
                        src={`${product.images.length > 0 ? "http://localhost:4000/" + product.images[0].path : "/placeholder.svg"}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <div className="flex items-center mt-2">
                      <span className="text-green-700 font-bold mr-2">{formatCurrency(product.ecommerceSalePrice)}</span>
                      <span className="text-gray-500 line-through">
                        {formatCurrency(product.ecommerceSalePrice / (1 - product.ecommercePercentageDiscount / 100))}
                      </span>
                    </div>
                    <AddToCart product={product} quantity={1} className="mt-4" />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
