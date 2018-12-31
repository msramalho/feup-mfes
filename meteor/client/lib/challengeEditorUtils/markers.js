/**
 * Created by José Pereira on 2/8/2017.
 */
//20180406 switched challengeEditor to textEditor
//Places lock markers
setLockedLines = function(lockedLines){
    if(lockedLines)
        lockedLines.forEach(function(n){
            //var info = challengeEditor.lineInfo(n);
            var info = textEditor.lineInfo(n);
            //var info = challengeEditor.lineInfo(n);
            textEditor.setGutterMarker(n-1, "breakpoints", info.gutterMarkers ? null : makeMarker());
        });
};

// Returns a list containing indexes of string which match the regex.
getIndexesOf = function(regex, string){
    var result = [];
    var match;
    while (match = regex.exec(string))
        result.push(match.index);
    return result;
};

//Returns lines marked with a lock
getLockedMarkers = function(){
   var lockedLines = [];

  /*
    var i = 0, line;
    var lockedLines = [];
    while(line = challengeEditor.lineInfo(i++)){
        if(line.gutterMarkers && line.gutterMarkers.breakpoints)lockedLines.push(i);
    }
  */
    return lockedLines;
};

// Highlights blocks of code given the start and finishing indexes and a css class name.
markBlocks = function(string, beginnings, endings, className){
    while(beginnings.length > 0){
        var beginning = beginnings.shift();
        var ending = endings.length > 0?endings.shift():undefined;
        if(ending && ending>beginning){
            textEditor.markText(textEditor.posFromIndex(beginning),textEditor.posFromIndex(ending), {className: className});
        }else{
            textEditor.markText(textEditor.posFromIndex(beginning),textEditor.posFromIndex(string.length), {className: className});
        }
    }
};

//Highlights secret blocks of code.
highlightLocksAndSecrets = function(){
    //Clear previous marks.
    textEditor.getAllMarks().forEach(function(mark){mark.clear()});
    var editorContent = textEditor.getValue();

    //SECRETS
    var startSecrets = getIndexesOf(/\/\/START_SECRET/g, editorContent);
    var endSecrets = getIndexesOf(/\/\/END_SECRET/g, editorContent);
    markBlocks(editorContent, startSecrets, endSecrets, "challenge-secret");
};

//Highlights secret blocks of code. APENAS A LINHA
markLines = function(string, lines, className){
    while(lines.length > 0){
        var line = lines.shift();
        textEditor.markText(textEditor.posFromIndex(line),textEditor.posFromIndex(line+8), {className: className});
        //TODO para marcar ate ao fim do vbloco contar os braces
    }
};

highlightLocksAndSecretsStartLine = function(){
    //Clear previous marks.
    textEditor.getAllMarks().forEach(
        function(mark){
            if (mark.className=="challenge-secret")
                mark.clear();
        }
    );
    var editorContent = textEditor.getValue();

    //SECRETS
    var lockeds = getIndexesOf(/\/\/LOCKED/g, editorContent);
    var secrets = getIndexesOf(/\/\/SECRET/g, editorContent);

    markLines(editorContent, lockeds, "challenge-secret");
    markLines(editorContent, secrets, "challenge-secret");
};


addErrorMarkerToGutter = function(message, lineNumber){
    var x = document.createElement("IMG");
    x.setAttribute("src", "/images/icons/error.png");
    x.setAttribute("width", "15");
    x.setAttribute("id", "error");
    x.setAttribute("title", message);
    textEditor.setGutterMarker(lineNumber-1, "error-gutter", x);
    textEditor.refresh();
};

makeMarker = function () {
    var marker = document.createElement("div");
    marker.className = "lock-resize";
    marker.style.color = "#ffffff";
    marker.innerHTML = '<span class="lock-gutter glyphicon glyphicon-lock"></span>';
    return marker;
};
