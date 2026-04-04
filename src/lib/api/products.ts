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
  }
];

export async function getProductsByTenant(tenantId?: string): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 600));
  // Filter products based on tenantId if required in the future
  return mockProducts.filter(p => !p.tenantId || p.tenantId === tenantId);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockProducts.find(p => p.id === id) || null;
}
