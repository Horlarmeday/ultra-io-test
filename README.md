# Ultra.io Challenge

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
docker-compose -f docker-compose.yml -f docker-compose.integration.yml up --abort-on-container-exit --exit-code-from test
```
##### production
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --abort-on-container-exit
```

## Features
The features of this project include the following.

- Create, fetch, delete and update games
- Fetch a publisher data via games API
- Process that automatically remove games having a release date older than 18
  months and then apply a discount of 20% to all games having a release date between 12 and 18 months

## Documentation
The API documentation for testing the endpoints is located <a href="https://documenter.getpostman.com/view/9548350/UzBjso6p">here</a>

## License

[MIT licensed](LICENSE).
