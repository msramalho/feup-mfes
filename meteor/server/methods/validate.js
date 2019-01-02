/**
 * Meteor method to validate an Alloy Model syntax
 * This will call the API (webService)
 * @param code the Alloy code to validate
 * @returns a JSON file with {success [, errorMessage, errorLocation]}
 */
Meteor.methods({
    validate: function(code) {
		return new Promise((resolve, reject) => {
			HTTP.call('POST', `${Meteor.settings.env.API_URL}/validate`, {
				data: {
					model: code
				}
			}, (error, result) => {
				if (error) reject(error)
				resolve(result.content)
			});	
		})
    }
});