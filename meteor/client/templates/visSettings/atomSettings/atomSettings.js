/**
 * Created by josep on 27/07/2016.
 */

Template.atomSettings.helpers({
    getType : function(){
        var type = Session.get("selectedType");
        return type? type:undefined;
    },
    'notUniv' : function(){
        var type = Session.get("selectedType");
        return (type && type!="univ");
    },
    updateContent : function(){
        var selectedType = Session.get("selectedType");
        if(selectedType && selectedType == "univ")$(".not-for-univ").hide();
        else $(".not-for-univ").show();
        var isSubset = selectedType?selectedType.indexOf(":")!=-1:false;
        if(selectedType){
            $("#atomLabelSettings").val(getAtomLabel(selectedType));

            if(!isSubset){
                $("#projectOverSig").prop("checked", $.inArray(selectedType, currentlyProjectedTypes) > -1);
                var unconnectedNodes = getUnconnectedNodesValue(selectedType);

                if(unconnectedNodes == "inherit"){
                    $("#atomHideUnconnectedNodes").prop('disabled', true);
                    $("#inheritHideUnconnectedNodes").prop("checked",true);
                    $("#atomHideUnconnectedNodes").prop("checked", getInheritedHideUnconnectedNodesValue(selectedType)=="true");
                }else{
                    $("#atomHideUnconnectedNodes").prop('disabled', false);
                    $("#inheritHideUnconnectedNodes").prop("checked",false);
                    $("#atomHideUnconnectedNodes").prop("checked",unconnectedNodes == "true");
                }

                var displayNodesNumber = getDisplayNodesNumberValue(selectedType);

                if(displayNodesNumber == "inherit"){
                    $("#displayNodesNumber").prop('disabled', true);
                    $("#inheritDisplayNodesNumber").prop("checked",true);
                    $("#displayNodesNumber").prop("checked", getInheritedDisplayNodesNumberValue(selectedType)=="true");
                }else{
                    $("#displayNodesNumber").prop('disabled', false);
                    $("#inheritDisplayNodesNumber").prop("checked",false);
                    $("#displayNodesNumber").prop("checked",displayNodesNumber == "true");
                }

                var visibility = getAtomVisibility(selectedType);

                if(visibility=="inherit"){
                    var inheritedVisibility = getInheritedAtomVisibility(selectedType);
                    $("#inheritHideNodes").prop("checked", true);
                    $("#hideNodes").prop("checked", inheritedVisibility == "visible");
                    $("#hideNodes").prop("disabled", true);
                }else{
                    $("#inheritHideNodes").prop("checked", false);
                    $("#hideNodes").prop("checked", visibility == "invisible");
                    $("#hideNodes").prop("disabled", false);
                }
            }
            var atomColor = getAtomColor(selectedType);
            if(atomColor == "inherit"){
                var color = isSubset?"#68DB53":getInheritedAtomColor(selectedType);
                $("#atomColorSettings").prop('disabled', true);
                $("#inheritAtomColor").prop("checked",true);
                $("#atomColorSettings").colorpicker('setValue', color);
            }
            else {
                $("#atomColorSettings").prop('disabled', false);
                $("#inheritAtomColor").prop("checked",false);
                $("#atomColorSettings").colorpicker('setValue', atomColor);
            }

            $("#atomShapeSettings").val(getAtomShape(selectedType));
            $("#atomBorderSettings").val(getAtomBorder(selectedType));


        }
    }
});



Template.atomSettings.events({
    'change #atomLabelSettings' : function(event){
        var selectedType = Session.get("selectedType");
        cy.nodes("[type='"+selectedType+"']").data({'label' : event.target.value});
        updateAtomLabel(selectedType, event.target.value);
        refreshGraph();
        refreshAttributes();
    },

    'changeColor.colorpicker #atomColorSettings' : function(event){
        var selectedType = Session.get("selectedType");
        var color = getAtomColor(selectedType);
        if(color!="inherit") {
            cy.nodes("[type='" + selectedType + "']").data({'color': event.target.value});
            updateAtomColor(selectedType, event.target.value);
            refreshGraph();
        }
    },

    'change #atomShapeSettings' : function(event){
        var selectedType = Session.get("selectedType");
        cy.nodes("[type='"+selectedType+"']").data({'shape' : event.target.value});
        updateAtomShape(selectedType, event.target.value);
        refreshGraph();

    },
    'change #atomBorderSettings' : function(event){
        var selectedType = Session.get("selectedType");
        cy.nodes("[type='"+selectedType+"']").data({'border' : event.target.value});
        updateAtomBorder(selectedType, event.target.value);
        refreshGraph();
    },
    'change #atomHideUnconnectedNodes' : function(event){
        var selectedType = Session.get("selectedType");
        setUnconnectedNodesValue(selectedType, $(event.target).is(':checked').toString() );
        updateUnconnectedNodes(selectedType,$(event.target).is(':checked').toString());
        refreshGraph();
    },
    'change #inheritHideUnconnectedNodes' : function(event){
        var selectedType = Session.get("selectedType");
        if($(event.target).is(':checked')){
            $("#atomHideUnconnectedNodes").prop('disabled', true);
            updateUnconnectedNodes(selectedType, "inherit" );
        }else{
            $("#atomHideUnconnectedNodes").prop('disabled', false);
            var hideUnconnectedNodes = getInheritedHideUnconnectedNodesValue(selectedType);
            updateUnconnectedNodes(selectedType,hideUnconnectedNodes);
            $("#atomHideUnconnectedNodes").prop("checked",hideUnconnectedNodes=="true");
        }
    },
    'change #inheritAtomColor' : function(event){
        var selectedType = Session.get("selectedType");
        var isSubset = selectedType.indexOf(":")!="-1";
        console.log(isSubset);
        var color = isSubset?getAtomColor(selectedType.split(":")[1]):getInheritedAtomColor(selectedType);
        if ($(event.target).is(':checked')) {
            updateAtomColor(selectedType, 'inherit');
            $("#atomColorSettings").prop('disabled', true);
            $("#atomColorSettings").colorpicker('setValue', color);
        } else {
            $("#atomColorSettings").prop('disabled', false);
            updateAtomColor(selectedType, color);
            $("#atomColorSettings").colorpicker('setValue', color);
        }

        refreshGraph();

    },
    'change #inheritDisplayNodesNumber' : function(event){
        var selectedType = Session.get("selectedType");
        var displayNodesNumber = getInheritedDisplayNodesNumberValue(selectedType);
        if($(event.target).is(':checked')){
            $("#displayNodesNumber").prop('disabled', true);
            updateDisplayNodesNumber(selectedType, "inherit" );
            setDisplayNodesNumberValue(selectedType, displayNodesNumber);
        }else{
            $("#displayNodesNumber").prop('disabled', false);
            updateDisplayNodesNumber(selectedType,displayNodesNumber);
            $("#displayNodesNumber").prop("checked",displayNodesNumber=="true");
        }
        refreshGraph();
    },
    'change #displayNodesNumber' : function(event){
        var selectedType = Session.get("selectedType");
        setDisplayNodesNumberValue(selectedType, $(event.target).is(':checked').toString() );
        updateDisplayNodesNumber(selectedType,$(event.target).is(':checked').toString());
        refreshGraph();
    },
    'change #hideNodes' : function(event){
        var selectedType = Session.get("selectedType");
        setAtomVisibility(selectedType, $(event.target).is(':checked')?"invisible":"visible" );
        updateUnconnectedNodes(selectedType,$(event.target).is(':checked')?"invisible":"visible");
        refreshGraph();
    },
    'change #inheritHideNodes' : function(event){
        var selectedType = Session.get("selectedType");
        var inheritedVisibility = selectedType=="univ"?getAtomVisibility("univ"):getInheritedAtomVisibility(selectedType);
        if($(event.target).is(':checked')){
            $("#hideNodes").prop('disabled', true);
            updateAtomVisibility(selectedType, "inherit" );
            setAtomVisibility(selectedType, inheritedVisibility);
        }else{
            $("#hideNodes").prop('disabled', false);
            updateAtomVisibility(selectedType,inheritedVisibility);
            $("#hideNodes").prop("checked",inheritedVisibility=="invisible");
        }
        refreshGraph();
    },
    "change #projectOverSig" : function(event){
        var selectedType = Session.get("selectedType");
        try{
            if(event.currentTarget.checked)addTypeToProjection(selectedType);
            else removeTypeFromProjection(selectedType);
        }catch(err){
            console.log(err);
        }
    }
});



Template.atomSettings.onRendered(function(){
    $(function(){
        $('#atomColorSettings').colorpicker({format: "hex"});
    });
    $(".atom-settings").hide();
})