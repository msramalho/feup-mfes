<h1 align="center"><img src="/meteor/public/favicon.ico" height="24"> Alloy4fun</h1>

Web application for editing, sharing and interpreting [Alloy](http://alloytools.org/) models in your browser, in real time.

<a href="https://travis-ci.org/msramalho/feup-mfes"><img align="right" alt="Build Status" src="https://travis-ci.org/msramalho/feup-mfes.svg?branch=master"/></a>

**LIVE DEMO:** http://alloy4fun.di.uminho.pt.

**ABOUT:** Alloy4Fun is being developed using:
 * [Meteor](https://www.meteor.com/) framework which is a full-stack JavaScript platform for developing modern web and mobile applications.
 * [Docker](https://www.docker.com/) is used to ensure a simple and ubiquitous development environment.
 * [Travis CI](https://travis-ci.org/) is used for continuous integration through the [.travis.yml](.travis.yml) file.

# Contributing and Development Guidelines
You can contribute by looking at the [issues](issues/) section.

**INFO:** The application contains three main services/containers:
 1. `api` - where a Java web service is used to interact with the [alloytools API](http://alloytools.org/documentation.html)
 1. `mongo` - the instance of [mongodb](https://www.mongodb.com/) that has data persistance outside docker
 1. `meteor` - the webapp that interacts with the other services

**SETUP:** To start the application in your development environment:
1. Install docker, npm, ...
1. clone the repo
1. `cp .env.example .env` and edit it if necessary
1. `docker-compose up` (pass `-d` for detached mode)


**READY:** You can now:
 * visit the application at [localhost:3010](http://localhost:3010)
 * access the database with a mongo client such as [Robo3T](https://robomongo.org/) at [localhost:27017](mongodb://localhost/27017)
 * use the webservice available at [localhost:8081](http://localhost:8081)


## Meteor Development with real-time updates
Since the meteor instance running inside docker is statick and has to be built everytime a change is made (`docker-compose build meteor`), it is not very good for development. 

To have real-time updates while you develop meteor you can run it on your computer (after `cd meteor`) with `npm start`.


## API
Since the api is essentially an Alloy4fun webservice a local jar file is used for stability purposes the lib folder structure is required for maven to detect the local repository. 

To run the **api** isolated do `cd api` and then `docker build -t alloy4fun-api . && docker run -p 8080:8080 alloy4fun-api` for now it can be accessed at [http://localhost:8080/](http://localhost:8080/)

You can also run it **outside docker**, just take a look at its [Dockerfile](api/Dockerfile), essentially you need:
 1. `mvn clean install`
 1. `java -Djava.net.preferIPv4Stack=true -jar /home/target/alloy4fun-api-swarm.jar`

## Database
The database is saved to a volume in `data/db/` and backups can be made by copying this folder elsewhere. 

## Meteor
Meteor will run locally on port **3000** and on port **3010** in docker so that there is no interference between both instances.

# Testing
Unit tests are enabled on both client and server code, with the appropriate chromedriver packages needed for integration and acceptance tests. 

To run the tests just do `npm test`

## Linter
Linter is also installed and configured but not included in the CI pipeline, to run the linter you can do `npm run lint` inside the `meteor` folder. To run linter without the `--fix` option do `eslint .`.

To include the linter in the CI pipeline (first make sure all linter errors are fixed) and then add the following to the [package.json](meteor/package.json) `scripts`: `"pretest": "npm run lint --silent"`

## Team
Alloy4fun has been developed by:
 * [Haslab](https://github.com/haslab)
 * [Universidade do Minho](https://www.uminho.pt/)
 * [Universidade do Porto](https://fe.up.pt/)
