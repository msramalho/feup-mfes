/**
 * Created by josep on 27/07/2016.
 */


Template.relationSettings.helpers({
    getRelation : function(){
        return Session.get("selectedRelation");
    },
    updateContent : function(){
        var selectedRelation = Session.get("selectedRelation");
        if(selectedRelation){
            $("#relationLabelSettings").val(getRelationLabel(selectedRelation));
            $("#relationColorSettings").colorpicker('setValue', getRelationColor(selectedRelation));
            $("#showAsArcs").prop("checked",isShowAsArcsOn(selectedRelation));
            $("#showAsAttributes").prop("checked",isShowAsAttributesOn(selectedRelation));
            $("#relationEdgeStyleSettings").val(getRelationEdgeStyle(selectedRelation));
        }
    }
});

Template.relationSettings.events({
    'change #relationLabelSettings' : function(event){
        var selectedRelation = Session.get("selectedRelation");
        cy.edges("[relation='"+selectedRelation+"']").data({'label' : event.target.value});
        updateRelationLabel(selectedRelation, event.target.value);
        refreshGraph();
        refreshAttributes();
    },

    'changeColor.colorpicker #relationColorSettings' : function(event){
        var selectedRelation = Session.get("selectedRelation");
        cy.edges("[relation='"+selectedRelation+"']").data({'color' : event.target.value});
        updateRelationColor(selectedRelation, event.target.value);
    },
    'change #showAsArcs' : function(event){
        var selectedRelation = Session.get("selectedRelation");
        $(event.target).is(':checked')?setShowAsArcsValue(selectedRelation, true ):setShowAsArcsValue(selectedRelation, false );
        updateShowAsArcs(selectedRelation,$(event.target).is(':checked'));
    },
    'change #showAsAttributes' : function(event){
        var selectedRelation = Session.get("selectedRelation");
        $(event.target).is(':checked')?setShowAsAttributesValue(selectedRelation, true ):setShowAsAttributesValue(selectedRelation, false );
        updateShowAsAttributes(selectedRelation,$(event.target).is(':checked'));
        refreshGraph();
    },
    'change #relationEdgeStyleSettings' : function(event){
        var selectedRelation = Session.get("selectedRelation");
        cy.edges("[relation='"+selectedRelation+"']").data({'edgeStyle' : event.target.value});
        updateEdgeStyle(selectedRelation, event.target.value);
    }
});

Template.relationSettings.onRendered(function(){
    $(function(){
        $('#relationColorSettings').colorpicker({format: "hex"});
    });
    $(".relation-settings").hide();
});