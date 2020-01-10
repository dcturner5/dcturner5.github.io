function Engine(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
    this.context.clearColor(0.0, 0.0, 0.0, 1.0);
    this.context.enable(this.context.DEPTH_TEST);
    this.context.depthFunc(this.context.LEQUAL);
    this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
    //this.context.enable(this.context.CULL_FACE);
    //this.context.frontFace(this.context.CCW);
    //this.context.cullFace(this.context.BACK);

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

    this.addToggleKey = function(string, a, b) {
        return new ToggleKey(this, string, a, b);
    };

    this.getMillis = function() {
        return new Date().getMilliseconds();
    };

    this.camera = new Camera();

    this.worldMatrix = new Float32Array(16);
    this.viewMatrix = new Float32Array(16);
    this.projMatrix = new Float32Array(16);

    this.positionLocation = null;
    this.normalLocation = null;
    this.colorLocation = null;

    this.matWorldUniformLocation = null;
    this.matViewUniformLocation = null;
    this.matProjUniformLocation = null;

    this.initShader = function(fragmentId, vertexId) {
        var gl = this.context;
        var fragmentShader = this.getShader(fragmentId);
        var vertexShader = this.getShader(vertexId);
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program.");
        }

        gl.useProgram(shaderProgram);

        this.positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
        gl.enableVertexAttribArray(this.positionLocation);

        //this.normalLocation = gl.getAttribLocation(shaderProgram, "a_normal");
        //gl.enableVertexAttribArray(this.normalLocation);

        this.colorLocation = gl.getAttribLocation(shaderProgram, "a_color");
        gl.enableVertexAttribArray(this.colorLocation);

        this.matWorldUniformLocation = gl.getUniformLocation(shaderProgram, 'u_world');
        this.matViewUniformLocation = gl.getUniformLocation(shaderProgram, 'u_view');
        this.matProjUniformLocation = gl.getUniformLocation(shaderProgram, 'u_proj');
    };


    this.getShader = function(id) {
        var gl = this.context;
        var shaderScript = document.getElementById(id);
        if (!shaderScript) return null;
        var theSource = "";
        var currentChild = shaderScript.firstChild;
        while(currentChild) {
            if (currentChild.nodeType == currentChild.TEXT_NODE) {
                theSource += currentChild.textContent;
            }
            currentChild = currentChild.nextSibling;
        }
        var shader;
        if (shaderScript.type == "fragment-shader") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "vertex-shader") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }
        gl.shaderSource(shader, theSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    };
}

function Camera() {
    this.pitch = 0;
    this.yaw = 0;

    this.eye = [0, 8, 0];
    this.center = [0, 8, 0];
    this.up = [0, 1, 0];

    this.update = function() {
        var yaw = this.yaw;
        this.center[0] = this.eye[0] + Math.cos(yaw);
        this.center[1] = this.eye[1];
        this.center[2] = this.eye[2] + Math.sin(yaw);
    };
}

function Model(engine, scale) {
    this.engine = engine;
    this.context = engine.context;

    this.vertices = null;
    this.indices = null;
    //this.normals = null;
    this.colors = null;

    this.scale = scale;

    this.initBuffer = function(vertexArray, indexArray, colorArray) {
        var gl = this.context;

        this.vertices = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

        this.indices = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);
        this.indices.numItems = indexArray.length;

        //this.normals = gl.createBuffer();
        //gl.bindBuffer(gl.ARRAY_BUFFER, this.normals);
        //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW);

        this.colors = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colors);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);
    };

    this.render = function() {
        var engine = this.engine;
        var gl = this.context;

        mat4.identity(engine.worldMatrix);
        mat4.lookAt(engine.viewMatrix, engine.camera.eye, engine.camera.center, engine.camera.up);
        mat4.perspective(engine.projMatrix, glMatrix.toRadian(45), engine.canvas.width / engine.canvas.height, 0.1, 1000.0);

        //mat4.rotate(engine.worldMatrix, engine.worldMatrix, this.angle, [0, 1, 0]);
        mat4.scalar.scale(engine.worldMatrix, engine.worldMatrix, [this.scale, this.scale, this.scale, 1]);

        gl.uniformMatrix4fv(engine.matWorldUniformLocation, gl.FALSE, engine.worldMatrix);
        gl.uniformMatrix4fv(engine.matViewUniformLocation, gl.FALSE, engine.viewMatrix);
        gl.uniformMatrix4fv(engine.matProjUniformLocation, gl.FALSE, engine.projMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
        gl.vertexAttribPointer(engine.positionLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

        //gl.bindBuffer(gl.ARRAY_BUFFER, this.normals);
        //gl.vertexAttribPointer(engine.normalLocation, 3, gl.FLOAT, gl.TRUE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colors);
        gl.vertexAttribPointer(engine.colorLocation, 4, gl.FLOAT, gl.FALSE, 4 * Float32Array.BYTES_PER_ELEMENT, 0);

        gl.drawElements(gl.TRIANGLES, this.indices.numItems, gl.UNSIGNED_SHORT, 0);
    }
}

function Texture(source) {
    this.image = new Image();
    this.image.crossOrigin = "Anonymous";
    this.image.src = source;
}

function Mesh(engine, scale) {
    this.engine = engine;
    this.context = engine.context;

    this.vertices = null;
    this.indices = null;
    this.colors = null;

    this.vertexArray = null;

    this.angle = 0;
    this.scale = scale;

    this.generate = function(size, invfreq) {
        var vertices = [];
        var indices = [];
        var colors = [];

        var step = 2 / size;
        for(var i = -1; i < 1; i += step) {
            for(var j = -1; j < 1; j += step) {
                vertices.push(i);
                vertices.push((Math.random() - .5) / invfreq);
                vertices.push(j);

                colors.push(Math.min(Math.random(), .5));
                colors.push(Math.min(Math.random() / 2 + .4, .8));
                colors.push(Math.min(Math.random(), .5));
                colors.push(1.0);
            }
        }

        for(var i = 0; i < vertices.length / 3; i++) {
            var x = ((i / size) - Math.floor(i / size)) * size;
            var y = (i - x) / size;

            if(x < size - 1 && y < size - 1) {
                indices.push(x + y * size);
                indices.push((x + 1) + y * size);
                indices.push((x + 1) + (y + 1) * size);

                indices.push(x + y * size);
                indices.push(x + (y + 1) * size);
                indices.push((x + 1) + (y + 1) * size);
            }
        }
        this.vertexArray = vertices;
        this.initBuffer(vertices, indices, colors);
    };

    this.initBuffer = function(vertexArray, indexArray, colorArray) {
        var gl = this.context;

        this.vertices = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

        this.indices = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);
        this.indices.numItems = indexArray.length;

        this.colors = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colors);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);
    };

    this.render = function() {
        var engine = this.engine;
        var gl = this.context;

        mat4.identity(engine.worldMatrix);
        mat4.lookAt(engine.viewMatrix, engine.camera.eye, engine.camera.center, engine.camera.up);
        mat4.perspective(engine.projMatrix, glMatrix.toRadian(45), engine.canvas.width / engine.canvas.height, 0.1, 1000.0);

        //mat4.rotate(engine.worldMatrix, engine.worldMatrix, this.angle, [0, 1, 0]);
        mat4.scalar.scale(engine.worldMatrix, engine.worldMatrix, [this.scale, this.scale, this.scale, 1]);

        gl.uniformMatrix4fv(engine.matWorldUniformLocation, gl.FALSE, engine.worldMatrix);
        gl.uniformMatrix4fv(engine.matViewUniformLocation, gl.FALSE, engine.viewMatrix);
        gl.uniformMatrix4fv(engine.matProjUniformLocation, gl.FALSE, engine.projMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
        gl.vertexAttribPointer(engine.positionLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

        //gl.bindBuffer(gl.ARRAY_BUFFER, this.normals);
        //gl.vertexAttribPointer(engine.normalLocation, 3, gl.FLOAT, gl.TRUE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colors);
        gl.vertexAttribPointer(engine.colorLocation, 4, gl.FLOAT, gl.FALSE, 4 * Float32Array.BYTES_PER_ELEMENT, 0);

        gl.drawElements(gl.TRIANGLES, this.indices.numItems, gl.UNSIGNED_SHORT, 0);
    }
}