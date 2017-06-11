(function() {
    var engine;
    function main() {
        engine = new Engine("canvas", 240, 160);
        engine.resize();
        engine.setClearColor('black');
        engine.setAutoResize(true);


            /*

            engine.client.receive('init_npc', function(data) {
                var npc = new NPC(data.id, new Vector(data.x, data.y), 16, 16, null);
                npc.factionid = data.factionid;
                npc.dir = data.dir;
                npcs.push(npc);
            });

            engine.client.receive('dir_npc', function(data) {
                for(var i = 0; i < npcs.length; i++) {
                    var npc = npcs[i];
                    if(npc.id == data.id) npc.dir = data.dir;
                }
            });

            engine.client.receive('move_npc', function(data) {
                for(var i = 0; i < npcs.length; i++) {
                    var npc = npcs[i];
                    if(npc.id == data.id) {
                        npc.moving = true;
                        npc.pos.x = data.x;
                        npc.pos.y = data.y;
                        npc.waypoint.x = data.waypointx;
                        npc.waypoint.y = data.waypointy;
                    }
                }
            });

            engine.client.receive('warp_npc', function(data) {
                for(var i = 0; i < npcs.length; i++) {
                    var npc = npcs[i];
                    if(npc.id == data.id) {
                        npc.pos.x = data.x;
                        npc.pos.y = data.y;
                        npc.waypoint.x = Math.floor(data.x / 16);
                        npc.waypoint.y = Math.floor(data.y / 16);
                    }
                }
            });

            engine.client.receive('warp_player', function(data) {
                player.pos.x = data.x;
                player.pos.y = data.y;
                player.waypoint.x = Math.floor(data.x / 16);
                player.waypoint.y = Math.floor(data.y / 16);
            });

            engine.client.receive('init_projectile', function(data) {
                var projectile = new Projectile(new Vector(data.x, data.y), new Vector(data.dirx, data.diry), data.owner);
                projectiles.push(projectile);
            });*/

        engine.init = init;
        engine.update = update;
        engine.render = render;

        //engine.onMouseDown = onMouseDown;

        engine.start();
    }

    var player;
    var npcs = [];
    var projectiles = [];
    var world;
    function init() {
        player = new Player(new Vector(16*87,16*294), 16, 16, new SpriteSheet("res/character/red.png"));
        world = new World(7200);
    }

    function update() {
        player.update();
        for(var i = 0; i < npcs.length; i++) {
            var npc = npcs[i];
            npc.update();
        }
        for(var i = 0; i < projectiles.length; i++) {
            var projectile = projectiles[i];
            projectile.update(i);
        }
    }

    function render(context) {
        engine.clear();
        var screenX = player.pos.x - engine.canvas.width / 2 + player.width / 2;
        var screenY = player.pos.y - engine.canvas.height / 2 + 8;
        var tileX = Math.floor(screenX / 16);
        var tileY = Math.floor(screenY / 16);

        var chunkTileSize = world.chunkSize / 16;

        var baseBuffer = new ChunkBuffer(screenX, screenY);
        baseBuffer.add(Math.floor(tileX / chunkTileSize), Math.floor(tileY / chunkTileSize));
        baseBuffer.add(Math.floor((tileX + 16) / chunkTileSize), Math.floor(tileY / chunkTileSize));
        baseBuffer.add(Math.floor(tileX / chunkTileSize), Math.floor((tileY + 11) / chunkTileSize));
        baseBuffer.add(Math.floor((tileX + 16) / chunkTileSize), Math.floor((tileY + 11) / chunkTileSize));

        if(world.ready) {
            for(var i = 0; i < baseBuffer.array.length; i++) {
                var chunk = world.chunks[baseBuffer.array[i].index];
                context.drawImage(chunk.base, -baseBuffer.array[i].x, -baseBuffer.array[i].y, world.chunkSize, world.chunkSize);
            }
        }

        var entities = [player].concat(npcs).sort(function(a, b) {return a.pos.y - b.pos.y});
        var offset = player.pos.sub(new Vector(16*7, 16*5)).scale(-1);
        for(var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            entity.render(context, offset);
        }

        for(var i = 0; i < projectiles.length; i++) {
            var projectile = projectiles[i];
            projectile.render(context, player.pos.sub(new Vector(16*7, 16*5)).scale(-1));
        }

        var overlayBuffer = new ChunkBuffer(screenX, screenY);
        overlayBuffer.add(Math.floor(player.pos.x / world.chunkSize), Math.floor(player.pos.y / world.chunkSize));
        if(world.ready) {
            var chunk = world.chunks[overlayBuffer.array[0].index];
            context.drawImage(chunk.overlay, -overlayBuffer.array[0].x, -overlayBuffer.array[0].y, world.chunkSize, world.chunkSize);
        }
    }

    function Entity(pos, width, height) {
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.getWorldPos = function() {
            return new Vector((this.pos.x / 16), (this.pos.y / 16));
        };
        this.update = function() {};
        this.render = function(context) {
            context.fillStyle = "red";
            context.fillRect(112, 72, this.width, this.height);
        };
    }

    function Player(pos, width, height, spritesheet) {
        var e = new Entity(pos, width, height);

        e.sprites = [];
        e.sprites[0] = new Sprite(spritesheet, 16 * 0, 24 * 0, 16, 24);
        e.sprites[1] = new Sprite(spritesheet, 16 * 1, 24 * 0, 16, 24);
        e.sprites[2] = new Sprite(spritesheet, 16 * 2, 24 * 0, 16, 24);
        e.sprites[3] = new Sprite(spritesheet, 16 * 3, 24 * 0, 16, 24);
        e.sprites[4] = new Sprite(spritesheet, 16 * 0, 24 * 1, 16, 24);
        e.sprites[5] = new Sprite(spritesheet, 16 * 1, 24 * 1, 16, 24);
        e.sprites[6] = new Sprite(spritesheet, 16 * 2, 24 * 1, 16, 24);
        e.sprites[7] = new Sprite(spritesheet, 16 * 3, 24 * 1, 16, 24);
        e.sprites[8] = new Sprite(spritesheet, 16 * 0, 24 * 2, 16, 24);
        e.sprites[9] = new Sprite(spritesheet, 16 * 1, 24 * 2, 16, 24);
        e.sprites[10] = new Sprite(spritesheet, 16 * 2, 24 * 2, 16, 24);
        e.sprites[11] = new Sprite(spritesheet, 16 * 3, 24 * 2, 16, 24);
        e.sprites[12] = new Sprite(spritesheet, 16 * 0, 24 * 3, 16, 24);
        e.sprites[13] = new Sprite(spritesheet, 16 * 1, 24 * 3, 16, 24);
        e.sprites[14] = new Sprite(spritesheet, 16 * 2, 24 * 3, 16, 24);
        e.sprites[15] = new Sprite(spritesheet, 16 * 3, 24 * 3, 16, 24);

        e.animation = {
            index: 0,
            frame: 0,
            max: 8
        };

        e.dir = 2;
        e.speed = 1;
        e.waypoint = new Vector(pos.x, pos.y).scale(1/16);

        e.movetimer = new Timer(4);

        e.shoottimer = new Timer(30);
        e.shoottimer.forceReady();

        e.warp = function(x, y) {
            e.pos.x = x * 16;
            e.pos.y = y * 16;
            e.waypoint.x = x;
            e.waypoint.y = y;
        };
        e.move = function(dx, dy) {
            var worldPos = e.getWorldPos();
            if(e.waypoint.x === worldPos.x && e.waypoint.y === worldPos.y && worldPos.x + dx >= 0 && worldPos.x + dx < world.width  && worldPos.y + dy >= 0 && worldPos.y + dy < world.height && world.get(worldPos.x + dx, worldPos.y + dy) == 0) {
                e.waypoint = worldPos.round().add(new Vector(dx, dy));
            }
        };
        e.isMoving = function() {
            if(engine.key("W") || engine.key("A") || engine.key("S") || engine.key("D") || e.getWorldPos().x != e.waypoint.x || e.getWorldPos().y != e.waypoint.y) return true;
            return false;
        };
        e.update = function() {
            if(e.isMoving()) {
                if(e.animation.frame < e.animation.max) {
                    e.animation.frame += 1;
                } else {
                    e.animation.frame = 0;
                    if(e.animation.index < 3) {
                        e.animation.index += 1;
                    } else{
                        e.animation.index = 0;
                    }
                }
            } else {
                e.animation.frame = 0;
                e.animation.index = 0;
                e.movetimer.reset();
            }

            if(engine.key("W") && !engine.key("S")) {
                var canmove = e.movetimer.ready();
                if(e.dir == 0 && canmove) e.move(0, -1);
                else {
                    if(e.dir != 0) {
                        e.dir = 0;
                    }
                    else e.movetimer.update();
                }
            }
            if(engine.key("S") && !engine.key("W")) {
                var canmove = e.movetimer.ready();
                if(e.dir == 2 && canmove) e.move(0, 1);
                else {
                    if(e.dir != 2) {
                        e.dir = 2;
                    }
                    else e.movetimer.update();
                }
            }
            if(engine.key("A") && !engine.key("D") && !engine.key("W") && !engine.key("S")) {
                var canmove = e.movetimer.ready();
                if(e.dir == 3 && canmove) e.move(-1, 0);
                else {
                    if(e.dir != 3) {
                        e.dir = 3;
                    }
                    else e.movetimer.update();
                }
            }

            if(engine.key("D") && !engine.key("A") && !engine.key("W") && !engine.key("S")) {
                var canmove = e.movetimer.ready();
                if(e.dir == 1 && canmove) e.move(1, 0);
                else {
                    if(e.dir != 1) {
                        e.dir = 1;
                    }
                    else e.movetimer.update();
                }
            }

            var worldPos = e.getWorldPos();
            if(worldPos.x < e.waypoint.x) e.pos.x += e.speed;
            else if(worldPos.x > e.waypoint.x) e.pos.x -= e.speed;
            else if(worldPos.y < e.waypoint.y) e.pos.y += e.speed;
            else if(worldPos.y > e.waypoint.y) e.pos.y -= e.speed;

            if(engine.key("SPACE")) {
                if(e.shoottimer.ready()) {
                    var projectile;
                    if(e.dir == 0) projectile = new Projectile(e.pos, new Vector(0, -1), e.username);
                    if(e.dir == 1) projectile = new Projectile(e.pos, new Vector(1, 0), e.username);
                    if(e.dir == 2) projectile = new Projectile(e.pos, new Vector(0, 1), e.username);
                    if(e.dir == 3) projectile = new Projectile(e.pos, new Vector(-1, 0), e.username);
                    projectiles.push(projectile);
                    e.shoottimer.reset();
                }
            }
            e.shoottimer.update();
        };
        e.render = function(context) {
            e.sprites[e.dir * 4 + e.animation.index].render(context, 112, 64);
        };
        e.updateSprite = function(spritesheet) {
            e.sprites[0] = new Sprite(spritesheet, 16 * 0, 24 * 0, 16, 24);
            e.sprites[1] = new Sprite(spritesheet, 16 * 1, 24 * 0, 16, 24);
            e.sprites[2] = new Sprite(spritesheet, 16 * 2, 24 * 0, 16, 24);
            e.sprites[3] = new Sprite(spritesheet, 16 * 3, 24 * 0, 16, 24);
            e.sprites[4] = new Sprite(spritesheet, 16 * 0, 24 * 1, 16, 24);
            e.sprites[5] = new Sprite(spritesheet, 16 * 1, 24 * 1, 16, 24);
            e.sprites[6] = new Sprite(spritesheet, 16 * 2, 24 * 1, 16, 24);
            e.sprites[7] = new Sprite(spritesheet, 16 * 3, 24 * 1, 16, 24);
            e.sprites[8] = new Sprite(spritesheet, 16 * 0, 24 * 2, 16, 24);
            e.sprites[9] = new Sprite(spritesheet, 16 * 1, 24 * 2, 16, 24);
            e.sprites[10] = new Sprite(spritesheet, 16 * 2, 24 * 2, 16, 24);
            e.sprites[11] = new Sprite(spritesheet, 16 * 3, 24 * 2, 16, 24);
            e.sprites[12] = new Sprite(spritesheet, 16 * 0, 24 * 3, 16, 24);
            e.sprites[13] = new Sprite(spritesheet, 16 * 1, 24 * 3, 16, 24);
            e.sprites[14] = new Sprite(spritesheet, 16 * 2, 24 * 3, 16, 24);
            e.sprites[15] = new Sprite(spritesheet, 16 * 3, 24 * 3, 16, 24);
        };
        return e;
    }

    function NPC(id, pos, width, height, factionid, spritesheet) {
        var e = new Entity(pos, width, height);
        e.id = id;

        spritesheet = new SpriteSheet("res/character/police.png");

        e.sprites = [];
        e.sprites[0] = new Sprite(spritesheet, 16 * 0, 24 * 0, 16, 24);
        e.sprites[1] = new Sprite(spritesheet, 16 * 1, 24 * 0, 16, 24);
        e.sprites[2] = new Sprite(spritesheet, 16 * 2, 24 * 0, 16, 24);
        e.sprites[3] = new Sprite(spritesheet, 16 * 3, 24 * 0, 16, 24);
        e.sprites[4] = new Sprite(spritesheet, 16 * 0, 24 * 1, 16, 24);
        e.sprites[5] = new Sprite(spritesheet, 16 * 1, 24 * 1, 16, 24);
        e.sprites[6] = new Sprite(spritesheet, 16 * 2, 24 * 1, 16, 24);
        e.sprites[7] = new Sprite(spritesheet, 16 * 3, 24 * 1, 16, 24);
        e.sprites[8] = new Sprite(spritesheet, 16 * 0, 24 * 2, 16, 24);
        e.sprites[9] = new Sprite(spritesheet, 16 * 1, 24 * 2, 16, 24);
        e.sprites[10] = new Sprite(spritesheet, 16 * 2, 24 * 2, 16, 24);
        e.sprites[11] = new Sprite(spritesheet, 16 * 3, 24 * 2, 16, 24);
        e.sprites[12] = new Sprite(spritesheet, 16 * 0, 24 * 3, 16, 24);
        e.sprites[13] = new Sprite(spritesheet, 16 * 1, 24 * 3, 16, 24);
        e.sprites[14] = new Sprite(spritesheet, 16 * 2, 24 * 3, 16, 24);
        e.sprites[15] = new Sprite(spritesheet, 16 * 3, 24 * 3, 16, 24);

        e.animation = {
            index: 0,
            frame: 0,
            max: 8
        };

        e.dir = 2;
        e.moving = false;
        e.speed = 1;
        e.waypoint = new Vector(pos.x, pos.y).scale(1/16);
        e.factionid = factionid;

        e.update = function() {
            if(e.moving) {
                if(e.animation.frame < e.animation.max) {
                    e.animation.frame += 1;
                } else {
                    e.animation.frame = 0;
                    if(e.animation.index < 3) {
                        e.animation.index += 1;
                    } else{
                        e.animation.index = 0;
                    }
                }
            } else {
                e.animation.frame = 0;
                e.animation.index = 0;
            }

            var worldPos = e.getWorldPos();
            if(worldPos.x < e.waypoint.x) e.pos.x += e.speed;
            else if(worldPos.x > e.waypoint.x) e.pos.x -= e.speed;
            else if(worldPos.y < e.waypoint.y) e.pos.y += e.speed;
            else if(worldPos.y > e.waypoint.y) e.pos.y -= e.speed;
            //else e.moving = false;
        };

        e.render = function(context, offset) {
            e.sprites[e.dir * 4 + e.animation.index].render(context, e.pos.x + offset.x, e.pos.y + offset.y - 16);
        };

        return e;
    }

    function Projectile(pos, dir, owner) {
        var e = new Entity(pos, 8, 8);
        e.dir = dir;
        e.speed = 2;
        e.sprite = new Sprite(new SpriteSheet("res/pokeball.png"), 0, 0, 12, 12);
        e.age = 0;
        e.maxAge = 120;
        e.owner = owner;

        e.update = function(id) {
            e.pos = e.pos.add(e.dir.scale(e.speed));

            var selfPos = e.getWorldPos();

            for(var i = 0; i < npcs.length; i++) {
                var npcPos = npcs[i].getWorldPos();
                if(selfPos.x == npcPos.x && selfPos.y == npcPos.y) {
                    if(e.owner.indexOf('npc-') == -1) {
                        projectiles.splice(id, 1);
                        if (e.owner == player.username) {
                            engine.client.send('kill_npc', {id: npcs[i].id});
                        }
                    }
                }
            }

            var playerPos = player.getWorldPos();
            if(selfPos.x == playerPos.x && selfPos.y == playerPos.y && e.owner.indexOf('npc-') != -1 && (e.getOwner().factionid != player.factionid || e.getOwner().factionid == 0)) {
                engine.client.send('kill_client', {username: player.username, attacker: ''});
                projectiles.splice(id, 1);
            }

            if(world.get(Math.floor(e.getWorldPos().x), Math.floor(e.getWorldPos().y)) == 1) {
                projectiles.splice(id, 1);
            }

            if(e.age > e.maxAge) projectiles.splice(id, 1);
            else e.age++;
        };

        e.getOwner = function() {
            if(e.owner.indexOf('npc-') != -1) {
                var id = parseInt(e.owner.slice(4));
                for(var i = 0; i < npcs.length; i++) {
                    if(npcs[i].id == id) {
                        return npcs[i];
                    }
                }
            }
            else {
                for(var i = 0; i < clients.length; i++) {
                    if(clients[i].username == e.owner) {
                        return clients[i];
                    }
                }
                if(player.username == e.owner) return player;
            }
            return;
        };

        e.render = function(context, offset) {
            var x = e.pos.x + offset.x;
            var y = e.pos.y + offset.y;
            if(x > -12 && y > -12 && x < engine.canvas.width && y < engine.canvas.height) e.sprite.render(context, x + 2, y - 8);
        };

        return e;
    }

    function World(chunkSize) {
        var self = this;
        self.chunks = [];
        self.chunkSize = chunkSize || 720;
        self.ready = false;
        self.base = new Image();
        self.base.src = "res/world.png";
        self.base.onload = function() {
            self.width = this.width / 16;
            self.height = this.height / 16;
            self.chunkWidth = this.width / self.chunkSize;
            self.chunkHeight = this.height / self.chunkSize;
            for(var y = 0; y < self.chunkHeight; y++) {
                for(var x = 0; x < self.chunkWidth; x++) {
                    var canvas = document.createElement("canvas");
                    canvas.width = self.chunkSize;
                    canvas.height = self.chunkSize;
                    var context = canvas.getContext("2d");
                    context.drawImage(this, x * self.chunkSize, y * self.chunkSize, self.chunkSize, self.chunkSize, 0, 0, self.chunkSize, self.chunkSize);
                    if(self.chunks.length <= x + y * self.chunkWidth) self.chunks.push({base: canvas, overlay: null});
                    else self.chunks[x + y * self.chunkWidth].base = canvas;
                }
            }
            self.ready = true;
        };

        self.overlay = new Image();
        self.overlay.src = "res/overlay.png";
        self.overlay.onload = function() {
            self.width = this.width / 16;
            self.height = this.height / 16;
            self.chunkWidth = this.width / self.chunkSize;
            self.chunkHeight = this.height / self.chunkSize;
            for(var y = 0; y < self.chunkHeight; y++) {
                for(var x = 0; x < self.chunkWidth; x++) {
                    var canvas = document.createElement("canvas");
                    canvas.width = self.chunkSize;
                    canvas.height = self.chunkSize;
                    var context = canvas.getContext("2d");
                    context.drawImage(this, x * self.chunkSize, y * self.chunkSize, self.chunkSize, self.chunkSize, 0, 0, self.chunkSize, self.chunkSize);
                    if(self.chunks.length <= x + y * self.chunkWidth) self.chunks.push({base: null, overlay: canvas});
                    else self.chunks[x + y * self.chunkWidth].overlay = canvas;
                }
            }
        };

        self.map = WORLD;
        self.mapWidth = WORLD[0].length;
        self.mapHeight = WORLD.length;

        self.get = function(x, y) {
            if(x >= 0 && x < self.mapWidth && y >= 0 && y < self.mapHeight) return self.map[y][x];
            return 1;
        };

        self.print = function() {
            var string = "[";
            for(var i = 0; i < self.mapHeight; i++) {
                string += "[";
                for(var j = 0; j < self.mapWidth; j++) {
                    var value = self.map[i][j].toString();
                    if(value.length == 1) value = "" + value;
                    string += value;
                    if(j < self.mapWidth - 1) string += ",";
                }
                string += "]";
                if(i < self.mapHeight - 1) string += ",";
            }
            string += "]";
            return string;
        };
    }

    function ChunkBuffer(screenX, screenY) {
        var self = this;
        self.array = [];
        self.screenX = screenX;
        self.screenY = screenY;

        self.add = function(col, row) {
            if(col >= 0 && col < world.chunkWidth && row >= 0 && row < world.chunkHeight) {
                var index = col + row * world.chunkWidth;
                self.array.push({
                    index: index,
                    x: (self.screenX - col * world.chunkSize),
                    y: (self.screenY - row * world.chunkSize)
                });
            }
        };
    }

    function onMouseDown(e) {
        var screenX = player.pos.x - engine.canvas.width / 2 + player.width / 2;
        var screenY = player.pos.y - engine.canvas.height / 2;
        var x = Math.floor((screenX + e.x) / 16);
        var y = Math.floor((screenY + e.y) / 16) + 1;
        console.log(x + " " + y);
        if(e.button == 0) world.map[y][x] = 1;
        else world.map[y][x] = 0;
    }

    document.body.onload = function() {
        main();
    };
})();