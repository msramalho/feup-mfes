Template.generalSettings.helpers({
});

Template.generalSettings.events({
    'change #originalAtomNames'(event) {
        setOriginalAtomNamesValue($(event.target).is(':checked'));
        updateOriginalAtomNames($(event.target).is(':checked'));
        refreshAttributes();
        // refreshGraph();
    },
    'change #layoutPicker'(event) {
        currentLayout = event.target.value;
        if (currentLayout == 'breadthfirst') {
            $('.node-spacing').show();
        } else {
            $('.node-spacing').hide();
        }
        applyCurrentLayout();
    },
    'change #nodeSpacing'(event) {
        updateNodeSpacing(event.target.value);
        applyCurrentLayout();
    },
});
