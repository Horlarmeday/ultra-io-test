# Ultra.io Challenge

  <p align="center"></p>
    <p align="center">
        <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
        <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
    </p>
 
## Description

Ultra.io coding exercise
## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

#### Docker (recommended)
For docker, run the following commands
##### development
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
```
##### test (integration)
```bash
docker-compose -f docker-compose.yml -f docker-compose.integration.yml up --abort-on-container-exit
```
##### production
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --abort-on-container-exit
```

## License

[MIT licensed](LICENSE).
