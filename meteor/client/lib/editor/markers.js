/**
 * This file contains useful functions to handle the code mirror editor markers
 */


addErrorMarkerToGutter = function (message, lineNumber) {
    const x = document.createElement('IMG');
    x.setAttribute('src', '/images/icons/error.png');
    x.setAttribute('width', '15');
    x.setAttribute('id', 'error');
    x.setAttribute('title', message);
    textEditor.setGutterMarker(lineNumber - 1, 'error-gutter', x);
    textEditor.refresh();
};
