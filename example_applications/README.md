# Example Applications

These applications exercise the library from very basic to complex.

## The Basics

These forms are meant to provide simple configuration-based test
suites for the framework.

### Simple RecordSet

The most basic example.  Some lists, etc. for Book and Author
records.

http://localhost:9090/simple_entity/dist/index.html

### How to run example app for developers (Docker)

#### Retold Harness
- Install `retold-harness` separately
- From `retold-harness` do `npm i`
- Run `npm run docker-dev-build`
- Run `npm run docker-dev-run`

#### In this repository
- Run `npm i`
- Run `npm run build`
- Go to `./example_applications`
- Run `npm i`
- Go to `./example_applications/simple_entity`
- Run `npm i`
- Run `npm run build`
- Go to `./example_applications`
- Run `npm run start`
- Go to a browser at: `http://localhost:9090/simple_entity/dist/index.html`

_NOTE: Making changes to the libraray only, just need to rebuild the base, but if altering the simple entity example app, you will need to rebuild in there as well._