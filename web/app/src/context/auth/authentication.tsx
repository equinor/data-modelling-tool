import axios from 'axios'
import {
  generateCodeChallenge,
  generateRandomString,
} from './getPCKECodeChallenge'
// Only supports OAuth2 Authorization Code flow with PKCE

const authSettings = {
  clientId: process.env.REACT_APP_AUTH_CLIENT_ID || '',
  authorizationEndpoint: process.env.REACT_APP_AUTH_ENDPOINT || '',
  tokenEndpoint: process.env.REACT_APP_TOKEN_ENDPOINT || '',
  scope: process.env.REACT_APP_AUTH_SCOPE + " openid" || '', // added openid scope...
  redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URI || '',
  logoutEndpoint: process.env.REACT_APP_LOGOUT_ENDPOINT || '',
}

export function logout() {
  window.location.href = `${authSettings.logoutEndpoint}?post_logout_redirect_uri=${authSettings.redirectUri}`
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

export const getlocalStorageAccessToken = (): string | null => {
   if (window.localStorage.getItem("token") === "null" || window.localStorage.getItem("token") === null) return null
   else return String(window.localStorage.getItem("token")).slice(1,-1) //need to remove first and last value of the string, these values are quotation marks
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
      console.error(e)
    })
}

export const getTokenFromRefreshToken = (refreshToken: string) => {
  if (!refreshToken) return Promise.reject()
  const params = new URLSearchParams({
    client_id: authSettings.clientId,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })

  return axios
    .post(authSettings.tokenEndpoint, params)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Could not fetch token.')
    })
}

export const decodeToken = (token: string) => {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}

export const tokenExpired = (token: string) => {
  if (!token) return true
  const bufferTimeInSeconds = 30 * 60
  const { exp } = decodeToken(token)

  //we will fetch new access token if expiration time is close
  const expirationTimeWithBuffer = new Date(
    exp * 1000 - bufferTimeInSeconds * 1000
  )
  const dateNow = new Date()
  if (dateNow <= expirationTimeWithBuffer) {
    return false
  }

  return true
}
