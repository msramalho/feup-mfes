import {
    displayError
} from "../../lib/editor/feedback"

function downloadTree() {
    let linkId = Router.current().data()._id
    Meteor.call("downloadTree", linkId, (err, res) => {
        if (err) return displayError(err)
        let d = new Date()
        download(`tree_${linkId}_${d.getFullYear()}_${lz(d.getMonth()+1)}_${lz(d.getDate())}_${lz(d.getHours())}_${lz(d.getMinutes())}_${lz(d.getSeconds())}.json`, JSON.stringify(descendantsToTree(res)))
    })
}

/**
 * converts a list of flat descendants into a tree object 
 * using Hashmap and DFS
 * @param {Object} res with descendants and root as properties
 */
function descendantsToTree(res) {
    let descendants = res.descendants
    let root = res.root
    // get all the ids
    let ids = descendants.map(x => x._id)
    ids.push(root._id)
    // generate a hashmap of id -> direct child
    let hashmap = {}
    ids.forEach(id => hashmap[id] = []);
    descendants.forEach(model => {
        hashmap[model.derivationOf].push(model)
    });
    //depth first search to obtain recursive tree structure
    let current, queue = [root]
    while (queue.length) {
        current = queue.shift()
        current.children = current.children || []
        hashmap[current._id].forEach(model => {
            queue.push(model)
            current.children.push(model)
        });
    }
    return root
}

/**
 * 
 * @param {String} filename filename
 * @param {String} text content
 */
function download(filename, text) {
    let anchor = document.createElement('a');
    anchor.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    anchor.setAttribute('download', filename);

    anchor.style.display = 'none';
    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);
}

/**
 * Adds leading zeros to string: 9->09, 19->19
 * @param {String} s 
 */
function lz(s) {
    return ('0' + s).slice(-2)
}
export {
    downloadTree,
    descendantsToTree
}