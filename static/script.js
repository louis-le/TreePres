$(function(){
    // Create the tree inside the <div id="tree"> element.
    $("#tree").fancytree({
        extensions: ["persist", "themeroller"],
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
            types: "active expanded focus selected"  // which status types to store
        },

        activate: function(event, data) {
            $("#echoActive").text(data.node.title);
            $('#echoActivePath').text(data.node.key);
            document.getElementById('active').value = $("#echoActivePath").text();
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
            types: "active expanded focus selected"  // which status types to store
        },
        activate: function(event, data) {
            $("#echoActive").text(data.node.title);
            $('#echoActivePath').text(data.node.key);
            document.getElementById('active').value = $("#echoActivePath").text();
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

    $("button").button();
    // $("button#expand").click(function(event){
    //     $("#tree").fancytree("getRootNode").visit(function(node){
    //         node.setExpanded(true);
    //     });
    // });

    $("button#sort").click(function(event){
        var node1 = $("#tree").fancytree("getRootNode");
        node.sortChildren(null, true);
    });

    $("button#collapse").click(function(event){
        $("#tree").fancytree("getRootNode").visit(function(node){
            node.setExpanded(false);
        });
    });

    $("button#toggle").click(function(event){
        $("#tree").fancytree("getRootNode").visit(function(node){
            node.toggleExpanded();
        });
    });

    $('document').ready(function() {
        $('select option[value="A"]').attr("selected",true);
    });

    $('#viewChoices').change(function () {
        $('#myTrees > div').hide();
        $('#myTrees').find('#' + $(this).val()).show();
    });
});
