/**
 * Created by josep on 09/02/2016.
 */

//url="http://alloy4funvm.di.uminho.pt:8080/Alloy4Fun/services/AlloyService?wsdl";
url="http://localhost:8080/Alloy4Fun/services/AlloyService?wsdl";
//url="http://localhost:8080/Alloy4Fun/services/AlloyService?wsdl";

/* Meteor server methods */
Meteor.methods({
/*  Uses webservice to get a model instance
      'forceInterpretation' : used to skip cache and force new model interpretation
      'cid' : link_id  , 'derivatedOf' model
              "Original" otherwise*/
    'getInstance' : function (model, sessionId, instanceNumber, commandLabel, forceInterpretation,cid,last_id){

      model=model.replace(/&/g,"&amp;"); //substituir todos os & por &amp; senao erro de parse do XML no servidor

      commandLabel = commandLabel.toString();
      /* Normal behaviour */
      var args = {model: model, sessionId: sessionId, instanceNumber: instanceNumber, commandLabel: commandLabel, forceInterpretation: forceInterpretation};
      try {
          var client = Soap.createClient(url);
          var result = client.getInstance(args);
      }
      catch (err) {
          if(err.error === 'soap-creation') {
              throw new Meteor.Error(500, "We're sorry! The service is currently unavailable. Please try again later.");
          }
          else if (err.error === 'soap-method') {
              throw new Meteor.Error(501, "We're sorry! The service is currently unavailable. Please try again later.");
          }
      }
      var resultObject = JSON.parse(result[Object.keys(result)[0]]);

      /* ----- Command Type search --------*/
      var commandType = "unknown";
      var command = "unknown";
      var commandNumber = 0;
      var control= false;

      if(commandLabel.includes("check"))  {commandType = "check"; control = true;} /*if the command have no label */
      if(commandLabel.includes("run"))    {commandType = "run"; control = true;}
      if(commandLabel.includes("assert")) {commandType = "assert"; control = true;}
      if(commandType === "unknown"){ commandType = getCommandType(model,commandLabel);}   /*if the command have any label */

      /* ----- Store exec data --------*/
      if(instanceNumber == 0){
        var derivatedOf="Original";
        if(cid != "Original" && (link = Link.findOne({_id:cid})) && !last_id){ derivatedOf = link.model_id; }
        else if(last_id) derivatedOf = last_id; /*Save model derivation */

        model_id =  Model.insert({  whole: model,
                                    derivationOf : derivatedOf,
                                    time : new Date().toLocaleString()
                                });

        var sat = (result.unsat) ? false : true;
        if(control) command = commandType; else command = commandType + " " + commandLabel;
          var runID = Run.insert({  sat : sat,
              model: model_id,
              command : command,
              time : new Date().toLocaleString()

          });
      }
      /* handle result*/
      if(resultObject.syntax_error){
          throw new Meteor.Error(502, resultObject);
      } else {
          resultObject.number=instanceNumber;
          resultObject.commandType=commandType;
          resultObject.last_id = model_id;
          resultObject.runID = runID;
          return resultObject;
      }
     },


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

    /*From 'model' get the command type with the label specified on 'commandLabel'*/
    function getCommandType(model,commandLabel) {
      var checkExp = RegExp("check(\ )+"+commandLabel,'g');
      var assertExp = RegExp("assert(\ )+"+commandLabel,'g');
      var runExp = RegExp("run(\ )+"+commandLabel,'g');

      if(checkExp.test(model)){return "check";}
      if(assertExp.test(model)){return "assert";}
      if(runExp.test(model)){return "run";}

      return "unknown";
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
