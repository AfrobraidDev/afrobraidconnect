import { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiController } from "@/lib/apiController";

interface BackendAuthResponse {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: "CUSTOMER" | "BRAIDER" | "ADMIN";
  braider_profile?: any | null;

  access_token?: string;
  refresh_token?: string;
  access?: string;
  refresh?: string;
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials in .env.local");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const data = await apiController<BackendAuthResponse>({
            method: "POST",
            url: "/auth/login/",
            data: {
              email: credentials.email,
              password: credentials.password,
            },
          });

          if (data && (data.access_token || data.access)) {
            return {
              id: data.id || "unknown",
              email: data.email,
              name: `${data.first_name} ${data.last_name}`,
              role: data.role || "CUSTOMER",
              accessToken: data.access_token || data.access || "",
              refreshToken: data.refresh_token || data.refresh || "",
              braiderProfile: data.braider_profile || null,
              image: null,
            };
          }
          return null;
        } catch (error) {
          console.error("Credentials Login Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const data = await apiController<BackendAuthResponse>({
            method: "POST",
            url: "/auth/google/",
            data: {
              id_token: account.id_token,
              role: "CUSTOMER",
            },
          });
          const accessToken = data.access || data.access_token;
          const refreshToken = data.refresh || data.refresh_token;

          if (accessToken) {
            user.accessToken = accessToken;
            user.refreshToken = refreshToken || "";
            user.id = data.id || user.id;
            user.role = data.role || "CUSTOMER";
            user.braiderProfile = data.braider_profile || null;

            return true;
          }

          console.error("Backend response missing access token:", data);
          return false;
        } catch (error) {
          console.error("Google Signin Exception:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
        token.role = user.role;
        token.braiderProfile = user.braiderProfile;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.braiderProfile = token.braiderProfile;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.AUTH_SECRET,
};
