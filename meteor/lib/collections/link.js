/**
 * Link merely links to Models.
 * When a challenge is created two links are provided: one public and another private.
 * This corresponds to two Link instances (with different _ids)
 * but both have the same model_id as they both point to same model.
 */
Link = new Meteor.Collection('Link');

Link.attachSchema(new SimpleSchema({
    _id: {
        type: String
    },
    private: { // whether this is a private or public link (shows SECRETs for private)
        type: Boolean
    },
    model_id: { // the id of the model associated
        type: String
    }
}))

Link.publicFields = {
    private: 1,
    model_id: 1
}

export {
    Link
};