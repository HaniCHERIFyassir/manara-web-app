export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  retailPrice?: number;
  images: string[];
  minParticipants: number;
  currentParticipants: number;
  endDate: string;
  tenantIds?: string[];
  maxQuantityPerUser: number;
  isHero?: boolean;
};
