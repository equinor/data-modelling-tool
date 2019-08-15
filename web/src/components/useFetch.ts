import { useEffect, useState } from 'react'
import axios from 'axios'

export default (url: string): any => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  if (!url) {
    return [false, {}, false]
  }
  useEffect(() => {
    async function fetch() {
      axios(url)
        .then(response => {
          setData(response.data)
          setLoading(false)
        })
        .catch(e => {
          setError(e.response.statusText)
          setLoading(false)
        })
    }
    fetch()
    setLoading(true)
  }, [url])

  return [loading, data, error]
}
