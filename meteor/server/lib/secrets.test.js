import {
    chai,
    assert
} from 'meteor/practicalmeteor:chai';
import {
    extractSecrets
} from "./secrets"

/**
 * Default meteor tests for programming principles to be forced
 */
describe("extracting secrets method", function() {
    let code, res
    it("returns empty public and secret", function() {
        code = ``
        res = extractSecrets(code)
        chai.assert.equal(res.public, "")
        chai.assert.equal(res.secret, "")
    });
    it("returns empty secret and correct public", function() {
        code = `sig A {}`
        res = extractSecrets(code)
        chai.assert.equal(res.secret, "")
        chai.assert.equal(res.public, code)

        code = `
sig A {}
pred checkStuff{

}`
        res = extractSecrets(code)
        chai.assert.equal(res.public, code)
        chai.assert.equal(res.secret, "")
    });
    it("returns empty public and correct secret", function() {
        code = `
//SECRET
sig A {}`
        res = extractSecrets(code)
        chai.assert.equal(res.public, "\n")
        chai.assert.equal(res.secret, code.substr(1))

        code = `
//SECRET
sig A {}
//SECRET
pred checkStuff{

}`
        res = extractSecrets(code)
        chai.assert.equal(res.public, "\n")
        chai.assert.equal(res.secret, code.substr(1))
    });
    it("returns correct public and secret", function() {
        let public_code = `
sig Employee{}

sig Department{}
one sig Company {
	isDirectorOf: Employee -> Department
}

//write a prediate Quizz to check that
fact Quizz {
	// In a company, each department has exactly one director (chosen among 
	// the company's employees), but each employee can only be the director 
	// of at most one department
		all d: Department | one  Company.isDirectorOf.d
	all e: Employee   | lone Company.isDirectorOf[e]
}`
        let private = `//SECRET
assert validQuizz {
		all d: Department | one  Company.isDirectorOf.d 
	all e: Employee   | lone Company.isDirectorOf[e]
}

//SECRET
check validQuizz for 5`
        code = public_code + private
        res = extractSecrets(code)
        chai.assert.equal(res.public, public_code)
        chai.assert.equal(res.secret, private)
    });
});