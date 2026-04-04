import type { PartnerCompany } from "@/types/partner";

export const partnerCompanies: PartnerCompany[] = [
  {
    id: "sonatrach",
    name: "Sonatrach",
    sector: "Énergie",
    initials: "S",
    domains: ["sonatrach.dz", "sonatrach.com"],
    branding: {
       primaryColor: "#E31B23", // Sonatrach Red
       secondaryColor: "#FFC20E",
    }
  },
  {
    id: "ooredoo",
    name: "Ooredoo Algérie",
    sector: "Télécommunications",
    initials: "O",
    domains: ["ooredoo.dz", "ooredoo.com"],
    branding: {
       primaryColor: "#ED1C24",
       secondaryColor: "#FFFFFF",
    }
  },
  {
    id: "djezzy",
    name: "Djezzy",
    sector: "Télécommunications",
    initials: "D",
    domains: ["djezzy.dz", "ota.dz"],
    branding: {
       primaryColor: "#E50019",
       secondaryColor: "#000000",
    }
  },
  {
    id: "air-algerie",
    name: "Air Algérie",
    sector: "Transport",
    initials: "A",
    domains: ["airalgerie.dz"],
    branding: {
       primaryColor: "#004B87",
       secondaryColor: "#E31B23",
    }
  },
  {
    id: "cosider",
    name: "Cosider",
    sector: "BTP & services",
    initials: "C",
    domains: ["cosider-groupe.dz"],
    branding: {
       primaryColor: "#005696",
    }
  },
  {
    id: "naftal",
    name: "Naftal",
    sector: "Distribution",
    initials: "N",
    domains: ["naftal.dz"],
    branding: {
       primaryColor: "#FDB813",
       secondaryColor: "#004B87",
    }
  },
];
