import { UserProfile } from "@/types/partner";
import { fetchPartnerByDomain } from "./partners";

// Helper to persist mock session for the pitch demo
const SESSION_KEY = "manara_mock_session";

function getStoredSession(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(SESSION_KEY);
  return saved ? JSON.parse(saved) : null;
}

function setStoredSession(user: UserProfile | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export async function login(email: string): Promise<{ user?: UserProfile; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulating auth process

  const domain = email.split("@")[1];
  if (!domain) return { error: "Adresse email invalide." };

  const partner = await fetchPartnerByDomain(domain);
  if (!partner) {
    return { error: "Votre entreprise n'est pas encore partenaire de Manara Network." };
  }

  // Simulate finding an existing user or creating a new one with pending onboarding
  const isExistingUser = email.includes("demo"); // Dummy check for existing vs first-time

  const user: UserProfile = {
    email,
    tenantId: partner.id,
    onboardingCompleted: isExistingUser,
    firstName: isExistingUser ? "Prénom Demo" : undefined,
    lastName: isExistingUser ? "Nom Demo" : undefined,
  };

  setStoredSession(user);
  return { user };
}

export async function completeOnboarding(profileData: Partial<UserProfile>): Promise<UserProfile> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const currentSession = getStoredSession();
  if (!currentSession) throw new Error("No active session");

  const updatedUser = {
    ...currentSession,
    ...profileData,
    onboardingCompleted: true,
  };

  setStoredSession(updatedUser);
  return updatedUser;
}

export async function fetchCurrentUser(): Promise<UserProfile | null> {
  return getStoredSession();
}

export async function logout() {
  setStoredSession(null);
}
