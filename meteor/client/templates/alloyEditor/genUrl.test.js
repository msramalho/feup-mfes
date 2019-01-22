import {
    chai
} from 'meteor/practicalmeteor:chai';
import {
    containsValidSecretWithAnonymousCommand
} from "./genUrl"

describe("gen url submethods work", function() {
    it("identifies anonymous methods", function() {
        chai.assert.isFalse(containsValidSecretWithAnonymousCommand("//SECRET\ncheck test{}"))
        chai.assert.isTrue(containsValidSecretWithAnonymousCommand("//SECRET\ncheck{}"))
    });
});