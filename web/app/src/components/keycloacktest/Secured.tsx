import React, {useEffect, useState} from 'react'
import Keycloak from 'keycloak-js'

const keycloakSettings = {
  "realm": "MyDemo",
  "auth-server-url": "http://localhost:8080/auth",
  "ssl-required": "external",
  "resource": "dmt-client",
  "public-client": true,
  "confidential-port": 0
}

// https://scalac.io/blog/user-authentication-keycloak-1/
const Secured = (props: any) => {
    const [keycloack, setKeycloack] = useState<any>(null) //todo set to type for  keycloack class
    const [authenticated, setAuthenticated] = useState(false)


    useEffect(() => {
        ///const keycloak_settings = require('./../../../../keycloak.json')
        //@ts-ignore
        const keycloak_object = Keycloak({
            realm: "MyDemo",
              url: "http://localhost:8080/auth",
              clientId: "dmt-client"
  })
        keycloak_object.init({onLoad: 'login-required'}).then((authenticated: boolean) => {
            setKeycloack(keycloak_object)
            setAuthenticated(authenticated)
        }).catch((error: any) =>  {
            throw new Error( `keycloack error occured ${error}`)
        })
    }, [keycloakSettings])
    if (keycloack) {
        if (authenticated) {
        return <div>
            <p>This is a Keycloak-secured component of your application. You shouldn't be able
          to see this unless you've authenticated with Keycloak.</p>
        </div>
        }
    } else return (<div>Unable to authenticate!</div>)
    return <div>
        <div>Initializing Keycloak...</div>
    </div>
}
export default Secured