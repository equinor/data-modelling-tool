import React, {useEffect, useState} from 'react'
import {decodeToken, getTokenFromRefreshToken, getTokens, login, tokenExpired} from "./authentication";
export const AuthContext = React.createContext()

export const AuthProvider = ({ authEnabled, children }) => {
  const token = localStorage.getItem('token') || null
  const refreshToken = localStorage.getItem('refreshToken') || null
  const loggedIn = localStorage.getItem('loggedIn') || false

  const getUserData = (token) => {
    if (!token) return {name: "Not authenticated"}
    const decodedToken = decodeToken(token)

    // information included in decodedToken can vary based on which authentication server is used.
    return {
      name: decodedToken["name"],
      accessToken: token
    }
  }
  const [userData, setUserData] = useState(getUserData(token))

  useEffect(() => {
    if (authEnabled) {
    if (!loggedIn) {
      localStorage.setItem('loggedIn', true)
      login()
    }
    if (loggedIn && tokenExpired(token)) {
      getTokenFromRefreshToken(refreshToken)
        .then((response) => {
          window.localStorage.setItem('refreshToken', response['refresh_token'])
          window.localStorage.setItem('token', response['access_token'])
          setUserData(getUserData(response['access_token']))
        })
        .catch((error) => {
          const urlParams = new URLSearchParams(window.location.search)
          const code = urlParams.get('code')
          if (!code) login()
          if (code) {
            getTokens().then((response) => {
              window.localStorage.setItem('refreshToken', response['refresh_token'])
              window.localStorage.setItem('token', response['access_token'])
              setUserData(getUserData(response['access_token']))
            })
          }
        })
    }
    }


  },[])

  return (
    <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
  )
}