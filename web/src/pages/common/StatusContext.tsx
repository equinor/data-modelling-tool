import React, { useState } from 'react'
export const StatusContext = React.createContext([{}, () => {}])

export const StatusProvider = ({ children }: any) => {
  const [status, setStatus] = useState({})
  return (
    <StatusContext.Provider value={[status, setStatus]}>
      {children}
    </StatusContext.Provider>
  )
}
