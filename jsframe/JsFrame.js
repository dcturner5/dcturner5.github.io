/*
 JsFrame Attributes:
 data-title
 data-x
 data-y
 data-color
 data-frameColor
 data-exitButtonColor
 data-exitButtonHoverColor
 data-exitButtonTextColor
*/
var JsFrame = {
    array: [],
    update: function() {
        this.array = [];
        var heads = document.getElementsByClassName("JsHead");
        while(heads[0]) heads[0].parentNode.removeChild(heads[0]);
        var elements = document.getElementsByClassName("JsFrame");
        for(var i = 0; i < elements.length; i++) this.array.push(new Element(elements[i]));
    },
    get: function(arg) {
        if(arg == null || arg.length < 1) return null;
        var firstChar = arg.charAt(0);
        if(firstChar === "#") {
            for(var i = 0; i < this.array.length; i++) {
                var element = this.array[i];
                if(element.element.id == arg.slice(1)) return element;
            }
        }
        else if(firstChar === ".") {
            var elements = [];
            for(var i = 0; i < this.array.length; i++) {
                var element = this.array[i];
                if(element.element.className == arg.slice(1)) elements.push(element);
            }
            return elements;
        }
        else {
            var elements = [];
            for(var i = 0; i < this.array.length; i++) {
                var element = this.array[i];
                if(element.element.tagName == arg) elements.push(element);
            }
            return elements;
        }
    }
};
JsFrame.update();

function Element(element) {
    this.element = element;
    this.mousex;
    this.mousey;
    this.active = false;
    this.disabled = false;
    this.onOpen = function() {};
    this.onClose = function() {};
    this.open = function() {
        this.onOpen();
        this.element.style.display = "inline-block";
    };
    this.close = function() {
        this.onClose();
        this.element.style.display = "none";
    };
    this.enable = function() {
        this.disabled = false;
    };
    this.disable = function() {
        this.disabled = true;
    };
    this.setPosition = function(x, y) {
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
    };
    this.fullScreen = function() {
        this.element.style.width = "99.5%";
        this.element.style.height = "99.5%";
        this.setPosition(0, 0);
    };
    this.startAnimation = function(radius, speed, fps) {
        fps = Math.min(fps, 60) || 60;
        this.stopAnimation();
        this.disabled = true;
        var time = 0;
        this.interval = setInterval(function() {
            this.setPosition(Math.cos(time) * radius + (Math.floor(window.innerWidth / 2) - Math.floor(this.getCSSValue(this.element, "width") / 2)), Math.sin(time) * radius + 100);
            time += speed;
        }.bind(this), 1000 / fps);
    };
    this.stopAnimation = function() {
        this.disabled = false;
        clearInterval(this.interval);
    };
    this.init = function() {
        var head = document.createElement("div");
        head.className = "JsHead";
        head.style.width = "100%";
        head.style.height = "24px";
        head.style.backgroundColor = this.element.getAttribute("data-frameColor") || "#eee";
        head.style.fontFamily = "arial";
        head.style.cursor = "pointer";
        head.innerHTML = this.element.getAttribute("data-title") || "";
        head.style.color = "black";
        this.element.insertBefore(head, this.element.childNodes[0]);

        var button = document.createElement("div");
        button.style.display = "inline-block";
        button.style.float = "right";
        button.style.margin = "2px";
        button.style.width = "20px";
        button.style.height = "20px";
        button.style.backgroundColor = this.element.getAttribute("data-exitButtonColor") || "#ccc";
        button.onmouseover = function() {button.style.backgroundColor = this.element.getAttribute("data-exitButtonHoverColor") || "#bbb"}.bind(this);
        button.onmouseleave = function() {button.style.backgroundColor = this.element.getAttribute("data-exitButtonColor") || "#ccc"}.bind(this);
        button.style.textAlign = "center";
        button.style.fontFamily = "arial";
        button.style.color = this.element.getAttribute("data-exitButtonTextColor") || "#eee";
        button.innerHTML = "&times;";
        button.onmousedown = function(){this.close();}.bind(this);
        head.appendChild(button);

        this.element.style.display = "inline-block";
        this.element.style.resize = this.element.getAttribute("data-resizable") || "none";
        this.element.style.overflow = "auto";
        this.element.style.backgroundColor = this.element.getAttribute("data-color") || "white";
        this.element.style.border = "solid 1px black";

        this.element.style.position = "absolute";
        this.setPosition(this.element.getAttribute("data-x") || (Math.floor(window.innerWidth / 2) - Math.floor(this.getCSSValue(this.element, "width") / 2)), this.element.getAttribute("data-y") || 32);

        head.addEventListener("mousedown", function(event) {
            if(this.disabled) return;
            this.mousex = event.clientX - parseInt(this.element.style.left);
            this.mousey = parseInt(window.getComputedStyle(head).height) / 2;
            this.active = true;
            var body = document.getElementsByTagName("body")[0];
            body.appendChild(this.element);
        }.bind(this),false);
        window.addEventListener("mouseup", function() {
            this.active = false;
        }.bind(this),false);
        window.addEventListener("mousemove", function(event) {
            if(this.active) this.setPosition(event.clientX - this.mousex, Math.max((event.clientY - this.mousey), 0));
        }.bind(this), false);
    };
    this.getCSSValue = function(element, property) {
        var value = window.getComputedStyle(element).getPropertyValue(property);
        if(isNaN(parseFloat(value))) {
            if(value.indexOf("%") != -1) {
                var parent = element.parentNode;
                var pvalue = this.getCSSValue(parent, property);
                value = parseFloat(value.slice(0, -1)) / 100;
                return value * pvalue;
            }
        } else {
            return parseFloat(value);
        }
    };
    this.init();
}