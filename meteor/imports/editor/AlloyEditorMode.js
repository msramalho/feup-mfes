/**
 * This file specifies the syntax highlighting rules for the codemirror editor
 * each rule is composed by regex and token, which allows for css rules on the tokens
 * such as .cm.comment {...} and also to refer to those tokens after parsing the syntax
 * Additionaly "sol: true" attribute means that the match should happen only at line start
 */

import CodeMirror from 'codemirror';
import * as simpleMode from 'codemirror/addon/mode/simple'; //do not remove despite unused warning
export { defineAlloyMode };

function defineAlloyMode() {
    CodeMirror.defineSimpleMode('alloy', {
        start: [{
            regex: /(\W)(abstract|fun|all|iff|check|but|else|assert|extends|set|fact|implies|module|open|sig|and|disj|for|in|no|or|as|Int|pred|sum|exactly|iden|let|not|run|univ)(?:\b)/,
            token: [null, 'keyword'],
        }, {
            regex: /(abstract|fun|all|iff|check|but|else|assert|extends|set|fact|implies|module|open|sig|and|disj|for|in|no|or|as|Int|pred|sum|exactly|iden|let|not|run|univ)(?:\b)/,
            token: 'keyword',
            sol: true,
        }, {
            regex: /(\W)(one|lone|none|some)(?:\b)/,
            token: [null, 'atom'],
        }, {
            regex: /(one|lone|none|some)(?:\b)/,
            token: 'atom',
            sol: true,
        }, {
            regex: /^\/\/SECRET$/mg,
            token: 'secret',
            sol: true,
        }, {
            regex: /\/\*/,
            token: 'comment',
            next: 'comment', // Jump to comment mode.
        }, {
            regex: /(\+\+ )|=>|=<|->|>=|\|\||<:|:>/,
            token: 'operator',
        }, {
            // Line comment.
            regex: /\/\/.*/,
            token: 'comment',
        }, {
            regex: /(\s+|\||{|})[0-9]+](?:\b)/,
            token: [null, 'number'],
        }, {
            regex: /(\s+|\||{|})[0-9]+](?:\b)/,
            token: 'number',
            // Rule that only applies if the match is at the start of some line(workaround).
            sol: true,
        }, {
            regex: /[{(]/,
            indent: true,
        }, {
            regex: /[})]/,
            dedent: true,
        }],
        // Modes allow applying a different set of rules to different contexts.
        comment: [{
            // When the comment block end tag is found...
            regex: /.*?\*\//,
            token: 'comment',
            next: 'start', // ...go back to start mode.
        }, {
            regex: /.*/,
            token: 'comment',
        },

        ],
        // Simple Mode additional settings, check documentation for more information.
        meta: {
            // Prevent indentation inside comments.
            dontIndentStates: ['comment'],
            lineComment: '//',
        },
    });
}
