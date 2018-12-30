Docker contains meteor (without hot code), mongodb, and java container

To run meteor locally using docker's persistent mongodb do `docker-compose up -d` and then `MONGO_URL=mongodb://localhost:27017 meteor`, this has been isolated to npm, so `npm start` also works.

[settings.json](settings.json) is not working as expected for defining `MONGO_URL` with `meteor --setings settings.json`

To run the **api** isolated do `cd api` and then `docker build -t alloy4fun-api . && docker run -p 8080:8080 alloy4fun-api` for now it can be accessed from [http://0.0.0.0:8080/greet](http://0.0.0.0:8080/greet)

[Unofficial meteor FAQs](https://github.com/oortcloud/unofficial-meteor-faq)

To build a single container in docker-compose do: `docker-compose build meteor` (or other container name)


Folder structure
```
lib/                       # <- any common code for client/server.
lib/environment.js         # <- general configuration
lib/methods.js             # <- Meteor.method definitions
lib/external               # <- common code from someone else
## Note that js files in lib folders are loaded before other js files.

models/                    # <- definitions of collections and methods on them (could be collections/)

client/lib                 # <- client specific libraries (also loaded first)
client/lib/environment.js  # <- configuration of any client side packages
client/lib/helpers         # <- any helpers (handlebars or otherwise) that are used often in view files

client/application.js      # <- subscriptions, basic Meteor.startup code.
client/index.html          # <- toplevel html
client/index.js            # <- and its JS
client/views/<page>.html   # <- the templates specific to a single page
client/views/<page>.js     # <- and the JS to hook it up
client/views/<type>/       # <- if you find you have a lot of views of the same object type
client/stylesheets/        # <- css / styl / less files

server/publications.js     # <- Meteor.publish definitions
server/lib/environment.js  # <- configuration of server side packages

public/                    # <- static files, such as images, that are served directly.

tests/                     # <- unit test files (won't be loaded on client or server)
```


## API
Since the api is essentially an Alloy4fun webservice a local jar file is used for stability purposes the lib folder structure is required for maven to detect the local repository. 