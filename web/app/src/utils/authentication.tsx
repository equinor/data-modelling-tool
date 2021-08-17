import axios from 'axios'
import jwt_decode from 'jwt-decode'

export const login = () => {
  const authorizationEndpoint = process.env.REACT_APP_AUTH_ENDPOINT
  const scope = 'openid'
  const clientId = process.env.REACT_APP_AUTH_CLIENT_ID
  const responseType = 'code'
  const redirectUri = window.location.href

  fetch(
    `${authorizationEndpoint}?` +
      `scope=${scope}&` +
      `response_type=${responseType}&` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}`,
    {
      redirect: 'manual',
    }
  )
    .then((response) => {
      window.location.replace(response.url)
    })
    .catch((err) => {
      throw new Error(err)
    })
}

export const getTokens = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code') || ''
  const clientId = process.env.REACT_APP_AUTH_CLIENT_ID || ''
  const tokenEndpoint = process.env.REACT_APP_TOKEN_ENDPOINT || ''

  const params = new URLSearchParams()
  params.append('grant_type', 'authorization_code')
  params.append('client_id', clientId)
  params.append('code', code)
  params.append('redirect_uri', `${window.location.origin}/`)

  const promise = axios.post(tokenEndpoint, params)
  const dataPromise = promise.then((response) => response.data)
  return dataPromise
}

export const getTokenFromRefreshToken = (refreshToken: any) => {
  const tokenEndpoint = process.env.REACT_APP_TOKEN_ENDPOINT || ''
  const clientId = process.env.REACT_APP_AUTH_CLIENT_ID || ''

  const params = new URLSearchParams()
  params.append('client_id', clientId)
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', refreshToken)

  const promise = axios.post(tokenEndpoint, params)
  const dataPromise = promise.then((response) => response.data)
  return dataPromise
}

export const decodeToken = (token: any) => {
  return jwt_decode(token)
}

export const isTokenValid = (token: any) => {
  if (!token) return false

  const bufferTimeInSeconds = 30 * 60

  try {
    //@ts-ignore
    const { exp } = jwt_decode(token)

    //we will fetch new access token if expiration time is close
    const expirationTimeWithBuffer = new Date(exp * 1000 - bufferTimeInSeconds * 1000)
    const dateNow = new Date()

    if (dateNow <= expirationTimeWithBuffer) {
      return true
    }
  } catch (err) {
    return false
  }
  return false
}
