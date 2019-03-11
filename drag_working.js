function Drag(selector, handleSelector, dragClass, dropData, moveToBody, createReplacer)
{
    if (!selector)
    {
        throw("Error: Cannot make nothing draggable - specify div to drag first");
    }

    if (typeof selector == "string")
    {
        if (!handleSelector)
        {
            var elements = document.querySelectorAll(selector);
            var drags = new Array();
            for (var i = 0; i < elements.length; i++)
            {
                drags.push(new Drag(elements[i], handleSelector, dragClass, dropData, moveToBody, createReplacer));
            }
            return (drags);
        }
        else
        {
            this.el = document.querySelector(selector);
        }
    }
    else
    {
        this.el = selector;
    }

    if (!this.el)
    {
        throw("Error: Element to drag not found: " + selector);
    }

    if (!handleSelector || handleSelector == null)
    {
        handleSelector = this.el;
    }

    if (typeof handleSelector === "string")
    {
        this.elEv = document.querySelector(handleSelector);
    }
    else
    {
        this.elEv = handleSelector;
    }
    if (!this.elEv)
    {
        throw("Error: Element to drag not found: " + handleSelector);
    }

    if (!dragClass || dragClass == null)
    {
        dragClass = "dragging";
    }

    this.dragClass = dragClass;
    this.id = "Drag-" + this.el.id;
    this.elementId = "Drag-" + this.el.id;

    this.prefix = "-replaced-by-drag";

    this.width = parseInt(document.defaultView.getComputedStyle(this.el).width, 10);
    this.height = parseInt(document.defaultView.getComputedStyle(this.el).height, 10);

    this.el.moveTo = function (x, y)
    {
        Drag.prototype.moveTo(x, y, self.el);
    }

    if (dropData && dropData != null)
    {
        this.dropData = dropData;
    }

    this.savedStyle = this.el.style;
    this.replacedCopy = null;

    var self = this;
    this.removeListener(this.elEv, "mousedown touchstart");
    this.addListener(this.elEv, "mousedown touchstart", function (e)
    {
        self.beginDrag(e);
    }, false);

    if (moveToBody)
    {
        this.moveToBody = true;
    }
    else
    {
        this.moveToBody = false;
    }

    if (createReplacer)
    {
        this.createReplacer = true;
    }
    else
    {
        this.createReplacer = false;
    }

    this.getSizingCorrection();
    //this.setPosition();
}

Drag.prototype.setPosition = function ()
{
    this.originalParent = this.el.parentNode;
    // Create replacing node to keep layout
    var cStyle = getComputedStyle(this.el);

    var replacer = null;
    if (this.createReplacer &&
        (!this.replacedCopy || this.replacedCopy == null ||
            this.replacedCopy.parentNode != this.el.parentNode))
    {
        if (cStyle.position != "absolute" && cStyle.position != "fixed" && cStyle.position != "relative")
        {
            replacer = this.cloneNode(this.el); // Need to replace moved div to keep the whole layout

            replacer.style["opacity"] = 0;
            replacer.style["z-index"] = "-100";
        }
        else
        {
            replacer = document.createElement("div");
            replacer.style.width = "0px";
            replacer.style.height = "0px";
            replacer.style.margin = "0px";
            replacer.style.border = "0px";
            replacer.style.padding = "0px";
        }
    }

    // Get current position and size

    var left;
    var top;
    var vpo = this.getOffset(this.el);
    if (this.moveToBody)
    {
        left = vpo.left;
        top = vpo.top;
    }
    else
    {
        top = this.el.offsetTop;
        left = this.el.offsetLeft;
    }

    /*console.log("Current top=" + top + ", currentLeft=" + left);
    console.log("Parent top=" + this.el.offsetParent.offsetTop +
        ", parent left=" + this.el.offsetParent.offsetLeft);
    */


    var width = parseFloat(cStyle.width);
    var height = parseFloat(cStyle.height);


    if (isNaN(width) || isNaN(height) || this.getSizingCorrection(cStyle.boxSizing))
    {
        width = this.el.offsetWidth;
        height = this.el.offsetHeight;
    }
    
    //console.log("parent node=" + this.el.parentNode.tagName + "#" + this.el.parentNode.id);
    //console.log("Computed top=" + top + ", left=" + left);

    if (replacer != null) // Need to insert replacing node
    {
        this.replacedCopy = replacer;
        this.replacedCopy.id = this.el.id + this.prefix;
        this.originalParent.insertBefore(this.replacedCopy, this.el);
    }
    if (this.moveToBody && this.el.parentNode !== document.body)
    {
        document.body.appendChild(this.el);
        //console.log("Moved to body");
    }

    this.el.style.position = "absolute";
    this.el.style.display = "block";
    this.el.style.margin = "0";

    this.el.style.left = left + "px";
    this.el.style.top = top + "px";

    this.el.dragSavedLeft = left;
    this.el.dragSavedTop = top;

    this.el.style.width = width + "px";
    this.el.style.height = height + "px";
}

Drag.prototype.getElement = function ()
{
    return (this.el);
}

Drag.prototype.calculate = function ()
{
    this.beginDrag({pageX: 0, pageY: 0});
    this.endDrag(this);
    return (this);
}

Drag.prototype.beginDrag = function (event)
{

    var self = this;

    this.setPosition();

    //var elRect = this.el.getBoundingClientRect();

    var positionX;
    var positionY;
    if (event.type === "touchstart")
    {
        positionX = event.touches[0].pageX;
        positionY = event.touches[0].pageY;
    }
    else
    {
        positionX = event.pageX;
        positionY = event.pageY;
    }

    this.startX = positionX;
    this.startY = positionY;

    this.el.dragSavedLeft = parseFloat(this.el.style.left);
    this.el.dragSavedTop = parseFloat(this.el.style.top);

    this.el.className = this.el.className.replace(new RegExp("(^|\\s+)" + this.dragClass + "($|\\s+)", "g"), " ")
        .trim();

    this.el.className += " " + this.dragClass;
    this.addListener(document.documentElement, "mousemove", function (e)
    {
        self.doDrag(e);
    });
    this.addListener(this.elEv, "touchmove", function (e)
    {
        self.doDrag(e);
    }, false);

    this.addListener(document.documentElement, "mouseup", function (e)
    {
        self.endDrag(e);
    });
    this.addListener(this.elEv, "touchend", function (e)
    {
        self.endDrag(e);
    });

//console.log("Begin: initial X="+divLeft+", Y="+divTop);

    /*
    // Save drag source to fire drag event at the end of the drag
        var touchX;
        var touchY;
        if (event.type == "touchmove")
        {
            touchX = parseFloat(event.touches[0].clientX);
            touchY = parseFloat(event.touches[0].clientY);
        }
        else
        {
            touchX = parseFloat(event.clientX);
            touchY = parseFloat(event.clientY);
        }

        var savedDisplay = this.el.style.display;
        this.el.style.display = "none";
        var dragTarget = document.elementFromPoint(touchX, touchY);
        this.el.style.display = savedDisplay;
        if (dragTarget && dragTarget != null)
        {
            this.draggedFrom = dragTarget;
        }
    */

    if (event.preventDefault)
    {
        event.preventDefault();
    }
    if (event.stopPropagation)
    {
        event.stopPropagation();
    }

    return (false);
}

Drag.prototype.doDrag = function (event)
{
    var touchX;
    var touchY;

    if (event.type === "touchmove")
    {
        touchX = parseFloat(event.touches[0].pageX);
        touchY = parseFloat(event.touches[0].pageY);
    }
    else
    {
        touchX = parseFloat(event.pageX);
        touchY = parseFloat(event.pageY);
    }

    var dx = touchX - this.startX;
    var dy = touchY - this.startY;

    var newX = this.el.dragSavedLeft + dx;
    var newY = +this.el.dragSavedTop + dy;

    this.el.style.left = newX + "px";
    this.el.style.top = newY + "px";

    // Save drag source to fire drag event at the end of the drag
    if (!this.wasDragDrop || this.wasDragDrop == null)
    {
        this.wasDragDrop = true;

        if (this.originalParent)
        {
            this.draggedFrom = this.originalParent;

            var dragEvent = new CustomEvent("dragdrag",
                {
                    bubbles: true,
                    detail: {
                        data: this.dropData,
                        element: this.el,
                        drag: this
                    }
                });
            this.draggedFrom.dispatchEvent(dragEvent);
        }

        /*
        var posX = touchX - window.pageXOffset;
        var posY = touchY - window.pageYOffset;

        var savedDisplay = this.el.style.display;
        this.el.style.display = "none";
        var dragTarget = document.elementFromPoint(posX, posY);
        this.el.style.display = savedDisplay;
        if (dragTarget && dragTarget != null)
        {
            this.draggedFrom = dragTarget;
        }
        if (this.draggedFrom && this.draggedFrom != null )
        {
            var dragEvent = new CustomEvent("dragdrag",
                                            {
                                                bubbles: true,
                                                detail: {
                                                    data: this.dropData,
                                                    element: this.el,
                                                    drag: this
                                                }
                                            });
            this.draggedFrom.dispatchEvent(dragEvent);
        }
        */

    }

    if (event.preventDefault)
    {
        event.preventDefault();
    }
    if (event.stopPropagation)
    {
        event.stopPropagation();
    }

    return (false);
}

Drag.prototype.endDrag = function (event)
{
    this.el.className = this.el.className.replace(new RegExp("(^|\\s+)" + this.dragClass + "($|\\s+)", "g"), " ")
        .trim();
    this.removeListener(document.documentElement, "mousemove");
    this.removeListener(document.documentElement, "mouseup");
    this.removeListener(document.documentElement, "mousedown");
    this.removeListener(this.elEv, "touchmove");
    this.removeListener(this.elEv, "touchend");

    if (!event.type)
    {
        return (false);
    }

    var posX = 0;
    var posY = 0;
    if (event.type === "touchmove")
    {
        posX = parseFloat(event.touches[0].pageX) - window.pageXOffset;
        posY = parseFloat(event.touches[0].pageY) - window.pageYOffset;
    }
    else
    {
        posX = parseFloat(event.pageX) - window.pageXOffset;
        posY = parseFloat(event.pageY) - window.pageYOffset;
    }

    if (this.wasDragDrop)
    {
        var savedDisplay = this.el.style.display;
        this.el.style.display = "none";
        var dropTarget = document.elementFromPoint(posX, posY);
        this.el.style.display = savedDisplay;
        /*        if (this.draggedFrom && this.draggedFrom != null /!*&& this.draggedFrom != dropTarget*!/)
                {
                    var dragEvent = new CustomEvent("dragdrag",
                        {
                            bubbles: true,
                            detail: {
                                data: this.dropData,
                                element: this.el,
                                drag: this
                            }
                        });
                    this.draggedFrom.dispatchEvent(dragEvent);
                }*/
        if (dropTarget && dropTarget != null /*&& dropTarget != this.draggedFrom*/)
        {
            var dropEvent = new CustomEvent("dragdrop",
                {
                    bubbles: true,
                    detail: {
                        data: this.dropData,
                        element: this.el,
                        drag: this
                    }
                });
            dropTarget.dispatchEvent(dropEvent);
        }
        this.wasDragDrop = false;
    }

    return (false);
}

Drag.prototype.cloneNode = function (nodeFrom)
{
    if (!nodeFrom)
    {
        return (null);
    }

    var replacer = nodeFrom.cloneNode(false);

    if (replacer && replacer.tagName && typeof replacer.tagName == "string")
    {
        if (replacer.tagName.toLowerCase() == "input" || replacer.tagName.toLowerCase() == "button")
        {
            replacer.readOnly = true;
        }
        var cStyle = document.defaultView.getComputedStyle(nodeFrom);
        for (var prop in cStyle)
        {
            if (cStyle[prop] && cStyle[prop] != "" && typeof cStyle[prop] != "function")
            {
                replacer.style[prop] = cStyle[prop];
            }
        }
    }

    for (var i = 0; i < nodeFrom.childNodes.length; i++)
    {
        var ch = nodeFrom.childNodes[i];
        var newChild = this.cloneNode(ch);
        if (newChild)
        {
            replacer.appendChild(newChild);
        }
        else
        {
            break;
        }
    }

    return (replacer);
}

Drag.prototype.addListener = function (el, type, foo, capture)
{
    if (el == undefined || el == null)
    {
        return;
    }

    var types = type.split(/\s+/);
    for (var i = 0; i < types.length; i++)
    {
        var listenerName = this.elementId + "-drag-" + types[i];
        var oldFoo = el[listenerName];
        if (oldFoo != undefined && oldFoo != null)
        {
            el.removeEventListener(types[i], oldFoo);
        }
        el[listenerName] = foo;
        el.addEventListener(types[i], el[listenerName], capture);
    }
}

Drag.prototype.removeListener = function (el, type)
{
    if (el == undefined || el == null)
    {
        return;
    }

    var types = type.split(/\s+/);
    for (var i = 0; i < types.length; i++)
    {
        var listenerName = this.elementId + "-drag-" + types[i];
        var foo = el[listenerName];
        if (foo != undefined && foo != null)
        {
            el.removeEventListener(types[i], foo);
        }
        delete el[listenerName];
    }
}

Drag.prototype.stopDrag = function (callback)
{
    this.endDrag({dummy: 0});
    this.removeListener(this.elEv, "mousedown touchstart mouseup touchend");

    if (this.replacedCopy && this.replacedCopy != null)
    {

        var self = this;
        this.moveTo(this.el, this.replacedCopy, function ()
        {
            self.el.parentNode.removeChild(self.el);
            self.replacedCopy.parentNode.insertBefore(self.el, self.replacedCopy);
            self.replacedCopy.parentNode.removeChild(self.replacedCopy);
            self.el.style = self.savedStyle;
            if (callback)
            {
                callback();
            }
        });
    }
    else
    {
        this.el.style = this.savedStyle;
        if (callback)
        {
            callback();
        }
    }
}

Drag.prototype.resumeDrag = function ()
{
    Drag.call(this, this.el, this.elEv, this.dragClass, this.dropData);
}

Drag.prototype.moveTo = function (el, refEl, callback)
{
    if (!el || el == null)
    {
        el = this.el;
    }
    if (!refEl || refEl == null)
    {
        refEl = document.body;
    }

    var destCoords = U.getOffset(refEl);

    var coords = U.getOffset(el);
    var dx = (destCoords.left - coords.left) / 50;
    var dy = (destCoords.top - coords.top) / 50;

    this.slowMove(destCoords.left, destCoords.top, dx, dy, el, callback);
}

Drag.prototype.getOldElement = function ()
{
    return (this.replacedCopy);
}
Drag.prototype.slowMove = function (dstX, dstY, dx, dy, el, callback)
{
    var coords = U.getOffset(el);

    var currentDx = dstX - coords.left;
    var currentDy = dstY - coords.top;

    var newDx = dstX - coords.left - dx;
    var newDy = dstY - coords.top - dy;

    //console.log("dx was "+currentDx+" now "+newDx);
    //console.log("                                    dy was "+currentDy+" now "+newDy);
    if (currentDx * newDx <= 0 || currentDy * newDy <= 0)
    {
        if (callback && callback != null)
        {
            callback();
            //console.log("Move done");
            return;
        }
    }

    var styleTop = parseFloat(el.style.top);
    var styleLeft = parseFloat(el.style.left);

    if (isNaN(styleTop)) styleTop = 0;
    if (isNaN(styleLeft)) styleLeft = 0;
    styleTop += dy;
    styleLeft += dx;
    el.style.top = styleTop + "px";
    el.style.left = styleLeft + "px";
    var self = this;
    setTimeout(function ()
    {
        self.slowMove(dstX, dstY, dx, dy, el, callback)
    }, 1);
}

Drag.prototype.getOffset = function (el)
{

    var nodeRect = el.getBoundingClientRect();

    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    var nodeTop = nodeRect.top + scrollTop;
    var nodeLeft = nodeRect.left + scrollLeft;
    return {top: nodeTop, left: nodeLeft}
}

Drag.prototype.getSizingCorrection = function (elBoxSizing)
{

    if (!Drag.prototype.boxSizingCorrection)
    {
        Drag.prototype.boxSizingCorrection = new Array();

        var boxSizing = ["border-box", "padding-box", "content-box"];

        for (var i = 0; i < boxSizing.length; i++)
        {
            var div = document.createElement("div");
            div.style.opacity = "0";
            div.style.position = "absolute";
            div.style.top = "-10";
            div.style.width = "10px";
            div.style.borderWidth = "7px";
            div.style.padding = "3px";


            div.style.boxSizing = boxSizing[i];
            document.body.appendChild(div);

            var style = getComputedStyle(div);
            var rect = div.getBoundingClientRect();

            //console.log(boxSizing[i] + ") style: " + style.width + ", rect: " + rect.width + ", offset: " + div.offsetWidth);
            if (parseInt(style.width) != 10)
            {
                this.boxSizingCorrection.push(boxSizing[i]);
            }
            else
            {
            }
            document.body.removeChild(div);
        }
        //console.log("Correction for: " + Drag.prototype.boxSizingCorrection);
    }

    if (elBoxSizing && Drag.prototype.boxSizingCorrection.indexOf(elBoxSizing) >= 0)
    {
        return (true);
    }
    return (false);
}



