import { PartnerCompany } from "@/types/partner";

const mockPartners: PartnerCompany[] = [
  {
    id: "sonatrach",
    name: "Sonatrach",
    sector: "Énergie",
    initials: "S",
    domains: ["sonatrach.dz", "sonatrach.com"],
    branding: {
      primaryColor: "#FF6600", // Sonatrach orange
      welcomeMessage: "Bienvenue à la famille Sonatrach",
    }
  },
  {
    id: "ooredoo",
    name: "Ooredoo Algérie",
    sector: "Télécommunications",
    initials: "O",
    domains: ["ooredoo.dz"],
    branding: {
      primaryColor: "#ED1C24", // Ooredoo red
      welcomeMessage: "Bienvenue chez Ooredoo",
    }
  },
  {
    id: "djezzy",
    name: "Djezzy",
    sector: "Télécommunications",
    initials: "D",
    domains: ["djezzy.dz"],
    branding: {
      primaryColor: "#FF0000",
      welcomeMessage: "Bienvenue chez la communauté Djezzy",
    }
  }
];

export async function fetchPartners(): Promise<PartnerCompany[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPartners;
}

export async function fetchPartnerByDomain(domain: string): Promise<PartnerCompany | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockPartners.find(p => p.domains.includes(domain)) || null;
}

export async function fetchPartnerById(id: string): Promise<PartnerCompany | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockPartners.find(p => p.id === id) || null;
}
