import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'

/*
 * TODO: Move to service layer.
 */
export function createEntity(type: string) {
  return axios
    .post('/api/entity', { name: '', type: type })
    .then((respose) => {
      return respose.data
    })
    .catch((error) => {
      NotificationManager.error(`failed to create entity from: ${type}`)
      console.error(error)
    })
}
