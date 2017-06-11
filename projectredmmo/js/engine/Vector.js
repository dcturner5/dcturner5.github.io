function Vector(x, y, z) {
    if(x == null || y == null) {
        warn("Vector Args Undefined");
        return;
    }
    if(z == null) return new Vector2(x, y);
    return new Vector3(x, y, z);
}

function Vector2(x, y) {
    this.x = x;
    this.y = y;
    if(x == null) this.x = 0;
    if(y == null) this. y = 0;
    this.add = function(v) {
        var x = this.x + v.x;
        var y = this.y + v.y;
        return new Vector2(x, y);
    };
    this.sub = function(v) {
        var x = this.x - v.x;
        var y = this.y - v.y;
        return new Vector2(x, y);
    };
    this.multiply = function(v) {
        var x = this.x * v.x;
        var y = this.y * v.y;
        return new Vector2(x, y);
    };
    this.scale = function(n) {
        var x = this.x * n;
        var y = this.y * n;
        return new Vector2(x, y);
    };
    this.dot = function(v) {
        return this.x * v.x + this.y * v.y;
    };
    this.normalize = function() {
        var m = this.magnitude();
        var x = this.x / m;
        var y = this.y / m;
        return new Vector2(x, y);
    };
    this.magnitude = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    this.random = function(limit) {
        if(limit == null) limit = 4;
        var x = Math.random() * 2 - 1;
        var y = Math.sqrt(1 - x * x);
        if(Math.random() < .5) y *= -1;
        x = parseFloat(x.toFixed(limit));
        y = parseFloat(y.toFixed(limit));
        return new Vector2(x, y);
    };
    this.reflect = function(normal) {
        var dot = this.dot(normal);
        var x = this.x - 2 * dot * normal.x;
        var y = this.y - 2 * dot * normal.y;
        return new Vector2(x, y);
    };
    this.floor = function() {
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    };
    this.round = function() {
        return new Vector2(Math.round(x), Math.round(y));
    };
}

function Vector3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.add = function(v) {
        var x = this.x + v.x;
        var y = this.y + v.y;
        var z = this.z;
        if(v.z != null) z = this.z + v.z;
        return new Vector3(x, y, z);
    }
    this.sub = function(v) {
        var x = this.x - v.x;
        var y = this.y - v.y;
        var z = this.z;
        if(v.z != null) z = this.z - v.z;
        return new Vector3(x, y, z);
    }
    this.dot = function(v) {
        if(v.z == null) return this.x * v.x + this.y * v.y;
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    this.cross = function(v) {
        if(v.z == null) return;
        var x = this.y * v.z - this.z * v.y;
        var y = this.z * v.x - this.x * v.z;
        var z = this.x * v.y - this.y * v.x;
        return new Vector3(x, y, z);
    }
    this.normalize = function() {
        var m = this.magnitude();
        var x = this.x / m;
        var y = this.y / m;
        var z = this.z / m;
        return new Vector3(x, y, z);
    }
    this.magnitude = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}
