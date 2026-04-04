export type LeadType = "partner" | "retailer";

export type Lead = {
  id: string;
  type: LeadType;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  message?: string;
  date: string;
  status: "new" | "contacted" | "converted";
};

const mockLeads: Lead[] = [
  {
    id: "lead-1",
    type: "partner",
    companyName: "TechCorp Algérie",
    contactName: "Amine Benali",
    email: "amine@techcorp.dz",
    phone: "0555123456",
    message: "Nous souhaitons offrir les avantages Manara à nos 500 employés.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "new",
  },
  {
    id: "lead-2",
    type: "retailer",
    companyName: "ElectroPlanet",
    contactName: "Sarah Mansour",
    email: "contact@electroplanet.dz",
    phone: "0770987654",
    message: "Nous sommes un distributeur d'électroménager et nous voulons proposer des offres.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "contacted",
  }
];

const LOCAL_STORAGE_KEY = "manara_leads";

function getStoredLeads(): Lead[] {
  if (typeof window === "undefined") return mockLeads;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    return [...mockLeads, ...JSON.parse(stored)];
  }
  return mockLeads;
}

export async function fetchLeads(type?: LeadType): Promise<Lead[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const leads = getStoredLeads();
  if (type) return leads.filter(l => l.type === type);
  return leads;
}

export async function submitLead(leadData: Omit<Lead, "id" | "date" | "status">): Promise<Lead> {
  const newLead: Lead = {
    ...leadData,
    id: `lead-${Date.now()}`,
    date: new Date().toISOString(),
    status: "new",
  };

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existing = stored ? JSON.parse(stored) : [];
    const newStored = [...existing, newLead];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStored));
  }
  return newLead;
}

export async function updateLeadStatus(id: string, status: Lead["status"]): Promise<void> {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existing: Lead[] = stored ? JSON.parse(stored) : [];
    const leadIndex = existing.findIndex((l) => l.id === id);
    if (leadIndex !== -1) {
       existing[leadIndex].status = status;
       localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
    } else {
       // if it's a mock lead, we need to save the override
       const mockLead = mockLeads.find(l => l.id === id);
       if (mockLead) {
          const newStored = [...existing, { ...mockLead, status }];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStored));
       }
    }
  }
}
