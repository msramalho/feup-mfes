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
        console.log(
            HTTP.call('POST', url, {
                param: JSON.stringify({
                    model: code
                })
            }, function(err, res){
				console.log(err);
				console.log(res);
			})
        )
    }
});