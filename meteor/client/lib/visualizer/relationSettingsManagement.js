/**
 * Created by josep on 29/07/2016.
 */

relationSettings = {};

getRelationColor = function(relationType){
    if(relationSettings && relationSettings.nodeColors){
        for(var i = 0;i< relationSettings.nodeColors.length; i++){
            if(relationSettings.nodeColors[i].type==relationType){
                return relationSettings.nodeColors[i].color;
            }
        }
        relationSettings.nodeColors.push({type : relationType, color: '#9988CC'});
        return '#9988CC';
    }else {
        relationSettings.nodeColors = [];
        relationSettings.nodeColors.push({type : relationType, color: '#9988CC'});
        return '#9988CC';
    }
};

getRelationLabel = function(relationType){
    if(relationSettings && relationSettings.edgeLabels){
        for(var i = 0;i< relationSettings.edgeLabels.length; i++){
            if(relationSettings.edgeLabels[i].type==relationType){
                return relationSettings.edgeLabels[i].label;
            }
        }
        relationSettings.edgeLabels.push({type : relationType, label: relationType});
        return relationType;
    }else {
        relationSettings.edgeLabels = [];
        relationSettings.edgeLabels.push({type : relationType, label: relationType});
        return relationType;
    }
};

getRelationEdgeStyle = function(relationType){
    if(relationSettings && relationSettings.edgeStyles){
        for(var i = 0;i< relationSettings.edgeStyles.length; i++){
            if(relationSettings.edgeStyles[i].type==relationType){
                return relationSettings.edgeStyles[i].edgeStyle;
            }
        }
        relationSettings.edgeStyles.push({type : relationType, edgeStyle: "solid"});
        return "solid";
    }else {
        relationSettings.edgeStyles = [];
        relationSettings.edgeStyles.push({type : relationType, edgeStyle: "solid"});
        return "solid";
    }
};

updateRelationLabel = function(relationType, newLabel){
    for(var i = 0;i< relationSettings.edgeLabels.length; i++){
        if(relationSettings.edgeLabels[i].type==relationType){
            relationSettings.edgeLabels[i].label = newLabel;
            return;
        }
    }
};



updateRelationColor = function(relationType, newColor){
    for(var i = 0;i< relationSettings.nodeColors.length; i++){
        if(relationSettings.nodeColors[i].type==relationType){
            relationSettings.nodeColors[i].color = newColor;
            return;
        }
    }
};

isShowAsArcsOn = function (relation){
    if(relationSettings.showAsArcs){
        for(var i = 0; i< relationSettings.showAsArcs.length; i++){
            if(relationSettings.showAsArcs[i].relation == relation){
                return relationSettings.showAsArcs[i].showAsArcs;
            }
        }
        return false;
    }else return false;
};

isShowAsAttributesOn = function (relation){
    if(relationSettings.showAsAttributes){
        for(var i = 0; i< relationSettings.showAsAttributes.length; i++){
            if(relationSettings.showAsAttributes[i].relation == relation){
                return relationSettings.showAsAttributes[i].showAsAttributes;
            }
        }
        return false;
    }else return false;
};

updateShowAsArcs = function(relationType, newShowAsArcsValue){
    if(relationSettings.showAsArcs) {
        for (var i = 0; i < relationSettings.showAsArcs.length; i++) {
            if (relationSettings.showAsArcs[i].relation == relationType) {
                relationSettings.showAsArcs[i].showAsArcs = newShowAsArcsValue;
                return;
            }
        }
        relationSettings.showAsArcs.push({relation: relationType, showAsArcs: newShowAsArcsValue});
        return;
    }
    relationSettings.showAsArcs = [];
    relationSettings.showAsArcs.push({relation: relationType, showAsArcs: newShowAsArcsValue});
};

updateShowAsAttributes = function(relationType, newShowAsAttributesValue){
    if(relationSettings.showAsAttributes) {
        for (var i = 0; i < relationSettings.showAsAttributes.length; i++) {
            if (relationSettings.showAsAttributes[i].relation == relationType) {
                relationSettings.showAsAttributes[i].showAsAttributes = newShowAsAttributesValue;
                return;
            }
        }
        relationSettings.showAsAttributes.push({relation: relationType, showAsAttributes: newShowAsAttributesValue});
        return;
    }
    relationSettings.showAsAttributes = [];
    relationSettings.showAsAttributes.push({relation: relationType, showAsAttributes: newShowAsAttributesValue});
};

updateEdgeStyle = function(relationType, newEdgeStyleValue){
    for(var i = 0;i< relationSettings.edgeStyles.length; i++){
        if(relationSettings.edgeStyles[i].type==relationType){
            relationSettings.edgeStyles[i].edgeStyle = newEdgeStyleValue;
            return;
        }
    }
}

setShowAsArcsValue = function(relationType, value){
    try{
        if(cy){
            //TODO : Display fields as edges alternative to attributes
            var edges = cy.edges("[relation='"+relationType+"']");
            if(value)
                edges.forEach(function(edge){
                    edge.hide();
                });
            else edges.forEach(function(edge){
                edge.show();
            });
        }
    } catch(e){
    }
};

setShowAsAttributesValue = function(relationType, value){
        if(cy) {
            var edges = cy.edges("[relation='"+relationType+"']");
            if (value) {
                var aux = {};
                for (var i = 0; i < edges.length; i++) {
                        if (!aux[edges[i].source().data().id])aux[edges[i].source().data().id]= [];
                        aux[edges[i].source().data().id].push(edges[i].data().labelExt==""?
                            edges[i].target().data().label:
                        edges[i].data().updatedLabelExt+"->"+edges[i].target().data().label+edges[i].target().data().number);
                }
                for(var key in aux){
                    if(!cy.nodes("[id='"+key+"']")[0].data().attributes)cy.nodes("[id='"+key+"']")[0].data().attributes = [];
                    cy.nodes("[id='"+key+"']")[0].data().attributes[relationType]= aux[key];
                }
            }else{
                for (var i = 0; i < edges.length; i++)
                    delete cy.nodes("[id='" + edges[i].source().data().id + "']")[0].data().attributes[relationType];
            }
        }

};