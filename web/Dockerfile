FROM node:12-alpine as base


ENV REACT_APP_AUTH=0
ENV REACT_APP_AUTH_CLIENT_ID=97a6b5bd-63fb-42c6-bb75-7e5de2394ba0
ENV REACT_APP_AUTH_TENANT=3aa4a235-b6e2-48d5-9195-7fcf05b459b0
ENV REACT_APP_TOKEN_ENDPOINT=https://login.microsoftonline.com/${REACT_APP_AUTH_TENANT}/oauth2/v2.0/token
ENV REACT_APP_AUTH_ENDPOINT=https://login.microsoftonline.com/${REACT_APP_AUTH_TENANT}/oauth2/v2.0/authorize
ENV REACT_APP_AUTH_REDIRECT_URI=http://localhost
ENV REACT_APP_AUTH_SCOPE=https://graph.microsoft.com/User.Read

WORKDIR /code/
COPY jest.config.base.js package.json yarn.lock jest.config.js tsconfig.json ./
COPY ./app ./app
COPY ./plugins ./plugins
RUN yarn install # --frozen-lockfile --production=false

FROM base as development
CMD ["yarn", "start"]

FROM base as prod
RUN npm install -g serve
RUN yarn build
WORKDIR /code/app
EXPOSE 3000
CMD ["serve", "--single", "build", "--listen", "3000"]