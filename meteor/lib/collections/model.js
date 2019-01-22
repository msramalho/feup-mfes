/**
 * Models created through the editor feature.
 * An Alloy model, with the code
 */

Model = new Meteor.Collection('Model');

Model.attachSchema(new SimpleSchema({
    _id: {
        type: String
    },
    code: { // has all of the code
        type: String
    },
    derivationOf: { // which model does it derive from (null if original)
        type: String,
        optional: true
    },
    /**
     * which model does it originally derive from
     * different from derivation, as this is the original model
     * and remains the same after derivation to preserve the
     * original SECRETs
     * if a user shares a model it is considered the new original
     * and all the previous secrets are forgotten
     */
    original: {
        type: String,
        optional: true
    },
    /**
     * optional field for the command selected when model was created.
     * genUrl will not set command
     * execute will set the command
     */
    command: {
        type: String,
        optional: true
    },
    sat: { // was the command satisfied?
        type: Boolean,
        optional: true
    },
    time: {
        type: String,
    },
}));

Model.publicFields = {
    code: 1,
    derivationOf: 1
}
export {
    Model
};