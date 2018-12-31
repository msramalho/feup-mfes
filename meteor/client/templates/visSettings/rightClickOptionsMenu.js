/**
 * Created by josep on 31/08/2016.
 */

Template.rightClickOptionsMenu.helpers({
    'getRightClickTargetType' : function(){
        return Session.get("rightClickTarget");
    },
    'updateRightClickContent' : function(){
        var selectedType = Session.get("rightClickTarget");
        if(selectedType){
            var atomColor = getAtomColor(selectedType);
            if(atomColor == "inherit"){
                var color = getInheritedAtomColor(selectedType);
                $(".right-click-color-picker").prop('disabled', true);
                $("#rightClickInheritAtomColor").prop("checked",true);
                $(".right-click-color-picker").colorpicker('setValue', color);
            }
            else {
                $(".right-click-color-picker").prop('disabled', false);
                $("#rightClickInheritAtomColor").prop("checked",false);
                $(".right-click-color-picker").colorpicker('setValue', atomColor);
            }

            $(".right-click-shape-picker").val(getAtomShape(selectedType));
        }
    }
});

Template.rightClickOptionsMenu.events({
    'changeColor.colorpicker .right-click-color-picker' : function(event){
        var selectedType = Session.get("rightClickTarget");
        var color = getAtomColor(selectedType);
        if(color!="inherit") {
            cy.nodes("[type='" + selectedType + "']").data({'color': event.target.value});
            updateAtomColor(selectedType, event.target.value);
            refreshGraph();
        }
    },
    'change .right-click-shape-picker' : function(event){
        var selectedType = Session.get("rightClickTarget");
        cy.nodes("[type='"+selectedType+"']").data({'shape' : event.target.value});
        updateAtomShape(selectedType, event.target.value);
        refreshGraph();
    },
    'change #rightClickInheritAtomColor' : function(event){
        var selectedType = Session.get("rightClickTarget");
        var color = getInheritedAtomColor(selectedType);
        if ($(event.target).is(':checked')) {
            updateAtomColor(selectedType, 'inherit');
            $(".right-click-color-picker").prop('disabled', true);
            $(".right-click-color-picker").colorpicker('setValue', color);
        } else {
            $(".right-click-color-picker").prop('disabled', false);
            updateAtomColor(selectedType, color);
            $(".right-click-color-picker").colorpicker('setValue', color);
        }

        refreshGraph();

    },
    'click #rightClickProject' : function(){
        var selectedType = Session.get("rightClickTarget");
        try{
            if(currentlyProjectedTypes.indexOf(selectedType)==-1)addTypeToProjection(selectedType);
            else removeTypeFromProjection(selectedType);
            $("#optionsMenu").hide();
            //TODO simular click na parte branca para limpar o checkBox

            //eventFire(document.getElementById(''), 'click');
        }catch(err){
            console.log(err);
        }
    }
});

Template.rightClickOptionsMenu.onRendered(function(){
    $('#optionsMenu').hide();
    //Initialize color picker plugin
    $(function(){
        $('.right-click-color-picker').colorpicker({format: "hex"});
    });

});
