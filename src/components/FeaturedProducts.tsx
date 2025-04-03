import AddToCart from "@/components/AddToCart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { generateSlug } from "@/lib/utils";
import type { Product } from "@/schemas/products";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products: initialProducts }: FeaturedProductsProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {products
        .filter((p) => p.showInEcommerce)
        .slice(0, 4)
        .map((product) => (
          <a key={product.id} href={`/productos/${generateSlug(product.name, product.id)}`} className="block h-full">
            <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md p-0">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={`${product.images.length > 0 ? import.meta.env.PUBLIC_API_URL + "/" + product.images[0].path : "/placeholder.svg"}`}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  width={300}
                  height={300}
                  loading="lazy"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                <div className="mt-2 flex items-center">
                  <span className="font-bold text-green-700">${product.ecommerceSalePrice.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <AddToCart product={product} quantity={1} />
              </CardFooter>
            </Card>
          </a>
        ))}
    </div>
  );
}
