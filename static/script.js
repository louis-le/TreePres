$(function(){
    // Create the tree inside the <div id="tree"> element.

    $("#tree").fancytree({

        extensions: ["persist", "wide", "filter"],
        source: {
            url: "/walk/"
        },
        checkbox: true,
        selectMode: 3,
        filter: {
            autoApply: true,  // Re-apply last filter if lazy data is loaded
            counter: true,  // Show a badge with number of matching child nodes near parent icons
            fuzzy: false,  // Match single characters in order, e.g. 'fb' will match 'FooBar'
            hideExpandedCounter: true,  // Hide counter badge, when parent is expanded
            highlight: true,  // Highlight matches by wrapping inside <mark> tags
            mode: "dimm"  // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
        },
        persist: {
            // Available options with their default:
            cookieDelimiter: "~",    // character used to join key strings
            cookiePrefix: undefined, // 'fancytree-<treeId>-' by default
            cookie: { // settings passed to jquery.cookie plugin
              raw: false,
              expires: "",
              path: "",
              domain: "",
              secure: false
            },
            expandLazy: false, // true: recursively expand and load lazy nodes
            overrideSource: true,  // true: cookie takes precedence over `source` data attributes.
            store: "auto",     // 'cookie': use cookie, 'local': use localStore, 'session': use sessionStore
            types: "expanded"  // which status types to store
        },

        activate: function(event, data) {
            $("#echoActive").text(data.node.title);
            $('#echoActivePath').text(data.node.key);
            document.getElementById('active').value = $("#echoActivePath").text();
            if(data.node.folder && document.getElementById("browse_button").files.length !== 0) {
                 document.getElementById("upload_button").disabled = false;
            } else {
                document.getElementById("upload_button").disabled = true;
            }
        },
        init: function(event, data, flag) {
            var node = $("#tree").fancytree("getRootNode");
            node.sortChildren(null, true);
        },
        select: function(event, data) {
            // Get a list of all selected nodes, and convert to a key array:
            var selKeys = $.map(data.tree.getSelectedNodes(true), function(node){
             return node.title;
            });
            $("#echoSelection").text(selKeys.join(", "));

            // Get a list of all selected TOP nodes
            var selRootNodes = data.tree.getSelectedNodes(true);
            // ... and convert to a key array:
            var selRootKeys = $.map(selRootNodes, function(node){
                return node.key;
            });
            $("#echoSelectionRootKeys").text(selRootKeys.join(", "));
            document.getElementById('paths').value = $("#echoSelectionRootKeys").text();

            if($("#echoSelection").text() === "") {
                document.getElementById("download_button").disabled = true;
            } else {
                document.getElementById("download_button").disabled = false;
            }
        },
        click: function(event, data) {
            var node = data.node,
            tt = $.ui.fancytree.getEventTargetType(event.originalEvent);
            if( tt !== "checkbox" && tt != "expander" ) {
                node.toggleExpanded();
            }
        },
    });

    $("#treetable").fancytree({
        extensions: ["table", "persist"],
        source: {
            url: "/walk/"
        },
        checkbox: true,
        selectMode: 3,
        persist: {
            // Available options with their default:
            cookieDelimiter: "~",    // character used to join key strings
            cookiePrefix: undefined, // 'fancytree-<treeId>-' by default
            cookie: { // settings passed to jquery.cookie plugin
              raw: false,
              expires: "",
              path: "",
              domain: "",
              secure: false
            },
            expandLazy: false, // true: recursively expand and load lazy nodes
            overrideSource: true,  // true: cookie takes precedence over `source` data attributes.
            store: "auto",     // 'cookie': use cookie, 'local': use localStore, 'session': use sessionStore
            types: "expanded"  // which status types to store
        },
        activate: function(event, data) {
            $("#echoActive").text(data.node.title);
            $('#echoActivePath').text(data.node.key);
            document.getElementById('active').value = $("#echoActivePath").text();
            if(data.node.folder && document.getElementById("browse_button").files.length !== 0) {
                 document.getElementById("upload_button").disabled = false;
            } else {
                document.getElementById("upload_button").disabled = true;
            }

        },
        init: function(event, data, flag) {
            var node = $("#tree").fancytree("getRootNode");
            node.sortChildren(null, true);
        },
        select: function(event, data) {
            // Get a list of all selected nodes, and convert to a key array:
            var selKeys = $.map(data.tree.getSelectedNodes(true), function(node){
             return node.title;
            });
            $("#echoSelection").text(selKeys.join(", "));

            // Get a list of all selected TOP nodes
            var selRootNodes = data.tree.getSelectedNodes(true);
            // ... and convert to a key array:
            var selRootKeys = $.map(selRootNodes, function(node){
                return node.key;
            });
            $("#echoSelectionRootKeys").text(selRootKeys.join(", "));
            document.getElementById('paths').value = $("#echoSelectionRootKeys").text();

            if($("#echoSelection").text() === "") {
                document.getElementById("download_button").disabled = true;
            } else {
                document.getElementById("download_button").disabled = false;
            }

        },
        click: function(event, data) {
            var node = data.node,
            tt = $.ui.fancytree.getEventTargetType(event.originalEvent);
            if( tt !== "checkbox" && tt != "expander" ) {
                node.toggleExpanded();
            }
        },
        renderColumns: function(event, data) {
            var node = data.node,
            $tdList = $(node.tr).find(">td");
            $tdList.eq(1).text(node.key);
            $tdList.eq(2).text(!!node.folder);
        }
    });

    var tree;
    if($('#viewChoices').val() === "A") {
        tree = $("#tree");
    } else {
        tree = $("#treetable");
    }

    $("button").button();

    $("button#sort").click(function(event){
        var node = tree.fancytree("getRootNode");
        node.sortChildren(null, true);
        var node = tree.fancytree("getRootNode");
        node.sortChildren(null, true);
    });

    $("button#reset").click(function(event){
        tree.fancytree("getRootNode").visit(function(node){
            node.setExpanded(false);
            node.setSelected(false);
        });
        data.node.setActive();
    });

    $("button#toggle").click(function(event){
        tree.fancytree("getRootNode").visit(function(node){
            node.toggleExpanded();
        });
    });

    $("input:file").change(function() {
        if($(this).val()) {
             document.getElementById("upload_button").disabled = false;
        } else {
            document.getElementById("upload_button").disabled = true;
        }
    });

    $('document').ready(function() {
        // Hidding and showing specific tree.
        $('.trees').hide();
        $('#'+$('#viewChoices').val()).show();

        document.getElementById("upload_button").disabled = true;
        document.getElementById("download_button").disabled = true;
    });

    $('#viewChoices').change(function () {
        $('.trees').hide();
        $('#'+$(this).val()).show();
        if($('#viewChoices').val() === "A") {
            tree = $("#tree");
        } else {
            tree = $("#treetable");
        }
    });

    $("input[name=search]").keyup(function(e){
        var n,
        opts = {
            counter: true,
            hideExpandedCounter: true,
            highlight: true,
        },
        match = $(this).val();

        if(e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === ""){
            $("button#btnResetSearch").click();
            return;
        }
        // Pass a string to perform case insensitive matching
        n = tree.fancytree("getTree").filterNodes(match);

        $("button#btnResetSearch").attr("disabled", false);
        $("span#matches").text("(" + n + " matches)");
    }).focus();

    $("button#btnResetSearch").click(function(e){
        $("input[name=search]").val("");
        $("span#matches").text("");
        tree.fancytree("getTree").clearFilter();
    }).attr("disabled", true);
});

var selDiv = "";

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    document.querySelector('#browse_button').addEventListener('change', handleFileSelect, false);
    selDiv = document.querySelector("#upload-file-info");
}

function handleFileSelect(e) {

    if(!e.target.files) return;

    selDiv.innerHTML = "";

    var files = e.target.files;
    for(var i=0; i<files.length; i++) {
        var f = files[i];
        selDiv.innerHTML += f.name + "<br/>";
    }

}