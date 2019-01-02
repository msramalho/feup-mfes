/**
 * Meteor method to store a model instance with the user-defined theme
 * Used in Share Instance option
 * Creates an instance that points to the run/execution
 * Saves the theme and the instance itself
 * @param runID id of the execution
 * @param themeData information about the theme used
 * @param instance object with information about the frame
 * @return url to make possible share the instance
 */
Meteor.methods({
    storeInstance: function(runID, themeData, instance) {
        var instanceID = Instance.insert({
            run_id: runID,
            graph: instance,
            theme: themeData,
            date: new Date().toLocaleString()
        });
        return instanceID;
    }
});