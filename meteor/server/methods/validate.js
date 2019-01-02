/**
 * Meteor method to validate an Alloy Model syntax
 * This will call the API (webService)
 * @param code the Alloy code to validate
 * @returns a JSON file with {success [, errorMessage, errorLocation]}
 */

import {
    HTTP
} from "meteor/http";
Meteor.methods({
    validate: function(code) {
        // return "Your code is" + code;
        let url = "http://localhost:8080/validate";
        console.log(JSON.stringify({
            model: code
        }));
        console.log(
            HTTP.call('POST',
                url, {
                    data: JSON.stringify({
                        model: code
                    }),
                },
                function(err, res) {
                    console.log(err);
                    console.log(res);
                })
        )
    }
});