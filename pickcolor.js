function PickColor(name, title, className, imgClose, imgOk, imgReset, callbackOk, callbackCancel)
{

    this.name = name;
    this.title = title;
    this.callbackOk = callbackOk;
    this.callbackCancel = callbackCancel;
    this.imgClose = imgClose;
    this.imgOk = imgOk;
    this.imgReset = imgReset;

    this.defColorBg = "rgb(255,255,255)";
    this.defColorFg = "rgb(0,0,0)";

    this.currentColorIsBg = true;


    this.sampleText = "Dm";

    if (!this.name || this.name == null || this.name === "")
    {
        this.name = "colorpickr";
    }

    if (!this.title || this.title == null || this.title === "")
    {
        this.title = null;
    }

    if (!className || className == null || /^[ \t]*$/.test(className))
    {
        className = name + "-cssclass";
    }

    this.className = className;


    for (let i = 0; i < document.styleSheets.length; i++)
    {
        let styleSheet = document.styleSheets[i];

        let styles;
        if (styleSheet.cssRules)
        {
            styles = styleSheet.cssRules;
        }
        if (styleSheet.rules)
        {
            styles = styleSheet.rules;
        }

        if (styles)
        {
            for (let j = 0; j < styles.length; j++)
            {
                if (styles[j].selectorText && styles[j].selectorText.trim() === "." + this.className)
                {
                    this.cssRule = styles[j];
                    break;
                }
            }
            if (this.cssRule)
            {
                if (this.cssRule.style)
                {
                    if (this.cssRule.style.color)
                    {
                        this.pickedColorFg = this.cssRule.style.color;
                        this.defColorFg = this.cssRule.style.color;
                    }
                    if (this.cssRule.style.backgroundColor)
                    {
                        this.pickedColorBg = this.cssRule.style.backgroundColor;
                        this.defColorBg = this.cssRule.style.backgroundColor;
                    }
                }
                break;
            }
        }
    }

    if (!this.cssRule)
    {
        this.styleName = "PickColorStyle-" + this.name;
        let styleEl = document.getElementById(this.styleName);
        if (!styleEl)
        {
            styleEl = document.createElement("style");
            styleEl.id = this.styleName;
            styleEl.type = "text/css";
            document.head.appendChild(styleEl);
        }
        let stylesheet = styleEl.sheet;
        let rules = stylesheet.cssRules;
        if (!rules)
        {
            rules = stylesheet.rules;
        }

        let re = new RegExp("^[ \t]*\\." + this.className + "[ \t]*$");
        for (let i = 0; i < rules.length; i++)
        {
            if (re.test(rules[i].selectorText))
            {
                this.cssRule = rules[i];
                break;
            }
        }

        if (!this.cssRule)
        {
            stylesheet.insertRule("." + this.className + " { }");
        }
        this.cssRule = stylesheet.rules[0];
        if (!re.test(this.cssRule.selectorText))
        {
            throw("PickColor: cannot add CSS for class " + this.className);
        }
    }

    this.cssRule.style.color = this.pickedColorFg;
    this.cssRule.style.backgroundColor = this.pickedColorBg;

    this.coverDiv = document.createElement("div");
    this.coverDiv.id = this.name + "-cover";
    this.coverDiv.className = "pickcolor-cover";
    this.coverDiv.style["position"] = "absolute";
    this.coverDiv.style["top"] = "0";
    this.coverDiv.style["bottom"] = "0";
    this.coverDiv.style["left"] = "0";
    this.coverDiv.style["right"] = "0";
    this.coverDiv.style["display"] = "none";

    this.div = document.createElement("div");
    this.div.id = this.name;
    this.div.className = "pickcolor-window";

    this.headDiv = document.createElement("div");
    this.headDiv.id = this.name + "-head";
    this.headDiv.className = "pickcolor-head";

    this.buttonCloseDiv = document.createElement("div");
    this.buttonCloseDiv.id = this.name + "-close";
    this.buttonCloseDiv.className = "pickcolor" + "-button";

    this.buttonOkDiv = document.createElement("div");
    this.buttonOkDiv.id = this.name + "-ok";
    this.buttonOkDiv.className = "pickcolor" + "-button";

    this.buttonResetDiv = document.createElement("div");
    this.buttonResetDiv.id = this.name + "-reset";
    this.buttonResetDiv.className = "pickcolor" + "-button";

    this.buttonCloseImg = document.createElement("img");
    this.buttonOkImg = document.createElement("img");
    this.buttonResetImg = document.createElement("img");

    this.buttonCloseImg.draggable = false;
    this.buttonResetImg.draggable = false;
    this.buttonOkImg.draggable = false;

    if (this.imgClose && this.imgClose != null)
    {
        this.buttonCloseImg.src = this.imgClose;
    }
    if (this.imgOk && this.imgOk != null)
    {
        this.buttonOkImg.src = this.imgOk;
    }
    if (this.imgReset && this.imgReset != null
    )
    {
        this.buttonResetImg.src = this.imgReset;
    }

    this.titleDiv = document.createElement("div");
    this.titleDiv.id = this.name + "-title";
    this.titleDiv.className = "pickcolor-title";

    this.parametersDiv = document.createElement("div");
    this.parametersDiv.id = this.name + "-parameters";
    this.parametersDiv.className = "pickcolor-parameters";

    this.sampleDiv = document.createElement("div");
    this.sampleDiv.id = this.name + "-sample";
    this.sampleDiv.className = this.className + " pickcolor-sample";


    this.sampleDivText = document.createElement("div");
    this.sampleDivText.id = this.name + "-sample-text";
    this.sampleDivText.className = "pickcolor-sample-text";

    this.sampleDivText.appendChild(document.createTextNode(this.sampleText));
    this.sampleDiv.appendChild(this.sampleDivText);

    this.formDiv = document.createElement("div");
    this.formDiv.id = this.name + "-form";
    this.formDiv.className = "pickcolor-form";

    this.redInput = document.createElement("input");
    this.redInput.type = "text";
    this.redInput.pattern = "[0-9]{1,3}";
    this.redInput.autocomplete = "off";
    this.redInput.id = this.name + "-red";
    this.redInput["pickcolor-index"] = 0;

    this.greenInput = document.createElement("input");
    this.greenInput.type = "text";
    this.greenInput.pattern = "[0-9]{1,3}";
    this.greenInput.autocomplete = "off";
    this.greenInput.id = this.name + "-green";
    this.redInput["pickcolor-index"] = 1;

    this.blueInput = document.createElement("input");
    this.blueInput.type = "text";
    this.blueInput.pattern = "[0-9]{1,3}";
    this.blueInput.autocomplete = "off";
    this.blueInput.id = this.name + "-blue";
    this.redInput["pickcolor-index"] = 2;

    let d;

    d = document.createElement("div");
    d.appendChild(document.createElement("div"));
    d.appendChild(this.redInput);
    this.formDiv.appendChild(d);

    d = document.createElement("div");
    d.appendChild(document.createElement("div"));
    d.appendChild(this.greenInput);
    this.formDiv.appendChild(d);

    d = document.createElement("div");
    d.appendChild(document.createElement("div"));
    d.appendChild(this.blueInput);
    this.formDiv.appendChild(d);

    this.currentColorNumberDiv = document.createElement("div");
    this.currentColorNumberDiv.id = this.name + "-currentcolornumber";
    this.currentColorNumberDiv.className = "pickcolor-currentcolornumber";
    this.formDiv.appendChild(this.currentColorNumberDiv);


    this.parametersDiv.appendChild(this.sampleDiv);
    this.parametersDiv.appendChild(this.formDiv);


    this.innerDiv = document.createElement("div");
    this.innerDiv.id = this.name + "-inner";
    this.innerDiv.className = "pickcolor-inner";

    this.canvasContainer = document.createElement("div");
    this.canvasContainer.id = this.name + "-canvascontainer";
    this.canvasContainer.className = "pickcolor-canvascontainer";

    this.canvas = document.createElement("canvas");

    /////////////////////////////////////////////
    this.canvasContainer.appendChild(this.canvas);

    this.innerDiv.appendChild(this.canvasContainer);
    this.innerDiv.appendChild(this.parametersDiv);

    this.buttonCloseDiv.appendChild(this.buttonCloseImg);
    this.buttonOkDiv.appendChild(this.buttonOkImg);
    this.buttonResetDiv.appendChild(this.buttonResetImg);

    if (this.title != null)
    {
        this.titleDiv.appendChild(document.createTextNode(this.title));
    }

    this.headDiv.appendChild(this.buttonCloseDiv);
    this.headDiv.appendChild(this.buttonOkDiv);
    this.headDiv.appendChild(this.buttonResetDiv);
    this.headDiv.appendChild(this.titleDiv);
    //this.headDiv.appendChild(this.sampleDiv);

    this.div.appendChild(this.headDiv);
    this.div.appendChild(this.innerDiv);
    this.div.style["display"] = "none";

    document.body.appendChild(this.coverDiv);
    document.body.appendChild(this.div);

    this.div.style["opacity"] = "0";
    this.div.style["display"] = "block";

    let cr = this.canvasContainer.getBoundingClientRect();
    this.canvas.width = cr.width;
    this.canvas.height = cr.height;

    this.div.style["display"] = "none";
    this.div.style["opacity"] = "1";


    this.addButtonsListeners();

    this.loadColors();

    if (Drag)
    {
        //Drag(selector, handleSelector, dragClass, dropData, moveToBody, createReplacer)
        this.drag = new Drag(this.div, this.titleDiv, null, null, false, false);
    }
}


PickColor.prototype.getCss = function ()
{
    return (this.cssRule.cssText);
};

PickColor.prototype.addButtonsListeners = function ()
{
    let self = this;

    U.addListener(this.buttonCloseDiv, "click", function ()
    {
        self.hide();
        self.pickedColorBg = self.defColorBg;
        self.pickedColorFg = self.defColorFg;
        self.setColor();
        self.setColorInputs();
        self.drawPalette();
    });
    U.addListener(this.buttonOkDiv, "click", function ()
    {
        if (self.callbackOk)
        {
            self.callbackOk();
        }
        self.defColorBg = self.pickedColorBg;
        self.defColorFg = self.pickedColorFg;
        self.saveColors();
        self.hide();
    });
    U.addListener(this.buttonResetDiv, "click", function ()
    {
        self.loadColors();
        self.pickedColorBg = self.defColorBg;
        self.pickedColorFg = self.defColorFg;
        //self.setColor();
        if (self.callbackCancel)
        {
            self.callbackCancel();
        }
    });

    U.addListener(this.sampleDiv, "click", function (e)
    {
        self.currentColorIsBg = true;
        self.setColorInputs();
        self.setColor();
        self.sampleDivText.style.fontSize = null;
        self.sampleDivText.style.fontWeight = null;
        self.drawCurrentGradient();
        e.stopPropagation();
    });
    U.addListener(this.sampleDivText, "click", function (e)
    {
        self.currentColorIsBg = false;
        self.setColorInputs();
        self.setColor();
        self.sampleDivText.style.fontSize = "150%";
        self.sampleDivText.style.fontWeight = "bold";
        self.drawCurrentGradient();
        e.stopPropagation();
    });

    U.addListener(this.redInput, "change paste drop keydown keyup", function (e)
    {
        self.inputChange(e)
    });
    U.addListener(this.greenInput, "change paste drop keydown keyup", function (e)
    {
        self.inputChange(e)
    });
    U.addListener(this.blueInput, "change paste drop keydown keyup", function (e)
    {
        self.inputChange(e)
    });
};

PickColor.prototype.inputChange = function (e)
{

    let input = e.target;

    console.log("event=" + e.type + ", target=" + input + ", value=" + input.value + ", key=" + e.key);

    if (e.key && !e.key.match(/[0-9]/)
        && !e.key.match(/backspace/i)
        && !e.key.match(/delete/i)
        && !e.key.match(/home/i)
        && !e.key.match(/end/i)
        && !e.key.match(/arrow.*/i)
    )
    {
        e.preventDefault();
        return (false);
    }

    if (!e.key || !e.key.match(/[0-9]/) || e.type !== "keydown")
    {
        while (input.value.charAt(0) === '0' && input.value.length > 1)
        {
            input.value = input.value.substr(1);
        }
        let color = parseInt(input.value);
        if (color < 0 || isNaN(color)) input.value = 0;
        if (color > 255) input.value = 255;
    }
    else
    {
        let selectionStart = input.selectionStart;
        let selectionEnd = input.selectionEnd;

        let value = [input.value.slice(0, selectionStart), e.key, input.value.slice(selectionEnd)].join("");

        console.log("New value=" + value); //277

        let color = parseInt(value);
        if (color < 0 || isNaN(color))
        {
            e.preventDefault();
        }
        if (color > 255)
        {
            e.preventDefault();
        }
    }
    if (e.type === "paste"
        || e.type === "drop"
        || e.type === "change"
        || e.type === "keyup")
    {
        if (this.currentColorIsBg)
        {
            this.pickedColorBg = "rgb(" + this.redInput.value + ", "
                                 + this.greenInput.value + ", "
                                 + this.blueInput.value + ")";
        }
        else
        {
            this.pickedColorFg = "rgb(" + this.redInput.value + ", "
                                 + this.greenInput.value + ", "
                                 + this.blueInput.value + ")";
        }
        this.setColor();
    }
};

PickColor.prototype.setColorInputs = function (color)
{
    if (!color)
    {
        color = this.currentColorIsBg ? this.pickedColorBg : this.pickedColorFg;
    }
    if (color.constructor !== Array)
    {
        color = this.parseColorStr(color);
    }
    if (color[0] < 0) color[0] = 0;
    if (color[0] > 255) color[0] = 255;
    this.redInput.value = color[0];

    if (color[1] < 0) color[1] = 0;
    if (color[1] > 255) color[1] = 255;
    this.greenInput.value = color[1];

    if (color[2] < 0) color[2] = 0;
    if (color[2] > 255) color[2] = 255;
    this.blueInput.value = color[2];
};


PickColor.prototype.setColor = function ()
{
    this.cssRule.style.backgroundColor = this.pickedColorBg;
    this.cssRule.style.color = this.pickedColorFg;


    let color = this.currentColorIsBg ? this.parseColorStr(this.pickedColorBg) : this.parseColorStr(this.pickedColorFg);

    let hexVals = "#";
    for (let i = 0; i < 3; i++)
    {
        let hexVal = parseInt(color[i]).toString(16);
        if (hexVal.length < 2) hexVal = "0" + hexVal;
        hexVals += hexVal;
    }

    U.setText(this.currentColorNumberDiv, hexVals.toUpperCase());


    if (this.callbackOk)
    {
        this.callbackOk();
    }

};
PickColor.prototype.parseColorStr = function (strColor)
{
    let color = [];

    let sColor = strColor.toLowerCase().replace(/^[\t ]*rgb[a]*[\t ]*\(/, "").split(",");

    let i;
    for (i = 0; i < sColor.length; i++)
    {
        if (sColor[i])
        {
            color[i] = parseFloat(sColor[i]);
            if (color[i] < 0) color[i] = 0;
            if (color[i] > 255) color[i] = 255;
        }
        else
        {
            color[i] = 0;
        }
    }
    for(;i<3;i++)
    {
        color[i]=0;
    }
    return (color);
};

PickColor.prototype.pick = function ()
{
    this.show();
};
PickColor.prototype.pickColor = function ()
{
    this.show();
};
PickColor.prototype.show = function ()
{
    this.setColorInputs();
    this.coverDiv.style["display"] = "block";
    this.div.style["display"] = "block";
    this.div.scrollIntoView();
};

PickColor.prototype.hide = function ()
{
    this.coverDiv.style["display"] = "none";
    this.div.style["display"] = "none";
};

PickColor.prototype.GREYWIDTH = 40.0;
PickColor.prototype.BUFFERWIDTH = 1530.0 + PickColor.prototype.GREYWIDTH;
PickColor.prototype.BUFFERHEIGHT = 256.0;

PickColor.prototype.drawPalette = function ()
{
    let self = this;
    let ctxt = this.canvas.getContext("2d");

    ctxt.setTransform(1, 0, 0, 1, 0, 0);
    ctxt.globalCompositeOperation = "source-over";
    ctxt.globalAlpha = 1;
    let scaleX = this.canvas.width / this.BUFFERWIDTH;
    let scaleY = this.canvas.height / this.BUFFERHEIGHT;

    let ctxtBuffer;
    if (!PickColor.prototype.bufferCanvas)
    {
        PickColor.prototype.bufferCanvas = document.createElement("canvas");
        PickColor.prototype.bufferCanvas.width = this.BUFFERWIDTH;
        PickColor.prototype.bufferCanvas.height = this.BUFFERHEIGHT;

        ctxtBuffer = PickColor.prototype.bufferCanvas.getContext("2d");
        ctxtBuffer.setTransform(1, 0, 0, 1, 0, 0);
        ctxtBuffer.globalCompositeOperation = "source-over";
        ctxtBuffer.globalAlpha = 1;

        ctxtBuffer.fillStyle = "#ffffff";
        ctxtBuffer.clearRect(0, 0, this.BUFFERWIDTH, this.BUFFERHEIGHT);
        ctxtBuffer.fillRect(0, 0, this.BUFFERWIDTH, this.BUFFERHEIGHT);


        /*
                        r    g    b    !
                       ----------------+---------
                        255  0    0    !
                                       ! 0  1  0
                        255  255  0    !
                                       !-1  0  0
                        0    255  0    !
                                       ! 0  0  1
                        0    255  255  !
                                       ! 0 -1  0
                        0    0    255  !
                                       ! 1  0  0
                        255  0    255  !
                                       ! 0  0 -1
         */
        let rgb = [255, 0, 0];
        let deltas = [[0, 1, 0],
            [-1, 0, 0],
            [0, 0, 1],
            [0, -1, 0],
            [1, 0, 0],
            [0, 0, -1]
        ];

        let current = 0;
        for (let watch = 0; watch < deltas.length; watch++)
        {
            for (let i = 0; i <= 255; i++)
            {
                for (let j = 0; j < 3; j++)
                {
                    rgb[j] += deltas[watch][j];
                }
                let color = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
                let grad = ctxtBuffer.createLinearGradient(0, 0, 0, 256);
                grad.addColorStop(0, "#fff");
                grad.addColorStop(.5, color);
                grad.addColorStop(1, "#000");
                ctxtBuffer.fillStyle = grad;
                ctxtBuffer.fillRect(current, 0, 1, 256);
                //console.log("x=" + current + ", r=" + rgb[0] + ",g=" + rgb[1] + ",b=" + rgb[2]);
                current++;
            }
        }
    }

    ctxtBuffer = this.bufferCanvas.getContext("2d");

    let grad = ctxtBuffer.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "rgb(255,255,255)");
    grad.addColorStop(.05, "rgb(255,255,255)");
    grad.addColorStop(1, "rgb(0,0,0)");
    ctxtBuffer.fillStyle = grad;
    ctxtBuffer.fillRect(this.BUFFERWIDTH - this.GREYWIDTH + this.GREYWIDTH / 2, 0, this.GREYWIDTH / 2, 256);

    this.drawCurrentGradient(true);

    //console.log("scale x=" + scaleX + ", y=" + scaleY + ". Size x=" + this.canvas.width + ", y=" + this.canvas.height);
    ctxt.scale(scaleX, scaleY);
    ctxt.drawImage(this.bufferCanvas, 0, 0);

    this.canvas.addEventListener("click", function (e)
    {
        e.stopPropagation();

        // Calculate position
        let elementRect = self.canvas.getBoundingClientRect();
        let offsetLeft = elementRect.left - window.pageXOffset;
        let offsetTop = elementRect.top - window.pageYOffset;
        // Done calc position

        //onsole.log("clicked poiint x="+e.offsetX+", y="+e.offsetY);

        let x = (e.offsetX /*- offsetLeft*/) / scaleX;
        let y = (e.offsetY /*- offsetTop*/) / scaleY;
        let color = ctxtBuffer.getImageData(x, y, 1, 1).data;
        if (x > (self.BUFFERWIDTH - self.GREYWIDTH / 2))
        {
            color[2] = color[1] = color[0];
        }

        let pickedColor;
        let currentColor;
        if (self.currentColorIsBg)
        {
            currentColor = self.pickedColorBg;
        }
        else
        {
            currentColor = self.pickedColorFg;
        }
        let currentColorColors = self.parseColorStr(currentColor);
        if (currentColorColors.length > 3)
        {
            pickedColor = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + currentColorColors[3] + ")";
        }
        else
        {
            pickedColor = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
        }
        if (self.currentColorIsBg)
        {
            self.pickedColorBg = pickedColor;
        }
        else
        {
            self.pickedColorFg = pickedColor;
        }

        self.setColor();

        self.redInput.value = color[0].toString();
        self.greenInput.value = color[1].toString();
        self.blueInput.value = color[2].toString();

        if (x <= self.BUFFERWIDTH - self.GREYWIDTH)
        {
            self.drawCurrentGradient();
        }
    });

};

PickColor.prototype.drawCurrentGradient = function (dontDraw)
{
    if (!this.bufferCanvas)
    {
        this.drawPalette();
    }

    let ctxt = this.canvas.getContext("2d");
    ctxt.setTransform(1, 0, 0, 1, 0, 0);
    ctxt.globalCompositeOperation = "source-over";
    ctxt.globalAlpha = 1;
    let scaleX = this.canvas.width / this.BUFFERWIDTH;
    let scaleY = this.canvas.height / this.BUFFERHEIGHT;

    let color = this.currentColorIsBg ? this.parseColorStr(this.pickedColorBg) : this.parseColorStr(this.pickedColorFg);
    let sColor = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
    let ctxtBuffer = PickColor.prototype.bufferCanvas.getContext("2d");
    ctxtBuffer.setTransform(1, 0, 0, 1, 0, 0);
    ctxtBuffer.globalCompositeOperation = "source-over";
    ctxtBuffer.globalAlpha = 1;

    let grad = ctxtBuffer.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "rgb(255,255,255)");
    grad.addColorStop(.5, sColor);
    grad.addColorStop(1, "rgb(0,0,0)");
    ctxtBuffer.fillStyle = grad;
    ctxtBuffer.fillRect(this.BUFFERWIDTH - this.GREYWIDTH, 0, this.GREYWIDTH / 2, 256);

    if (!dontDraw)
    {
        ctxt.scale(scaleX, scaleY);
        ctxt.drawImage(this.bufferCanvas, 0, 0);
    }
};


PickColor.prototype.saveColors = function ()
{
    localStorage.setItem(this.name + "-bg", this.pickedColorBg);
    localStorage.setItem(this.name + "-fg", this.pickedColorFg);
};

PickColor.prototype.loadColors = function ()
{
    this.pickedColorBg = localStorage.getItem(this.name + "-bg");
    this.pickedColorFg = localStorage.getItem(this.name + "-fg");
    if (!this.pickedColorBg)
    {
        this.pickedColorBg = this.defColorBg;
    }
    if (!this.pickedColorFg)
    {
        this.pickedColorFg = this.defColorFg;
    }
    this.defColorBg = this.pickedColorBg;
    this.defColorFg = this.pickedColorFg;
    this.saveColors();

    this.setColor();
    this.setColorInputs();
    this.drawPalette();
};

PickColor.prototype.getColors = function ()
{
    return ({background: this.pickedColorBg, foreground: this.pickedColorFg});
};


