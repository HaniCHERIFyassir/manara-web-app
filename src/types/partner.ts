export type PartnerCompany = {
  id: string;
  name: string;
  sector: string;
  initials: string;
  domains: string[]; // e.g. ["sonatrach.dz", "sonatrach.com"]
  hrAdminEmail?: string; // Specific email that sees statistics
  logoUrl?: string;
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
  role: "employee" | "hr_admin";
  onboardingCompleted: boolean;
  tenantId: string;
};
