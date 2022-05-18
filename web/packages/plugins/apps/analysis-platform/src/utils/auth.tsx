const EXPERT_ROLES = [
  'expert-operator',
  'domain-developer',
  'domain-expert',
  'dmss-admin',
]

export function hasExpertRole(userData: any): boolean {
  // Always return true if auth is not enabled
  if (process.env.REACT_APP_AUTH !== '1') return true
  if (userData?.roles) {
    // If any of the roles the user has in the the EXPERT_ROLES array, return TRUE
    return userData.roles.some((role: string) => EXPERT_ROLES.includes(role))
  }
  return false
}

export function getUsername(userData: any): string {
  if (userData?.preferred_username) {
    // With azuare AD, the user's email is stored in the preferred_username attribute.
    return userData.preferred_username.split('@')[0]
  }
  return 'NoLogin'
}
