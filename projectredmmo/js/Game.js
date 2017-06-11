(function() {
    var engine;
    function main() {
        engine = new Engine("canvas", 240, 160);
        engine.resize();
        engine.setClearColor('black');
        engine.setAutoResize(true);

        engine.client = new ServerSocket('http://138.197.199.138/', 8000);
        engine.client.init(function() {
            engine.client.connect();

            engine.client.receive('login_player', function(data) {
                player.id = data.id;
                var token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
                engine.client.send('init_player', {token: token});
            });

            engine.client.receive('init_player', function(data) {
                player.username = data.username;
                player.pos.x = data.x;
                player.pos.y = data.y;
                player.waypoint.x = data.x / 16;
                player.waypoint.y = data.y / 16;
                player.dir = data.dir;
                player.faction = data.faction;
                player.factionid = data.factionid;
                player.color = data.color;
                player.updateSprite(new SpriteSheet("res/character/" + data.sprite));
            });

            engine.client.receive('ban_player', function() {
                engine.client.send('disconnect');
                location.href = "status/index.php?s=ban";
            });

            engine.client.receive('kick_player', function() {
                engine.client.send('disconnect');
                location.href = "status/index.php?s=kick";
            });

            engine.client.receive('init_client', function(data) {
                var client = new Client(data.id, new Vector(data.x, data.y), 16, 16, data.username, new SpriteSheet("res/character/" + data.sprite));
                client.dir = data.dir;
                client.faction = data.faction;
                client.factionid = data.factionid;
                client.color = data.color;
                client.nametag.style.color = data.color;
                client.driving = data.driving;
                clients.push(client);

                gui.updateClientsOnline();
            });

            engine.client.receive('delete_client', function(data) {
                for(var i = 0; i < clients.length; i++) {
                    var client = clients[i];
                    if(client.username == data.username) {
                        document.body.removeChild(client.nametag);
                        clients.splice(i, 1);
                    }
                }

                gui.updateClientsOnline();
            });

            engine.client.receive('dir_client', function(data) {
                for(var i = 0; i < clients.length; i++) {
                    var client = clients[i];
                    if(client.id == data.id) client.dir = data.dir;
                }
            });

            engine.client.receive('move_client', function(data) {
                for(var i = 0; i < clients.length; i++) {
                    var client = clients[i];
                    if(client.id == data.id) {
                        client.moving = true;
                        client.pos.x = data.x;
                        client.pos.y = data.y;
                        client.waypoint.x = data.waypointx;
                        client.waypoint.y = data.waypointy;
                        client.driving = data.driving;
                    }
                }
            });

            engine.client.receive('init_npc', function(data) {
                var npc = new NPC(data.id, new Vector(data.x, data.y), 16, 16, data.factionid, new SpriteSheet("res/character/"+data.sprite));
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

            engine.client.receive('kill_npc', function(data) {
                for(var i = 0; i < npcs.length; i++) {
                    var npc = npcs[i];
                    if(npc.id == data.id) {
                        npcs.splice(i, 1);
                    }
                }
            });

            engine.client.receive('init_vehicle', function(data) {
                var vehicle = new Vehicle(data.id, new Vector(data.x, data.y), 48, 48, new SpriteSheet("res/truck.png"));
                vehicle.dir = data.dir;
                vehicles.push(vehicle);
            });

            engine.client.receive('dir_vehicle', function(data) {
                for(var i = 0; i < vehicles.length; i++) {
                    var vehicle = vehicles[i];
                    if(vehicle.id == data.id) {
                        vehicle.dir = data.dir;
                    }
                }
            });

            engine.client.receive('move_vehicle', function(data) {
                for(var i = 0; i < vehicles.length; i++) {
                    var vehicle = vehicles[i];
                    if(vehicle.id == data.id) {
                        vehicle.moving = true;
                        vehicle.pos.x = data.x;
                        vehicle.pos.y = data.y;
                        vehicle.waypoint.x = data.waypointx;
                        vehicle.waypoint.y = data.waypointy;
                    }
                }
            });

            engine.client.receive('take_vehicle', function(data) {
                if(player.driving && player.vehicle.id == data.id) {
                    player.vehicle = null;
                    player.driving = false;
                    player.speed = 1;
                }
                for(var i = 0; i < clients.length; i++) {
                    var client = clients[i];
                    if(client.driving && client.vehicle.id == data.id) {
                        client.vehicle = null;
                        client.driving = false;
                        client.speed = 1;
                    }
                }
            });

            engine.client.receive('warp_player', function(data) {
                player.pos.x = data.x;
                player.pos.y = data.y;
                player.waypoint.x = Math.floor(data.x / 16);
                player.waypoint.y = Math.floor(data.y / 16);

                if(player.driving) {
                    player.vehicle = null;
                    player.driving = false;
                    player.speed = 1;
                }
            });

            engine.client.receive('warp_client', function(data) {
                for(var i = 0; i < clients.length; i++) {
                    var client = clients[i];
                    if(client.id == data.id) {
                        client.pos.x = data.x;
                        client.pos.y = data.y;
                        client.waypoint.x = Math.floor(data.x / 16);
                        client.waypoint.y = Math.floor(data.y / 16);
                    }
                }
            });

            engine.client.receive('init_projectile', function(data) {
                var projectile = new Projectile(new Vector(data.x, data.y), new Vector(data.dirx, data.diry), data.owner);
                projectiles.push(projectile);
            });

            engine.client.receive('init_world', function(data) {
                world = new World(7200, data.world);
            });

            engine.client.receive('init_territory', function(data) {
                territory = new Territory(data.territory);
            });

            engine.client.receive('edit_territory', function(data) {
                territory.set(data.id, data.x, data.y);
            });

            engine.client.receive('chat', function(data) {
                gui.addTextMessage(data.username, data.message);
            });
        });

        engine.init = init;
        engine.update = update;
        engine.render = render;

        //engine.onMouseDown = onMouseDown;

        engine.start();
    }

    var player;
    var clients = [];
    var npcs = [];
    var projectiles = [];
    var vehicles = [];
    var world;
    var territory;
    var gui;

    function init() {
        player = new Player(new Vector(16*87,16*294), 16, 16, new SpriteSheet("res/character/red.png"));
        gui = new GuiManager();
    }

    function update() {
        player.update();
        for(var i = 0; i < clients.length; i++) {
            var client = clients[i];
            client.update();
        }
        for(var i = 0; i < npcs.length; i++) {
            var npc = npcs[i];
            npc.update();
        }
        for(var i = 0; i < projectiles.length; i++) {
            var projectile = projectiles[i];
            projectile.update(i);
        }
        for(var i = 0; i < vehicles.length; i++) {
            var vehicle = vehicles[i];
            vehicle.update();
        }
    }

    function render(context) {
        engine.clear();
        var screenX = player.pos.x - engine.canvas.width / 2 + player.width / 2;
        var screenY = player.pos.y - engine.canvas.height / 2 + 8;
        var tileX = Math.floor(screenX / 16);
        var tileY = Math.floor(screenY / 16);

        if(world != null) {
            var chunkTileSize = world.chunkSize / 16;

            var baseBuffer = new ChunkBuffer(screenX, screenY);
            baseBuffer.add(Math.floor(tileX / chunkTileSize), Math.floor(tileY / chunkTileSize));
            baseBuffer.add(Math.floor((tileX + 16) / chunkTileSize), Math.floor(tileY / chunkTileSize));
            baseBuffer.add(Math.floor(tileX / chunkTileSize), Math.floor((tileY + 11) / chunkTileSize));
            baseBuffer.add(Math.floor((tileX + 16) / chunkTileSize), Math.floor((tileY + 11) / chunkTileSize));

            if (world.ready) {
                for (var i = 0; i < baseBuffer.array.length; i++) {
                    var chunk = world.chunks[baseBuffer.array[i].index];
                    context.drawImage(chunk.base, -baseBuffer.array[i].x, -baseBuffer.array[i].y, world.chunkSize, world.chunkSize);
                }
            }
        }

        var entities = [player].concat(clients.concat(npcs.concat(vehicles))).sort(function(a, b) {return a.pos.y - b.pos.y});
        var offset = player.pos.sub(new Vector(16*7, 16*5)).scale(-1);
        for(var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            entity.render(context, offset);
        }

        for(var i = 0; i < projectiles.length; i++) {
            var projectile = projectiles[i];
            projectile.render(context, player.pos.sub(new Vector(16*7, 16*5)).scale(-1));
        }

        if(world != null) {
            var overlayBuffer = new ChunkBuffer(screenX, screenY);
            overlayBuffer.add(Math.floor(player.pos.x / world.chunkSize), Math.floor(player.pos.y / world.chunkSize));
            if (world.ready) {
                var chunk = world.chunks[overlayBuffer.array[0].index];
                context.drawImage(chunk.overlay, -overlayBuffer.array[0].x, -overlayBuffer.array[0].y, world.chunkSize, world.chunkSize);
            }
        }

        if(engine.key("T")) {
            if(territory != null) territory.render(context, player.pos.sub(new Vector(16*7, 16*5)).scale(-1));
        }
    }

    function Entity(pos, width, height) {
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.getWorldPos = function() {
            return new Vector((this.pos.x / 16), (this.pos.y / 16));
        };
        this.collision = function(entity) {
            return (this.pos.x < entity.pos.x + entity.width && this.pos.x + this.width > entity.pos.x && this.pos.y < entity.pos.y + entity.height && this.pos.y + this.height > entity.pos.y);
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

        e.shoottimer = new Timer(60);
        e.shoottimer.forceReady();

        e.driving = false;
        e.riding = false;
        e.vehicle = null;

        e.warp = function(x, y) {
            e.pos.x = x * 16;
            e.pos.y = y * 16;
            e.waypoint.x = x;
            e.waypoint.y = y;
        };
        e.move = function(dx, dy) {
            var worldPos = e.getWorldPos();
            if(e.waypoint.x === worldPos.x && e.waypoint.y === worldPos.y && worldPos.x + dx >= 0 && worldPos.x + dx < world.width  && worldPos.y + dy >= 0 && worldPos.y + dy < world.height) {
                var newWorldPos = worldPos.round().add(new Vector(dx, dy));
                if(e.driving) {
                    if(
                        ((e.dir == 0 || e.dir == 2) &&
                        world.get(newWorldPos.x, newWorldPos.y - 1) == 0 &&
                        world.get(newWorldPos.x, newWorldPos.y) == 0 &&
                        world.get(newWorldPos.x, newWorldPos.y + 1) == 0 &&
                        world.get(newWorldPos.x, newWorldPos.y + 2) == 0) ||

                        ((e.dir == 1 ||e.dir == 3) &&
                        world.get(newWorldPos.x - 1, newWorldPos.y) == 0 &&
                        world.get(newWorldPos.x - 1, newWorldPos.y + 1) == 0 &&
                        world.get(newWorldPos.x, newWorldPos.y) == 0 &&
                        world.get(newWorldPos.x, newWorldPos.y + 1) == 0 &&
                        world.get(newWorldPos.x + 1, newWorldPos.y) == 0 &&
                        world.get(newWorldPos.x + 1, newWorldPos.y + 1) == 0)
                    ) {
                        e.waypoint = newWorldPos;
                        engine.client.send('move_client', {id: e.id, x: e.pos.x, y: e.pos.y, waypointx: e.waypoint.x, waypointy: e.waypoint.y, driving: e.driving});
                        e.vehicle.waypoint = e.waypoint.sub(new Vector(1, 1));
                        e.vehicle.dir = e.dir;
                        engine.client.send('move_vehicle', {id: e.vehicle.id, x: e.vehicle.pos.x, y: e.vehicle.pos.y, waypointx: e.vehicle.waypoint.x, waypointy: e.vehicle.waypoint.y});
                        engine.client.send('dir_vehicle', {id: e.vehicle.id, dir: e.vehicle.dir});
                    }
                }
                else {
                    if(world.get(newWorldPos.x, newWorldPos.y) == 0) {
                        e.waypoint = newWorldPos;
                        engine.client.send('move_client', {id: e.id, x: e.pos.x, y: e.pos.y, waypointx: e.waypoint.x, waypointy: e.waypoint.y, driving: e.driving});
                    }
                }
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

            var canmove = e.movetimer.ready();
            var dirChange = false;
            if(engine.key("W") && !engine.key("S")) {
                if(e.dir == 0 && canmove) e.move(0, -1);
                else {
                    if(e.dir != 0) {
                        e.dir = 0;
                        dirChange = true;
                    }
                    else e.movetimer.update();
                }
            }
            if(engine.key("S") && !engine.key("W")) {
                if(e.dir == 2 && canmove) e.move(0, 1);
                else {
                    if(e.dir != 2) {
                        e.dir = 2;
                        dirChange = true;
                    }
                    else e.movetimer.update();
                }
            }
            if(engine.key("A") && !engine.key("D") && !engine.key("W") && !engine.key("S")) {
                if(e.dir == 3 && canmove) e.move(-1, 0);
                else {
                    if(e.dir != 3) {
                        e.dir = 3;
                        dirChange = true;
                    }
                    else e.movetimer.update();
                }
            }

            if(engine.key("D") && !engine.key("A") && !engine.key("W") && !engine.key("S")) {
                if(e.dir == 1 && canmove) e.move(1, 0);
                else {
                    if(e.dir != 1) {
                        e.dir = 1;
                        dirChange = true;
                    }
                    else e.movetimer.update();
                }
            }

            if(dirChange) engine.client.send('dir_client', {id: e.id, dir: e.dir});

            var worldPos = e.getWorldPos();
            if(worldPos.x < e.waypoint.x) e.pos.x += e.speed;
            else if(worldPos.x > e.waypoint.x) e.pos.x -= e.speed;
            else if(worldPos.y < e.waypoint.y) e.pos.y += e.speed;
            else if(worldPos.y > e.waypoint.y) e.pos.y -= e.speed;

            if(territory != null) {
                var id = territory.get(worldPos.x, worldPos.y);
                if(id != e.factionid && id != 0) {
                    e.shoottimer.time = 120;
                }
                else {
                    e.shoottimer.time = 60;
                }
            }

            if(engine.key("SPACE")) {
                if(e.shoottimer.ready()) {
                    var projectile;
                    if(e.dir == 0) projectile = new Projectile(e.pos, new Vector(0, -1), e.username);
                    if(e.dir == 1) projectile = new Projectile(e.pos, new Vector(1, 0), e.username);
                    if(e.dir == 2) projectile = new Projectile(e.pos, new Vector(0, 1), e.username);
                    if(e.dir == 3) projectile = new Projectile(e.pos, new Vector(-1, 0), e.username);
                    engine.client.send('init_projectile', {x: projectile.pos.x, y: projectile.pos.y, dirx: projectile.dir.x, diry: projectile.dir.y, owner: projectile.owner});
                    e.shoottimer.reset();
                }
            }
            e.shoottimer.update();

            if(engine.key("E") && !e.driving) {
                for(var i = 0; i < vehicles.length; i++) {
                    if(vehicles[i].pos.x + 16 == e.pos.x && vehicles[i].pos.y + 16 == e.pos.y) {
                        e.vehicle = vehicles[i];
                        e.driving = true;
                        e.speed = vehicles[i].speed;
                        engine.client.send('take_vehicle', {id: e.vehicle.id});
                    }
                }
            }
            if(engine.key("Q") && e.driving) {
                e.vehicle = null;
                e.driving = false;
                e.speed = 1;
            }
        };
        e.render = function(context) {
            if(e.driving) {
                e.animation.index = 0;
            }
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

    function Client(id, pos, width, height, username, spritesheet) {
        var e = new Entity(pos, width, height);
        e.id = id;

        e.sprite = spritesheet.image.src.replace(engine.client.ip + "/res/character/", "").replace(".png", "");

        var nametags = document.getElementsByClassName("nametag");
        for(var i = 0; i < nametags.length; i++) {
            if(nametags[i].innerHTML == username) {
                document.body.removeChild(nametags[i]);
            }
        }
        e.nametag = document.createElement("div");
        e.nametag.className = "nametag";
        e.nametag.innerHTML = username;
        e.nametag.style.position = "absolute";
        document.body.appendChild(e.nametag);

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
        e.username = username;

        e.driving = false;

        e.update = function() {
            if(e.moving) {
                if(e.animation.frame < e.animation.max) {
                    e.animation.frame += 1;
                } else{
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

            if(e.driving) e.speed = 2;
            else e.speed = 1;

            var worldPos = e.getWorldPos();
            if(worldPos.x < e.waypoint.x) e.pos.x += e.speed;
            else if(worldPos.x > e.waypoint.x) e.pos.x -= e.speed;
            else if(worldPos.y < e.waypoint.y) e.pos.y += e.speed;
            else if(worldPos.y > e.waypoint.y) e.pos.y -= e.speed;
            else e.moving = false;
        };

        e.render = function(context, offset) {
            if(e.driving) {
                e.animation.index = 0;
            }

            e.sprites[e.dir * 4 + e.animation.index].render(context, e.pos.x + offset.x, e.pos.y + offset.y - 16);

            e.nametag.style.left = engine.canvas.offsetLeft + (e.pos.x + offset.x) * (parseInt(engine.canvas.style.width.slice(0, -2)) / engine.canvas.width) + "px";
            e.nametag.style.top = engine.canvas.offsetTop + (e.pos.y + offset.y - 20) * (parseInt(engine.canvas.style.height.slice(0, -2)) / engine.canvas.height) + "px";

            var x = parseInt(e.nametag.style.left.slice(0, -2)) - engine.canvas.offsetLeft;
            var y = parseInt(e.nametag.style.top.slice(0, -2)) - engine.canvas.offsetTop;
            if(x >= 0 && y >= 0 && x < parseInt(engine.canvas.style.width.slice(0, -2)) && y < parseInt(engine.canvas.style.height.slice(0, -2))) {
                e.nametag.style.display = "inline-block";
            }
            else {
                e.nametag.style.display = "none";
            }
        };

        return e;
    }

    function NPC(id, pos, width, height, factionid, spritesheet) {
        var e = new Entity(pos, width, height);
        e.id = id;

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
            else e.moving = false;
        };

        e.render = function(context, offset) {
            e.sprites[e.dir * 4 + e.animation.index].render(context, e.pos.x + offset.x, e.pos.y + offset.y - 16);
        };

        return e;
    }

    function Projectile(pos, dir, owner) {
        var e = new Entity(pos, 8, 8);
        e.dir = dir;
        e.speed = 3;
        e.sprite = new Sprite(new SpriteSheet("res/pokeball.png"), 0, 0, 12, 12);
        e.age = 0;
        e.maxAge = 120;
        e.owner = owner;

        e.update = function(id) {
            e.pos = e.pos.add(e.dir.scale(e.speed));

            for(var i = 0; i < clients.length; i++) {
                var client = clients[i];
                if(e.collision(client) && e.owner != client.username) {
                    if(e.owner.indexOf('npc-') == -1) {
                        if (e.getOwner().faction != client.faction || client.faction == "") {
                            projectiles.splice(id, 1);
                            if (e.owner == player.username) {
                                engine.client.send('kill_client', {username: client.username, attacker: player.username});
                            }
                        }
                    }
                }
            }

            for(var i = 0; i < npcs.length; i++) {
                var npc = npcs[i];
                if(e.collision(npc)) {
                    if(e.owner.indexOf('npc-') == -1) {
                        projectiles.splice(id, 1);
                        if (e.owner == player.username) {
                            engine.client.send('kill_npc', {id: npc.id, factionid: player.factionid});
                        }
                    }
                }
            }

            if(e.collision(player) && e.owner.indexOf('npc-') != -1 && (e.getOwner().factionid != player.factionid || e.getOwner().factionid == 0)) {
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

    function Vehicle(id, pos, width, height, spritesheet) {
        var e = new Entity(pos, width, height);
        e.id = id;

        e.sprites = [];
        e.sprites[0] = new Sprite(spritesheet, 0, 0, 48, 48);
        e.sprites[1] = new Sprite(spritesheet, 48, 0, 48, 48);
        e.sprites[2] = new Sprite(spritesheet, 48 * 2, 0, 48, 48);
        e.sprites[3] = new Sprite(spritesheet, 48 * 3, 0, 48, 48);
        e.sprites[4] = new Sprite(spritesheet, 0, 48, 48, 48);
        e.sprites[5] = new Sprite(spritesheet, 48, 48, 48, 48);
        e.sprites[6] = new Sprite(spritesheet, 48 * 2, 48, 48, 48);
        e.sprites[7] = new Sprite(spritesheet, 48 * 3, 48, 48, 48);
        e.sprites[8] = new Sprite(spritesheet, 0, 48 * 2, 48, 48);
        e.sprites[9] = new Sprite(spritesheet, 48, 48 * 2, 48, 48);
        e.sprites[10] = new Sprite(spritesheet, 48 * 2, 48 * 2, 48, 48);
        e.sprites[11] = new Sprite(spritesheet, 48 * 3, 48 * 2, 48, 48);
        e.sprites[12] = new Sprite(spritesheet, 0, 48 * 3, 48, 48);
        e.sprites[13] = new Sprite(spritesheet, 48, 48 * 3, 48, 48);
        e.sprites[14] = new Sprite(spritesheet, 48 * 2, 48 * 3, 48, 48);
        e.sprites[15] = new Sprite(spritesheet, 48 * 3, 48 * 3, 48, 48);

        e.animation = {
            index: 0,
            frame: 0,
            max: 8
        };

        e.dir = 2;
        e.moving = true;
        e.speed = 2;
        e.waypoint = new Vector(pos.x, pos.y).scale(1/16);

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
            else e.moving = false;
        };

        e.render = function(context, offset) {
            /*if(e.dir == 0) offset.y -= 8;
             if(e.dir == 2) offset.y += 3;*/
            e.sprites[e.dir * 4 + e.animation.index].render(context, e.pos.x + offset.x, e.pos.y + offset.y);
        };

        return e;
    }

    function World(chunkSize, map) {
        var self = this;
        self.chunks = [];
        self.chunkSize = chunkSize || 720;
        self.ready = false;
        self.base = new Image();
        self.base.src = "res/world.png?6";
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
        self.overlay.src = "res/overlay.png?4";
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

        self.map = map;
        self.mapWidth = map[0].length;
        self.mapHeight = map.length;

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

    function Territory(map) {
        this.map = map;
        this.mapWidth = map[0].length;
        this.mapHeight = map.length;

        this.chunkSize = 5;

        this.render = function(context, offset) {
            var tileWidth = 16;
            var tileHeight = 16;
            var firstTileX = Math.max(Math.floor((-1 * offset.x) / tileWidth), 0);
            var lastTileX = Math.min(firstTileX + (engine.canvas.width / tileWidth) + 1, this.mapWidth * this.chunkSize);
            var firstTileY = Math.max(Math.floor((-1 * offset.y) / tileHeight), 0);
            var lastTileY = Math.min(firstTileY + (engine.canvas.height / tileHeight) + 2, this.mapHeight * this.chunkSize);
            for(var i = firstTileY; i < lastTileY; i++) {
                for(var j = firstTileX; j < lastTileX; j++) {
                    var faction = this.get(j, i);
                    var tileX = j * tileWidth + offset.x;
                    var tileY = i * tileHeight + offset.y - 8;
                    if(faction != 0) {
                        if(faction == 1) context.fillStyle = "red";
                        if(faction == 2) context.fillStyle = "blue";
                        if(faction == 3) context.fillStyle = "yellow";
                        if(faction == 4) context.fillStyle = "green";
                        if(faction == 5) context.fillStyle = "purple";
                        context.globalAlpha = .3;
                        context.fillRect(tileX, tileY, 16, 16);
                    }
                }
            }
            context.fillStyle = "black";
            context.globalAlpha = 1.0;
        };

        this.get = function(x, y) {
            if(x >= 0 && x < this.mapWidth * this.chunkSize && y >= 0 && y < this.mapHeight * this.chunkSize) {
                var chunkX = Math.floor(x / this.chunkSize);
                var chunkY = Math.floor(y / this.chunkSize);
                return this.map[chunkY][chunkX];
            }
            return 0;
        };

        this.set = function(id, x, y) {
            if(x >= 0 && x < this.mapWidth * this.chunkSize && y >= 0 && y < this.mapHeight * this.chunkSize) {
                var chunkX = Math.floor(x / this.chunkSize);
                var chunkY = Math.floor(y / this.chunkSize);
                this.map[chunkY][chunkX] = id;
            }
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

    function GuiManager() {
        this.textDiv = document.getElementById("textDiv");
        this.textWrap = document.getElementById("textWrap");
        this.textOutput = document.getElementById("textOutput");
        this.clientsOnline = document.getElementById("clientsOnline");

        this.textDiv.onclick = function() {
            var name = player.username;
            var message = prompt("Message:") || "";
            if(name == "" || message == "") return;
            engine.client.send('chat', {username: name, message: message});
        };

        this.addTextMessage = function(name, string) {
            if(this.textOutput.innerHTML != "") this.textOutput.innerHTML += "<br><br>";
            this.textOutput.innerHTML += "<span class='red'>" + name + "</span>: " + string;
            this.textWrap.scrollTop = 999999999;
        };

        this.updateClientsOnline = function() {
            this.clientsOnline.innerHTML = "";
            for(var i = 0; i < clients.length; i++) {
                this.clientsOnline.innerHTML += "<div class='client-list'>" +
                    "<img width='64' height='96' src='" + clients[i].sprite + "pre.png'>" +
                    "<div><span>" + clients[i].username + "</span><br><span class='" + clients[i].color + "'>" + clients[i].faction + "</span></div>" +
                    "</div>";
            }
        };
    }

    // 1 = WALL
    // 2 = WATER

    function onMouseDown(e) {
        var screenX = player.pos.x - engine.canvas.width / 2 + player.width / 2;
        var screenY = player.pos.y - engine.canvas.height / 2;
        var x = Math.floor((screenX + e.x) / 16);
        var y = Math.floor((screenY + e.y) / 16) + 1;
        console.log(x + " " + y);
        if(e.button == 0) world.map[y][x] = 2;
        else world.map[y][x] = 0;
    }

    document.body.onload = function() {
        main();
    };
})();