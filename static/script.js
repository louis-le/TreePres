$(function(){
    // Create the tree inside the <div id="tree"> element.
    $("#tree1").fancytree({
        source: {
            url: "/walk/"
        },
        checkbox: true,
    });
    $("#tree2").fancytree({
        source: [
            {title: "Node 1", key: "1"},
            {title: "Folder 2", key: "2", folder: true, children: [
                {title: "Node 2.1", key: "3"},
                {title: "Node 2.2", key: "4"}
            ]}
        ],
    });
    $("#tree3").fancytree();
});