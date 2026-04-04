export type PartnerCompany = {
  id: string;
  name: string;
  sector: string;
  initials: string;
  domains: string[]; // e.g. ["sonatrach.dz", "sonatrach.com"]
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    welcomeMessage?: string;
    logoVariant?: "horizontal" | "stacked";
  };
};

export type UserProfile = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    zip: string;
    state?: string;
  };
  onboardingCompleted: boolean;
  tenantId: string;
};
