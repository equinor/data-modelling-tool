export function getUsername(userData: any): string {
  if (userData?.preferred_username) {
    // With azuare AD, the user's email is stored in the preferred_username attribute.
    return userData.preferred_username.split('@')[0]
  }
  return 'NoLogin'
}
