interface DocumentEventMap {
  productsUpdated: CustomEvent<Product[]>; // Product[] es el tipo de "detail"
}