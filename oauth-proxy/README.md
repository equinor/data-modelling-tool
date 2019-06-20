# Oauth-Proxy

The OAuth proxy sits in front of the web application and handles authentication. Typical use case, make sure that a end-user is authenticated before he/she is allowed access to the application.

This example uses the [OAuth2_Proxy](https://pusher.github.io/oauth2_proxy/) project and the [Bitnami Docker image](https://github.com/bitnami/bitnami-docker-oauth2-proxy) for implementation. There are quite a few other alternatives, I do not have any preferences, just wanted to test this one. [OpenResty](https://openresty.org/en/) also lookes very interesting.

## Config

* The ```oauth2_proxy.cfg``` file contains the basic config for the proxy. If the example is going to be used on Radix the ```redirect_url``` parameter needs to reflect the app URL in Raidx. The value of ```redirect_url``` also needs to be defined in the Azure AD object for the application.
* Two secrets needs to be defined for the oauth-proxy component in Radix, ```ENV OAUTH2_PROXY_CLIENT_ID``` and ```OAUTH2_PROXY_CLIENT_SECRET```
* Documentation for how to define Azure as a provider is available in the [OAuth_Proxy project documentation](https://pusher.github.io/oauth2_proxy/auth-configuration#azure-auth-provider)
