/**
 * Meteor method to get a model instance
 * This will call the API (webService)
 * @param model the Alloy code to validate
 * @param sessionId the id of the session
 * @param instanceNumber the index of the instance to retrieve
 * @param commandLabel (alloy commands [run, check, assert, ...])
 * @param forceInterpretation used to skip cache and force new model interpretation
 * @param cid link_id of the 'derivatedOf' model (original otherwise)
 * @param last_id
 * @returns Object with the instance data
 */
Meteor.methods({
    getInstance: function(model, sessionId, instanceNumber, commandLabel, forceInterpretation, cid, last_id) {

        //substituir todos os & por &amp; senao erro de parse do XML no servidor
        model = model.replace(/&/g, "&amp;");

        commandLabel = commandLabel.toString();
        /* Normal behaviour */
        var args = {
            model: model,
            sessionId: sessionId,
            instanceNumber: instanceNumber,
            commandLabel: commandLabel,
            forceInterpretation: forceInterpretation
        };
        try {
            var client = Soap.createClient(`${Meteor.settings.env.API_URL}/getInstances`);
            var result = client.getInstance(args);
        } catch (err) {
            if (err.error === 'soap-creation') {
                throw new Meteor.Error(500, "We're sorry! The service is currently unavailable. Please try again later.");
            } else if (err.error === 'soap-method') {
                throw new Meteor.Error(501, "We're sorry! The service is currently unavailable. Please try again later.");
            }
        }
        var resultObject = JSON.parse(result[Object.keys(result)[0]]);

        /* ----- Command Type search --------*/
        var commandType = "unknown";
        var command = "unknown";
        var commandNumber = 0;
        var control = false;

        if (commandLabel.includes("check")) {
            commandType = "check";
            control = true;
        } /*if the command have no label */
        if (commandLabel.includes("run")) {
            commandType = "run";
            control = true;
        }
        if (commandLabel.includes("assert")) {
            commandType = "assert";
            control = true;
        }
        if (commandType === "unknown") {
            commandType = getCommandType(model, commandLabel);
        } /*if the command have any label */

        /* ----- Store exec data --------*/
        if (instanceNumber == 0) {
            var derivatedOf = "Original";
            if (cid != "Original" && (link = Link.findOne({
                    _id: cid
                })) && !last_id) {
                derivatedOf = link.model_id;
            } else if (last_id) derivatedOf = last_id; /*Save model derivation */

            model_id = Model.insert({
                whole: model,
                derivationOf: derivatedOf,
                time: new Date().toLocaleString()
            });

            var sat = (result.unsat) ? false : true;
            if (control) command = commandType;
            else command = commandType + " " + commandLabel;
            var runID = Run.insert({
                sat: sat,
                model: model_id,
                command: command,
                time: new Date().toLocaleString()

            });
        }
        /* handle result*/
        if (resultObject.syntax_error) {
            throw new Meteor.Error(502, resultObject);
        } else {
            resultObject.number = instanceNumber;
            resultObject.commandType = commandType;
            resultObject.last_id = model_id;
            resultObject.runID = runID;
            return resultObject;
        }
    },
});

// Helper functions


/*From 'model' get the command type with the label specified on 'commandLabel'*/
function getCommandType(model, commandLabel) {
    var checkExp = RegExp("check(\ )+" + commandLabel, 'g');
    var assertExp = RegExp("assert(\ )+" + commandLabel, 'g');
    var runExp = RegExp("run(\ )+" + commandLabel, 'g');

    if (checkExp.test(model)) return "check";
    if (assertExp.test(model)) return "assert";
    if (runExp.test(model)) return "run";
    return "unknown";
}