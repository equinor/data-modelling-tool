// Toggles between true or false
import { useCallback, useState } from 'react'

export default function useToggle(initialValue = false) {
  const [toggle, setToggle] = useState(initialValue)

  return [toggle, useCallback(() => setToggle(status => !status), [])]
}
