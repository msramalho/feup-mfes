export {
    extractSecrets
}

/**
 * Given the code of a model, with //SECRET paragrahs, split them into public and private code
 * @param {String} code the complete code
 */
function extractSecrets(code) {
    let secret = "",
        public_code = "";
    let s, i;
    while (s = code.match(RegExp(/(?:\/\*(?:.|\n)*?\*\/|(\/\/SECRET\s*?\n\s*(?:(?:(?:abstract|one|lone|some)\s+)*sig|fact|assert|check|fun|pred|run)(?:.*|\n)*?)(?:\/\/SECRET\s*?\n\s*)?(?:(?:(?:one|abstract|lone|some)\s+)*sig|fact|assert|check|fun|pred|run|$))/))) {
        if (s[0].match(/^\/\*(?:.|\n)*?\*\/$/)) {
            i = code.indexOf(s[0]);
            public_code += code.substr(0, i + s[0].length);
            code = code.substr(i + s[0].length);
        } else {
            i = code.indexOf(s[0]);
            public_code += code.substr(0, i);
            secret += s[1];
            code = code.substr(i + s[1].length);
        }
    }
    public_code += code;
    return {
        public: public_code,
        secret: secret
    };
}