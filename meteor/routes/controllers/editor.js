import {
    Model
} from "../../lib/collections/model"

/**
 * This is used to retrieve data when the Route contains a link /:_id
 */
editor = RouteController.extend({
    template: 'alloyEditor',

    // see http://iron-meteor.github.io/iron-router/#subscriptions
    subscriptions: function() {
        this.subscribe('modelFromLink', this.params._id).wait()
    },

    // see http://iron-meteor.github.io/iron-router/#the-waiton-option
    waitOn: function() {},

    data: function() {
        return Model.findOne(this.params._id) || {
            code: "Unable to retrieve Model from Link"
        }
    },

    onRun() {
        this.next();
    },
    onRerun() {
        this.next();
    },
    onBeforeAction() {
        this.next();
    },
    action() {
        this.render();
    },
    onAfterAction() {},
    onStop() {},
});