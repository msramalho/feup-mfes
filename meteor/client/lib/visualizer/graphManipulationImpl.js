/**
 * Created by josep on 29/08/2016.
 */

import cytoscape from 'cytoscape';

updateGraph = function(instance){
    //If not yet initialized, create new cytoscape object using the text area identified by 'instance' class.
    if (!cy)initGraphViewer("instance");
    $('#instanceViewer').show();
    $("#genInstanceUrl").show();
    //Remove previous nodes and edges.
    cy.remove(cy.elements());
    //Add new ones.
    var atomElements = getAtoms(instance)
    cy.add(atomElements);
    cy.add(getEdges(instance));
    if(atomElements.length==0)
        $(".empty-universe").show();
    else {
        $(".empty-universe").hide();
    }
    cy.resize();
    //Apply same theme settings as previous instance.
    applyThemeSettings();
    //Draw data according to the selected layout.
    applyCurrentLayout();
};

applyThemeSettings = function (){
    //Apply unconnected nodes set on previous instances.
    if(atomSettings.unconnectedNodes)
        for(var i = 0; i< atomSettings.unconnectedNodes.length; i++)
            setUnconnectedNodesValue(atomSettings.unconnectedNodes[i].type, atomSettings.unconnectedNodes[i].unconnectedNodes);

    //Apply show as attributes option set on previous instances.
    setOriginalAtomNamesValue(generalSettings.useOriginalAtomNames?true:false);
    if(relationSettings.showAsArcs)
        relationSettings.showAsArcs.forEach(function(item){
            if(item.showAsArcs)setShowAsArcsValue(item.relation, true);
        });
    //In case of label change.
    refreshAttributes();
    //Add types, subsets and relations to selection area on settings tab.
    updateElementSelectionContent();
    //Backup of whole instance. Helpful for projection.
    allAtoms = cy.nodes();
    //Apply same projections as on previous instances.
    newInstanceSetup();
};


//Get atom information received from server ready to upload to cytoscape object.
getAtoms = function(instance){
    var atoms = [];
    if(instance.atoms)
        instance.atoms.forEach(function (atom){
            if(atom.type.toLowerCase().indexOf("this/")>-1){
                if(atom.isPrimSig) {
                    metaPrimSigs.push({
                        type: atom.type.split("/")[1],
                        parent: atom.parent.indexOf("/") > -1 ? atom.parent.split("/")[1] : atom.parent
                    });
                    getAtomBorder(atom.type.split("/")[1]);
                    getAtomColor(atom.type.split("/")[1]);
                    getAtomShape(atom.type.split("/")[1]);

                    atom.values.forEach(function (value) {
                        if (value.indexOf("/") == -1)
                            var type = value.split("$")[0];
                        atoms.push(
                            {
                                group: "nodes",
                                classes: "multiline-manual",
                                data: {
                                    number:  value.split("$")[1],
                                    numberBackup:  value.split("$")[1],
                                    color: getAtomColor(type),
                                    shape: getAtomShape(type),
                                    id:  value,
                                    type: type,
                                    label: getAtomLabel(type),
                                    dollar: "",
                                    border: getAtomBorder(type),
                                    subsetSigs : []
                                }
                            });
                        return atoms;
                    });
                }else {
                    atom.values.forEach(function (value) {
                        if(!hasSubsetSig(atom.type.split("/")[1]+":"+value.split("$")[0])){
                            var type = atom.type.split("/")[1]+":"+value.split("$")[0];
                            metaSubsetSigs.push({type: atom.type.split("/")[1]+":"+value.split("$")[0], parent : value.split("$")[0]});
                            getAtomBorder(type);
                            getAtomColor(type);
                            getAtomShape(type);
                            getAtomLabel(type);
                            updateAtomLabel(type, atom.type.split("/")[1]);
                        }
                        for(var i = 0; i< atoms.length ; i++){
                            if(atoms[i].data.id==value){
                                atoms[i].data.subsetSigs.push(atom.type.split("/")[1]+":"+value.split("$")[0]);
                            }
                        }
                    });

                }

                return atoms;
            }
        });

    for(var skolem in instance.skolem){
        for(var atom in atoms){
            if(atoms[atom].data.id==instance.skolem[skolem]){
                atoms[atom].data.skolem = skolem;
            }
        }
    }
    return atoms;
};


getEdges = function(instance){
    var result = [];
    if(instance.fields)
        instance.fields.forEach(function (field){
            if(field.type.indexOf("this/")!=-1){
                field.values.forEach(function(relation){
                    var label =field.label;
                    var labelExt= relation.splice(1,relation.length-2).toString();
                    result.push({group : "edges", selectable: true, data :{
                        relation: label,
                        source : relation[0],
                        target : relation[relation.length-1],
                        label: getRelationLabel(label),
                        color: getRelationColor(label),
                        //when relation's arity > 2, add remaining involved types to its label
                        labelExt : field.arity>2?labelExt:"",
                        //useful when these types have their labels edited. "labelExt" is a backup of the original while "updatedLabelExt" reflects the current state of the world
                        updatedLabelExt : field.arity>2?labelExt:"",
                        edgeStyle : getRelationEdgeStyle(label)
                    }});
                });
            }
        });
    return result;
};

//Selecting an element on the cytoscape canvas recalculates its label. Useful after editing labels
refreshGraph = function(){
    var selected= cy.$(':selected');
    cy.elements().select().unselect();
    selected.select();
};

//Called on atom label modification.
refreshAttributes = function(){
    if(relationSettings.showAsAttributes){
        relationSettings.showAsAttributes.forEach(function(item){
            if(item.showAsAttributes)setShowAsAttributesValue(item.relation, true);
        })
    }
    refreshGraph();
};

initGraphViewer = function(element) {
    cy = cytoscape({
        container: document.getElementById(element), // container to render in
        elements: [ // list of graph elements to start with

        ],
        zoom: 1,
        pan: { x: 0, y: 0 },

        // interaction options:
        minZoom: 0.2,
        maxZoom: 5,
        wheelSensitivity : 0.5,

        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    'background-color': function(ele){
                        if(ele.data().subsetSigs.length>0){
                            var i=0;
                            var color = getAtomColor(ele.data().subsetSigs[i++]);
                            while(color=="inherit" && i<ele.data().subsetSigs.length){
                                color = getAtomColor(ele.data().subsetSigs[i++]);
                            }
                            if(color!="inherit")return color;
                            color = getAtomColor(ele.data().type);
                            if(color =="inherit")return getInheritedAtomColor(ele.data().type);
                            else return color;
                        }else {
                            var color = getAtomColor(ele.data().type);
                            if(color =="inherit")return getInheritedAtomColor(ele.data().type);
                            else return color;
                        }
                    },
                    'label': function(ele){
                        if(!ele.data().attributes || Object.keys(ele.data().attributes).length==0){
                            return ele.data().label+ele.data().dollar+ele.data().number+(ele.data().subsetSigs.length>0?"\n("+ele.data().subsetSigs.map(getAtomLabel)+")\n":"")+(typeof ele.data().skolem != "undefined"?"\n"+ele.data().skolem:"");
                        }
                        else {
                            var attributes = "";
                            for(var i in ele.data().attributes){
                                attributes+=cy.edges("[relation='"+i+"']")[0].data().label+" : "+ele.data().attributes[i].toString()+"\n";
                            }
                            return ele.data().label+ele.data().dollar+ele.data().number+(ele.data().subsetSigs.length>0?"\n("+ele.data().subsetSigs.map(getAtomLabel)+")\n":"")+"\n"+attributes+(typeof ele.data().skolem != "undefined"?"\n"+ele.data().skolem:"");
                        }
                    },
                    'border-style' : function(ele){
                        if(ele.data().subsetSigs.length>0){
                            var i=0;
                            var border = getAtomBorder(ele.data().subsetSigs[i++]);
                            while(border=="inherit" && i<ele.data().subsetSigs.length){
                                border = getAtomBorder(ele.data().subsetSigs[i++]);
                            }
                            if(border!="inherit")return border;
                            border = getAtomBorder(ele.data().type);
                            if(border =="inherit")return getInheritedAtomBorder(ele.data().type);
                            else return border;
                        }else {
                            var border = getAtomBorder(ele.data().type);
                            if(border =="inherit")return getInheritedAtomBorder(ele.data().type);
                            else return border;
                        }
                    },
                    'text-valign': 'center',
                    'text-outline-color': '#black',
                    'shape' : function(ele){
                        if(ele.data().subsetSigs.length>0){
                            var i=0;
                            var shape = getAtomShape(ele.data().subsetSigs[i++]);
                            while(shape=="inherit" && i<ele.data().subsetSigs.length){
                                shape = getAtomShape(ele.data().subsetSigs[i++]);
                            }
                            if(shape!="inherit")return shape;
                            shape = getAtomShape(ele.data().type);
                            if(shape =="inherit")return getInheritedAtomShape(ele.data().type);
                            else return shape;
                        }else {
                            var shape = getAtomShape(ele.data().type);
                            if(shape =="inherit")return getInheritedAtomShape(ele.data().type);
                            else return shape;
                        }
                    },
                    'width' : 'label',
                    'height' : 'label',
                    'padding-bottom' : '10px',
                    'padding-top' : '10px',
                    'padding-left' : '10px',
                    'padding-right' : '10px',
                    'border-color': 'black',
                    'border-width': 2,
                    'border-opacity': 0.8
                }
            },

            {
                selector: 'edge',
                style: {
                    'width': 1,
                    'line-color': 'data(color)',
                    'target-arrow-color': 'data(color)',
                    'target-arrow-shape': 'triangle',
                    'label' : function( ele ){
                        if(ele.data().labelExt=="")return ele.data().label;
                        else{
                            var auxLabelExt = ele.data().labelExt;
                            var sigs= ele.data().labelExt.split(",");
                            for(var i = 0; i< sigs.length;i++){
                                var currentLabel = cy.nodes("[id='"+sigs[i]+"']")[0].data().label+cy.nodes("[id='"+sigs[i]+"']")[0].data().dollar+cy.nodes("[id='"+sigs[i]+"']")[0].data().number;
                                auxLabelExt=auxLabelExt.replace(sigs[i],currentLabel);
                            }
                            ele.data().updatedLabelExt = auxLabelExt;
                            return ele.data().label+"["+auxLabelExt+"]";
                        }
                    },
                    'curve-style': 'bezier',
                    'text-valign': 'center',
                    'text-outline-color': '#ff3300',
                    'edge-text-rotation': 'autorotate',
                    'line-style' : 'data(edgeStyle)'
                }
            },
            {
                selector: ':selected',
                style: {
                    'background-opacity' : 0.5
                }
            },
            {
                selector: '.multiline-manual',
                style: {
                    'text-wrap': 'wrap'
                }
            },
            {
                selector : 'edge:selected',
                style:{
                    'width': 5
                }
            },
            {
                selector: ':parent',
                style: {
                    'background-opacity': 0.3,
                    'text-valign': 'top'
                }
            }

        ],

        layout : {
            name: 'grid',
            fit: true,
            sort : function(a, b){
                return a.data('label') < b.data('label')
            },
            avoidOverlap : true
        }

    });

    //right click event on cytoscape's node
    cy.on('cxttap', 'node', {}, function(evt){
        //Place right click options menu on mouse position and display it
        $('#optionsMenu').css({
            //overlap cytoscape canvas
            'z-index': 10,
            'position': 'absolute',
            //+1 avoids recapturing right click event and opening browser's context menu.
            'top':evt.originalEvent.offsetY+1,
            //if the menu's width overflows page width, place it behind the cursor.
            'left':evt.originalEvent.screenX+1+300>$(window).width()?evt.originalEvent.offsetX+1-300:evt.originalEvent.offsetX+1}).fadeIn('slow');
        Session.set("rightClickTarget", undefined);
        Session.set("rightClickTarget", evt.cyTarget.data().type);
        return false;
    });

    //left click event on cytoscape canvas
    cy.on('tap', function(event){
        var evtTarget = event.cyTarget;

        //If clicked background (not a node or edge)
        if( evtTarget === cy ){
            $(".relation-settings").slideUp();
            $(".atom-settings").slideUp();
            $(".general-settings").slideDown();
        } else {
            //Clicked a node
            if(evtTarget.isNode()){
                Session.set("selectedType", evtTarget.data().type);
                $(".general-settings").slideUp();
                $(".relation-settings").slideUp();
                $(".atom-settings").slideDown();
                //Redisplay options hidden by subsetsig selection
                $(".projection-settings").show();
                $(".hide-unconnected-settings").show();
                $(".hide-nodes-settings").show();
                $(".number-nodes-settings").show();
            }else{
                //Clicked an edge
                Session.set("selectedRelation", evtTarget.data().relation);
                $(".general-settings").slideUp();
                $(".atom-settings").slideUp();
                $(".relation-settings").slideDown();
            }
        }
    });

    cy.on('tap', function(event){
        $("#optionsMenu").hide();
    });
};