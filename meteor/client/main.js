import {
    Meteor
} from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on client at startup

    Todos = new Mongo.Collection('todos');
    console.log("MONGO IS ALIVE CLIENT");

});