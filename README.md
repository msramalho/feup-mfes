Currently running at http://alloy4fun.di.uminho.pt

Docker contains meteor (without hot code), mongodb, and java container

Magic command: `docker-compose up -d` (meteor available at localhost:3010 and api at localhost:8080)

## API
Since the api is essentially an Alloy4fun webservice a local jar file is used for stability purposes the lib folder structure is required for maven to detect the local repository. 

To run the **api** isolated do `cd api` and then `docker build -t alloy4fun-api . && docker run -p 8080:8080 alloy4fun-api` for now it can be accessed from [http://localhost:8080/greet](http://localhost:8080/greet)

Otherwise, it will be available at [http://localhost:8081/validate](http://localhost:8081/validate)
### Database
The database is saved to a volume in `data/db/`

## Meteor
To run meteor locally using docker's persistent mongodb do `docker-compose up -d` and then `MONGO_URL=mongodb://localhost:27017 meteor`, this has been isolated to npm, so `npm start` also works.

[settings.json](settings.json) is not working as expected for defining `MONGO_URL` with `meteor --setings settings.json`

[Unofficial meteor FAQs](https://github.com/oortcloud/unofficial-meteor-faq)

To build a single container in docker-compose do: `docker-compose build meteor` (or other container name)

To run with hot code (outside docker): `cd meteor/ && npm start` (This will run meteor in localhost:3000)

## Development
The easiest way to deploy is to run meteor locally and the service and database in docker (if a lot of changes have to be made to the service, you can updated it as well)