# Report for MFES @ FEUP
This is a report of the tasks achieved, problems fixed, and ideas for future development of the Alloy4fun platform

## Changelog
Here are the overall changes that were performed on this project, these are iterative and show the overall progress of the work:

 * Fixed installation guide for old version (with Eclipse)
 * Java Web services that only run on Eclipse are no longer needed
 * Introducing Docker containers for each service (api + mongo + meteor) and a docker-compose file for orchestrating these services together
 * Setup of api to be REST instead of SOAP
 * Imported old meteor code into new instance
 * Fixed missing imports
 * Removed unused fonts
 * Improved Schema documentation
 * Removed unused html template for old homepage
 * Meta tags for <noscript> browsers informing browsers that javascript is required to run the app
 * Meta tags for open-graph (sharing links from alloy4fun in social networks will now display a rich preview, title and description)
 * Removed unused images
 * Implemented `/validate` endpoint to validate Alloy models (this is a stateless endpoint and requires only a String with the code)
 * Used the `/validate` endpoint to give good visual feedback to user about what might be wrong with a model (indicating error message at correct line)
 * Isolated important settings into `.env` file for production/deploy purposes
 * Setup the API endpoint to be configurable from the from `.env` file
 * Removed old _challengeMode_ files and functions
 * Removed unused css classes
 * Syntax highlighting for `//SECRET` and not for `//LOCKED`
 * Configured linter on a separate branch
 * Wrote some server tests and installed and configured package.json so that `npm test` would run them properly
 * Configured (without testing) continuous integration with Circle-CI but this will require repository owner to allow access of the circle-ci app
 * Copy to clipboard with correct number of buttons (used to be 1 button to copy 2 links...)
 * Copy to clipboard is working (was not working on original version)
 * Instead of querying the the api for each new instance a predefined (and configurable) number of instances is retrieved at once (currently 5). Old service had to iterate all previous instances to reach the desired one
 * Configured tests for client as well with chromedriver (only server tests before)
 * Found and fixed bug in command processing during execution.
 * A performance issue was detected (and partially fixed) with the library Cytoscape. The page gets slower and slower as new instances are rendered. There might be held references to old graphs preventing the garbage colector from cleaning the old instances (see `#Future Tasks`).
 * Projections are working as well as multiple instances loading
 * Although not fixed, we found a bug derived from the fact that the service uses cache (and is therefore not state-less) that means that there can be no projection on shared instances (because the instance is statically saved and the cache is session specific) (see `#Future Tasks`).
 * If the number of instances is smaller than the default, the buttons behaviour will handle it
 * Optional update: links do not disappear on model code change, this can be changed back by uncommenting line 42 of EditorInializer
 * Model executions were not increasing the tree structure (no derived models created), this bug has been fixed
 * getInstances creates a single model derived from the previous one (if not original)
 * Removes sat property from Instance Schema, given that only unsatisified instances are shareable (previous behaviour)
 * getInstances also saves sat if the execution led to a satisfiable model (no counter-examples found for the command) 
 * Only exposing single Model, instead of all of them...(performance issue fixed on publications)
 * TDD for secret separation from Prof. Alcino's function (found a bug in the regex and updated code a bit)
 * Extensive tests for critical function (to separate public from secret code)
 * Fixed security bug -> secrets only sent when private link is used
 * Model schema now contains "original" for the inception Model which remains the same even after many derivations, so as to conserve the original SECRETs. If a user shares a model a new original is always considered from then on, but the derivationOf property remains because there is no consequence of this except better data for data mining purposes. 
 * Even hidden commands are show to user, without loading secret code to frontend
 * getInstances evaluates code with secrets but registers model with secrets hidden (otherwise sharing would reveal secrets) this is made possible by the "original" property on the Model Schema
 * Continuous integration refactoring from Circle-CI to Travis-CI
 * Greatly simplified publications (single file and only necessary data)
 * Sharing instances is working with new db schema
 * HTML cleanup for editor with bootstrap (unnecessary classes and ids, structure, ...)
 * Dimplified contribution instructions and setup difficulty
 * README is ready to be official
 * Derivation tree implemented (tried with mongo aggregation but it seems unfeasable). Currently, all the descents are loaded and then the tree is created on client-side using a hashmap and DFS iteration.
 * Tests for the algorithm to generate the derivation tree
 * Implemented download of derivation tree for Data Mining  (name of files is `tree_LINKID_YYYY_MM_DD_HH_MM_SS`)
 * Improved user feedback on errors when invoking Meteor methods, using sweet alert to display verbose errors from server
 * Number of instances to load is configurable outside meteor in the Meteor settings variable (`.env` and `meteor/settings.json`) as `MAX_INSTANCES`
 * Database seeded with the examples from [excel list](https://docs.google.com/spreadsheets/d/1UdGxKZLYJvvGxItWf6C_nCRjDu4jwKPHW6HlisvdZgg/edit#gid=0) keeping the same public and private linkId, also this seed is done automatically on server startup if no Model is present
 * Updated UI for better UX
 * Mobile-friendly UI for buttons
 * Sticky footer

## Future Tasks
 * `run` and `check` both say "Counter-example found" when `run` should only be "instance found"
 * Improve SECRET separation to handle `//SECRET\n//comment\n/*other comment*/assert ...`
 * Continuous Deployment (if a server is given to us, we can handle this until the end of january)
 * Choose linter rules (it is ready but was not customized by Product Owner, see README)
 * After that, fixing linter errors (there are 600+, but they were 2000+ originally and some depend on rules chosen, which we did not feel confortable in doing)
 * Including [analytics](https://guide.meteor.com/deployment.html#analytics) might be a good addition to monitor platform usage, also see the [analytics for iron router](https://github.com/reywood/meteor-iron-router-ga) which is the Routes library being used. 
 * Ideas for scaling Alloy4fun:
    * Defining indexes for mongodb (requires good knowledge of mongo optimization)
    * Check [docker swarm](https://docs.docker.com/engine/swarm/) for horizontal scaling of api service
    * Good server for deployment
 * Did not change the following todos because they were not clear or not specified by the PO:
    * `// TODO: Allow choosing between multiple themes.`
    * `// TODO: This is broken. Must be fixed to permit block folding.`
    * `// TODO simular click na parte branca para limpar o checkBox`
 * Ternary relations in visualizer - this is possibly the only requested task not completed, but it was due to more critical problems that neeeded solving.
 * We also believe there should be more of "brand concept" for Alloy4fun, such as a logo with better quality.

## Conclusion
We believe the changes made to the alloy4fun platform represent a very drastic and necessary step towards an easier maintenance, deployment, development and for the overall future of the platform. We have greatly simplified the code and audited+documented many files and functions, especially the ones that are essential for the proper operation of Alloy4fun.

We also belive we have exceeded our expectations of produced work for the time given for the project, and are happy with the outcome.

 * _Context:_ 		   MFES 2018/2019 - FEUP
 * _Group:_			   Daniel Silva and Miguel Ramalho
 * _Teacher:_		   Professora Ana Paiva
 * _Product Owner:_	Professor Alcino Cunha
