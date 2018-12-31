/**
 * Created by José Pereira on 2/7/2017.
 */

import CodeMirror from 'codemirror';
import * as simpleMode from 'codemirror/addon/mode/simple';
export {defineAlloyChallengeMode};

function defineAlloyChallengeMode() {
    //Defines syntax highlighting rules, allowing Code Mirror to support new languages, like Alloy.
    CodeMirror.defineSimpleMode("alloyChallenge", {
        start: [{
            regex: /(\W)(abstract|fun|all|iff|check|but|else|assert|extends|set|fact|implies|module|open|sig|and|disj|for|in|no|or|as|Int|pred|sum|exactly|iden|let|not|run|univ)(?:\b)/,
            //Token value refers to regex captured matching groups.
            token: [null, "keyword"]
        }, {
            //For some reason " ^ " doesn't work as supposed (line start). A workaround was necessary to correctly identify keywords on the beginning of the line.
            regex: /(abstract|fun|all|iff|check|but|else|assert|extends|set|fact|implies|module|open|sig|and|disj|for|in|no|or|as|Int|pred|sum|exactly|iden|let|not|run|univ)(?:\b)/,
            token: "keyword",
            //Rule that only applies if the match is at the start of some line(workaround).
            sol: true
        }, {
            regex: /(\W)(one|lone|none|some)(?:\b)/,
            token: [null, "atom"]
        }, {
            //For some reason " ^ " doesn't work as supposed (line start). A workaround was necessary to correctly identify atoms on the beginning of the line.
            regex: /(one|lone|none|some)(?:\b)/,
            token: "atom",
            //Rule that only applies if the match is at the start of some line(workaround).
            sol: true
        }, {
            regex: /\/\*/,
            token: "comment",
            //Jump to comment mode.
            next: "comment"
        }, {
            regex: /(\+\+ )|=>|=<|->|>=|\|\||<:|:>/,
            token: "operator"
        }, {
            //Line comment.
            regex: /\/\/.*/,
            token: "comment"
        }, {
            regex: /(\s+|\||{|})[0-9]+](?:\b)/,
            token: [null, "number"]
        }, {
            //For some reason " ^ " doesn't work as supposed (line start). A workaround was necessary to correctly identify numbers on the beginning of the line.
            regex: /(\s+|\||{|})[0-9]+](?:\b)/,
            token: "number",
            //Rule that only applies if the match is at the start of some line(workaround).
            sol: true
        }, {
            regex: /[{(]/,
            indent: true
        }, {
            regex: /[})]/,
            dedent: true
        }
        ],
        //Modes allow applying a different set of rules to different contexts.
        comment: [{
            //When the comment block end tag is found...
            regex: /.*?\*\//,
            token: "comment",
            //...go back to start mode.
            next: "start"
        }, {
            regex: /.*/,
            token: "comment"
        }

        ],
        //Simple Mode additional settings, check documentation for more information.
        meta: {
            //Prevent indentation inside comments.
            dontIndentStates: ["comment"],
            lineComment: "//"
        }
    });

    CodeMirror.defineSimpleMode("alloyChallenge", {
        start : [ {
            regex : /(\W)(abstract|fun|all|iff|check|but|else|assert|extends|set|fact|implies|module|open|sig|and|disj|for|in|no|or|as|Int|pred|sum|exactly|iden|let|not|run|univ)(?:\b)/,
            token : [null,"keyword"]
        },{
            //For some reason " ^ " doesn't work as supposed (line start). A workaround was necessary to correctly identify keywords on the beginning of the line.
            regex : /(abstract|fun|all|iff|check|but|else|assert|extends|set|fact|implies|module|open|sig|and|disj|for|in|no|or|as|Int|pred|sum|exactly|iden|let|not|run|univ)(?:\b)/,
            token : "keyword",
            sol: true
        }, {
            regex : /(\W)(one|lone|none|some)(?:\b)/,
            token :  [null,"atom"]
        },{
            //For some reason " ^ " doesn't work as supposed (line start). A workaround was necessary to correctly identify atoms on the beginning of the line.
            regex : /(one|lone|none|some)(?:\b)/,
            token : "atom",
            sol: true
        }, {
            regex : /\/\*/,
            token : "comment",
            //Jump to comment mode.
            next : "comment"
        },{
            regex : /\/\/START_SECRET.*/,
            token : "start-secret"
        },{
            regex : /\/\/END_SECRET.*/,
            token : "end-secret"
        },{
            regex : /\/\/(?!(START_LOCK|END_LOCK|START_SECRET|END_SECRET)).*/,
            token : "comment"
        },{
            regex : /(\+\+ )|=>|=<|->|>=|\|\||<:|:>/,
            token : "operator"
        },{
            regex : /\/\/.*/,
            token : "comment"
        }, {
            regex: /(\s+|\||{|})[0-9]+](?:\b)/,
            token: [null,"number"]
        },{
            //For some reason " ^ " doesn't work as supposed (line start). A workaround was necessary to correctly identify numbers on the beginning of the line.
            regex: /(\s+|\||{|})[0-9]+](?:\b)/,
            token: "number",
            sol: true
        }, {
            regex : /[{(]/,
            indent : true
        }, {
            regex : /[})]/,
            dedent : true
        }
        ],
        comment : [{
            regex : /.*?\*\//,
            token : "comment",
            //Go back to start mode after comment block is over.
            next : "start"
        }, {
            regex : /.*/,
            token : "comment"
        }

        ],
        meta : {
            //Prevent indentation inside comments.
            dontIndentStates: ["comment"],
            lineComment: "//"
        }
    });
}
