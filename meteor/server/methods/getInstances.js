import {
    extractSecrets
} from "../lib/secrets"
/**
 * Meteor method to get a model instance
 * This will call the API (webService)
 * @param code the Alloy code to validate
 * @param instanceNumber the index of the instance to retrieve
 * @param commandLabel (alloy commands [run, check, assert, ...])
 * @param last_id the model this one derives from
 * @param from_private false means it was loaded from public link and must retrieve //SECRET code
 * @returns Object with the instance data
 */
Meteor.methods({
    getInstances: function(code, commandLabel, last_id, original, from_private) {
        return new Promise((resolve, reject) => {
            let code_with_secrets = code
            if (from_private === false) { //if public link was used, load secrets
                //load original model, extract secrets and append to code
                code_with_secrets = code + extractSecrets(Model.findOne(original).code).secret
            }

            // call webservice to get instances
            HTTP.call('POST', `${Meteor.settings.env.API_URL}/getInstances`, {
                data: {
                    model: code_with_secrets,
                    numberOfInstances: Meteor.settings.env.MAX_INSTANCES,
                    commandLabel: commandLabel
                }
            }, (error, result) => {
                if (error) reject(error)

                // handle result (unsat vs sat)
                let content = JSON.parse(result.content);
                if (content.unsat) { // no counter-examples found
                    content.commandType = "check";
                } else { // counter-examples found
                    Object.keys(content).forEach(k => {
                        content[k].commandType = "check";
                    });
                }

                // save executed model to database
                let new_model = {
                    code: code, // should not be code_with_secrets
                    command: commandLabel,
                    sat: !!content.unsat, // sat means there was no counter-example (!! is for bool)
                    time: new Date().toLocaleString()
                }
                // optional params explictly to avoid_idnull
                if (last_id) new_model.derivationOf = last_id
                if (original) new_model.original = original
                // insert
                let model_id = Model.insert(new_model);

                // resolve the promise
                resolve({
                    instances: content,
                    last_id: model_id
                });
            });
        })
    }
});