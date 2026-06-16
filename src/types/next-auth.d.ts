import "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role?: "ADMIN" | "CLIENT" | "TEAM";
  }

  interface Session {
    user: {
      id: string;
      role?: "ADMIN" | "CLIENT" | "TEAM";
    } & DefaultSession["user"];
  }
}
