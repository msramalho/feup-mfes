/**
 * Created by josep on 10/02/2016.
 */


editorLoadController = RouteController.extend({

    template : 'alloyEditor',

    subscriptions: function () {
        //Model collection
        this.subscribe('editorLoad').wait();

        //Instance collection: for shareInstance
        this.subscribe('instanceLoad', this.params._id).wait();

        //Run collection: to retrieve the Model when in Share Instance
        this.subscribe('runLoad').wait();

        //Link Collection
        this.subscribe('links', this.params._id).wait();
    },

    // Subscriptions or other things we want to "wait" on. This also
    // automatically uses the loading hook. That's the only difference between
    // this option and the subscriptions option above.
    // return Meteor.subscribe('post', this.params._id);

    waitOn: function () {
    },

    data: function () {
        var priv = false;
        var link = Link.findOne({_id: this.params._id});
        var model;
        var secrets = "";
        var instance;

        var model_id;
        var isPrivate;


        if (link) {  //from share Model
            isPrivate=link.private;
            model_id = link.model_id;
        }

        else{  //not from share Model
            isPrivate=false;
            instance=Instance.findOne({_id: this.params._id});

            if(instance){ //from share Instance
                run_id = instance.run_id;
                run = Run.findOne({_id:run_id});
                model_id = run.model;
            }
        }

        var themes = Theme.find({modelId : this.params._id}).fetch();
        /*------- SECRETs and LOCKS handler ---------- for ShareInstance and shareModel*/
        if (model_id){
            model = Model.findOne({_id: model_id});
            var v = model.whole;
            var i,z;

            var teste;
            /*--------- SECRETS HANDLER------------*/
            if (!isPrivate){ /*if the model is public*/
                var nsecrets = 0;
                while ((i = v.indexOf("//SECRET\n",i))>=0) { /*while Contains secrets*/
                    teste = teste + "\ni = " + i;
                    z = i;
                    var j = 0;
                    var word = "";

                    for(z; v[z]!= '\n';z++); z++; /*goto next line*/
                    for(z;v[z] && v[z]!='{';z++){ word += v[z];}

                    if (!(isParagraph(word))) {i++; teste = teste + "\nisParagraphBreak!"; continue; } /*break case 'word' is not a paragraph */

                    try{  /*if its a paragraph then } must match '}' */
                        var e = findClosingBracketMatchIndex(v,z);
                    }catch(err){
                        i++;
                        teste = teste + "\nerrorBreak!";
                        continue;
                    }

                    secrets+="\n\n"+v.substr(i,(e-i)+1);
                    v = v.substr(0,i) + v.substr(e+1); /* remove secrets from v (whole model) */
                    i++;
                }

                /*return {
                        "whole": teste,
                        "secrets": "",
                        "lockedLines":"",
                        "priv": false,
                        "instance":"",
                        "themes":""
                      };*/


                /*------------LOCK handler---------------*/
                var lockedLines = [];
                var lines = v.split(/\r?\n/); /*Array of lines */
                var l=0;
                var modelToEdit="";
                var numLockedLines=0;
                while (l<lines.length) {
                    var line = lines[l];
                    if (line.trim() == "//LOCKED") {
                        numLockedLines++;

                        //recheck if there are more lines
                        if (l>=lines.length)
                            break;

                        l++;
                        //last line is where the paragraph ends
                        var lastLine = findParagraph(lines, l);

                        if (lastLine!=-1){
                            //lockedLines.push(l - numLockedLines);//line numbers in editor are '1' based
                            while (l < lastLine + 1) {
                                lockedLines.push(l + 1 - numLockedLines);
                                modelToEdit+=lines[l]+"\n";
                                l++;
                            }
                            //acrescentamos uma linha para forcar a separacao de um eventual proximo locked
                            //modelToEdit+="\n";
                            //lockedLines.push(l + 1 - numLockedLines);
                            //l++
                        }
                    }else {
                        modelToEdit+=line+"\n"; //add new line to the last line
                        l++;
                    }
                }

                return {
                        "whole": modelToEdit,
                        "secrets": secrets,
                        "lockedLines":lockedLines,
                        "priv": false,
                        "instance":instance,
                        "themes":themes
                        };

            }
            else { //private
                return {
                            "whole": v,
                            "secrets":"",
                            "lockedLines":"",
                            "priv": true,
                            "instance":instance,
                            "themes":themes
                        };
            }
        }else{
            return {
                    "whole": "Link não encontrado",
                    "secrets": "",
                    "lockedLines":"",
                    "priv":false,
                    "instance":undefined,
                    "themes":undefined
                    };
        }

    },

    // You can provide any of the hook options

    onRun: function () {
        this.next();
    },
    onRerun: function () {
        this.next();
    },
    onBeforeAction: function () {
        this.next();
    },

    // The same thing as providing a function as the second parameter. You can
    // also provide a string action name here which will be looked up on a Controller
    // when the route runs. More on Controllers later. Note, the action function
    // is optional. By default a route will render its template, layout and
    // regions automatically.
    // Example:
    //  action: 'myActionFunction'

    action: function () {
        this.render();
    },
    onAfterAction: function () {
    },
    onStop: function () {
    }
});


/* ----------Aux functions used to parse data ---------*/
function findParagraph(lines, l) {
    //locate the start of the next paragraph {
    var braces=0;
    var estado=1;
    while (l<lines.length) {
        var line = lines[l].trim() + ' ';

        if (line.length>0) {//empty lines or lines with white space are ignored
            if (estado==1
                && line.match("^(one sig|sig|module|open|fact|pred|assert|fun|run|check|abstract sig)[ \t{]")
            ){
                estado=2;
            }

            if (estado>1) {//ie found valid token
                for (var c = 0; c < line.length; c++) {
                    if (estado == 2) {//we need to find a {
                        switch (line.charAt(c)) {
                            case ' ':
                            case '\t':
                            case '\r':
                            case '\n':
                                break;//ok allow white space
                            case '{':
                                estado = 3;
                                braces++;
                                break;
                            //default: //some other char - so ignore the lock
                            //    return -1;
                        }
                    } else if (estado == 3) {
                        switch (line.charAt(c)) {
                            case '{':
                                braces++;
                                break;
                            case '}':
                                braces--;
                                break;
                        }
                    }
                }
            }

            if (estado==3 && braces == 0)
                return l;//this is the last line of this paragraph
        }
        l++;
    }

    return -1;
}
function findClosingBracketMatchIndex(str, pos) {
    if (str[pos] != '{') {
        throw new Error("No '{' at index " + pos);
    }
    var depth = 1;
    for (var i = pos + 1; i < str.length; i++) {
        switch (str[i]) {
            case '{':
                depth++;
                break;
            case '}':
                if (--depth == 0) {
                    return i;
                }
                break;
        }
    }
    return -1;    // No matching closing parenthesis
}

/*Function that returns true if the word it's a valid paragraph, returns false otherwise*/
function isParagraph(word){
    var pattern_named = /^((one sig |sig |pred |fun |abstract sig )(\ )*[A-Za-z0-9]+)/;
    var pattern_nnamed = /^((fact|assert|run|check)(\ )*[A-Za-z0-9]*)/;
    if(word.match(pattern_named) == null && word.match(pattern_nnamed) == null) return false ;
    else return true;
}
