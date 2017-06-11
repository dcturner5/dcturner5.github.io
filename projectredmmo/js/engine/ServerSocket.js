function ServerSocket(ip, port) {
    var script = document.createElement("script");
    this.ip = ip.slice(0, -1);
    this.port = port;
    this.socket = null;
    this.ready = false;
    this._init = function() {};

    script.src = this.ip + ":" + this.port + "/socket.io/socket.io.js";
    document.head.appendChild(script);

    script.onload = (function() {
        this.ready = true;
        this._init();
    }).bind(this);

    this.init = function(funct) {
        this._init = funct;
        if(this.ready) funct();
    };

    this.connect = function() {
        this.socket = io.connect(this.ip + ":" + this.port);
        this.socket.on('error', console.error.bind(console));
        this.socket.on('message', console.log.bind(console));
    };

    this.send = function(type, data) {
        this.socket.emit(type, data);
    };

    this.receive = function(type, funct) {
        this.socket.on(type, function(data) {
            funct(data);
        });
    };
}