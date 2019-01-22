
Template.atomSettings.helpers({
    getType() {
        const type = Session.get('selectedType');
        return type || undefined;
    },
    notUniv() {
        const type = Session.get('selectedType');
        return (type && type != 'univ');
    },
    updateContent() {
        const selectedType = Session.get('selectedType');
        if (selectedType && selectedType == 'univ')$('.not-for-univ').hide();
        else $('.not-for-univ').show();
        const isSubset = selectedType ? selectedType.indexOf(':') != -1 : false;
        if (selectedType) {
            $('#atomLabelSettings').val(getAtomLabel(selectedType));

            if (!isSubset) {
                $('#projectOverSig').prop('checked', $.inArray(selectedType, currentlyProjectedTypes) > -1);
                const unconnectedNodes = getUnconnectedNodesValue(selectedType);

                if (unconnectedNodes == 'inherit') {
                    $('#atomHideUnconnectedNodes').prop('disabled', true);
                    $('#inheritHideUnconnectedNodes').prop('checked', true);
                    $('#atomHideUnconnectedNodes').prop('checked', getInheritedHideUnconnectedNodesValue(selectedType) == 'true');
                } else {
                    $('#atomHideUnconnectedNodes').prop('disabled', false);
                    $('#inheritHideUnconnectedNodes').prop('checked', false);
                    $('#atomHideUnconnectedNodes').prop('checked', unconnectedNodes == 'true');
                }

                const displayNodesNumber = getDisplayNodesNumberValue(selectedType);

                if (displayNodesNumber == 'inherit') {
                    $('#displayNodesNumber').prop('disabled', true);
                    $('#inheritDisplayNodesNumber').prop('checked', true);
                    $('#displayNodesNumber').prop('checked', getInheritedDisplayNodesNumberValue(selectedType) == 'true');
                } else {
                    $('#displayNodesNumber').prop('disabled', false);
                    $('#inheritDisplayNodesNumber').prop('checked', false);
                    $('#displayNodesNumber').prop('checked', displayNodesNumber == 'true');
                }

                const visibility = getAtomVisibility(selectedType);

                if (visibility == 'inherit') {
                    const inheritedVisibility = getInheritedAtomVisibility(selectedType);
                    $('#inheritHideNodes').prop('checked', true);
                    $('#hideNodes').prop('checked', inheritedVisibility == 'visible');
                    $('#hideNodes').prop('disabled', true);
                } else {
                    $('#inheritHideNodes').prop('checked', false);
                    $('#hideNodes').prop('checked', visibility == 'invisible');
                    $('#hideNodes').prop('disabled', false);
                }
            }
            const atomColor = getAtomColor(selectedType);
            if (atomColor == 'inherit') {
                const color = isSubset ? '#68DB53' : getInheritedAtomColor(selectedType);
                $('#atomColorSettings').prop('disabled', true);
                $('#inheritAtomColor').prop('checked', true);
                $('#atomColorSettings').colorpicker('setValue', color);
            } else {
                $('#atomColorSettings').prop('disabled', false);
                $('#inheritAtomColor').prop('checked', false);
                $('#atomColorSettings').colorpicker('setValue', atomColor);
            }

            $('#atomShapeSettings').val(getAtomShape(selectedType));
            $('#atomBorderSettings').val(getAtomBorder(selectedType));
        }
    },
});


Template.atomSettings.events({
    'change #atomLabelSettings'(event) {
        const selectedType = Session.get('selectedType');
        cy.nodes(`[type='${selectedType}']`).data({ label: event.target.value });
        updateAtomLabel(selectedType, event.target.value);
        refreshGraph();
        refreshAttributes();
    },

    'changeColor.colorpicker #atomColorSettings'(event) {
        const selectedType = Session.get('selectedType');
        const color = getAtomColor(selectedType);
        if (color != 'inherit') {
            cy.nodes(`[type='${selectedType}']`).data({ color: event.target.value });
            updateAtomColor(selectedType, event.target.value);
            refreshGraph();
        }
    },

    'change #atomShapeSettings'(event) {
        const selectedType = Session.get('selectedType');
        cy.nodes(`[type='${selectedType}']`).data({ shape: event.target.value });
        updateAtomShape(selectedType, event.target.value);
        refreshGraph();
    },
    'change #atomBorderSettings'(event) {
        const selectedType = Session.get('selectedType');
        cy.nodes(`[type='${selectedType}']`).data({ border: event.target.value });
        updateAtomBorder(selectedType, event.target.value);
        refreshGraph();
    },
    'change #atomHideUnconnectedNodes'(event) {
        const selectedType = Session.get('selectedType');
        setUnconnectedNodesValue(selectedType, $(event.target).is(':checked').toString());
        updateUnconnectedNodes(selectedType, $(event.target).is(':checked').toString());
        refreshGraph();
    },
    'change #inheritHideUnconnectedNodes'(event) {
        const selectedType = Session.get('selectedType');
        if ($(event.target).is(':checked')) {
            $('#atomHideUnconnectedNodes').prop('disabled', true);
            updateUnconnectedNodes(selectedType, 'inherit');
        } else {
            $('#atomHideUnconnectedNodes').prop('disabled', false);
            const hideUnconnectedNodes = getInheritedHideUnconnectedNodesValue(selectedType);
            updateUnconnectedNodes(selectedType, hideUnconnectedNodes);
            $('#atomHideUnconnectedNodes').prop('checked', hideUnconnectedNodes == 'true');
        }
    },
    'change #inheritAtomColor'(event) {
        const selectedType = Session.get('selectedType');
        const isSubset = selectedType.indexOf(':') != '-1';
        console.log(isSubset);
        const color = isSubset ? getAtomColor(selectedType.split(':')[1]) : getInheritedAtomColor(selectedType);
        if ($(event.target).is(':checked')) {
            updateAtomColor(selectedType, 'inherit');
            $('#atomColorSettings').prop('disabled', true);
            $('#atomColorSettings').colorpicker('setValue', color);
        } else {
            $('#atomColorSettings').prop('disabled', false);
            updateAtomColor(selectedType, color);
            $('#atomColorSettings').colorpicker('setValue', color);
        }

        refreshGraph();
    },
    'change #inheritDisplayNodesNumber'(event) {
        const selectedType = Session.get('selectedType');
        const displayNodesNumber = getInheritedDisplayNodesNumberValue(selectedType);
        if ($(event.target).is(':checked')) {
            $('#displayNodesNumber').prop('disabled', true);
            updateDisplayNodesNumber(selectedType, 'inherit');
            setDisplayNodesNumberValue(selectedType, displayNodesNumber);
        } else {
            $('#displayNodesNumber').prop('disabled', false);
            updateDisplayNodesNumber(selectedType, displayNodesNumber);
            $('#displayNodesNumber').prop('checked', displayNodesNumber == 'true');
        }
        refreshGraph();
    },
    'change #displayNodesNumber'(event) {
        const selectedType = Session.get('selectedType');
        setDisplayNodesNumberValue(selectedType, $(event.target).is(':checked').toString());
        updateDisplayNodesNumber(selectedType, $(event.target).is(':checked').toString());
        refreshGraph();
    },
    'change #hideNodes'(event) {
        const selectedType = Session.get('selectedType');
        setAtomVisibility(selectedType, $(event.target).is(':checked') ? 'invisible' : 'visible');
        updateUnconnectedNodes(selectedType, $(event.target).is(':checked') ? 'invisible' : 'visible');
        refreshGraph();
    },
    'change #inheritHideNodes'(event) {
        const selectedType = Session.get('selectedType');
        const inheritedVisibility = selectedType == 'univ' ? getAtomVisibility('univ') : getInheritedAtomVisibility(selectedType);
        if ($(event.target).is(':checked')) {
            $('#hideNodes').prop('disabled', true);
            updateAtomVisibility(selectedType, 'inherit');
            setAtomVisibility(selectedType, inheritedVisibility);
        } else {
            $('#hideNodes').prop('disabled', false);
            updateAtomVisibility(selectedType, inheritedVisibility);
            $('#hideNodes').prop('checked', inheritedVisibility == 'invisible');
        }
        refreshGraph();
    },
    'change #projectOverSig'(event) {
        const selectedType = Session.get('selectedType');
        try {
            if (event.currentTarget.checked)addTypeToProjection(selectedType);
            else removeTypeFromProjection(selectedType);
        } catch (err) {
            console.log(err);
        }
    },
});


Template.atomSettings.onRendered(() => {
    $(() => {
        $('#atomColorSettings').colorpicker({ format: 'hex' });
    });
    $('.atom-settings').hide();
});
