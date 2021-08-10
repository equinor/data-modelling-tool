import React, {useEffect, useState} from 'react'

export const AuthContext = React.createContext()

export const AuthProvider = ({ idToken, children, keycloakObject }) => {
    const getInitialState = () => {
    if (idToken) return idToken
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

    useEffect(() => {
        if (keycloakObject) {
    keycloakObject.loadUserInfo().then(info => {
      console.log("kk info", info)
      const user = info.preferred_username
      const name = info.name
      setState({user: user, profile: { name: name, jwt_token: keycloakObject.token} })
    })
  }
    }, [])



  return (
    <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
  )
}
