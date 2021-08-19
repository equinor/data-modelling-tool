import axios from 'axios'
import jwt_decode from 'jwt-decode'
// Only supports OAuth2 Authorization Code flow with PKCE

const authSettings = {
  clientId: '97a6b5bd-63fb-42c6-bb75-7e5de2394ba0',
  authorizationEndpoint:
    'https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/oauth2/v2.0/authorize',
  tokenEndpoint:
    'https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/oauth2/v2.0/token',
  scope: 'https://graph.microsoft.com/User.Read',
  redirectUri: 'http://localhost',
}

function getRandomInteger(range: number): number {
  const max_range = 256 // Highest possible number in Uint8

  // Create byte array and fill with 1 random number
  let byteArray = new Uint8Array(1)
  window.crypto.getRandomValues(byteArray) // This is the new, and safer API than Math.Random()

  // If the generated number is out of range, try again
  if (byteArray[0] >= Math.floor(max_range / range) * range)
    return getRandomInteger(range)
  return byteArray[0] % range
}

function generateRandomString(length: number) {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(getRandomInteger(possible.length - 1))
  }
  return text
}

async function generateCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder()
  const bytes: Uint8Array = encoder.encode(codeVerifier) // Encode the verifier to a byteArray
  const hash: ArrayBuffer = await crypto.subtle.digest('SHA-256', bytes) // sha256 hash it
  // @ts-ignore
  const hashString: string = String.fromCharCode(...new Uint8Array(hash))
  // @ts-ignore
  const base64 = btoa(hashString) // Base64 encode the verifier hash
  const base64url = base64 // Base64Url encode the base64 encoded string, making it safe as a query param
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  return base64url
}

export async function login() {
  // Create and store a random string in localStorage, used as the 'code_verifier'
  const codeVerifier = generateRandomString(20)
  window.localStorage.setItem('PKCE_code_verifier', codeVerifier)

  // Hash and Base64URIEncode the code_verifier, used as the 'code_challenge'
  generateCodeChallenge(codeVerifier).then((codeChallenge) => {
    // Set query parameters and redirect user to OAuth2 authentication endpoint
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: authSettings.clientId,
      scope: authSettings.scope,
      redirect_id: authSettings.redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    })
    window.location.replace(
      `${authSettings.authorizationEndpoint}?${params.toString()}`
    )
  })
}

export const getTokens = (): Promise<any> => {
  const urlParams = new URLSearchParams(window.location.search)
  const authCode = urlParams.get('code') || ''
  const codeVerifier = window.localStorage.getItem('PKCE_code_verifier') || ''

  const formData = new FormData()
  formData.append('grant_type', 'authorization_code')
  formData.append('code', authCode)
  formData.append('scope', authSettings.scope)
  formData.append('client_id', authSettings.clientId)
  formData.append('redirect_uri', authSettings.redirectUri)
  formData.append('code_verifier', codeVerifier)

  return axios
    .post(authSettings.tokenEndpoint, formData)
    .then((response) => response.data)
    .catch((e) => {
      console.log(e)
    })
}

export const getTokenFromRefreshToken = (refreshToken: any) => {
  const params = new URLSearchParams()
  params.append('client_id', authSettings.clientId)
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', refreshToken)

  const promise = axios.post(authSettings.tokenEndpoint, params)
  const dataPromise = promise.then((response) => response.data)
  return dataPromise
}

export const decodeToken = (token: any) => {
  return jwt_decode(token)
}

export const isTokenValid = (token: any) => {
  // Rename to tokenExpired()
  if (!token) return false

  const bufferTimeInSeconds = 30 * 60

  try {
    //@ts-ignore
    const { exp } = jwt_decode(token) // Do we need this jwt_decode? Should be enough with a base64 decode

    //we will fetch new access token if expiration time is close
    const expirationTimeWithBuffer = new Date(
      exp * 1000 - bufferTimeInSeconds * 1000
    )
    const dateNow = new Date()

    if (dateNow <= expirationTimeWithBuffer) {
      return true
    }
  } catch (err) {
    return false
  }
  return false
}
