import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Define the structure of your Backend API Response
export interface BraiderProfile {
  is_phone_verified: boolean;
  document_verification_status:
    | "VERIFIED"
    | "PENDING"
    | "REJECTED"
    | "NOT_UPLOADED";
  is_payouts_enabled: boolean;
}

// Extend the built-in User type
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    accessToken: string;
    refreshToken: string;
    role: "CUSTOMER" | "BRAIDER" | "ADMIN";
    braiderProfile: BraiderProfile | null;
  }

  interface Session extends DefaultSession {
    user: User; // Re-use the extended User type
    accessToken: string;
    refreshToken: string;
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string;
    refreshToken: string;
    role: "CUSTOMER" | "BRAIDER" | "ADMIN";
    braiderProfile: BraiderProfile | null;
  }
}
