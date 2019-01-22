Template.visSettings.helpers({
});

Template.visSettings.events({
    'click #settings-button'() {
        $('.settings-panel').toggleClass('open');
    },
});

Template.visSettings.onRendered(() => {
    // Add styling to scroll bar on theme settings
    $('.scroll-settings').slimScroll({
        height: '380px',
    });
});
