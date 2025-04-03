import { Menu, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@nanostores/react";
import { cart, removeFromCart } from "@/store/cart";
import { formatCurrency, generateSlug } from "@/lib/utils";
import type { Product } from "@/schemas/products";
import { io } from "socket.io-client";

interface HeaderProps {
  products: Product[];
}

export default function Header({ products: initialProducts }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const $cart = useStore(cart);
  const totalItems = $cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = $cart.reduce((sum, item) => sum + item.product.ecommerceSalePrice * item.quantity, 0);
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

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = products
        .filter((p) => p.showInEcommerce)
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 results
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* NAVEGACION MOBILE */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pl-4 pt-4 gap-0">
            <a href="/" className="flex items-center">
              <SheetTitle className="font-bold text-xl">R&N</SheetTitle>
            </a>
            <div className="mt-8 flex flex-col gap-4">
              <a href="/" className="text-lg font-medium">
                Home
              </a>
              <a href="/productos" className="text-lg font-medium">
                Products
              </a>
            </div>
          </SheetContent>
        </Sheet>

        {/* NAVEGACION DESKTOP */}
        <a href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block text-green-600 text-xl">R&N</span>
        </a>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="/" className="transition-colors hover:text-green-600">
            Home
          </a>
          <a href="/productos" className="transition-colors hover:text-green-600">
            Productos
          </a>
        </nav>

        <div className="flex items-center space-x-4 ml-auto">
          {/* SEARCH */}
          {isSearchOpen ? (
            <div className="relative flex items-center">
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border z-50 max-h-[300px] overflow-auto">
                  <ul className="py-2">
                    {searchResults.map((product) => (
                      <li key={product.id}>
                        <a
                          href={`/productos/${generateSlug(product.name, product.id)}`}
                          className="flex items-center px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                            setSearchResults([]);
                          }}
                        >
                          <div className="max-w-10 max-h-10 bg-gray-100 mr-3">
                            <img
                              className="rounded-md object-cover"
                              src={`${
                                product.images.length > 0 ? import.meta.env.PUBLIC_API_URL + "/" + product.images[0].path : "/placeholder.svg"
                              }`}
                              alt={product.name}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-sm line-clamp-2">{product.name}</div>
                            <div className="text-green-600 text-xs font-medium">{formatCurrency(product.ecommerceSalePrice)}</div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="text-foreground">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          {/* CUENTA */}
          <Button variant="ghost" size="icon" className="text-foreground">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>

          {/* CART */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-foreground">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-600">{totalItems}</Badge>
                )}
                <span className="sr-only">Shopping cart</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4">
                <h3 className="font-medium">Mi Carrito ({totalItems})</h3>
              </div>
              <DropdownMenuSeparator />

              {$cart.length === 0 ? (
                <div className="py-6 text-center">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[300px] p-4">
                    <div className="space-y-4">
                      {$cart.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                            <img
                              src={`${
                                item.product.images.length > 0
                                  ? import.meta.env.PUBLIC_API_URL + "/" + item.product.images[0].path
                                  : "/placeholder.svg"
                              }`}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium leading-tight">{item.product.name}</h4>
                            <div className="text-sm text-muted-foreground mt-1">
                              {item.quantity} × {formatCurrency(item.product.ecommerceSalePrice)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <DropdownMenuSeparator />

                  <div className="p-4">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a href="/cart" className="w-full">
                        <Button className="w-full bg-green-600 hover:bg-green-700">Ver carrito</Button>
                      </a>
                      <a href="/checkout" className="w-full">
                        <Button variant="outline" className="w-full">
                          Checkout
                        </Button>
                      </a>
                    </div>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
