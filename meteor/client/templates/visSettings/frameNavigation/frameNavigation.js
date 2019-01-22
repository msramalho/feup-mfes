Template.frameNavigation.helpers({

});

Template.frameNavigation.events({
    'click #nextFrame.enabled'() {
        const type = $('.framePickerTarget')[0].value;
        currentFramePosition[type]++;
        if (currentFramePosition[type] == lastFrame(type)) {
            $('#nextFrame.enabled').removeClass('enabled');
        }
        $('#previousFrame').addClass('enabled');
        $('.current-frame').html(currentFramePositionToString());
        savePositions();
        project();
    },
    'click #previousFrame.enabled'() {
        const type = $('.framePickerTarget')[0].value;
        currentFramePosition[type]--;
        if (currentFramePosition[type] == 0) {
            $('#previousFrame.enabled').removeClass('enabled');
        }
        $('#nextFrame').addClass('enabled');
        $('.current-frame').html(currentFramePositionToString());
        savePositions();
        project();
    },
    'change .framePickerTarget'(event) {
        const selectedType = event.target.value;
        console.log(`currentFramePosition: ${currentFramePosition}`);
        const currentAtom = currentFramePosition[selectedType];
        console.log(`currentAtom: ${currentAtom}`);
        $('#nextFrame').addClass('enabled');
        $('#previousFrame').addClass('enabled');
        if (currentAtom == lastFrame(selectedType))$('#nextFrame').removeClass('enabled');
        if (currentAtom == 0)$('#previousFrame').removeClass('enabled');
    },
});

Template.frameNavigation.onRendered(() => {
    $('.frame-navigation').hide();
});

lastFrame = function (type) {
    console.log(allAtoms.nodes(`[type='${type}']`).length - 1);
    return allAtoms.nodes(`[type='${type}']`).length - 1;
};
