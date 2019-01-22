/**
 * Functions that handle clipboard operations
 */
export {
    zeroclipboard,
    getAnchorWithLink,
    getUrlAndClipboard
}

function zeroclipboard() {
	$(".clipboardbutton").click(copyToClipboard)
};

/**
 * Generate html to show nad handle clipboard actions for Links
 * @param {ID} link of the Link
 * @param {String} title message to set in the link (usually "public url" or "private url")
 */
function getUrlAndClipboard(link, title) {
    return Blaze.toHTML(Blaze.With({
        title: title,
        link: link,
        fullLink: `${window.location.origin}/${link}`
    }, function() {
        return Template.shareLink;
    }));
}

function getAnchorWithLink(link, title) {
    if (!link) return
    return createElementFromHTML(getUrlAndClipboard(link, title))
}

/**
 * Generates a DOM elment from string
 * @param {String} htmlString the HTML code
 */
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

/**
 * Copy the data in the "data-clipboard-text" attribute 
 * into the user's clipboard, when a button with that
 * element as target is clicked
 * @param {DOMElement} element 
 */
function copyToClipboard(element) {
	let el = $(element.target)
	el = el.is("button")?el:el.parent("button")
	let text = el.attr("data-clipboard-text")

    let $temp = $("<input>")
    $("body").append($temp)
    $temp.val(text).select()
    document.execCommand("copy")
    $temp.remove()
}