window.onload = run;

function run()
{
    var drags = new Drag(".move", null, null, "Drag and drop data", true, true);

    /*U.addListener("div#droptarget1", "drop", function (e) {
        U.appendText("div#droptarget1", "drop event fired for " + e);
        e.preventDefault();
        e.stopPropagation();
    })
    U.addListener("div#droptarget1", "dragover", function (e) {
        U.appendText("div#droptarget1", "dragover event fired for " + e);
        e.preventDefault();
        e.stopPropagation();
    })
    U.addListener("div#droptarget1", "dragend", function (e) {
        U.appendText("div#droptarget1", "dragend event fired for " + e);
        e.preventDefault();
        e.stopPropagation();
    })*/

    U.addListener("div#droptarget1", "dragdrop", function (e)
    {
        var dt = e.detail;
        var d = new Date();
        var div = U.getEl("div#droptarget1");
        U.addText(div, d.toFullString() + " : ");
        U.addText(div, "drop event fddired for \"" + dt.data + "\"");
        U.addText(div, ":" + dt.element.tagName);
        U.addText(div, "." + dt.element.className);
        U.addText(div, "#" + dt.element.id + "\n");

        var thisDrag = e.detail.drag;
        var old = thisDrag.getOldElement();
        if (old && old != null)
        {
            if (old.parentNode.tagName != 'BODY')
            {
                old.parentNode.removeChild(old);
            }
            div.appendChild(old);
            thisDrag.stopDrag(function ()
                              {
                                  thisDrag.resumeDrag();
                              });
        }

        div.scrollTop = div.scrollHeight - div.getBoundingClientRect().height;
    });
    U.addListener("div#droptarget2", "dragdrop", function (e)
    {
        var dt = e.detail;
        var d = new Date();
        var div = U.getEl("div#droptarget2");
        U.addText(div, d.toFullString() + " : ");
        U.addText(div, "drop event fired for \"" + dt.data + "\"");
        U.addText(div, ":" + dt.element.tagName);
        U.addText(div, "." + dt.element.className);
        U.addText(div, "#" + dt.element.id + "\n");

        var thisDrag = e.detail.drag;
        var old = thisDrag.getOldElement();
        if (old && old != null)
        {
            if (old.parentNode.tagName != 'BODY')
            {
                old.parentNode.removeChild(old);
            }
            div.appendChild(old);
            thisDrag.stopDrag(function ()
                              {
                                  thisDrag.resumeDrag();
                              });
        }

        div.scrollTop = div.scrollHeight - div.getBoundingClientRect().height;
    });
    U.addListener("div#droptarget1", "dragdrag", function (e)
    {
        var dt = e.detail;
        var d = new Date();
        var div = U.getEl("div#droptarget1");
        U.addText(div, d.toFullString() + " : ");
        U.addText(div, "drag event fired for \"" + dt.data + "\"");
        U.addText(div, ":" + dt.element.tagName);
        U.addText(div, "." + dt.element.className);
        U.addText(div, "#" + dt.element.id + "\n");
        div.scrollTop = div.scrollHeight - div.getBoundingClientRect().height;
    });
    U.addListener("div#droptarget2", "dragdrag", function (e)
    {
        var dt = e.detail;
        var d = new Date();
        var div = U.getEl("div#droptarget2");
        U.addText(div, d.toFullString() + " : ");
        U.addText(div, "drag event fired for \"" + dt.data + "\"");
        U.addText(div, ":" + dt.element.tagName);
        U.addText(div, "." + dt.element.className);
        U.addText(div, "#" + dt.element.id + "\n");
        div.scrollTop = div.scrollHeight - div.getBoundingClientRect().height;
    });

    var stopDrag = U.getEl("button#stopdrag");
    var startDrag = U.getEl("button#startdrag");
    U.addListener(stopDrag, "click", function ()
    {
        for (var i = 0; i < drags.length; i++)
        {
            drags[i].stopDrag();
        }
    })
    U.addListener(startDrag, "click", function ()
    {
        drags = new Drag(".move", null, null, "Drag and drop data");
    })
}



