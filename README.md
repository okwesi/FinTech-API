# FINTECH API

## Tech Stack
- TypeScript
- Node.js & Express
- Docker
- MySql 

## Documentation
- Run `yarn install` to install project dependencies
- Run `yarn dev` to start the server in development mode
- Run `yarn start` to start the server in production mode

  - You should be able to preview in the browser at `http://localhost:8000`
  - You should also be able to see doxs in the browser at `http://127.0.0.1:8080/api-docs`

## Run Locally
To run this project locally, make sure you have Docker running on your system.
- Create a `.env` file in the root directory and copy over the environment variables from `.env.example`.
	- Update the variables in the newly created `.env` file with their respective values.
- Run `yarn install` to install project dependencies, if you don't already have dependencies installed.
- Run `docker-compose up mongodb` to start the database server.`,
- Start the application with `yarn dev`

## Available Scripts
In the project directory, you can run:

### `yarn dev`
Runs the app in the development mode. The API will be available at [http://localhost:8080](http://localhost:8080)
