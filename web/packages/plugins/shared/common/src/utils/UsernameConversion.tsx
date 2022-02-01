import { TokenResponse } from '../components/AccessControlList'
import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'

const GRAPH_API = 'https://graph.microsoft.com/v1.0'
export type UsernameIdMapping = { usernameId: string; username: string }

export function postWithFormData(tokenEndpoint: string, formData: FormData) {
  return fetch(tokenEndpoint, {
    method: 'POST',
    body: formData,
  })
    .then((response) =>
      response.json().then((body: any): any => {
        if (!response.ok) {
          console.error(body.error_description)
          throw body.error_description
        }
        return body
      })
    )
    .catch((error: any) => {
      console.error(error)
      throw error?.message || error
    })
}

export const getTokenWithUserReadAccess = (
  refreshToken: string
): Promise<string> => {
  // A token with scope User.ReadBasic.All is required to get information about users.
  const formData = new FormData()
  formData.append('grant_type', 'refresh_token')
  formData.append('refresh_token', refreshToken)
  formData.append('scope', 'https://graph.microsoft.com/User.ReadBasic.All')

  const tokenEndpoint: string = process.env.REACT_APP_TOKEN_ENDPOINT || ''
  return postWithFormData(tokenEndpoint, formData).then(
    (response: TokenResponse) => {
      return response.access_token
    }
  )
}

export const getUsernameMappingFromId = (
  usernameId: string,
  refreshToken: string
): Promise<UsernameIdMapping> => {
  // Find username from username id.
  // Only works with azure AD.

  return getTokenWithUserReadAccess(refreshToken)
    .then((token: string) => {
      const request_url = `${GRAPH_API}/users/${usernameId}?$select=mail`
      return axios
        .get(request_url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          return {
            username: result.data.mail.split('@')[0],
            usernameId: usernameId,
          }
        })
    })
    .catch((error) => {
      NotificationManager.error(
        `Failed to get username from username ID. Returning username ID instead.`
      )
      return { username: '', usernameId: usernameId }
    })
}

export const getUsernameMappingFromUsername = (
  username: string,
  refreshToken: string
): Promise<UsernameIdMapping> => {
  // Find username id from username.
  //Only works with azure AD.
  return getTokenWithUserReadAccess(refreshToken).then((token: string) => {
    const request_url = `${GRAPH_API}/users/?$filter=mail eq '${username}@equinor.com'`
    return axios
      .get(request_url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        if (result.data.value && result.data.value.length === 0) {
          throw new Error(`Found no users with username ${username}.`)
        }
        if (result.data.value.length > 1) {
          throw new Error(
            `Found several users with username ${username}. Username must be unique.`
          )
        }
        return { usernameId: result.data.value[0].id, username: username }
      })
  })
}
