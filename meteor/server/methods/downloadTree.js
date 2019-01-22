import {
    Model
} from '../../lib/collections/model'

Meteor.methods({
    /**
     * Retrieves the information about the current node's descendants so as to 
     * produce the derivation tree, that task is done client-side
     * for efficiency purposes
     * @param {String} linkId the link used on the page
     */
    downloadTree: function(linkId) {
        let link = Link.findOne(linkId)
        if (!link) throw new Meteor.Error(404, "Link not found")
        if (!link.private) throw new Meteor.Error(403, "No permission to get this model's tree (only private link will work)")
        // get the starting node of the tree -> root
        let root = Model.findOne(link.model_id)
        if (!root) throw new Meteor.Error(404, "Model not found")

        // compilation of result will be done client-side
        return {
            descendants: Model.find({ // get all descendants (direct or not)
                original: root._id
            }).fetch(),
            root: root
        }
    }
});