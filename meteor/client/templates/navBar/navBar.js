/**
 * Created by josep on 13/04/2016.
 */

Template.navBar.helpers({

});



Template.navBar.events({
    'click #navCreateChallenge' : function(){
        Session.set("editChallenge",undefined);
    },
    'click #navCreateChallenge' : function(){
        Router.go('createChallenge');
    }
});

Template.navBar.onRendered(function () {

});


