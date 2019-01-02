/**
 * Created by josep on 08/02/2016.
 */
import {initializeAlloyEditor} from '/imports/editor/EditorInitializer';

Template.textEditor.onRendered(function () {
    textEditor = initializeAlloyEditor(document.getElementById("editor"));
});

