FROM node:12-alpine as base
WORKDIR /code
RUN npm install -g serve
COPY package.json yarn.lock /code/
RUN yarn install --frozen-lockfile
ENV REACT_APP_AUTH=0
ENV REACT_APP_AUTH_CLIENT_ID=97a6b5bd-63fb-42c6-bb75-7e5de2394ba0
ENV REACT_APP_AUTH_TENANT=3aa4a235-b6e2-48d5-9195-7fcf05b459b0
COPY ./ /code/

FROM base as development
CMD ["yarn", "start"]

FROM base as prod
RUN yarn build
EXPOSE 3000
CMD ["serve", "--single", "build", "--listen", "3000"]
