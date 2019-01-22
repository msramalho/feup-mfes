atomSettings = {};
atomSettings.nodeColors = [{ type: "univ", color: "#68DB53" }];
atomSettings.nodeShapes = [{ type: "univ", shape: "ellipse" }];
atomSettings.nodeBorders = [{ type: "univ", border: "solid" }];
atomSettings.unconnectedNodes = [{ type: "univ", unconnectedNodes: "false" }];
atomSettings.displayNodesNumber = [{ type: "univ", displayNodesNumber: "true" }];
atomSettings.nodeVisibility = [{ type: "univ", visibility: "visible" }];

getAtomColor = function (atomType) {
    //var atomSettings = Session.get("atomSettings");
    if (atomSettings && atomSettings.nodeColors) {
        for (var i = 0; i < atomSettings.nodeColors.length; i++) {
            if (atomSettings.nodeColors[i].type == atomType) {
                return atomSettings.nodeColors[i].color;
            }
        }
        atomSettings.nodeColors.push({ type: atomType, color: 'inherit' });
        //Session.set("atomSettings",atomSettings);
        return 'inherit';
    } else {
        atomSettings.nodeColors = [];
        atomSettings.nodeColors.push({ type: atomType, color: 'inherit' });
        //Session.set("atomSettings",atomSettings);
        return 'inherit';
    }
    atomSettings.nodeColors = [];
    atomSettings.nodeColors.push({ type: atomType, color: 'inherit' });
    // Session.set("atomSettings",atomSettings);
    return 'inherit';
};

getAtomShape = function (atomType) {
    //var atomSettings = Session.get("atomSettings");
    if (atomSettings && atomSettings.nodeShapes) {
        for (var i = 0; i < atomSettings.nodeShapes.length; i++) {
            if (atomSettings.nodeShapes[i].type == atomType) {
                return atomSettings.nodeShapes[i].shape;
            }
        }
        atomSettings.nodeShapes.push({ type: atomType, shape: 'inherit' });
        //Session.set("atomSettings",atomSettings);
        return 'inherit';
    } else {
        atomSettings.nodeShapes = [];
        atomSettings.nodeShapes.push({ type: atomType, shape: 'inherit' });
        //Session.set("atomSettings",atomSettings);
        return 'inherit';
    }
    atomSettings.nodeShapes = [];
    atomSettings.nodeShapes.push({ type: atomType, shape: 'inherit' });
    // Session.set("atomSettings",atomSettings);
    return 'inherit';
};

getAtomBorder = function (atomType) {
    if (atomSettings && atomSettings.nodeBorders) {
        for (var i = 0; i < atomSettings.nodeBorders.length; i++) {
            if (atomSettings.nodeBorders[i].type == atomType) {
                return atomSettings.nodeBorders[i].border;
            }
        }
        atomSettings.nodeBorders.push({ type: atomType, border: 'inherit' });
        return 'inherit';
    } else {
        atomSettings.nodeBorders = [];
        atomSettings.nodeBorders.push({ type: atomType, border: 'inherit' });
        return 'inherit';
    }
    atomSettings.nodeBorders = [];
    atomSettings.nodeBorders.push({ type: atomType, border: 'inherit' });
    return 'inherit';
};

getAtomVisibility = function (atomType) {
    if (atomSettings && atomSettings.nodeVisibility) {
        for (var i = 0; i < atomSettings.nodeVisibility.length; i++) {
            if (atomSettings.nodeVisibility[i].type == atomType) {
                return atomSettings.nodeVisibility[i].visibility;
            }
        }
        atomSettings.nodeVisibility.push({ type: atomType, visibility: 'inherit' });
        return 'inherit';
    } else {
        atomSettings.nodeVisibility = [];
        atomSettings.nodeVisibility.push({ type: atomType, visibility: 'inherit' });
        return 'inherit';
    }
    atomSettings.nodeVisibility = [];
    atomSettings.nodeVisibility.push({ type: atomType, visibility: 'inherit' });
    return 'inherit';
};

updateAtomVisibility = function (atomType, newVisibilityValue) {
    for (var i = 0; i < atomSettings.nodeVisibility.length; i++) {
        if (atomSettings.nodeVisibility[i].type == atomType) {
            atomSettings.nodeVisibility[i].visibility = newVisibilityValue;
            return;
        }
    }
};

getInheritedAtomVisibility = function (type) {
    type = getSigParent(type);
    var visibility = getAtomVisibility(type);
    while (visibility == "inherit") {
        var parent = getSigParent(type);
        visibility = getAtomVisibility(type);
        type = parent;
    }
    return visibility;
};

setAtomVisibility = function (atomType, visibilityValue) {
    var inheriting = [atomType];
    var queue = [atomType];
    while (queue.length > 0) {
        var children = getChildSigs(queue.shift());
        for (var i in children) {
            if (getAtomVisibility(children[i]) == "inherit") {
                inheriting.push(children[i]);
                queue.push(children[i]);
            }
        }
    }
    for (var j in inheriting) {
        var atomSet = cy.nodes("[type='" + inheriting[j] + "']");
        for (var i = 0; i < atomSet.length; i++) {
            visibilityValue == "visible" ? atomSet[i].show() : atomSet[i].hide();
        }
    }
};

getAtomLabel = function (atomType) {
    if (atomSettings && atomSettings.nodeLabels) {
        for (var i = 0; i < atomSettings.nodeLabels.length; i++) {
            if (atomSettings.nodeLabels[i].type == atomType) {
                return atomSettings.nodeLabels[i].label;
            }
        }
        atomSettings.nodeLabels.push({ type: atomType, label: atomType });
        return atomType;
    } else {
        atomSettings.nodeLabels = [];
        atomSettings.nodeLabels.push({ type: atomType, label: atomType });
        return atomType;
    }
    atomSettings.nodeLabels = [];
    atomSettings.nodeLabels.push({ type: atomType, label: atomType });
    return atomType;
};

updateAtomLabel = function (atomType, newLabel) {
    for (var i = 0; i < atomSettings.nodeLabels.length; i++) {
        if (atomSettings.nodeLabels[i].type == atomType) {
            atomSettings.nodeLabels[i].label = newLabel;
            return;
        }
    }
};

updateAtomBorder = function (atomType, newBorder) {
    for (var i = 0; i < atomSettings.nodeBorders.length; i++) {
        if (atomSettings.nodeBorders[i].type == atomType) {
            atomSettings.nodeBorders[i].border = newBorder;
            return;
        }
    }
};

setUnconnectedNodesValue = function (atomType, value) {
    try {
        if (cy) {
            var inheriting = [atomType];
            var queue = [atomType];
            while (queue.length > 0) {
                var children = getChildSigs(queue.shift());
                for (var i in children) {
                    if (getUnconnectedNodesValue(children[i]) == "inherit") {
                        inheriting.push(children[i]);
                        queue.push(children[i]);
                    }
                }
            }

            for (var j in inheriting) {
                var atomSet = cy.nodes("[type='" + inheriting[j] + "']");
                for (var i = 0; i < atomSet.length; i++) {
                    if (atomSet[i].neighbourhood().length == 0) {
                        value == 'true' ? atomSet[i].hide() : atomSet[i].show();
                    }
                }
            }
        }
    } catch (e) {
    }
};


updateAtomShape = function (atomType, newShape) {
    //var atomSettings = Session.get("atomSettings");
    for (var i = 0; i < atomSettings.nodeShapes.length; i++) {
        if (atomSettings.nodeShapes[i].type == atomType) {
            atomSettings.nodeShapes[i].shape = newShape;
            // Session.set("atomSettings", atomSettings);
            return;
        }
    }
};


updateAtomColor = function (atomType, newColor) {
    //var atomSettings = Session.get("atomSettings");
    for (var i = 0; i < atomSettings.nodeColors.length; i++) {
        if (atomSettings.nodeColors[i].type == atomType) {
            atomSettings.nodeColors[i].color = newColor;
            // Session.set("atomSettings", atomSettings);
            return;
        }
    }
};

isUnconnectedNodesOn = function (atomType) {
    //var atomSettings = Session.get("atomSettings");
    if (atomSettings.unconnectedNodes) {
        for (var i = 0; i < atomSettings.unconnectedNodes.length; i++) {
            if (atomSettings.unconnectedNodes[i].type == atomType) {
                return atomSettings.unconnectedNodes[i].unconnectedNodes;
            }
        }
        return false;
    } else {
        return false;
    }
    return false;
};

updateUnconnectedNodes = function (atomType, newUnconnectedNodesValue) {
    if (atomSettings.unconnectedNodes) {
        for (var i = 0; i < atomSettings.unconnectedNodes.length; i++) {
            if (atomSettings.unconnectedNodes[i].type == atomType) {
                atomSettings.unconnectedNodes[i].unconnectedNodes = newUnconnectedNodesValue;
                return;
            }
        }
        atomSettings.unconnectedNodes.push({ type: atomType, unconnectedNodes: newUnconnectedNodesValue });
        return;
    }
    atomSettings.unconnectedNodes = [];
    atomSettings.unconnectedNodes.push({ type: atomType, unconnectedNodes: newUnconnectedNodesValue });
};

updateDisplayNodesNumber = function (atomType, newDisplayNodesNumberValue) {
    if (atomSettings.displayNodesNumber) {
        for (var i = 0; i < atomSettings.displayNodesNumber.length; i++) {
            if (atomSettings.displayNodesNumber[i].type == atomType) {
                atomSettings.displayNodesNumber[i].displayNodesNumber = newDisplayNodesNumberValue;
                return;
            }
        }
        atomSettings.displayNodesNumber.push({ type: atomType, displayNodesNumber: newDisplayNodesNumberValue });
        return;
    }
    atomSettings.displayNodesNumber = [];
    atomSettings.displayNodesNumber.push({ type: atomType, displayNodesNumber: newDisplayNodesNumberValue });
};



setDisplayNodesNumberValue = function (atomType, value) {
    try {
        if (cy) {
            var inheriting = [atomType];
            var queue = [atomType];
            while (queue.length > 0) {
                var children = getChildSigs(queue.shift());
                for (var i in children) {
                    if (getDisplayNodesNumberValue(children[i]) == "inherit") {
                        inheriting.push(children[i]);
                        queue.push(children[i]);
                    }
                }
            }
            for (var j in inheriting) {
                var atomSet = cy.nodes("[type='" + inheriting[j] + "']");
                for (var i = 0; i < atomSet.length; i++) {
                    value == "true" ? atomSet[i].data().number = atomSet[i].data().numberBackup : atomSet[i].data().number = "";
                }
            }
        }
    } catch (e) {

    }
};

isDisplayNodesNumberOn = function (selectedType) {
    if (atomSettings.displayNodesNumber) {
        for (var i = 0; i < atomSettings.displayNodesNumber.length; i++) {
            if (atomSettings.displayNodesNumber[i].type == selectedType) {
                return atomSettings.displayNodesNumber[i].displayNodesNumber == "true";
            }
        }
        return false;
    } else {
        return false;
    }
    return false;
};

getUnconnectedNodesValue = function (selectedType) {
    if (atomSettings && atomSettings.unconnectedNodes) {
        for (var i = 0; i < atomSettings.unconnectedNodes.length; i++) {
            if (atomSettings.unconnectedNodes[i].type == selectedType) {
                return atomSettings.unconnectedNodes[i].unconnectedNodes;
            }
        }
        atomSettings.unconnectedNodes.push({ type: selectedType, unconnectedNodes: 'inherit' });
        return 'inherit';
    } else {
        atomSettings.unconnectedNodes = [];
        atomSettings.unconnectedNodes.push({ type: selectedType, unconnectedNodes: 'inherit' });
        return 'inherit';
    }
    atomSettings.unconnectedNodes = [];
    atomSettings.unconnectedNodes.push({ type: selectedType, unconnectedNodes: 'inherit' });
    return 'inherit';
};

getDisplayNodesNumberValue = function (selectedType) {
    if (atomSettings && atomSettings.displayNodesNumber) {
        for (var i = 0; i < atomSettings.displayNodesNumber.length; i++) {
            if (atomSettings.displayNodesNumber[i].type == selectedType) {
                return atomSettings.displayNodesNumber[i].displayNodesNumber;
            }
        }
        atomSettings.displayNodesNumber.push({ type: selectedType, displayNodesNumber: 'inherit' });
        return 'inherit';
    } else {
        atomSettings.displayNodesNumber = [];
        atomSettings.displayNodesNumber.push({ type: selectedType, displayNodesNumber: 'inherit' });
        return 'inherit';
    }
    atomSettings.displayNodesNumber = [];
    atomSettings.displayNodesNumber.push({ type: selectedType, displayNodesNumber: 'inherit' });
    return 'inherit';
};

getInheritedHideUnconnectedNodesValue = function (type) {
    type = getSigParent(type);
    var hideUnconnectedNodes = getUnconnectedNodesValue(type);
    while (hideUnconnectedNodes == "inherit") {
        var parent = getSigParent(type);
        hideUnconnectedNodes = getUnconnectedNodesValue(type);
        type = parent;
    }
    return hideUnconnectedNodes;
};

getInheritedDisplayNodesNumberValue = function (type) {
    type = getSigParent(type);
    var displayNodesNumber = getDisplayNodesNumberValue(type);
    while (displayNodesNumber == "inherit") {
        var parent = getSigParent(type);
        displayNodesNumber = getDisplayNodesNumberValue(type);
        type = parent;
    }
    return displayNodesNumber;
};

getInheritedAtomColor = function (type) {
    type = getSigParent(type);
    var color = getAtomColor(type);
    while (color == "inherit") {
        var parent = getSigParent(type);
        color = getAtomColor(parent);
        type = parent;
    }
    return color;
};

getInheritedAtomShape = function (type) {
    type = getSigParent(type);
    var shape = getAtomShape(type);
    while (shape == "inherit") {
        var parent = getSigParent(type);
        shape = getAtomShape(parent);
        type = parent;
    }
    return shape;
};


getInheritedAtomBorder = function (type) {
    type = getSigParent(type);
    var border = getAtomBorder(type);
    while (border == "inherit") {
        var parent = getSigParent(type);
        border = getAtomBorder(parent);
        type = parent;
    }
    return border;
};
