/**
 * Meteor method to get a model's projection
 * This will call the API (webService)
 * @param sessionId id of the session
 * @param frameInfo object with information about the frame
 * @return JSON object with the projection
 */
Meteor.methods({
    getProjection: function(sessionId, frameInfo) {
        var args = {
            sessid: sessionId,
            type: []
        };
        for (var key in frameInfo) {
            args.type.push(key + frameInfo[key]);
        }
        try {
            var client = Soap.createClient(`${Meteor.settings.env.API_URL}/getProjection`);
            var result = client.getProjection(args);
        } catch (err) {
            if (err.error === 'soap-creation') {
                throw new Meteor.Error(500, "We're sorry! The service is currently unavailable. Please try again later.");
            } else if (err.error === 'soap-method') {
                throw new Meteor.Error(501, "TYPE=" + types + "-XXX");
            }
        }

        return JSON.parse(result[Object.keys(result)[0]]);
    }
});