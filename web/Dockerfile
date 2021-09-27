FROM node:12-alpine as base

ARG AUTH_ENABLED=0
ARG REDIRECT_URI=http://localhost/
ARG AUTH_SCOPE=api://97a6b5bd-63fb-42c6-bb75-7e5de2394ba0/dmss_test_scope
ARG CLIENT_ID=ee7dbf49-e358-4c9c-a7e4-fb6d56c02205
ENV REACT_APP_AUTH=$AUTH_ENABLED
ENV REACT_APP_AUTH_CLIENT_ID=$CLIENT_ID
ENV REACT_APP_AUTH_TENANT=3aa4a235-b6e2-48d5-9195-7fcf05b459b0
ENV REACT_APP_TOKEN_ENDPOINT=https://login.microsoftonline.com/${REACT_APP_AUTH_TENANT}/oauth2/v2.0/token
ENV REACT_APP_AUTH_ENDPOINT=https://login.microsoftonline.com/${REACT_APP_AUTH_TENANT}/oauth2/v2.0/authorize
ENV REACT_APP_LOGOUT_ENDPOINT=https://login.microsoftonline.com/${REACT_APP_AUTH_TENANT}/oauth2/logout
ENV REACT_APP_AUTH_REDIRECT_URI=$REDIRECT_URI
ENV REACT_APP_AUTH_SCOPE=$AUTH_SCOPE

WORKDIR /code/
COPY jest.config.base.js package.json yarn.lock jest.config.js tsconfig.json ./
COPY ./app ./app
COPY ./plugins ./plugins
RUN yarn install # --frozen-lockfile --production=false

FROM base as development
CMD ["yarn", "start"]
USER 1000

FROM base as prod
RUN npm install -g serve
RUN yarn build
WORKDIR /code/app
EXPOSE 3000
CMD ["serve", "--single", "build", "--listen", "3000"]
USER 1000