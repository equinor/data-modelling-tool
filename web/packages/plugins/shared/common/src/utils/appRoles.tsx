export const DMSS_ADMIN_ROLE: string = 'dmss-admin'
export const INSPECTOR_ROLE: string = 'inspector'
// Domain roles
export const DOMAIN_ROLES: string[] = [
  'domain-developer',
  'domain-expert',
  DMSS_ADMIN_ROLE,
]
// Expert roles: Includes domain roles
export const EXPERT_ROLES: string[] = ['expert-operator', ...DOMAIN_ROLES]
// Operator roles: Includes expert roles
export const OPERATOR_ROLES: string[] = ['operator', ...EXPERT_ROLES]
// All roles
export const APP_ROLES: string[] = [INSPECTOR_ROLE, ...OPERATOR_ROLES]

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
    // If any of the roles the user has are in the EXPERT_ROLES array, return TRUE
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
    // If any of the roles the user has are in the OPERATOR_ROLES array, return TRUE
    return roles.some((role: string) => OPERATOR_ROLES.includes(role))
  }
  return false
}

export function hasDomainRole(tokenData: any): boolean {
  /**
   * Check whether the user's token has a 'domain' role
   * Accounts for any impersonated roles
   */
  // Always return true if auth is not enabled
  if (process.env.REACT_APP_AUTH !== '1') return true
  const roles = getRoles(tokenData)
  if (roles) {
    // If any of the roles the user has are in the DOMAIN_ROLES array, return TRUE
    return roles.some((role: string) => DOMAIN_ROLES.includes(role))
  }
  return false
}
