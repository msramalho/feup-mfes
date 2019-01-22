import {Instance} from "../../lib/collections/instance"
/**
 * Meteor method to store a model instance with the user-defined theme
 * Used in Share Instance option
 * Creates an instance that points to the model
 * Saves the theme in the instance itself
 */
Meteor.methods({
    /**
     * Saves the instance and returns the id
     * @param {String} modelId the model id
     * @param {String} command the name of the command that was executed
     * @param {String} instance the JSON string of the cytoscape graph
     * @param {Object} themeData with the theme information for cytoscape
     * @return id of the new instance
     */
    storeInstance: function(modelId, command, instance, themeData) {
        return Instance.insert({
            model_id: modelId,
            command: command,
            graph: instance,
            theme: themeData,
            time: new Date().toLocaleString()
        });
    }
});
