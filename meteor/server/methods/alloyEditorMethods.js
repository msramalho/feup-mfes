/**
 * Created by josep on 09/02/2016.
 */

//url="http://alloy4funvm.di.uminho.pt:8080/Alloy4Fun/services/AlloyService?wsdl";
url="http://localhost:8080/Alloy4Fun/services/AlloyService?wsdl";
//url="http://localhost:8080/Alloy4Fun/services/AlloyService?wsdl";

/* Meteor server methods */
Meteor.methods({
/*Stores the model specified in the function argument, returns model url 'id'
   used in Share Model option*/
    'genURL' : function (model,current_id,only_one_link,last_id) {

        var modeldOf = "Original";

        // Aqui é que tenho que trabalhar, nesta condição
        if(current_id != "Original" && !(Link.findOne({_id:current_id}))){
            if(instance = Instance.findOne({_id:current_id})){
              var aux = instance.run_id;
              var run = Run.findOne({_id:aux});
              modeldOf = run.model;
            }
        }
        if (current_id != "Original" && !last_id && (modeldOf == "Original")){ /* if its not an original model */

          var link = Link.findOne({_id:current_id});
          modeldOf = link.model_id;
        }else if(last_id && !(containsValidSecret(model) && !only_one_link) && (modeldOf == "Original")) modeldOf = last_id;

        var newModel_id  = Model.insert({ /*A Model is always created, regardless of having secrets or not */
                            whole: model,
                            derivationOf : modeldOf,
                            time : new Date().toLocaleString()
                         });

        var public_link_id = Link.insert({   /*A public link is always created as well*/
            model_id : newModel_id,
            private: false
        });

        var result;

        if ((containsValidSecret(model) && !only_one_link)){   /* assert result and returns*/

            var private_link_id=Link.insert({
                model_id : newModel_id,
                private: true
            });
            var result={
                public: public_link_id,
                private: private_link_id,
                last_id : newModel_id
            }
        }else{
            result={
                public: public_link_id,
              //  last_id : newModel_id
            }
        }

        return result;
      },
    'getProjection' : function (sessid, frameInfo){
        var args = {sessid: sessid, type : []};
        for(var key in frameInfo){
            args.type.push(key+frameInfo[key]);
        }
        try {
            var client = Soap.createClient(url);
            var result = client.getProjection(args);
        }
        catch (err) {
            if(err.error === 'soap-creation') {
                throw new Meteor.Error(500, "We're sorry! The service is currently unavailable. Please try again later.");
            }
            else if (err.error === 'soap-method') {
                throw new Meteor.Error(501, "TYPE="+types+"-XXX");// "We're sorry! The service is currently unavailable. Please try again later.");
            }
        }
        
        return JSON.parse(result[Object.keys(result)[0]]);
    },

/*Stores model instance, returns url to make possible share the instance.
  used in Share Instance option*/
    'storeInstance' : function (runID, themeData, instance){
        /*
            criar um instance que aponta para o run
            guardar no instance o theme e o o proprio "instance"
         */
        var instanceID = Instance.insert({
            run_id: runID,
            graph: instance,
            theme: themeData,
            date: new Date().toLocaleString()

        });

        return instanceID;
    },
  });

/* ------- Aux Methods  ------- */
    function findClosingBracketMatchIndex(str, pos) {
        if (str[pos] != '{') {
            throw new Error("No '{' at index " + pos);
        }
        var depth = 1;
        for (var i = pos + 1; i < str.length; i++) {
            switch (str[i]) {
                case '{':
                    depth++;
                    break;
                case '}':
                    if (--depth == 0) {
                        return i;
                    }
                    break;
            }
        }
        return -1;    // No matching closing parenthesis
    }

    /*Check if the model contains some valid 'secret'*/
    function containsValidSecret(model){

      var i,j,lastSecret = 0;
      var paragraph = "";
      while( (i = model.indexOf("//SECRET\n",lastSecret)) >= 0){
        for(var z = i+("//SECRET\n".length) ; (z<model.length && model[z]!='{'); z++){
            paragraph = paragraph + model[z];
        }
        if(!isParagraph(paragraph)) {paragraph = ""; lastSecret = i + 1 ; continue;}
        if( findClosingBracketMatchIndex(model, z) != -1) {return true;}
        lastSecret = i + 1 ;
      }
      return false;
    }

    /*Function that returns true if the word it's a valid paragraph, returns false otherwise*/
    function isParagraph(word){
        var pattern_named = /^((one sig |sig |pred |fun |abstract sig )(\ )*[A-Za-z0-9]+)/;
        var pattern_nnamed = /^((fact|assert|run|check)(\ )*[A-Za-z0-9]*)/;
        if(word.match(pattern_named) == null && word.match(pattern_nnamed) == null) return false ;
        else return true;
    }
