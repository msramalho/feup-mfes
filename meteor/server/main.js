import {
    Meteor
} from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup

    Todos = new Mongo.Collection('todos');
    console.log("MONGO IS ALIVE");

    Meteor.setTimeout(function() {
        HTTP.call('GET', 'http://0.0.0.0:8080/greet', {
            "options": "to set"
        }, function(_, response) {
            console.log("API IS WORKING: " + response.content);
        });
    }, 5000)
});