/**
 * An instance was generated from a command with ref to the model
 */

Instance = new Meteor.Collection('Instance');

Instance.attachSchema(new SimpleSchema({
    _id: {
        type: String
    },
    model_id: {
        type: String
    },
    command: { // name of the command that was executed to generate instance
        type: String
    },
    graph: { // the entire cytoscape graph
        type: Object,
        blackbox: true
    },
    theme: { // the theme associated with this instance
        type: Object,
        blackbox: true
    },
    time: {
        type: String
    }
}))

export { Instance };
