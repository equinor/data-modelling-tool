import { useEffect, useState } from 'react'
import axios from 'axios'

export default (url: string): any => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const error = false

  if (!url) {
    return [false, {}, false]
  }
  useEffect(() => {
    async function fetch() {
      const response = await axios(url)
      setData(response.data)
      setLoading(false)
    }
    fetch()
    setLoading(true)
  }, [url])

  return [loading, data, error]
}
