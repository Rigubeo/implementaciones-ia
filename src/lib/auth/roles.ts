export const roles = ["ADMIN", "CLIENT", "TEAM"] as const;

export type Role = (typeof roles)[number];

export function canAccessAdmin(role?: Role) {
  return role === "ADMIN" || role === "TEAM";
}

export function canAccessClientDashboard(role?: Role) {
  return role === "ADMIN" || role === "TEAM" || role === "CLIENT";
}
