FROM node:14-alpine as base

ARG AUTH_ENABLED=0
ARG REDIRECT_URI=http://localhost/
# Azure AD requires a scope.
ARG AUTH_SCOPE=""
ARG CLIENT_ID=""
ARG TENANT_ID=""
ENV REACT_APP_AUTH_SCOPE=$AUTH_SCOPE
ENV REACT_APP_AUTH=$AUTH_ENABLED
ENV REACT_APP_AUTH_CLIENT_ID=$CLIENT_ID
ENV REACT_APP_AUTH_TENANT=$TENANT_ID
ENV REACT_APP_TOKEN_ENDPOINT=https://login.microsoftonline.com/${REACT_APP_AUTH_TENANT}/oauth2/v2.0/token
ENV REACT_APP_AUTH_ENDPOINT=https://login.microsoftonline.com/${REACT_APP_AUTH_TENANT}/oauth2/v2.0/authorize
ENV REACT_APP_LOGOUT_ENDPOINT=https://login.microsoftonline.com/${REACT_APP_AUTH_TENANT}/oauth2/logout
ENV REACT_APP_AUTH_REDIRECT_URI=$REDIRECT_URI

WORKDIR /code/
COPY jest.config.base.js package.json yarn.lock jest.config.js tsconfig.json ./
COPY --chown=1000 ./packages ./packages
RUN yarn install --ignore-scripts  --frozen-lockfile --link-duplicates

FROM base as development
CMD ["yarn", "start"]
USER 1000

FROM base as prod
RUN npm install -g serve
RUN yarn build
WORKDIR /code/packages/home
EXPOSE 3000
CMD ["serve", "--single", "build", "--listen", "3000"]
USER 1000
