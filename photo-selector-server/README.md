# README #
This README document will provide steps to get this application up and running.

## Project Requirements ##
- `NodeJs 14.16.1 or higher`
- `Npm latest version`
- `MongoDB latest version`
- `Redis client latest version`

## Project Setup Steps ##

### - Common steps ###
*** NOTE : For this test, no need to follow these steps.

- `Create .json file with node environment name (development.json) in below directories`
  - `src/v1/config/env/`
    - `Copy relavant ` sample_* ` file data into *.json` ( * By default sample_docker file content has copied to development.json file )
  - `src/config/env/`
    - `Copy` sample `to *.json`

### - Setup in Locally ###

- `If you have not installed NodeJs in your pc, go to this link and follow the instructions` [https://nodejs.org/en/download/releases/](https://nodejs.org/en/download/releases/)
  - `If you do have Nodejs installed,`
    - `Check the version. We are using v14.16.1. If your version is not matching, upgrade your node version.`
    - `Or try to use this module.` [http://nvm.sh](http://nvm.sh)
- `Create .env file in root directory`
  - `To run the project in local >> copy` local_env `to .env`
- `Create .json file with node environment name (development.json) in below directories`
  - `src/v1/config/env/`
    - `Copy` sample_local `to above *.json file.`
- `Run 'npm install' or 'npm i'.` (within the directory)
- `To start the project;`
  - `In local >> type the command in terminal 'npm start' or 'npm run dev'`
- `By default, the server will start on port 5000.`
- `To access swagger documentation open` [http://localhost:5000/v1/api-docs/](http://localhost:5000/v1/api-docs/)

### - Setup in Docker ###

- `Create .env file in root directory`
  - `To run the project in docker >> copy` docker_env `to .env`
- `Create .json file with node environment name (development.json) in below directories`
  - `src/v1/config/env/`
    - `Copy` sample_docker `to above *.json file.`
- `To start the project:`
  - `In docker >> type the command in terminal 'docker-compose up'`

## Run tests ##

- `Run 'npm run test'` (within the root directory)

## Configurations ##

- Database configurations in `./config/database.js.`
- Swagger configuration in `./config/swagger.js.`

## Files ##

- `.env` > for environment variables

## Docker ##

- Containers :
  - Nodejs server :
    - container name  = `nodejs_server`
    - port            = `5000`
  - MongoDB :
    - container name  = `mongo`
    - port            = `27017`

## Third-party libraries and usage ##

#### Dependencies ####

* `body-parser`         - Node.js body parsing middleware
* `dotenv`              - Loads environment variables from a . env file into process. env
* `module-alias`        - Create aliases of directories and register custom module paths
* `mongoose`            - Mongodb schema solution
* `swagger-jsdoc`       - Generates swagger doc based on JSDoc
* `swagger-ui-express`  - Auto-generated swagger-ui

#### Dev-Dependencies ####

* `babel-eslint`  - Linting utility
* `eslint`        - Linting utility
* `nodemon`       - Automatically restarting the node application when file changes
* `jest`          - Unit testing
* `supertest`     - Unit testing

#### TODO ####
* `Unit tests`

#### Areas can improve ####
* `Typescript integration`