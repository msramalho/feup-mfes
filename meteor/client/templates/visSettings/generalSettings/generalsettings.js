/**
 * Created by josep on 27/07/2016.
 */


Template.generalSettings.helpers({
});

Template.generalSettings.events({
    'change #originalAtomNames' : function(event){
        setOriginalAtomNamesValue($(event.target).is(':checked'))
        updateOriginalAtomNames($(event.target).is(':checked'));
        refreshAttributes();
        //refreshGraph();
    },
    'change #layoutPicker' : function(event){
        currentLayout = event.target.value;
        if(currentLayout == "breadthfirst"){
            $(".node-spacing").show();
        }else{
            $(".node-spacing").hide();
        }
        applyCurrentLayout();
    },
    'change #nodeSpacing' : function(event){
        updateNodeSpacing(event.target.value);
        applyCurrentLayout();
    }
});