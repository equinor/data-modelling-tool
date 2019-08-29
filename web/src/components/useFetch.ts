import { useEffect, useState } from 'react'
import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
type NotificationText = {
  title: string
  body: string
}

type Props = {
  successNotification?: NotificationText
  failureNotification?: NotificationText
}

const defaultProps = Object.freeze({})
/**
 *
 * @param url can be null. Useful to avoid unnecessary fetch.
 * @param props
 */
export default (url: string | null, props?: Props): any => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  props = props || defaultProps
  useEffect(() => {
    async function fetch() {
      if (url) {
        axios(url)
          .then(response => {
            setData(response.data)
            setLoading(false)
            if (props && props.successNotification) {
              NotificationManager.success(
                props.successNotification.body,
                props.successNotification.title
              )
            }
          })
          .catch(e => {
            if (e.response && e.response.statusText) {
              setError(e.response.statusText)
            }
            setLoading(false)
            if (props && props.failureNotification) {
              NotificationManager.success(
                props.failureNotification.body,
                props.failureNotification.title
              )
            }
          })
      }
    }
    if (url) {
      fetch()
      setLoading(true)
    }
  }, [url, props])
  return [loading, data, error]
}
