import {
    Meteor
} from "meteor/meteor";
import {
    extractSecrets
} from "../lib/secrets"
import {
    getCommandsFromCode
} from "../../lib/editor/text";
/**
 * Receives a link (private or public) and returns the corresponding Model
 * with or without the SECRET code
 */
Meteor.methods({
    /**
     * retrieves the Link -> the Model -> extracts Secrets if necessary ->
     * extracts secret commands -> returns the model
     * @param {String} id
     */
    getModel: function(id) {
        return getModelFromLink(id) || getModelFromInstance(id)
    }
})

/**
 * retrieves the Link -> the Model -> extracts Secrets if necessary ->
 * extracts secret commands -> returns the model
 * @param {String} id
 */
function getModelFromLink(linkId) {
    let link = Link.findOne(linkId)
    if (!link) return //undefined if link does not exist
    let model = Model.findOne(link.model_id)
    let complete_model = model.code
    if (!link.private) model.code = extractSecrets(model.code).public
    model.from_private = link.private // return info about the used link type
    model.commands = getCommandsFromCode(complete_model)
    model.model_id = model._id // this is necessary because publish is for the linkId
    return model
}

/**
 * Does not have to clean SECRETS as share instance sends the code as-is
 * @param {String} instanceId the potential instance id
 */
function getModelFromInstance(instanceId) {
    let instance = Instance.findOne(instanceId)
    if (!instance) return //undefined if instance does not exist
    let model = Model.findOne(instance.model_id)
    model.instance = instance // so that frontend can access the instance
    model.from_private = false // so as to load the secrets from original on execute
    model.commands = getCommandsFromCode(model.code)
    model.model_id = model._id // this is necessary because publish is for the linkId
    return model
}