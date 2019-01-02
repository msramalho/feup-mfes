import {
    Meteor
} from 'meteor/meteor';

import '../server/methods/validate.js'

Meteor.startup(() => {
    // code to run on server at startup

    Todos = new Mongo.Collection('todos');
    console.log("MONGO IS ALIVE");

});