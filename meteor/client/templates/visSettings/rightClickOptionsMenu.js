Template.rightClickOptionsMenu.helpers({
    getRightClickTargetType() {
        return Session.get('rightClickTarget');
    },
    updateRightClickContent() {
        const selectedType = Session.get('rightClickTarget');
        if (selectedType) {
            const atomColor = getAtomColor(selectedType);
            if (atomColor == 'inherit') {
                const color = getInheritedAtomColor(selectedType);
                $('.right-click-color-picker').prop('disabled', true);
                $('#rightClickInheritAtomColor').prop('checked', true);
                $('.right-click-color-picker').colorpicker('setValue', color);
            } else {
                $('.right-click-color-picker').prop('disabled', false);
                $('#rightClickInheritAtomColor').prop('checked', false);
                $('.right-click-color-picker').colorpicker('setValue', atomColor);
            }

            $('.right-click-shape-picker').val(getAtomShape(selectedType));
        }
    },
});

Template.rightClickOptionsMenu.events({
    'changeColor.colorpicker .right-click-color-picker'(event) {
        const selectedType = Session.get('rightClickTarget');
        const color = getAtomColor(selectedType);
        if (color != 'inherit') {
            cy.nodes(`[type='${selectedType}']`).data({ color: event.target.value });
            updateAtomColor(selectedType, event.target.value);
            refreshGraph();
        }
    },
    'change .right-click-shape-picker'(event) {
        const selectedType = Session.get('rightClickTarget');
        cy.nodes(`[type='${selectedType}']`).data({ shape: event.target.value });
        updateAtomShape(selectedType, event.target.value);
        refreshGraph();
    },
    'change #rightClickInheritAtomColor'(event) {
        const selectedType = Session.get('rightClickTarget');
        const color = getInheritedAtomColor(selectedType);
        if ($(event.target).is(':checked')) {
            updateAtomColor(selectedType, 'inherit');
            $('.right-click-color-picker').prop('disabled', true);
            $('.right-click-color-picker').colorpicker('setValue', color);
        } else {
            $('.right-click-color-picker').prop('disabled', false);
            updateAtomColor(selectedType, color);
            $('.right-click-color-picker').colorpicker('setValue', color);
        }

        refreshGraph();
    },
    'click #rightClickProject'() {
        const selectedType = Session.get('rightClickTarget');
        try {
            if (currentlyProjectedTypes.indexOf(selectedType) == -1)addTypeToProjection(selectedType);
            else removeTypeFromProjection(selectedType);
            $('#optionsMenu').hide();
            // TODO simular click na parte branca para limpar o checkBox

            // eventFire(document.getElementById(''), 'click');
        } catch (err) {
            console.log(err);
        }
    },
});

Template.rightClickOptionsMenu.onRendered(() => {
    $('#optionsMenu').hide();
    // Initialize color picker plugin
    $(() => {
        $('.right-click-color-picker').colorpicker({ format: 'hex' });
    });
});
