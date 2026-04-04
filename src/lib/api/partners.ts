import { PartnerCompany } from "@/types/partner";

const mockPartners: PartnerCompany[] = [
  {
    id: "sonatrach",
    name: "Sonatrach",
    sector: "Énergie",
    initials: "S",
    domains: ["sonatrach.dz", "sonatrach.com"],
    branding: {
      primaryColor: "#FF6600",
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
      primaryColor: "#ED1C24",
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

const LOCAL_STORAGE_KEY = "manara_partners";

function getStoredPartners(): PartnerCompany[] {
  if (typeof window === "undefined") return mockPartners;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockPartners));
  return mockPartners;
}

export async function fetchPartners(): Promise<PartnerCompany[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return getStoredPartners();
}

export async function fetchPartnerByDomain(domain: string): Promise<PartnerCompany | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const partners = getStoredPartners();
  return partners.find(p => p.domains.includes(domain)) || null;
}

export async function fetchPartnerById(id: string): Promise<PartnerCompany | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const partners = getStoredPartners();
  return partners.find(p => p.id === id) || null;
}

export async function addPartner(partner: PartnerCompany): Promise<PartnerCompany> {
  if (typeof window !== "undefined") {
    const existing = getStoredPartners();
    const newStored = [...existing, partner];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStored));
  }
  return partner;
}

export async function updatePartner(updatedPartner: PartnerCompany): Promise<PartnerCompany> {
  if (typeof window !== "undefined") {
    const existing = getStoredPartners();
    const newStored = existing.map(p => p.id === updatedPartner.id ? updatedPartner : p);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStored));
  }
  return updatedPartner;
}

export async function deletePartner(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    const existing = getStoredPartners();
    const newStored = existing.filter(p => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStored));
  }
}

