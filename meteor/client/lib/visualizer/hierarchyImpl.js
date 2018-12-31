/**
 * Created by josep on 05/08/2016.
 */

metaPrimSigs= [{type: "univ", parent : null}];
metaSubsetSigs = [];

getSigParent = function(sigType){
    for(var i in metaPrimSigs){
        if(metaPrimSigs[i].type==sigType)return metaPrimSigs[i].parent;
    }
    throw null;
};


getChildSigs = function(sigType){
    var childSigs = [];
    for(var i in metaPrimSigs){
        if(metaPrimSigs[i].parent == sigType)childSigs.push(metaPrimSigs[i].type);
    }
    return childSigs;
};

getSubTree = function(root){
    var queue = [root];
    var subTree =[root];
    while(queue.length>0){
        var childSigs = getChildSigs(queue.shift());
        queue.concat(childSigs);
        subTree.concat(childSigs);
    }
    return subTree;
};

updateElementSelectionContent = function(){
    //var nodes = cy.nodes();
    var edges = cy.edges();
    var types = [];
    var subsets = [];
    var relations = [];
    //Gather all distinct types from nodes represented in the graph
    metaPrimSigs.forEach(function(sig){
        if ($.inArray(sig.type, types) == -1) types.push(sig.type);
    });
    //get all distinct subset signatures
    metaSubsetSigs.forEach(function(subsetSig){
        subsets.push(subsetSig.type);
    });
    //Gather all distinct relations from edges represented in the graph
    edges.forEach(function(edge){
        if ($.inArray(edge.data().relation, relations) == -1) relations.push(edge.data().relation);
    });

    //Remove previous types available for selection
    selectAtomElement.selectize.clear();
    selectAtomElement.selectize.clearOptions();

    //Remove previous subsets available for selection
    selectSubset.selectize.clear();
    selectSubset.selectize.clearOptions();

    //Remove previous relations available for selection
    selectRelationElement.selectize.clear();
    selectRelationElement.selectize.clearOptions();

    //Add new Types
    types.forEach(function(type){
        selectAtomElement.selectize.addOption({value: type, text: type});
        selectAtomElement.selectize.addItem(type);
    });
    //Replace tag on the bottom right corner of type selection div
    $(".wrapper-select-atom > div > div.selectize-input > p").remove();
    $(".wrapper-select-atom > div > div.selectize-input").append( "<p class='select-label'>Types</p>" );


    //Add new Subsets
    subsets.forEach(function(subset){
        selectSubset.selectize.addOption({value: subset, text: subset});
        selectSubset.selectize.addItem(subset);
    });
    //Replace tag on the bottom right corner of subset selection div
    $(".wrapper-select-subset > div > div.selectize-input > p").remove();
    $(".wrapper-select-subset > div > div.selectize-input").append( "<p class='select-label'>Subsets</p>" );

    //Add new Relations
    relations.forEach(function(relation){
        selectRelationElement.selectize.addOption({value: relation, text: relation});
        selectRelationElement.selectize.addItem(relation);
    });
    //Replace tag on the bottom right corner of relation selection div
    $(".wrapper-select-relation > div > div.selectize-input > p").remove();
    $(".wrapper-select-relation > div > div.selectize-input").append( "<p class='select-label'>Relations</p>" );
};

hasSubsetSig = function (subsetSig){
    for (var i = 0 ; i< metaSubsetSigs.length;i++){
        if(metaSubsetSigs[i].type==subsetSig)return true;
    }
    return false;
}