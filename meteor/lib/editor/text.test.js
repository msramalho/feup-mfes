import {
    chai,
    assert
} from 'meteor/practicalmeteor:chai';
import {
    isParagraph,
    containsValidSecret,
    getCommandsFromCode
} from "./text"
/**
 * Default meteor tests for programming principles to be forced
 */
describe("editor text util functions", function() {
    it("identifies invalid paragraphs", function() {
        chai.assert.isFalse(isParagraph("one sig"))
        chai.assert.isFalse(isParagraph("lol one sig A"))
    });
    it("identifies valid paragraphs", function() {
        chai.assert.isTrue(isParagraph("one sig A"))
        chai.assert.isTrue(isParagraph("pred X {}"))
    });
    it("identifies invalid secrets", function() {
        chai.assert.isFalse(containsValidSecret("something"))
        chai.assert.isFalse(containsValidSecret("something/SECRET"))
        chai.assert.isFalse(containsValidSecret("something//SECRET\n"))
    });
    it("identifies valid secrets", function() {
        chai.assert.isTrue(containsValidSecret("something\n//SECRET\nthis is the secret"))
        chai.assert.isTrue(containsValidSecret("\n//SECRET\nthis is the secret"))
    });
    it("identifies correct commands in code", function() {
        let code = `
// run shouldNotDetect { no d: Dir | d in d.^contents }
// check shouldNotDetect2 { no d: Dir | d in d.^contents }
run run1 for 5
run run2
run run3 {}
check check1 for 5
check check2
`
        chai.assert.sameMembers(getCommandsFromCode(code), ["run1", "run2", "run3", "check1", "check2"])
    });
});
