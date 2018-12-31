import assert from "assert";

describe("meteor_docker", function() {
    it("package.json has correct name", async function() {
        const {
            name
        } = await import("../package.json");
        assert.strictEqual(name, "meteor_docker");
    });

    if (Meteor.isClient) {
        it("client is not server", function() {
            assert.strictEqual(Meteor.isServer, false);
        });
    }

    if (Meteor.isServer) {
        it("server is not client", function() {
            assert.strictEqual(Meteor.isClient, false);
        });
        it("should access the API", function() {
            Meteor.setTimeout(function() {
                HTTP.call('GET', 'http://0.0.0.0:8080/greet', {
                    "options": "to set"
                }, function(_, response) {
                    console.log("API IS WORKING: " + response.content);
                });
            }, 5000)
        })
    }
});