/**
 * Meteor method to get a model's projection
 * This will call the API (webService)
 * @param sessionId id of the session
 * @param frameInfo object with information about the frame
 * @return JSON object with the projection
 */
Meteor.methods({
    getProjection: function(uuid, frameInfo) {
        let type = [];
        for (var key in frameInfo) {
            type.push(key + frameInfo[key]);
        };
        return new Promise((resolve, reject) => {
            HTTP.call('POST', `${Meteor.settings.env.API_URL}/getProjection`, {
                data: {
                    uuid: uuid,
                    type: type
                }
            }, (error, result) => {
                if (error) reject(error)
                let content = JSON.parse(result.content)
                if (content.unsat) {
                    content.commandType = "check";
                } else {
                    Object.keys(content).forEach(k => {
                        content[k].commandType = "check";
                    });
                }
                resolve(content);

            });
        })
    }
});
