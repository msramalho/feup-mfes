/**
 * Created by josep on 10/02/2016.
 */


//publish and subscribe method is used so that clients can only access specific data from the database
//to access is necessary to "subscribe"


Meteor.publish('editorLoad', function (/*_id*/) {//sem parametro para se conseguir aceder

    // TODO está a publicar todos os para o cliente, só deve publicar os requeridos
    // TODO deve extrair os segredos nesta fase, i.e., os segredos não devem ficar expostos ao cliente. Há que retirar antes de enviar.

    //chavetas aninhadas??????

    var selector = {
        //_id: _id
    };

    var options = {
        fields : {
            _id: 1,
            whole: 1,
            derivationOf: 1
        }
    }

    //empty selector access all Models (required to get the specific Model with the ModelId)
    var result = Model.find(selector, options);
    //var result = Model.find(selector, options);

    if (result) {
        return result;
    }
    return this.ready();
});

Meteor.publish('instanceLoad', function (_id) {

    var selector = {
        _id: _id
    };

    var options = {
        fields : {
            run_id: 1,
            graph : 1,
            theme : 1
        }
    }


    var result = Instance.find(selector, options);

    if (result) {
        return result;
    }
    return this.ready();
});

Meteor.publish('runLoad', function () {

    var selector = {
        //_id: _id
    };

    var options = {
        fields : {
            model: 1,
            command : 1
        }
    }


    var result = Run.find(selector, options);

    if (result) {
        return result;
    }
    return this.ready();
});

Meteor.publish('links', function (_id) {

    //ID do challenge
    // Selector: {_id : XXXXXX}
    var selector = {
        _id : _id
    };

    var options = {
        fields: {
            model_id: 1,
            private: 1
        }
    };

    //puts query return in result variable and is captured in "editLoadController.js"
    var result = Link.find(selector, options);

    if (result) {
        return result;
    }
    return this.ready();
});
