/**
 * Created by josep on 09/02/2016.
  -- Possivel código inutilizado
 */



Template.instanceViewer.helpers({

});

function getCurrentInstance(instanceNumber){
    var instances = Session.get("instances");
    var result = undefined;
    instances.forEach(function(inst){
        if (inst.number==instanceNumber){
            result=inst;
            return;
        }
    });
    return result;
}

Template.instanceViewer.events({


});

Template.instanceViewer.onRendered(function () {

});
