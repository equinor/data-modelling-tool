export const APP_ROLES: string[] = [
  'dmss-admin',
  'inspector',
  'operator',
  'expert-operator',
  'domain-expert',
  'domain-developer',
]
export const EXPERT_ROLES = [
  'expert-operator',
  'domain-developer',
  'domain-expert',
  'dmss-admin',
]
export const OPERATOR_ROLES = EXPERT_ROLES.concat(['operator'])

export function getRoles(tokenData: any): string[] {
  /**
   * Retrieve the user's roles from tokenData,
   * overriding with impersonated roles if present
   */
  // Get roles from token
  let roles = tokenData?.roles || []
  // Check for impersonated roles
  if (localStorage.getItem('impersonateRoles')) {
    roles = [JSON.parse(localStorage.getItem('impersonateRoles') || 'null')]
  }
  return roles
}

export function hasExpertRole(tokenData: any): boolean {
  /**
   * Check whether the user's token has an expert role
   * Accounts for any impersonated roles
   */
  // Always return true if auth is not enabled
  if (process.env.REACT_APP_AUTH !== '1') return true
  const roles = getRoles(tokenData)
  if (roles) {
    // If any of the roles the user has in the the EXPERT_ROLES array, return TRUE
    return roles.some((role: string) => EXPERT_ROLES.includes(role))
  }
  return false
}

export function hasOperatorRole(tokenData: any): boolean {
  /**
   * Check whether the user's token has an operator role (i.e. 'operator' or one of the expert roles)
   * Accounts for any impersonated roles
   */
  // Always return true if auth is not enabled
  if (process.env.REACT_APP_AUTH !== '1') return true
  const roles = getRoles(tokenData)
  if (roles) {
    // If any of the roles the user has in the the OPERATOR_ROLES array, return TRUE
    return roles.some((role: string) => OPERATOR_ROLES.includes(role))
  }
  return false
}
