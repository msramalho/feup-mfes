import {
    zeroclipboard,
    getAnchorWithLink
} from "../../lib/editor/clipboard"
import {
    displayError
} from "../../lib/editor/feedback"
export {
    clickGenUrl,
    containsValidSecretWithAnonymousCommand
}

/**
 * Function to handle click on "Share" button
 */
function clickGenUrl() {
    if ($("#genURL > button").is(":disabled")) return

    let modelToShare = textEditor.getValue();
    let callGenerate = function() { // reusable function
        Meteor.call('genURL', modelToShare, Session.get("last_id"), handleGenURLEvent);
    }

    if (containsValidSecretWithAnonymousCommand(modelToShare)) {
        swal({
            title: "This model contains an anonymous Command!",
            text: "Are you sure you want to share it?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, share it!",
            closeOnConfirm: true
        }, callGenerate)
    } else callGenerate()
}

function containsValidSecretWithAnonymousCommand(model) {
    let lastSecret = 0;
    while ((i = model.indexOf("//SECRET\n", lastSecret)) >= 0) {
        let s = model.substr(i + "//SECRET\n".length).trim();
        // if the remaning text matches the regex below than it has an anonymous command
        if (s.match("^(assert|run|check)([ \t\n])*[{]")) return true;
        lastSecret = i + 1;
    }
    return false;
}

/* genUrlbtn event handler after genUrl method */
function handleGenURLEvent(err, result) {
    if (err) return displayError(err)
    // if the URL was generated successfully, create and append a new element to the HTML containing it.
    let url = getAnchorWithLink(result['public'], "public link");
    let urlPrivate = getAnchorWithLink(result['private'], "private link");

    let textcenter = document.createElement('div');
    textcenter.className = "text-center";
    textcenter.id = "permalink";
    textcenter.appendChild(url);
    if (urlPrivate) textcenter.appendChild(urlPrivate);

    $('#url-permalink').empty() //remove previous links
    document.getElementById('url-permalink').appendChild(textcenter);
    $("#genUrl > button").prop('disabled', true);
    zeroclipboard();

    //update the value of the last model id
    Session.set("last_id", result.last_id); // this will change on every derivation
}