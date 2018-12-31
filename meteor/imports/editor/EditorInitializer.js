/**
 * Created by José Pereira on 11/1/2016.
 */
import CodeMirror from 'codemirror';
import {defineAlloyMode} from '/imports/editor/AlloyEditorMode';
import {defineAlloyChallengeMode} from '/imports/editor/AlloyChallengeMode';
import 'codemirror/theme/twilight.css';
import 'codemirror/lib/codemirror.css';
import 'qtip2';

export {initializeAlloyCreateChallengeEditor, initializeAlloySolveChallengeEditor, initializeAlloyEditor};

/*
Editor initialization options.
*/
var options = {
    //Display line numbers.
    lineNumbers: true,
    //Whether CodeMirror should scroll or wrap for long lines. Defaults to false (scroll).
    lineWrapping: true,
    styleActiveLine: true,
    //Highlight matching brackets when editor's standing next to them
    matchBrackets: true,
    //TODO: Allow choosing between multiple themes.
    theme: "twilight",
    //TODO: This is broken. Must be fixed to permit block folding.
    foldGutter: true,
    //Adds gutters to the editor. In this case a single one is added for the error icon placement
    gutters: ["error-gutter", "breakpoints"]
};

/*
  Initialization of the code editor and associated buttons.
*/
function initializeAlloyEditor(htmlElement){
    defineAlloyMode();

    var editor = initializeEditor(htmlElement, "alloy");
    //Text change event for the editor on alloy4fun/editor page
    editor.on('change', function (editor) {
        $(".qtip").remove();
        //[gutter] -> A gutter is the clear empty space between an element's boundaries and the element's content.
        editor.clearGutter("error-gutter");

        //Delete previous existing permalink elements if existent.
        var permalink = document.getElementById("permalink");
        if(permalink)
            permalink.remove();

        //var instanceLink = document.getElementById("url-instance-permalink");
        var instancel = document.getElementById("instance_permalink");
        if(instancel)
            instancel.remove();


        $("#genInstanceUrl").hide();
        $("#log").empty();

        if ($.trim(editor.getValue()) == '') {
            //When editor is empty
            Session.set("commands",[]);
            $('#exec > button').prop('disabled', true);
            $('#next > button').prop('disabled', true);
            $('#prev > button').prop('disabled', true);
            $('.permalink > button').prop('disabled', true);
        } else {
            //Populate commands combo box
            editor.getCommands();
            if(Session.get("commands") && Session.get("commands").length>=0) {
                $('#instanceViewer').hide();
                $('#exec > button').prop('disabled', false);
                $('.permalink').prop('disabled', false);
                $('#next > button').prop('disabled', true);
                $('#prev > button').prop('disabled', true);
                $('.empty-univ').hide();
                $('.permalink > button').prop('disabled', false);
            }
            //marcar o //LOCKED e //SECRET
            highlightLocksAndSecretsStartLine();
        }
        Session.set("currentInstance",undefined);
        Session.set("instances",undefined);
        Session.set("projectableTypes",undefined);


    });
    editor.setSize("100%",400);
    return editor;
}

/*
  Function that initializes the code editor and provides data context for the session.
  mode = "alloy" by default
*/
function initializeEditor(htmlElement, mode){
    var editor = CodeMirror.fromTextArea(htmlElement, options);
    options.mode = mode;
    editor.getCommands = getCommands;
    return editor;
}

/*
  Function associated with 'text box' that parses command type paragraphs, to be used as data for the combobox.
*/
function getCommands(){

      var pattern = /((\W|^)run(\{|(\[\n\r\s]+\{)|([\n\r\s]+([^{\n\r\s]*)))|((\W|^)check(\{|(\[\n\r\s]+\{)|([\n\r\s]+([^{\n\r\s]*)))))/g;
      var commands = [];
      var commandNumber = 1;
      var input = this.getValue();

      if(Router.current().params._id) /*if the model have some _id, the commands must be parsed*/
      {
        if(secrets = (Router.current().data().secrets)){
          input +=secrets;
        }
      }

      input = input.replace(/\/\/(.*)(\n)/g,"");    /*To avoid commands that are in comment, comments must be eliminated before parse */
      var matches = pattern.exec(input);

      while(matches != null){

          if (matches[6]) commands.push(matches[6]);
          else if (matches[12]) commands.push(matches[12]);
          else if (matches[0].includes("run")) {
              commands.push("run$"+commandNumber);
          } else if (matches[0].includes("check")) {
              commands.push("check$"+commandNumber);
          } else console.log("Unreachable block of code. If you're reading this, consider debugging (function initializeEditor, file EditorInitializer).");
          commandNumber++;
          matches = pattern.exec(input);
      }

      Session.set("commands",commands);
}
