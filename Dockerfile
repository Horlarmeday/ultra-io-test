FROM node:14-alpine as base

WORKDIR /app
COPY package*.json /
EXPOSE 4500

FROM base as production
ENV NODE_ENV=production
RUN yarn ci
COPY . /
CMD ["node", "start:prod"]

FROM base as dev
ENV NODE_ENV=development
RUN yarn install
COPY . /
CMD ["yarn", "start:dev"]

FROM base as test
ENV NODE_ENV=test
RUN yarn install
COPY . /
CMD ["yarn", "test:all"]