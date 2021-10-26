import React, {useEffect, useState} from 'react'
import {
  decodeToken,
  getlocalStorageAccessToken,
  getTokenFromRefreshToken,
  getTokens,
  login,
  logout,
  tokenExpired
} from "./authentication";
//@ts-ignore
import useLocalStorage from "@dmt/dmt-app/src/hooks/useLocalStorage";
export const AuthContext = React.createContext()

export const AuthProvider = ({ authEnabled, children }) => {
  const [refreshToken, setRefreshToken] = useLocalStorage('refreshToken', null)
  const [token, setToken] = useLocalStorage('token', null)
  const [loggedIn, setLoggedIn] = useLocalStorage('loggedIn', false)
  const [loginInProgress, setLoginInProgress] = useLocalStorage('loginInProgress', false)

  const getUserData = (token, loggedIn) => {
    if (!token) return {name: "Not authenticated", loggedIn: false, token: undefined}
    const decodedToken = decodeToken(token)
    // information included in decodedToken can vary based on which authentication server is used.
    return {
      name: decodedToken["name"],
      sub: decodedToken["sub"],
      roles: decodedToken["roles"],
      username: decodedToken["preferred_username"].split("@")[0],
      accessToken: token,
      loggedIn: loggedIn
    }
  }
  const [userData, setUserData] = useState(getUserData(token, loggedIn))
  const logOut = () => {
    setRefreshToken(null)
    setToken(null)
    setLoggedIn(false)
    logout()
  }

  useEffect(() => {
    if (authEnabled) {
      if (!loggedIn && !loginInProgress) {
        setLoginInProgress(true)
        login()
      }
      else if (loggedIn && tokenExpired(token)) {
        //fetch token from stored refreshToken if token has expired
         setToken(null)
         getTokenFromRefreshToken(refreshToken)
          .then((response) => {
            setRefreshToken(response.refresh_token)
            setToken(response.access_token)
            setUserData(getUserData(response.access_token, true))
          })
           .catch((error =>  {
             // If refresh token has expired or is invalid, ask user to login.
            setLoginInProgress(true)
            setLoggedIn(false)
            login()
      }))
      }
      else if (!loggedIn && loginInProgress  && tokenExpired(token)) {
        getTokenFromRefreshToken(refreshToken)
          .then((response) => {
            setRefreshToken(response.refresh_token)
            setToken(response.access_token)
            setLoggedIn(true)
            setLoginInProgress(false)
            setUserData(getUserData(response.access_token, true))
          })
          .catch((error) => {
            const urlParams = new URLSearchParams(window.location.search)
            const code = urlParams.get('code')
            if (!code) login()
            getTokens().then((response) => {
              setRefreshToken(response.refresh_token)
              setToken(response.access_token)
              setLoggedIn(true)
              setLoginInProgress(false)
              setUserData(getUserData(response.access_token, true))
            })

          })
      }
    }

  },[])


  if (!getlocalStorageAccessToken() && authEnabled){
    return <div>Login in progress, please wait...</div>
  }
  return (
    <AuthContext.Provider value={{ userData , logOut, token}}>{children}</AuthContext.Provider>
  )
}