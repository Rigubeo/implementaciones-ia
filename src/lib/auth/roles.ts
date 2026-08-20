export const roles = ["ADMIN", "CLIENT", "TEAM"] as const;

export type Role = (typeof roles)[number];

export function getUserRole(
  _userMetadata?: Record<string, unknown>,
  appMetadata?: Record<string, unknown>
): Role {
  const candidate = appMetadata?.role;
  return roles.includes(candidate as Role) ? (candidate as Role) : "CLIENT";
}

export function canAccessAdmin(role?: Role) {
  return role === "ADMIN" || role === "TEAM";
}

export function canAccessClientDashboard(role?: Role) {
  return role === "ADMIN" || role === "TEAM" || role === "CLIENT";
}
