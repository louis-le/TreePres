$(function(){
    // Create the tree inside the <div id="tree"> element.
    $("#tree1").fancytree({
        source: {
            url: "/walk/"
        },
        checkbox: true,
        lazyLoad: function(event, data) {
            logEvent(event, data);
            // return children or any other node source
            data.result = {url: "ajax-sub2.json"};
        },
    });
});