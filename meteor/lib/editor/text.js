/**
 * File with utils function shared by both client and server
 * with regard to text parsing
 */

export {
    isParagraph,
    containsValidSecret,
    getCommands,
    getCommandsFromCode
}


/*Check if the model contains some valid 'secret'*/
function containsValidSecret(model) {
    return model.indexOf("\n//SECRET\n") != -1
}

/**
 * Check if word is a valid paragraph
 * @param word the word to check
 * @return true if valid paragraph, false otherwise
 */
function isParagraph(word) {
    let pattern_named = /^((one sig |sig |pred |fun |abstract sig )(\ )*[A-Za-z0-9]+)/m;
    let pattern_nnamed = /^((fact|assert|run|check)(\ )*[A-Za-z0-9]*)/m;
    if (word.match(pattern_named) == null && word.match(pattern_nnamed) == null) return false;
    return true;
}

/**
 * Function associated with 'text box' that parses command type paragraphs, to be used as data for the combobox.
 * @param {String} code with the code
 */
function getCommandsFromCode(code) {
    let pattern = /((\W|^)run(\{|(\[\n\r\s]+\{)|([\n\r\s]+([^{\n\r\s]*)))|((\W|^)check(\{|(\[\n\r\s]+\{)|([\n\r\s]+([^{\n\r\s]*)))))/g;
    let commands = [];
    let commandNumber = 1;

    // To avoid commands that are in comment, comments must be eliminated before parse
    code = code.replace(/\/\/(.*)(\n)/g, "");
    let matches = pattern.exec(code);

    while (matches != null) {
        if (matches[6]) commands.push(matches[6]);
        else if (matches[12]) commands.push(matches[12]);
        else if (matches[0].includes("run")) {
            commands.push("run$" + commandNumber);
        } else if (matches[0].includes("check")) {
            commands.push("check$" + commandNumber);
        } else console.log("Unreachable block of code.");
        commandNumber++;
        matches = pattern.exec(code);
    }
    return commands
}