/**
 * Meteor method to validate an Alloy Model syntax
 * This will call the API (webService)
 * @param code the Alloy code to validate
 * @returns a JSON file with {success [, errorMessage, errorLocation]}
 */
Meteor.methods({
    validate: function(code) {
        // return "Your code is" + code;
        let url = "http://localhost:8080/validate";

        HTTP.call('POST', url, {
            data: { model: code}
          }, (error, result) => {
              console.log(result);
            if (!error) {
              return true;
            }
          });
    }
});