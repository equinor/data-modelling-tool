import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { TUserIdMapping } from '../types'

const GRAPH_API = 'https://graph.microsoft.com/v1.0'

type TTokenResponse = {
  token_type: string
  scope: string
  expires_in: number
  ext_expires_in: number
  access_token: string
  refresh_token: string
}

export function postWithFormData(tokenEndpoint: string, formData: FormData) {
  return axios
    .post(tokenEndpoint, formData)
    .then((response) => {
      return response.data
    })
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
    (response: TTokenResponse) => {
      return response.access_token
    }
  )
}

export const getUsernameMappingFromUserId = (
  userId: string,
  token: string
): Promise<TUserIdMapping> => {
  // Find username from username id.
  // Only works with azure AD.
  // the supplied token needs the access level: User.ReadBasic.All

  const request_url = `${GRAPH_API}/users/${userId}?$select=mail`
  return axios
    .get(request_url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((result) => {
      return {
        username: result.data.mail.split('@')[0],
        userId: userId,
      }
    })
    .catch(() => {
      NotificationManager.error(`Failed to get username from username ID.`)
      return { username: '', userId: userId }
    })
}

export const getUsernameMappingFromUsername = (
  username: string,
  token: string
): Promise<TUserIdMapping> => {
  // Find username id from username.
  // Only works with azure AD.
  // the supplied token needs the access level: User.ReadBasic.All

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
      return { userId: result.data.value[0].id, username: username }
    })
}
