import { useEffect, useState } from "react";
import { Filter, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import type { Product } from "@/schemas/products";
import type { Category } from "@/schemas/categories";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency, generateSlug } from "@/lib/utils";
import AddToCart from "@/components/AddToCart";
import { io } from "socket.io-client";

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
}

export default function ProductsPage({ products: initialProducts, categories }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/products`);
        if (!response.ok) throw new Error("Error en la API");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();

    const socket = io(`${import.meta.env.PUBLIC_API_URL}/product-updates`);

    socket.on("productListUpdated", ({ id, changes }: { id: number; changes: Product }) => {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 300]);

  const filteredProducts = products
    .filter((p) => p.showInEcommerce)
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product?.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product?.category?.name ?? "");
      const matchesPrice = product.ecommerceSalePrice >= priceRange[0] && product.ecommerceSalePrice <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
  };

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Mobile Filter */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader className="text-center pt-4 pb-0">
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>Limite su búsqueda de productos</SheetDescription>
            </SheetHeader>
            <div className="px-4">
              <h3 className="font-medium mb-2">Categorías</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mobile-category-${category.id}`}
                      checked={selectedCategories.includes(category.name)}
                      onCheckedChange={() => handleCategoryChange(category.name)}
                    />
                    <label
                      htmlFor={`mobile-category-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>

              <h3 className="font-medium mt-6 mb-2">Gama de precios</h3>
              <div className="px-2">
                <Slider defaultValue={[0, 50]} max={50} step={1} value={priceRange} onValueChange={setPriceRange} />
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>{formatCurrency(priceRange[0])}</span>
                  <span>{formatCurrency(priceRange[1])}</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 sticky top-20">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium mb-4">Categorías</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => handleCategoryChange(category.name)}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>

            <h3 className="font-medium mt-6 mb-4">Gama de precios</h3>
            <div className="px-2">
              <Slider defaultValue={[0, 50]} max={50} step={1} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>{formatCurrency(priceRange[0])}</span>
                <span>{formatCurrency(priceRange[1])}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Todos los productos</h1>
            <div className="w-full sm:w-auto">
              <Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full" />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-4 text-lg font-medium">No se encontraron productos</h2>
              <p className="mt-2 text-gray-500">Intente ajustar sus criterios de búsqueda o filtro</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <a key={product.id} href={`/productos/${generateSlug(product.name, product.id)}`}>
                  <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md p-0">
                    <div className="aspect-square relative overflow-hidden">
                      {product.ecommercePercentageDiscount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                          {product.ecommercePercentageDiscount}% DSCTO
                        </div>
                      )}
                      <img
                        src={`${product.images.length > 0 ? import.meta.env.PUBLIC_API_URL + "/" + product.images[0].path : "/placeholder.svg"}`}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <CardContent className="pt-0">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-gray-500">(2)</span>
                      </div>
                      <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                      <div className="mt-2 flex items-center">
                        <span className="font-bold text-green-700">{formatCurrency(product.ecommerceSalePrice)}</span>
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {formatCurrency(product.ecommerceSalePrice / (1 - product.ecommercePercentageDiscount / 100))}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <AddToCart product={product} quantity={1} />
                    </CardFooter>
                  </Card>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
