import { Product } from "@/types/product";

const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Samsung Galaxy S24 Ultra",
    description: "Le summum de la technologie mobile avec IA intégrée.",
    category: "Électronique",
    price: 155000,
    retailPrice: 185000,
    images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80"],
    minParticipants: 50,
    currentParticipants: 32,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    maxQuantityPerUser: 2,
  },
  {
    id: "prod-2",
    name: "MacBook Air M3 13\"",
    description: "Fin, léger et incroyablement puissant pour votre productivité.",
    category: "Informatique",
    price: 178000,
    retailPrice: 210000,
    images: ["https://images.unsplash.com/photo-1517336714460-4c98882c3fae?auto=format&fit=crop&w=800&q=80"],
    minParticipants: 30,
    currentParticipants: 12,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
    maxQuantityPerUser: 1,
  },
  {
    id: "prod-3",
    name: "Smart TV LG OLED 55\"",
    description: "Une qualité d'image exceptionnelle pour vos soirées cinéma.",
    category: "Maison",
    price: 139000,
    retailPrice: 165000,
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80"],
    minParticipants: 40,
    currentParticipants: 25,
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    maxQuantityPerUser: 1,
    isHero: true,
  }
];

const LOCAL_STORAGE_KEY = "manara_products";

function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return mockProducts;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockProducts));
  return mockProducts;
}

export async function fetchAllProducts(): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return getStoredProducts();
}

export async function getProductsByTenant(tenantId?: string): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 600));
  const products = getStoredProducts();
  return products.filter(p => !p.tenantIds || p.tenantIds.length === 0 || (tenantId && p.tenantIds.includes(tenantId)));
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const products = getStoredProducts();
  return products.find(p => p.id === id) || null;
}

export async function addProduct(product: Product): Promise<Product> {
  if (typeof window !== "undefined") {
    const existing = getStoredProducts();
    const newStored = [...existing, product];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStored));
  }
  return product;
}

export async function updateProduct(updatedProduct: Product): Promise<Product> {
  if (typeof window !== "undefined") {
    const existing = getStoredProducts();
    const newStored = existing.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStored));
  }
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    const existing = getStoredProducts();
    const newStored = existing.filter(p => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStored));
  }
}
