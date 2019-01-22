import {
    Model
} from '../../lib/collections/model'
import {
    Link
} from '../../lib/collections/link'
import {
    containsValidSecret
} from "../../lib/editor/text"

/**
 * Meteor method to get a model share URL
 * Stores the model specified in the function argument
 * @return The 'id' of the model link, used in Share Model option
 */
Meteor.methods({
    genURL: function(code, lastId) {
        // A Model is always created, regardless of having secrets or not
        let model = {
            code: code,
            time: new Date().toLocaleString()
        }
        // explicitly set optional to avoid nulls
        if (lastId) model.derivationOf = lastId
        // insert
        let modelId = Model.insert(model);

        //Generate the public link
        let publicLinkId = Link.insert({
            model_id: modelId,
            private: false
        });

        //Generate private link if SECRET is present
        let privateLinkId
        if (containsValidSecret(code)) {
            privateLinkId = Link.insert({
                model_id: modelId,
                private: true
            });
        }

        return {
            public: publicLinkId,
            private: privateLinkId, // will be undefined if no secret is present
            last_id: modelId
        }
    }
});