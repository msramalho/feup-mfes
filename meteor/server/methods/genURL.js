/**
 * Meteor method to get a model share URL
 * Stores the model specified in the function argument
 * @return The 'id' of the model link, used in Share Model option
 */
Meteor.methods({
    genURL: function(model, current_id, only_one_link, last_id) {

        var modeldOf = "Original";

        // TODO: figure out what this means: "Aqui é que tenho que trabalhar, nesta condição"
        if (current_id != "Original" && !(Link.findOne({
                _id: current_id
            }))) {
            if (instance = Instance.findOne({
                    _id: current_id
                })) {
                var aux = instance.run_id;
                var run = Run.findOne({
                    _id: aux
                });
                modeldOf = run.model;
            }
        }
        if (current_id != "Original" && !last_id && (modeldOf == "Original")) { /* if its not an original model */

            var link = Link.findOne({
                _id: current_id
            });
            modeldOf = link.model_id;
        } else if (last_id && !(containsValidSecret(model) && !only_one_link) && (modeldOf == "Original")) modeldOf = last_id;

        var newModel_id = Model.insert({ /*A Model is always created, regardless of having secrets or not */
            whole: model,
            derivationOf: modeldOf,
            time: new Date().toLocaleString()
        });

        var public_link_id = Link.insert({ /*A public link is always created as well*/
            model_id: newModel_id,
            private: false
        });

        var result;

        if ((containsValidSecret(model) && !only_one_link)) { /* assert result and returns*/

            var private_link_id = Link.insert({
                model_id: newModel_id,
                private: true
            });
            var result = {
                public: public_link_id,
                private: private_link_id,
                last_id: newModel_id
            }
        } else {
            result = {
                public: public_link_id,
                //  last_id : newModel_id
            }
        }

        return result;
    }
});


// Helper functions


function findClosingBracketMatchIndex(str, pos) {
    if (str[pos] != '{') {
        throw new Error("No '{' at index " + pos);
    }
    var depth = 1;
    for (var i = pos + 1; i < str.length; i++) {
        switch (str[i]) {
            case '{':
                depth++;
                break;
            case '}':
                if (--depth == 0) {
                    return i;
                }
                break;
        }
    }
    return -1; // No matching closing parenthesis
}

/*Check if the model contains some valid 'secret'*/
function containsValidSecret(model) {

    var i, j, lastSecret = 0;
    var paragraph = "";
    while ((i = model.indexOf("//SECRET\n", lastSecret)) >= 0) {
        for (var z = i + ("//SECRET\n".length);
            (z < model.length && model[z] != '{'); z++) {
            paragraph = paragraph + model[z];
        }
        if (!isParagraph(paragraph)) {
            paragraph = "";
            lastSecret = i + 1;
            continue;
        }
        if (findClosingBracketMatchIndex(model, z) != -1) {
            return true;
        }
        lastSecret = i + 1;
    }
    return false;
}

/*Function that returns true if the word it's a valid paragraph, returns false otherwise*/
function isParagraph(word) {
    var pattern_named = /^((one sig |sig |pred |fun |abstract sig )(\ )*[A-Za-z0-9]+)/;
    var pattern_nnamed = /^((fact|assert|run|check)(\ )*[A-Za-z0-9]*)/;
    if (word.match(pattern_named) == null && word.match(pattern_nnamed) == null) return false;
    else return true;
}