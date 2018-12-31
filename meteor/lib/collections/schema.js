/**
 * Created by josep on 10/02/2016.
 */

var Schema = {};

// whole tem tudo, derivation de onde deriva
//Models created through the editor feature.
Schema.Model = new SimpleSchema({
    _id: {
        type: String,
        optional: false
    },
    whole: {
        type: String,
        optional: false
    },
    derivationOf : {
        type: String,
        optional : true
    },
    time : {
        type : String,
        optional : true
    }
});

// ao executar um comando, guarda o modelo a que pertencia o comando, sat ou não, o próprio comando, e o resultado
Schema.Run = new SimpleSchema({
    _id: {
        type: String,
        optional: false
    },
    sat: {
        type: Boolean,
        optional: false
    },
    // Atenção aqui fica o model_id != "model" : Alterar
    model : {
        type: String,
        optional : false
    },
    command : {
        type: String,
        optional: false
    },
    time : {
        type : String,
        optional : true
    }
});

// theme é suposto ser o theme...
Schema.Theme = new SimpleSchema({
    _id: {
        type: String,
        optional: false
    },

    name:{
        type : String,
        optional: false
    },

    //Node Colors
    nodeColors: {
        type : Array,
        optional : true
    },
    "nodeColors.$":{
        type : Object
    },
    "nodeColors.type":{
        type : String
    },
    "nodeColors.color":{
        type: String
    },

    //Node Shapes
    nodeShapes: {
        type : Array,
        optional : true
    },
    "nodeShapes.$":{
        type : Object
    },
    "nodeShapes.type":{
        type : String
    },
    "nodeShapes.shape":{
        type: String
    },

    /*nodePositions: {
        type: Array,
        optional : true
    },
    "nodePositions.$" : {
        type: Object
    },
    "nodePositions.id" : {
        type: String,
        optional : false
    },
    "nodePositions.pos" : {
        type: Object
    },
    "nodePositions.pos.x" : {
        type : Number
    },
    "nodePositions.pos.y" : {
        type: Number
    },*/

    //Node labels in case of renaming
    nodeLabels : {
        type: Array,
        optional : true
    },
    "nodeLabels.$" : {
        type : Object
    },
    "nodeLabels.type" : {
        type : String
    },
    "nodeLabels.label" : {
        type: String
    },


    //Edge Colors
    edgeColors: {
        type : Array,
        optional : true
    },
    "edgeColors.$":{
        type : Object
    },
    "edgeColors.relation":{
        type : String
    },
    "edgeColors.color":{
        type: String
    },

    //Edge Labels
    edgeLabels: {
        type : Array,
        optional : true
    },
    "edgeLabels.$":{
        type : Object
    },
    "edgeLabels.relation":{
        type : String
    },
    "edgeLabels.label":{
        type: String
    },

    //Reference to its model
    modelId : {
        type: String,
        optional : false
    },

    //Edge Colors

});

//TODO colocar aqui esquema correto, model_id não está a ser utilizado
/*

// uma instância foi originada a partir de um comanod que tem ref para o modelo.
Schema.Instance = new SimpleSchema({
    _id: {
        type: String,
        optional: false
    },
/*    model : {
        type: String,
        optional : false
    },* /
    run_id : {
        type: String,
        optional : false
    },
    graph : { // the whole graph
        type : Object,
        optional : false,
        blackbox: true 
    },
    theme : { // o tema associado à instância
        type : Object,
        optional : false,
        blackbox: true
    }
})*/



/* Link merely links to Models. When a challenge is created two links are provided. One public and another private.
* This corresponds to two Link instances (with different _ids obvs) but both have the same model_id as they both
* point to same model. */
Schema.Link = new SimpleSchema({
   _id: {
      type : String,
      optional : false
   },
   private: {
        type : Boolean,
        optional : false
  },
    model_id:{
        type : String,
        optional : false
    }
});
// os links para as instancias estão armazenadas noutra tabela. Estão na tabela das instâncias.

Model.attachSchema(Schema.Model);
Run.attachSchema(Schema.Run);
Theme.attachSchema(Schema.Theme);
Link.attachSchema(Schema.Link);
//Instance.attachSchema(Schema.Instance);
