import { initializeAlloyEditor } from '/imports/editor/EditorInitializer';

Template.textEditor.onRendered(() => {
    textEditor = initializeAlloyEditor(document.getElementById('editor'));
});
