import classie from 'classie';
import 'qtip2/src/core.css';

import {
    clickGenUrl
} from "./genUrl"
import {
    downloadTree
} from "./downloadTree"
import {
    zeroclipboard,
    getAnchorWithLink
} from "../../lib/editor/clipboard"
import {
    displayError
} from "../../lib/editor/feedback"

// Globals
/** @var instances The received instances */
instances = [];

/** @var instanceIndex The current instance index */
instanceIndex = 0;

/** @var maxInstanceNumber The number of instances in the variable instances */
maxInstanceNumber = -1;

/*Each template has a local dictionary of helpers that are made available to it, and this call specifies helpers to add to the template’s dictionary.*/
Template.alloyEditor.helpers({

    getMaxIntanceNumber() {
        return process.env.MAX_INSTANCES;
    },

    drawInstance() {
        const instanceNumber = Session.get('currentInstance');
        if (instanceNumber == 0) $('#prev > button').prop('disabled', true);
        if (instanceNumber != undefined) {
            const instance = getCurrentInstance(instanceNumber);
            if (instance) {
                updateGraph(instance);
            }
        }
    },
    getCommands() {
        const commands = Session.get('commands');
        if (commands && commands.length > 1) {
            $('.command-selection').show();
        } else $('.command-selection').hide();
        return commands;
    },
    getTargetNode() {
        const target = Session.get('targetNode');
        if (target) return target.label;
    },
    getType() {
        const target = Session.get('targetNode');
        if (target) return target.label.split('$')[0];
    },

});
Template.alloyEditor.events({
    'click #exec': function () {
        if ($("#exec > button").is(":disabled")) return;

        currentlyProjectedTypes = [];
        currentFramePosition = {};
        allAtoms = [];
        atomPositions = {};
        $(".frame-navigation").hide();

        let commandLabel = getCommandLabel();
        if (!commandLabel || commandLabel.length == 0) { //no command to run
            swal({
                title: "",
                text: "There are no commands to execute",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            });
        } else { // Execute command
            let model = textEditor.getValue();
            Meteor.call('getInstances', model, commandLabel, Session.get("last_id"), Session.get("original_id"), Session.get("from_private"), handleExecuteModel);
        }
        // update button states after execution
        $("#exec > button").prop('disabled', true);
        $("#next > button").prop('disabled', false);
    },
    'change .command-selection > select'() {
        $('#exec > button').prop('disabled', false);
    },
    'click #genUrl': clickGenUrl,
    'click #prev': function (evt) {
        if ($("#prev > button").is(":disabled")) return
        if (evt.toElement.id != "prev") {
            let ni = getPreviousInstance();
            if (typeof ni !== 'undefined') {
                updateGraph(ni);
                if (instanceIndex == 0) {
                    $("#prev > button").prop('disabled', true);
                }
                $("#next > button").prop('disabled', false);
            }
        }
    },
    'click #next': function (evt) {
        if ($("#next > button").is(":disabled")) return
        if (evt.toElement.id != "next") {
            let ni = getNextInstance();
            if (typeof ni !== 'undefined') {
                if (ni.unsat) {
                    $('#next > button').prop('disabled', true);
                    swal("No more satisfying instances!", "", "error");
                } else {
                    updateGraph(ni);
                }
                if (instanceIndex + 1 == maxInstanceNumber) {
                    $("#next > button").prop('disabled', true);
                }
                $("#prev > button").prop('disabled', false);
            }
        }
    },
    'click #genInstanceUrl'() {
        const themeData = {
            atomSettings,
            relationSettings,
            generalSettings,
            currentFramePosition,
            currentlyProjectedTypes,
            metaPrimSigs,
            metaSubsetSigs,
        };

        Meteor.call("storeInstance", Session.get("last_id"), getCommandLabel(), cy.json(), themeData, handleGenInstanceURLEvent)
    },
    'click #validateModel'() { // click on the validate button
        Meteor.call('validate', textEditor.getValue(), (err, res) => {
            if (err) return displayError(err)
            else {
                res = JSON.parse(res);
                if (!res.success) {
                    addErrorMarkerToGutter(res.errorMessage, res.errorLocation.line);
                    swal({
                        title: "There is at least an error on line " + res.errorLocation.line + "!",
                        text: "The corresponding line has been highlighted in the text area!",
                        type: "error"
                    });
                } else { // success
                    swal({
                        title: 'The Model is Valid!',
                        text: "You're doing great!",
                        type: "success"
                    });
                }
            }
        });
    },
    'click #downloadTree': downloadTree
});
/* Callbacks added with this method are called once when an instance of Template.alloyEditor is rendered into DOM nodes and put into the document for the first time. */
Template.alloyEditor.onRendered(() => {
    try {
        cy;
    } catch (e) {
        initGraphViewer('instance');
    }

    buttonsEffects(); //Adds click effects to Buttons
    hideButtons(); //Hide Next, Previous, Run... buttons on startup

    $("#next").css("display", 'none');
    $("#prev").css("display", 'none');
    

    if (Router.current().data && textEditor) { // if there's subscribed data, process it.
        let model = Router.current().data(); // load the model from controller
        textEditor.setValue(model.code); // update the textEditor
        // save the loaded model id for later derivations
        Session.set("last_id", model.model_id); // this will change on execute
        Session.set("original_id", model.model_id); // this will only change on share model
        Session.set("from_private", model.from_private); // this will not change
        Session.set("hidden_commands", model.commands) // update the commands for public links that do not have them
        Session.set("commands", model.commands) // update the commands to start correct

        if(model.from_private) $("#downloadTree > button").prop('disabled', false);

        if (model.instance) { // if there is an instance to show
            let themeData = model.instance.theme;
            atomSettings = themeData.atomSettings;
            relationSettings = themeData.relationSettings;
            generalSettings = themeData.generalSettings;
            currentFramePosition = themeData.currentFramePosition;
            currentlyProjectedTypes = themeData.currentlyProjectedTypes;
            if (themeData.metaPrimSigs) metaPrimSigs = themeData.metaPrimSigs;
            if (themeData.metaSubsetSigs) metaSubsetSigs = themeData.metaSubsetSigs;
            if (cy) { //Load graph JSON data in case of instance sharing.
                $('#instanceViewer').show();
                cy.add(model.instance.graph.elements);
                updateElementSelectionContent();
            }
        }
    }
    styleRightClickMenu();
    $('#optionsMenu').hide();
});

/* ------------- Server HANDLERS methods && Aux Functions ----------- */


function handleExecuteModel(err, result) {
    if (err) {
        $('#next > button').prop('disabled', true);
        $('#prev > button').prop('disabled', true);
        return displayError(err)
    }

    Session.set("last_id", result.last_id) // update the last_id for next derivations

    $.unblockUI();
    $('#exec > button').prop('disabled', true);
    $('#url-permalink').empty() //remove previous links
    $("#genUrl > button").prop('disabled', false); // Restart shareModel option

    //clear projection combo box
    let select = document.getElementsByClassName("framePickerTarget");
    if (select) select = select[0];
    if (select) {
        let length = select.options.length;
        for (i = 0; i < length; i++) select.remove(0);
    }

    $('#instanceViewer').hide();
    $("#log").empty();
    let command = $('.command-selection > select option:selected').text();


    result = result.instances
    storeInstances(result);
    if (Array.isArray(result))
        result = result[0];
    if (result.commandType && result.commandType == "check") {
        /* if the commandType == check */

        let log = document.createElement('div');
        log.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        let paragraph = document.createElement('p');

        if (result.unsat) {
            $('#instancenav').hide();
            paragraph.innerHTML = "No counter-examples. " + command + " solved!";
            paragraph.className = "log-complete";
        } else {
            paragraph.innerHTML = "Invalid solution, checking " + command + " revealed a counter-example.";
            paragraph.className = "log-wrong";
            updateGraph(result);

            $("#next").css("display", 'initial');
            $("#prev").css("display", 'initial');
        }

        log.appendChild(paragraph);
        $("#log")[0].appendChild(log);
    }

    if (result.unsat) { // no counter examples found
        $('.empty-univ').fadeIn();
        $('#instanceViewer').hide();
        $("#genInstanceUrl").hide();
    }

    if (result.syntax_error) swal("There is a syntax error!", "Please validate your model.", "error");

}

function storeInstances(allInstances) {
    instances = allInstances;
    instanceIndex = 0;
    maxInstanceNumber = allInstances.length;
}

function getNextInstance() {
    return instances[++instanceIndex];
}

function getPreviousInstance() {
    return instances[--instanceIndex];
}

function getCommandLabel() {
    return Session.get("commands").length > 1 ? $('.command-selection > select option:selected').text() : Session.get("commands")[0];
}

// geninstanceurlbtn event handler after storeInstance method
function handleGenInstanceURLEvent(err, result) {
    if (err) return displayError(err)

    // if the URL was generated successfully, create and append a new element to the HTML containing it.
    let url = getAnchorWithLink(result, "instance link");

    let textcenter = document.createElement('div');
    textcenter.className = "text-center";
    textcenter.id = "instance_permalink";
    textcenter.appendChild(url);

    $("#url-instance-permalink").empty()
    document.getElementById('url-instance-permalink').appendChild(textcenter);
    $("#genInstanceUrl > button").prop('disabled', true);
    zeroclipboard();
}

getCurrentInstance = function () {
    return instances[instanceIndex]
};

/* onRendered aux functions */
function buttonsEffects() {
    function mobilecheck() {
        let check = false;
        (function (a) {
            if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        }(navigator.userAgent || navigator.vendor || window.opera));
        return check;
    }

    const support = {
        animations: Modernizr.cssanimations,
    };


    const animEndEventNames = {
        WebkitAnimation: 'webkitAnimationEnd',
        OAnimation: 'oAnimationEnd',
        msAnimation: 'MSAnimationEnd',
        animation: 'animationend',
    };


    const animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];


    const onEndAnimation = function (el, callback) {
        var onEndCallbackFn = function (ev) {
            if (support.animations) {
                if (ev.target != this) return;
                this.removeEventListener(animEndEventName, onEndCallbackFn);
            }
            if (callback && typeof callback === 'function') {
                callback.call();
            }
        };
        if (support.animations) {
            el.addEventListener(animEndEventName, onEndCallbackFn);
        } else {
            onEndCallbackFn();
        }
    };


    const eventtype = mobilecheck() ? 'touchstart' : 'click';

    [].slice.call(document.querySelectorAll('.cbutton')).forEach((el) => {
        el.addEventListener(eventtype, () => {
            classie.add(el, 'cbutton--click');
            onEndAnimation(classie.has(el, 'cbutton--complex') ? el.querySelector('.cbutton__helper') : el, () => {
                classie.remove(el, 'cbutton--click');
            });
        });
    });
}

function hideButtons() {
    $('#exec > button').prop('disabled', true);
    $('#next > button').prop('disabled', true);
    $('#prev > button').prop('disabled', true);
    $('#validateModel > button').prop('disabled', true);
    $('#downloadTree > button').prop('disabled', true);
    $('.permalink > button').prop('disabled', true);
}

function styleRightClickMenu() {
    //Right click menu styling
    $(".command-selection").hide();
    (function ($) {
        $(document).ready(function () {
            $('#cssmenu li.active').addClass('open').children('ul').show();
            $('#cssmenu li.has-sub>a').on('click', function () {
                $(this).removeAttr('href');
                var element = $(this).parent('li');
                if (element.hasClass('open')) {
                    element.removeClass('open');
                    element.find('li').removeClass('open');
                    element.find('ul').slideUp(200);
                } else {
                    element.addClass('open');
                    element.children('ul').slideDown(200);
                    element.siblings('li').children('ul').slideUp(200);
                    element.siblings('li').removeClass('open');
                    element.siblings('li').find('li').removeClass('open');
                    element.siblings('li').find('ul').slideUp(200);
                }
            });

        });
    })(jQuery);
}