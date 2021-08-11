FROM node:12-alpine as base

ENV REACT_APP_AUTH=0
ENV REACT_APP_AUTH_CLIENT_ID=dmt-client
ENV REACT_APP_AUTH_TENANT=3aa4a235-b6e2-48d5-9195-7fcf05b459b0
ENV REACT_APP_TOKEN_ENDPOINT=http://localhost:8080/auth/realms/MyDemo/protocol/openid-connect/token
ENV REACT_APP_AUTH_ENDPOINT=http://localhost:8080/auth/realms/MyDemo/protocol/openid-connect/auth

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