import React, {useEffect, useState} from 'react'

export const AuthContext = React.createContext()

export const AuthProvider = ({ token, children }) => {
    const getInitialState = () => {
    if (token) return token
    else {
      return {
      user: 'Not Logged in',
      profile: {
        name: 'Not Authenticated',
      },
    }
    }
  }

  const [state, setState] = useState(getInitialState())



  return (
    <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
  )
}
