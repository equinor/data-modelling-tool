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
