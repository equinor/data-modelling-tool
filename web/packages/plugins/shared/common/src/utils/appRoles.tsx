const EXPERT_ROLES = [
  'expert-operator',
  'domain-developer',
  'domain-expert',
  'dmss-admin',
]

export function getRoles(userData: any): string[] {
  /**
   * Retrieve the user's roles from userData,
   * overriding with impersonated roles if present
   */
  // Get roles from token
  let roles = userData?.roles || []
  // Check for impersonated roles
  if (localStorage.getItem('impersonateRoles')) {
    roles = [JSON.parse(localStorage.getItem('impersonateRoles') || 'null')]
  }
  return roles
}

export function hasExpertRole(userData: any): boolean {
  // Always return true if auth is not enabled
  if (process.env.REACT_APP_AUTH !== '1') return true
  const roles = getRoles(userData)
  if (roles) {
    // If any of the roles the user has in the the EXPERT_ROLES array, return TRUE
    return roles.some((role: string) => EXPERT_ROLES.includes(role))
  }
  return false
}
