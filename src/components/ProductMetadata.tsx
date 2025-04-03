import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product } from "@/schemas/products";
import { Star } from "lucide-react";
import AddToCart from "@/components/AddToCart";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useProductUpdates } from "@/hooks/useProductSocket";

interface ProductMetadataProps {
  product: Product;
}

export default function ProductMetadata({ product: initialProduct }: ProductMetadataProps) {
  const [quantity, setQuantity] = useState(1);
  const product = useProductUpdates(initialProduct);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border">
          <div className="aspect-square relative">
            <img
              src={`${product.images.length > 0 ? "http://localhost:4000/" + product.images[0].path : "/placeholder.svg"}`}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center mt-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${"text-yellow-400 fill-yellow-400"}`} />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">(2 reseñas)</span>
          </div>

          <div className="mt-4">
            <span className="text-2xl font-bold text-green-700">{formatCurrency(product.ecommerceSalePrice)}</span>
          </div>

          {product.stock > 0 ? (
            <div className="text-green-600 font-medium mt-2">En Stock</div>
          ) : (
            <div className="text-red-500 font-medium mt-2">Agotado</div>
          )}

          <div className="mt-6">
            <div className="text-sm font-medium mb-2">Cantidad</div>
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-4 font-medium">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity((q) => q + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <AddToCart product={product} quantity={quantity} size="lg" disabled={!(product.stock > 0)} />
          </div>
          <Tabs defaultValue="description" className="mt-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <p className="text-gray-700">{product.description}</p>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${"text-yellow-400 fill-yellow-400"}`} />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">Autor Anónimo</span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    Este producto superó mis expectativas en todos los sentidos. La calidad es excepcional, el diseño es elegante y la funcionalidad
                    es impecable.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${"text-yellow-400 fill-yellow-400"}`} />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">Autor Anónimo</span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    Este producto superó mis expectativas en todos los sentidos. La calidad es excepcional, el diseño es elegante y la funcionalidad
                    es impecable.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
