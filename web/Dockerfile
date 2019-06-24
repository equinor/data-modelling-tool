FROM node:12-alpine as base
RUN npm install -g serve
WORKDIR /code
COPY package.json yarn.lock /code/
RUN yarn install
COPY ./ /code/

FROM base as dev
CMD ["yarn", "start"]

FROM base as test
ENV CI=true
RUN yarn test --ci --color --coverage
RUN yarn audit

FROM base as prod
EXPOSE 80
RUN yarn build
CMD ["serve", "--single", "build", "--listen", "80"]
