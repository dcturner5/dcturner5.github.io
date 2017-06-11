function print(string) {
    console.log("RedEngine :: " + string);
}

function warn(string) {
    console.warn("RedEngine :: " + string);
}

function error(string) {
    console.error("RedEngine :: " + string);
}

function Engine(canvasId, canvasWidth, canvasHeight) {
    /*Initialize Canvas Element*/
    this.canvas = document.getElementById(canvasId);
    this.canvas.style.imageRendering = "crisp-edges";
    this.canvas.style.imageRendering = "pixelated";
    this.context = this.canvas.getContext("2d");
    if(canvasWidth != null) this.canvas.width = canvasWidth;
    if(canvasHeight != null) this.canvas.height = canvasHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    /*Initialize Key Array And Event Listeners*/
    this.toggles = new Array();
    this.keys = new Array(256);
    for(var i = 0; i < 256; i++) {
        this.keys[i] = false;
    }

    window.addEventListener("keydown", function(e) {
        this.keys[e.keyCode] = true;
        for(var i = 0; i < this.toggles.length; i++) {
            var toggle = this.toggles[i];
            if(toggle.code == e.keyCode && toggle.active) toggle.update(true);
        }
    }.bind(this), false);

    window.addEventListener("keyup", function(e) {
        this.keys[e.keyCode] = false;
        for(var i = 0; i < this.toggles.length; i++) {
            var toggle = this.toggles[i];
            if(toggle.code == e.keyCode && toggle.active) toggle.update(false);
        }
    }.bind(this), false);

    this.key = function(string) {
        var code;
        if(string.length === 1) code = string.charCodeAt(0);
        else if(string === "SPACE") code = 32;
        else if(string === "LEFT") code = 37;
        else if(string === "UP") code = 38;
        else if(string === "RIGHT") code = 39;
        else if(string === "DOWN") code = 40;
        if(code != null) return this.keys[code];
        return false;
    };

    /*Initialize Mouse Event Listeners*/
    this.canvas.addEventListener("mousedown",function() {
        var e = {
            x: event.x - this.canvas.offsetLeft,
            y: event.y - this.canvas.offsetTop,
            button: event.button
        };
        e.x = Math.floor((e.x / parseInt(this.canvas.style.width)) * this.canvas.width);
        e.y = Math.floor((e.y / parseInt(this.canvas.style.height)) * this.canvas.height);
        this.onMouseDown(e);
    }.bind(this), false);

    this.canvas.addEventListener("mouseup",function() {
        var e = {
            x: event.x - this.canvas.offsetLeft,
            y: event.y - this.canvas.offsetTop,
            button: event.button
        };
        e.x = Math.floor((e.x / parseInt(this.canvas.style.width)) * this.canvas.width);
        e.y = Math.floor((e.y / parseInt(this.canvas.style.height)) * this.canvas.height);
        this.onMouseUp(e);
    }.bind(this), false);

    this.canvas.addEventListener("mousemove",function() {
        var e = {
            x: event.x - this.canvas.offsetLeft,
            y: event.y - this.canvas.offsetTop,
            button: event.button
        };
        e.x = Math.floor((e.x / parseInt(this.canvas.style.width)) * this.canvas.width);
        e.y = Math.floor((e.y / parseInt(this.canvas.style.height)) * this.canvas.height);
        this.onMouseMove(e);
    }.bind(this), false);

    this.canvas.addEventListener("mousewheel",function() {
        var e = {
            x: event.x - this.canvas.offsetLeft,
            y: event.y - this.canvas.offsetTop,
            delta: event.wheelDeltaY
        };
        e.x = Math.floor((e.x / parseInt(this.canvas.style.width)) * this.canvas.width);
        e.y = Math.floor((e.y / parseInt(this.canvas.style.height)) * this.canvas.height);
        this.onMouseWheel(e);
    }.bind(this), false);

    this.onMouseDown = function(e) {};
    this.onMouseUp = function(e) {};
    this.onMouseMove = function(e) {};
    this.onMouseWheel = function(e) {};

    /*Initialize Main Engine Functions*/
    this.start = function() {
        this.init();
        this.running = true;
        this.last = this.getMillis();
        this.loop();
    };

    this.stop = function() {
        this.running = false;
    };

    this.loop = function() {
        var now = this.getMillis();
        var delta = now - this.last;
        this.ups = Math.round(1000 / delta);
        this.fps = this.ups;
        this.update();
        this.render(this.context);
        this.last = now;
        if(this.running) requestAnimationFrame(this.loop.bind(this));
    };

    this.update = function() {};
    this.render = function(context) {};
    this.init = function() {};

    this.getPath = function() {
        var scripts = document.head.getElementsByTagName("script");
        for(var i = 0; i < scripts.length; i++) {
            var source = scripts[i].src;
            var index = source.indexOf("Engine.js");
            if(index != -1) return source.slice(0, index);
        }
    };

    /*Loads In Additional Scripts Through: engine.load(src);*/
    this.load = function(source) {
        source = source.substring(0, 1).toUpperCase() + source.substring(1).toLowerCase();
        var script = document.createElement("script");
        script.src = this.getPath() + source + ".js";
        document.head.appendChild(script);
    };

    /*Clears Canvas Screen When Called*/
    this.clear = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    this.setClearColor = function(color) {
        this.canvas.style.backgroundColor = color;
    };

    this.resize = function(width, height) {
        var ratio = this.canvas.width / this.canvas.height;
        height = height || window.innerHeight - 160;
        width = width || height * ratio;
        this.canvas.style.width =  width + "px";
        this.canvas.style.height = height + "px";
    };

    this.setAutoResize = function(state) {
        if(state) {
            this.resize();
            document.body.onresize = function() {
                this.resize();
            }.bind(this);
        }
        else {
            document.body.onresize = function() {

            };
        }
    };

    this.addToggleKey = function(string, a, b) {
        return new ToggleKey(this, string, a, b);
    };

    this.getMillis = function() {
        return new Date().getMilliseconds();
    };

    /*ServerSocket Client*/
    this.client = null;
}

function ToggleKey(engine, string, a, b) {
    this.engine = engine;
    this.active = true;
    this.code = 0;
    if(string.length === 1) this.code = string.charCodeAt(0);
    else if(string === "SPACE") this.code = 32;
    else if(string === "LEFT") this.code = 37;
    else if(string === "UP") this.code = 38;
    else if(string === "RIGHT") this.code = 39;
    else if(string === "DOWN") this.code = 40;
    this.a = a;
    this.b = b;
    this.state = false;
    this.ready = true;
    this.update = function(value) {
        if(this.ready && value) {
            if(!this.state) {
                this.state = true;
                this.a();
            }
            else {
                this.state = false;
                this.b();
            }
        }
        else if(!value) this.ready = true;
    };
    engine.toggles.push(this);
}

function SpriteSheet(source) {
    this.image = new Image();
    this.width = 0;
    this.height = 0;
    this.load = function(source, callback) {
        this.image.src = source;
        this.width = this.image.width;
        this.height = this.image.height;
    };
    if(source) this.load(source);
}

function Sprite(spritesheet, sx, sy, swidth, sheight) {
    this.spritesheet = spritesheet;
    this.width = spritesheet.width;
    this.height = spritesheet.height;

    if(sx != null && sy != null) {
        this.sx = sx;
        this.sy = sy;
    } else {
        this.sx = 0;
        this.sy = 0;
    }
    if(sheight != null && sheight != null) {
        this.swidth = swidth;
        this.sheight = sheight;
    } else {
        this.swidth = this.width;
        this.sheight = this.height;
    }
    this.render = function(context, x, y, width, height) {
        if(width == null) width = this.swidth;
        if(height == null) height = this.sheight;
        context.drawImage(this.spritesheet.image, this.sx, this.sy, this.swidth, this.sheight, x, y, width, height);
    };
}

function Color(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a || 1.0;

    this.getHex = function() {
        return "#" + ("0" + parseInt(this.r, 10).toString(16)).slice(-2) + ("0" + parseInt(this.g, 10).toString(16)).slice(-2) + ("0" + parseInt(this.b, 10).toString(16)).slice(-2);
    };
    this.getRGB = function() {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    };
    this.getRGBA = function() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    };
    this.getInteger = function() {
        return ((this.r & 0x0ff) << 16) | ((this.g & 0x0ff) << 8) | (this.b & 0x0ff);
    };

    this.blend = function(color, i) {
        var r = (this.r + i * (color.r - this.r));
        var g = (this.g + i * (color.g - this.g));
        var b = (this.b + i * (color.b - this.b));
        return new Color(r, g, b, this.a);
    };
    this.darken = function(i) {
        var r = this.r * i;
        var g = this.g * i;
        var b = this.b * i;
        return new Color(r, g, b, this.a);
    };
}

function Timer(time) {
    this.current = 0;
    this.time = time;
    this.ready = function() {
        if(this.current > this.time) return true;
        else return false;
    };
    this.reset = function() {
        this.current = 0;
    };
    this.update = function() {
        this.current++;
    };
    this.forceReady = function() {
        this.current = this.time + 1;
    };
}














function Collider(entity) {
    this.entity = entity;
    this.update = function(aabb) {
        var x = 9007199254740991;
        var y = 9007199254740991;
        var box = this.entity.getAABB();
        for(var i=0; i<aabb.length; i++) {
            var box1 = aabb[i];
            if (box.getCollision(box1)) {
                var mtv = box.getTranslationVector(box1);
                if(Math.abs(mtv.x) < Math.abs(x) && mtv.x !== 0) x = mtv.x;
                if(Math.abs(mtv.y) < Math.abs(y) && mtv.y !== 0) y = mtv.y;
            }
        }
        if(x == 9007199254740991) x = 0;
        if(y == 9007199254740991) y = 0;
        return new Vector(x, y);
    }
}

function AABB(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;

    this.getCollision = function(b) {
        if(this.x >= b.x + b.width || this.y >= b.y + b.height || this.x + this.width <= b.x || this.y + this.height <= b.y) return false;
        return true;
    }

    this.getTranslationVector = function(b) {
        var mtv = new Vector(0, 0);

        var amin = this.getMin();
        var amax = this.getMax();
        var bmin = b.getMin();
        var bmax = b.getMax();

        var left = bmin.x - amax.x;
        var right = bmax.x - amin.x;
        var top = bmin.y - amax.y;
        var bottom = bmax.y - amin.y;

        if(Math.abs(left) < right) mtv.x = left;
        else mtv.x = right;
        if(Math.abs(top) < bottom) mtv.y = top;
        else mtv.y = bottom;

        if(Math.abs(mtv.x) < Math.abs(mtv.y)) mtv.y = 0;
        else mtv.x = 0;

        return mtv;
    }

    this.getMin = function() {
        return new Vector(this.x, this.y);
    }
    this.getMax = function() {
        return new Vector(this.x + this.width, this.y + this.height);
    }
}







