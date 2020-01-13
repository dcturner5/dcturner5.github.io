var canvas = document.getElementById("Canvas");
var cxt = canvas.getContext("2d");

var game = {
	running: false,
	ups: 60,
	fps: 0,
	frame: 0,
	log: false,
	range: 32
};

var tick = {
	current: 0,
	max: 6
};

var power = {
	source: [],
	block: [],
	wire: [],
	delay: []
};

var gui = {
	chat: {
		state: false
	},
	bar: {
		sprite: new Image(),
		ready: true,
		selected: 0,
		array: []
	},
	inv: {
		sprite: new Image(),
		state: false,
		ready: true,
		array: []
	},
	craft2: {
		sprite: new Image(),
		state: false,
		array: []
	},
	craft3: {
		state: false,
		open: {},
		sprite: new Image()
	},
	chest: {
		state: false,
		open: {},
		sprite: new Image()
	},
	furnace: {
		state: false,
		open: {},
		sprite: new Image()
	},
	select: {
		state: false,
		ready: true,
		origin: null,
		type: 0,
		amt: 0,
		x: 0,
		y: 0,
		width: 32,
		height: 32
	}
};

var recipe = {
	craft: [],
	furnace: []
};

var mousedown = {
	button: 0,
	x: 0,
	y: 0,
	width: 1,
	height: 1,
	column: 0,
	row: 0
};

var mouseup = {
	button: 0,
	x: 0,
	y: 0,
	width: 1,
	height: 1,
	column: 0,
	row: 0
};

var mousemove = {
	x: 0,
	y: 0,
	width: 1,
	height: 1,
	column: 0,
	row: 0
};

var map = {
	x: 0,
	y: 0,
	width: 1024,
	height: 128,
	array: []
};

var tile = {
	x: 0,
	y: 0,
	width: 32,
	height: 32,
	air: 0,
	water: 1,
	stone: 3,
	cobble: 4,
	dirt: 5,
	grass: 6,
	sand: 7,
	wood: 8,
	leaf: 9,
	plank: 10,
	ironore: 11,
	goldore: 12,
	diamondore: 13,
	redore: 14,
	ironblock: 15,
	goldblock: 16,
	diamondblock: 17,
	brick: 18,
	stonebrick: 19,
	craft: 20,
	furnace: 21,
	chest: 22,
	
	stick: 100,
	ironbar: 101,
	goldbar: 102,
	diamondbar: 103,
	woodpick: 104,
	stonepick: 105,
	ironpick: 106,
	goldpick: 107,
	diamondpick: 108,
	woodshov: 109,
	stoneshov: 110,
	ironshov: 111,
	goldshov: 112,
	diamondshov: 113,
	woodaxe: 114,
	stoneaxe: 115,
	ironaxe: 116,
	goldaxe: 117,
	diamondaxe: 118,
	woodsword: 119,
	stonesword: 120,
	ironsword: 121,
	goldsword: 122,
	diamondsword: 123,
	
	redwire: 200,
	flat_redwire: 201,
	left_redwire: 202,
	right_redwire: 203,
	both_redwire: 204,
	flat_redtorch: 205,
	left_redtorch: 206,
	right_redtorch: 207,
	left_repeater1: 208,
	left_repeater2: 209,
	left_repeater3: 210,
	left_repeater4: 211,
	right_repeater1: 212,
	right_repeater2: 213,
	right_repeater3: 214,
	right_repeater4: 215,
	
	group: {
		none: 0,
		pick: 1,
		shov: 2,
		axe: 3
	},
	animation: {
		frame: 0,
		max: 30,
		index: 1
	},
	sprite: new Image(),
	itemsprite: new Image(),
	redsprite: new Image(),
	brksprite: new Image(),
	
	entity: {
		chest: {
			array: []
		},
		craft: {
			array: []
		},
		furnace: {
			array: []
		}
	}
};

var player = {
	array: [],
	sprite: new Image()
};

var enemy = {
	array: [],
	sprite: new Image()
};

var item = {
	array: [],
	sprite: new Image()
};

var bullet = {
	array: []
};

var particle = {
	array: []
};



function update() {
	updateMap();
	updateTileEntity();
	updateRed();
	updatePlayer();
	updateEnemy();
	updateItem();
	updateBullet();
	updateParticle();
	updateGui();
}

function updateMap() {
	if(tile.animation.frame < tile.animation.max) {
		tile.animation.frame += 1;
	} else{
		tile.animation.frame = 0;
		if(tile.animation.index < 2) {
			tile.animation.index += 1;
		} else{ 
			tile.animation.index = 1;
		}
	}
	
	if(tile.animation.frame < tile.animation.max) {
		tile.animation.frame += 1;
	} else {
		
		//WATER LOGIC
		var tiles = getTiles(tile.water, 32, player.array[0].col, player.array[0].row);
		for(var i=0; i<tiles.length; i++) {
			var t = tiles[i];
			getProxTilePos(t);
			if((t.pos.down.type == tile.air || Math.floor(t.pos.down.type) == tile.water) && t.pos.down.type != tile.water) {
				map.array[t.row+1][t.col] = tile.water;
			}
			if(t.pos.down.type > tile.water + 1 && t.pos.current.type - Math.floor(t.pos.current.type) < 7/8  && (t.pos.left.type == tile.air || t.pos.left.type - Math.floor(t.pos.left.type) > t.pos.current.type - Math.floor(t.pos.current.type))) {
				map.array[t.row][t.col-1] = map.array[t.row][t.col] + 1/8;
			}
			if(t.pos.current.type - Math.floor(t.pos.current.type) > t.pos.left.type - Math.floor(t.pos.left.type)) {
				if(map.array[t.row][t.col-(t.pos.current.type - Math.floor(t.pos.current.type))*8] != tile.water) {
					map.array[t.row][t.col] = tile.air;
				} else {
					for(var w=0; w<(t.pos.current.type - Math.floor(t.pos.current.type))*8; w++) {
						if(Math.floor(map.array[t.row][t.col-w]) != tile.water) {
							map.array[t.row][t.col] = tile.air;
						}
					}
				}
			}
			if(t.pos.down.type > tile.water + 1 && t.pos.current.type - Math.floor(t.pos.current.type) < 7/8   && (t.pos.right.type == tile.air || t.pos.right.type - Math.floor(t.pos.right.type) > t.pos.current.type - Math.floor(t.pos.current.type)) && Math.floor(map.array[t.row][t.col]) == tile.water) {
				map.array[t.row][t.col+1] = map.array[t.row][t.col] + 1/8;
			}
			
			if(t.pos.current.type - Math.floor(t.pos.current.type) == 1/8 && t.pos.left.type == tile.water && t.pos.right.type == tile.water) {
				map.array[t.row][t.col] = tile.water;
			}
			
			if(t.pos.down.type >= tile.flat_redwire && t.pos.down.type <= tile.right_repeater4) {
				createItem(getTileInfo(t.pos.down.type).drop, t.pos.down);
				map.array[t.row+1][t.col] = tile.air;
			}
		}
		
		//GRASS LOGIC
		var tiles = getTiles(tile.grass, 32, player.array[0].col, player.array[0].row);
		for(var i=0; i<tiles.length; i++) {
			var t = tiles[i];
			getProxTilePos(t);
			if(t.pos.upright.type == tile.dirt && !getTileInfo(map.array[t.row-2][t.col+1]).solid) {
				map.array[t.row-1][t.col+1] = tile.grass;
			}
			if(t.pos.right.type == tile.dirt && !getTileInfo(map.array[t.row-1][t.col+1]).solid) {
				map.array[t.row][t.col+1] = tile.grass;
			}
			if(t.pos.downright.type == tile.dirt && !getTileInfo(map.array[t.row][t.col+1]).solid) {
				map.array[t.row+1][t.col+1] = tile.grass;
			}
			if(t.pos.downleft.type == tile.dirt && !getTileInfo(map.array[t.row][t.col-1]).solid) {
				map.array[t.row+1][t.col-1] = tile.grass;
			}
			if(t.pos.left.type == tile.dirt && !getTileInfo(map.array[t.row-1][t.col-1]).solid) {
				map.array[t.row][t.col-1] = tile.grass;
			}
			if(t.pos.upleft.type == tile.dirt && !getTileInfo(map.array[t.row-2][t.col-1]).solid) {
				map.array[t.row-1][t.col-1] = tile.grass;
			}
			
		}
		
		var tiles = getTiles(tile.grass, 32, player.array[0].col, player.array[0].row);
		for(var i=0; i<tiles.length; i++) {
			var t = tiles[i];
			getProxTilePos(t);
			if(getTileInfo(t.pos.up.type).solid) {
				map.array[t.row][t.col] = tile.dirt;
			}
		}
		
	}
	
	var tiles = getTiles(tile.sand, 32, player.array[0].col, player.array[0].row);
	for(var i=0; i<tiles.length; i++) {
		var t = tiles[i];
		t.col = Math.floor((t.x + t.width/2) / tile.width);
		t.row = Math.floor((t.y + t.height/2) / tile.height);
		t.pos.right = getTileObject(t.col + 1, t.row);
		t.pos.down = getTileObject(t.col, t.row + 1);
		t.pos.left = getTileObject(t.col - 1, t.row);
		if(t.pos.down.type == tile.air || t.pos.down.type == tile.water) {
			map.array[t.row][t.col] = tile.air;
			map.array[t.row+1][t.col] = tile.sand;
		}
	}
}

function updateTileEntity() {
	for(var i=0; i<tile.entity.furnace.array.length; i++) {
		var furnace = tile.entity.furnace.array[i];
		if(furnace.fuel > 0) {
			furnace.fuel -= .025;
		} else {
			furnace.fuel = 0;
		}
		for(var j=0; j< recipe.furnace.length; j++) {
			if(furnace.array[0].type == recipe.furnace[j].input && (furnace.array[2].type == recipe.furnace[j].output || furnace.array[2].type == tile.air)) {
				if(furnace.fuel > 0) {
					furnace.percent += .201;
					if(furnace.percent >= 100) {
						furnace.array[0].amt -= 1;
						if(furnace.array[0].amt <= 0) {
							furnace.array[0].type = tile.air;
						}
						furnace.array[2].type = recipe.furnace[j].output;
						furnace.array[2].amt += recipe.furnace[j].amt;
						furnace.percent = 0;
					}
				}
				if(furnace.fuel <= 0) {
					if(furnace.array[1].type == tile.wood) {
						furnace.fuel += 100;
						furnace.array[1].amt -= 1;
						if(furnace.array[1].amt <= 0) {
							furnace.array[1].type = tile.air;
						}
					}
					if(furnace.array[1].type == tile.plank) {
						furnace.fuel += 50;
						furnace.array[1].amt -= 1;
						if(furnace.array[1].amt <= 0) {
							furnace.array[1].type = tile.air;
						}
					}
					if(furnace.array[1].type == tile.stick) {
						furnace.fuel += 12.5;
						furnace.array[1].amt -= 1;
						if(furnace.array[1].amt <= 0) {
							furnace.array[1].type = tile.air;
						}
					}
				}
			}
		}
	}
}

function updatePlayer() {
	var p = player.array[0];
	if (keys[87] || keys[83] || keys[65] || keys[68] || keys[37] || keys[38] || keys[39] || keys[40] || keys[32]) {
		if(p.animation.frame < p.animation.max) {
			p.animation.frame += 1;
		} else{
			p.animation.frame = 0;
			if(p.animation.index < 4) {
				p.animation.index += 1;
			} else{ 
				p.animation.index = 1;
			}
		}
	} else {
		p.dir = 3;
		p.animation.index = 2;
	}
	
	if(p.tile.cur != null) {
		var brk = getTileInfo(p.tile.cur.type);
		var hand = getTileInfo(gui.bar.array[gui.bar.selected].type);
		if(p.tile.cur.row == mousemove.row && p.tile.cur.col == mousemove.column) {
			if(hand.group == brk.group) {
				p.tile.percent += 1 * hand.multiplier / brk.resistance;
			} else {
				p.tile.percent += 1 / brk.resistance;
			}
		} else {
			p.tile.cur = null;
			p.tile.percent = 0;
		}
		if(p.tile.percent >= 100) {
			if(true) {
				for(var i=0; i<tile.entity.craft.array.length; i++) {
					if(tile.entity.craft.array[i].x == p.tile.cur.col * tile.width && tile.entity.craft.array[i].y == p.tile.cur.row * tile.height) {
						for(var j=0; j<tile.entity.craft.array[i].array.length; j++) {
							for(var x=0; x<tile.entity.craft.array[i].array[j].amt; x++) {
								createItem(tile.entity.craft.array[i].array[j].type, p.tile.cur);
							}
						}
						tile.entity.craft.array.splice(i,1);
					}
				}
				for(var i=0; i<tile.entity.chest.array.length; i++) {
					if(tile.entity.chest.array[i].x == p.tile.cur.col * tile.width && tile.entity.chest.array[i].y == p.tile.cur.row * tile.height) {
						for(var j=0; j<tile.entity.chest.array[i].array.length; j++) {
							for(var x=0; x<tile.entity.chest.array[i].array[j].amt; x++) {
								createItem(tile.entity.chest.array[i].array[j].type, p.tile.cur);
							}
						}
						tile.entity.chest.array.splice(i,1);
					}
				}
				for(var i=0; i<tile.entity.furnace.array.length; i++) {
					if(tile.entity.furnace.array[i].x == p.tile.cur.col * tile.width && tile.entity.furnace.array[i].y == p.tile.cur.row * tile.height) {
						for(var j=0; j<tile.entity.furnace.array[i].array.length; j++) {
							for(var x=0; x<tile.entity.furnace.array[i].array[j].amt; x++) {
								createItem(tile.entity.furnace.array[i].array[j].type, p.tile.cur);
							}
						}
						tile.entity.furnace.array.splice(i,1);
					}
				}
				
				for(var i=0; i<power.source.length; i++) {
					var r = power.source[i];
					if(r.row == p.tile.cur.row && r.col == p.tile.cur.col) {
						power.source.splice(i,1);
					}
				}
				for(var i=0; i<power.block.length; i++) {
					var r = power.block[i];
					if(r.row == p.tile.cur.row && r.col == p.tile.cur.col) {
						power.block.splice(i,1);
					}
				}
				for(var i=0; i<power.wire.length; i++) {
					var r = power.wire[i];
					if(r.row == p.tile.cur.row && r.col == p.tile.cur.col) {
						power.wire.splice(i,1);
					}
				}
				
				createItem(brk.drop, p.tile.cur);
				map.array[p.tile.cur.row][p.tile.cur.col] = tile.air;
				p.tile.cur = null;
				p.tile.percent = 0;
			}
		}
	}
	
	for(var i=0; i<item.array.length; i++) {
		var e = item.array[i];
		var info = getTileInfo(e.type);
		if(getCollision(p,e)) {
			var exit = false;
			var openbar = [];
			var openinv = [];
			
			for(var j=0; j<gui.bar.array.length; j++) {
				if(!exit) {
					if(gui.bar.array[j].type == 0) {
						openbar.push(j);
					}
					if(gui.bar.array[j].type == e.type && gui.bar.array[j].amt < info.stack) {
						gui.bar.array[j].amt += 1;
						item.array.splice(i, 1);
						exit = true;
					}
				}
			}
			
			for(var op = 0; op<openbar.length; op++) {
				if(!exit) {
					var id = openbar[op];
					gui.bar.array[id].type = e.type;
					gui.bar.array[id].amt += 1;
					item.array.splice(i, 1);
					exit = true;
				}
			}
			
			for(var j=0; j<gui.inv.array.length; j++) {
				if(!exit) {
					if(gui.inv.array[j].type == 0) {
						openinv.push(j);
					}
					if(gui.inv.array[j].type == e.type && gui.inv.array[j].amt < info.stack) {
						gui.inv.array[j].amt += 1;
						item.array.splice(i, 1);
						exit = true;
					}
				}
			}
				
			for(var op = 0; op<openinv.length; op++) {
				if(!exit) {
					var id = openinv[op];
					gui.inv.array[id].type = e.type;
					gui.inv.array[id].amt += 1;
					item.array.splice(i, 1);
					exit = true;
				}
			}
		}
	}
	
	if(p.health <= 0) {
	
	}
	
	if((p.pos.current.type - Math.floor(p.pos.current.type) > p.pos.right.type - Math.floor(p.pos.right.type) && p.pos.right.type != 0) || (p.pos.current.type - Math.floor(p.pos.current.type) == 7/8 && p.pos.right.type - Math.floor(p.pos.right.type) == 6/8)) {
		p.x -= p.vel/2;
	}
	if((p.pos.current.type - Math.floor(p.pos.current.type) > p.pos.left.type - Math.floor(p.pos.left.type) && p.pos.left.type != 0) || (p.pos.current.type - Math.floor(p.pos.current.type) == 7/8 && p.pos.left.type - Math.floor(p.pos.left.type) == 6/8)) {
		p.x += p.vel/2;
	}
	
	if(keys[87] && Math.floor(p.pos.current.type) == tile.water) {
		p.y -= p.vel;
		p.dir  = 1;
	}
		
	if(keys[68] || keys[39]) {
		p.x += p.vel;
		p.dir = 2;
	}
	if(keys[65] || keys[37]) {
		p.x -= p.vel;
		p.dir = 4;
	}
	if(keys[32] && !p.jump.state) {
		createRise(p);
		p.dir = 1;
	}
	if(Math.floor(p.pos.current.type) == tile.water) {
		//p.vel = 1;
	} else {
		p.vel = 4;
	}
	
	getJump(p);
	getProxTilePos(p);
	getProxTileCollision(p);
	
	map.x = Math.min(0, -1 * (p.x - 12 * tile.width));
	map.y = Math.min(0, -1 * (p.y - 7 * tile.height));
	
	/*if(p.weapon.disable) {
		p.weapon.dtime += 1;
		if(p.weapon.dtime > p.weapon.firerate) {
			p.weapon.dtime = 0;
			p.weapon.disable = false;
		}
	}
	
	if(keys[32] && p.state == 0 && !p.weapon.disable && p.weapon.type != "None" && p.weapon.ammo > 0) {
		p.weapon.ammo -= 1;
		p.weapon.disable = true;
		createBullet(p);
	}*/
}
	
function updateEnemy() {
	for(var i=0; i<enemy.array.length; i++) {
		var cp = enemy.array[i];
		var p = player.array[0];
		
		if(getDistance(cp, p) <= game.range * tile.width) {
		if(getDistance(cp, p) >= tile.width) {
			var path = cp.path.current;
			var waypoint = cp.path.node;
			if(path != null) {
			if (cp.y > path[waypoint].y * tile.height) {
				/*if(!cp.jump.state) {
					createRise(cp);
				}*/
				cp.y -= cp.vel;
				cp.dir = 1;
				if(cp.y < path[waypoint].y * tile.height) {
					cp.y = path[waypoint].y * tile.height;
				}
			}
			if (cp.y < path[waypoint].y * tile.height) {
				cp.y += cp.vel;
				cp.dir = 3;
				if(cp.y > path[waypoint].y * tile.height) {
					cp.y = path[waypoint].y * tile.height;
				}
			}
			if (cp.x < path[waypoint].x * tile.width) {
				cp.x += cp.vel;
				cp.dir = 2;
				if(cp.x > path[waypoint].x * tile.width) {
					cp.x = path[waypoint].x * tile.width;
				}
			}
			if (cp.x > path[waypoint].x * tile.width) {
				cp.x -= cp.vel;
				cp.dir = 4;
				if(cp.x < path[waypoint].x * tile.width) {
					cp.x = path[waypoint].x * tile.width;
				}
			}
			
			/*getJump(cp);
			getProxTilePos(cp);
			getProxTileCollision(cp);*/
			
			if(cp.x == path[waypoint].x * tile.width && cp.y == path[waypoint].y * tile.height) {
				if(waypoint < path.length - 1) {
					cp.path.node += 1;
				} else {
				
					if(getDistance(cp, p) <= cp.range * tile.width && cp.state != 1) {
						cp.state = 1;
						cp.vel = 2;
						cp.animation.max = 6;
					}
					
					if(getDistance(cp, p) > cp.range * 2 * tile.width && cp.state != 0) {
						cp.state = 0;
						cp.vel = 1;
						cp.animation.max = 12;
					}
					
					cp.path.node = 0;
					cp.path.start = [Math.floor(cp.x / tile.width), Math.floor(cp.y / tile.height)];
					
					if(cp.state == 0) {
						var goal = getRandomTile(tile.air, 4, Math.floor(cp.x / tile.width), Math.floor(cp.y / tile.width));
						cp.path.goal = [goal[0], goal[1]];
					}
					
					if(cp.state == 1) {
						cp.path.goal = [Math.floor((p.x + p.width/2) / tile.width), Math.floor((p.y + p.height/2) / tile.height)];
					}
					
					getPath(cp, cp.path.start, cp.path.goal, [tile.air, tile.water]);
				}
			}
			} else {
				cp.path.node = 0;
				cp.path.start = [Math.floor(cp.x / tile.width), Math.floor(cp.y / tile.height)];
				
				if(cp.state == 0) {
					var goal = getRandomTile(tile.grass, 4, Math.floor(cp.x / tile.width), Math.floor(cp.y / tile.width));
					cp.path.goal = [goal[0], goal[1]];
				}
				
				if(cp.state == 1) {
					cp.path.goal = [Math.floor((p.x + p.width/2) / tile.width), Math.floor((p.y + p.height/2) / tile.height)];
				}
				
				getPath(cp, cp.path.start, cp.path.goal, [tile.air, tile.water]);
			}
			
			if(map.x + cp.x <= canvas.width && map.y + cp.y <= canvas.height && map.x + cp.x + cp.width >= 0 && map.y + cp.y + cp.height >= 0) {
				if(cp.animation.frame < cp.animation.max) {
					cp.animation.frame += 1;
				} else{
					cp.animation.frame = 0;
					if(cp.animation.index < 4) {
						cp.animation.index += 1;
					} else{ 
						cp.animation.index = 1;
					}
				}
			}
		}
		
		if(cp.health <= 0) {
			createItem(1, cp);
			createParticle(cp, 12, 4, .25, "red", .6);
			enemy.array.splice(i, 1);
			if(game.log) console.log("Entity Killed [Type: enemy] [Cause: Collision]");
		}
			
		if(cp.weapon.disable) {
			cp.weapon.dtime += 1;
			if(cp.weapon.dtime > cp.weapon.firerate) {
				cp.weapon.dtime = 0;
				cp.weapon.disable = false;
			}
		}
		if(cp.state == 1 && cp.weapon.disable == false) {	
			if ((cp.x + cp.width > p.x && cp.x < p.x + p.width) ||
			(cp.y + cp.height > p.y && cp.y < p.y + p.height)) {
				cp.weapon.disable = true;
				createBullet(cp);
			}
		}
			
		}
	}
}

function updateItem() {
	for(var i=0; i<item.array.length; i++) {
		var e = item.array[i];
		var p = player.array[0];
		
		getJump(e);
		getProxTilePos(e);
		getProxTileCollision(e);
		var current = e.pos.current;
		
		if(current.type >= e.wall) {
			createRise(e);
		}
		
		if(!e.jump.state) {
			if(getDistance(e, p) <= game.range * tile.width) {
				e.min_y = (Math.floor(current.y / tile.height) * tile.height) + (current.height/2 - 8) - 8;
				e.max_y = (Math.floor(current.y / tile.height) * tile.height) + (current.height/2 - 8) + 8;
				e.y += e.vel;
				if(e.y < e.min_y || e.y > e.max_y) {
					e.vel *= -1;
				}
			}
		}
		
	}
}

function updateBullet() {
	for(var i=0; i<bullet.array.length; i++) {
		var b = bullet.array[i];
		var p = player.array[0];
		
		switch(b.dir) {
			case 1: b.y -= b.vel; break;
			case 2: b.x += b.vel; break;
			case 3: b.y += b.vel; break;
			case 4: b.x -= b.vel; break;
		}
		
		var row = Math.floor(b.y / tile.height);
		var col = Math.floor(b.x / tile.width);
		if(map.array[row][col] == tile.tree) {
			createParticle(b, 8, 2, .1, "black", .6);
			bullet.array.splice(i, 1);
			return;
		}
		
		for(var j=0; j<enemy.array.length; j++) {
			var cp = enemy.array[j];
			if(getCollision(b, cp) && b.origin != cp) {
				createParticle(b, 8, 2, .1, "black", .6);
				bullet.array.splice(i, 1);
				cp.health -= b.dmg;
				return;
			}
		}
		
		if(getCollision(b, p) && b.origin != p) {
			createParticle(b, 8, 2, .1, "black", .6);
			bullet.array.splice(i, 1);
			p.health -= b.dmg;
			return;
		}
		
		if(b.age > b.max) {
			bullet.array.splice(i, 1);
			return;
		} else {
			b.age += 1;
		}
		
	}
}

function updateParticle() {
	for(var i=0; i<particle.array.length; i++) {
		var p = particle.array[i];
		if(p.origin != null) {
			p.max_x = (p.origin.x + p.origin.width/2) + p.radius;
			p.min_x = (p.origin.x + p.origin.width/2) - p.radius;
			p.max_y = (p.origin.y + p.origin.height/2) + p.radius;
			p.min_y = (p.origin.y + p.origin.height/2) - p.radius;
		}
		if(p.age > p.max) {
			particle.array.splice(i, 1);
			return;
		} else {
			p.age += 1;
		}
	}
}

function render() {
	cxt.clearRect(0,0,canvas.width,canvas.height);
	renderMap();
	renderItem();
	renderPlayer();
	renderEnemy();
	renderBullet();
	renderParticle();
	renderGui();
	
	game.frame++;
	requestAnimationFrame(render);
}

function renderMap() {
	var offsetX = map.x;
	var offsetY = map.y;
	var firstTileX = Math.max(Math.floor((-1*offsetX) / tile.width),0);
	var lastTileX = Math.min(firstTileX + (canvas.width/tile.width) + 1,map.width-1);
	var firstTileY = Math.max(Math.floor((-1*offsetY) / tile.height),0);
	var lastTileY = Math.min(firstTileY + (canvas.height/tile.height) + 1,map.height-1);
	for (var i = firstTileY; i < lastTileY; i++) {
		for (var j = firstTileX; j < lastTileX; j++) {
			var id = map.array[i][j];
			
			if(Math.floor(id) == tile.water && tile.animation.index == 1) {
				id += 1;
			}
			
			var sy = (id - Math.floor(id)) * tile.height;
			id = Math.floor(id);
			var sx = id * 32;
			tile.x = j * tile.width + offsetX;
			tile.y = i * tile.height + offsetY;
			if(id < 100) {
				if(id != tile.air) {
					cxt.drawImage(tile.sprite,sx,sy,32,32,tile.x,tile.y + sy,tile.width,tile.height);
				}
			} else if(id < 200) {
				cxt.drawImage(tile.itemsprite,sx - 3200,sy,32,32,tile.x,tile.y + (sy * tile.height),tile.width,tile.height);
			} else {
				cxt.drawImage(tile.redsprite,sx - 6400,sy,32,32,tile.x,tile.y + (sy * tile.height),tile.width,tile.height);
			}
			if(isPowerSource(i,j)) {
				cxt.fillStyle = "red";
				cxt.globalAlpha = .3;
				cxt.fillRect(tile.x,tile.y,tile.width,tile.height);
				cxt.globalAlpha = 1;
			}
			if(isPowerBlock(i,j)) {
				cxt.fillStyle = "blue";
				cxt.globalAlpha = .3;
				cxt.fillRect(tile.x,tile.y,tile.width,tile.height);
				cxt.globalAlpha = 1;
			}
			if(player.array[0].tile.cur != null && i == player.array[0].tile.cur.row && j == player.array[0].tile.cur.col) {
				if(player.array[0].tile.percent < 25) cxt.drawImage(tile.brksprite,0,sy,32,32,tile.x,tile.y,tile.width,tile.height);
				else if(player.array[0].tile.percent < 50) cxt.drawImage(tile.brksprite,32,sy,32,32,tile.x,tile.y,tile.width,tile.height);
				else if(player.array[0].tile.percent < 75) cxt.drawImage(tile.brksprite,64,sy,32,32,tile.x,tile.y,tile.width,tile.height);
				else if(player.array[0].tile.percent < 100) cxt.drawImage(tile.brksprite,96,sy,32,32,tile.x,tile.y,tile.width,tile.height);
			}
        }
	}
}

function renderPlayer() {
	for(var i=0; i<player.array.length; i++) {
		var p = player.array[i];
		if(p.state == 0) {
			var sx = (p.animation.index * 32) - 32;
			var sy = (p.dir * 32) - 32;
			cxt.drawImage(player.sprite,sx,sy,32,32,map.x + p.x,map.y + p.y,p.width,p.height);
			
			var vpx = map.x + p.x;
			var vpy = map.y + p.y + p.height * .40;
			if(p.dir == 1 || p.dir == 2) {
				vpx += p.width/2;
			}
			if(p.animation.index == 2 || p.animation.index == 4) {
				if(p.dir == 2 || p.dir == 4) {
					vpx += 2;
				}
				if(p.dir == 1 || p.dir == 3) {
					vpy += 2;
				}
			}
			
			var id = gui.bar.array[gui.bar.selected].type;
			var sx = id * 32;
			var sy = 0;
			if(id != 0) {
				if(id < 100) {
					cxt.drawImage(tile.sprite,sx,sy,32,32,vpx,vpy,8,8);
				} else if(id < 200) {
				cxt.drawImage(tile.itemsprite,(id-100)*32,sy,32,32,vpx,vpy,16,16);
			} else {
				cxt.drawImage(tile.redsprite,(id-200)*32,sy,32,32,vpx,vpy,16,16);
			}
			}
			
			cxt.strokeRect(map.x + p.x,map.y + p.y - 10,p.width, tile.width / 6.4);
			cxt.fillStyle = "red";
			cxt.fillRect(map.x + p.x + 1,map.y + p.y - 9,(p.health * p.width) / 100, tile.width / 10.6);
			cxt.fillStyle = "black";
		}
	}
}

function renderEnemy() {
	for(var i=0; i<enemy.array.length; i++) {
		var cp = enemy.array[i];
		var vpx = map.x + cp.x;
		var vpy = map.y + cp.y;
		if(vpx <= canvas.width && vpy <= canvas.height && vpx + cp.width >= 0 && vpy + cp.height >= 0) {
			var sx = (cp.animation.index * 32) - 32;
			var sy = (cp.dir * 32) - 32;
			cxt.drawImage(enemy.sprite,sx,sy,32,32,vpx,vpy,cp.width,cp.height);
			
			cxt.strokeRect(vpx,vpy - 10,cp.width, tile.width / 6.4);
			cxt.fillStyle = "red";
			cxt.fillRect(vpx + 1,vpy - 9,(cp.health * cp.width) / 100, tile.width / 10.6);
			cxt.fillStyle = "black";
		}
	}
}

function renderItem() {
	for(var i=0; i<item.array.length; i++) {
		var e = item.array[i];
		var vpx = map.x + e.x;
		var vpy = map.y + e.y;
		if(vpx <= canvas.width && vpy <= canvas.height && vpx + e.width >= 0 && vpy + e.height >= 0) {
			var id = e.type;
			var sx = id * 32;
			var sy = 0;
			if(id < 100) {
				cxt.drawImage(tile.sprite,sx,sy,32,32,vpx,vpy,e.width,e.height);
			} else if(id < 200) {
				cxt.drawImage(tile.itemsprite,(id-100)*32,sy,32,32,vpx,vpy,e.width,e.height);
			} else {
				cxt.drawImage(tile.redsprite,(id-200)*32,sy,32,32,vpx,vpy,e.width,e.height);
			}
		}
	}
}

function renderBullet() {
	for(var i=0; i<bullet.array.length; i++) {
		var b = bullet.array[i];
		var vpx = map.x + b.x;
		var vpy = map.y + b.y;
		if(vpx <= canvas.width && vpy <= canvas.height && vpx + b.width >= 0 && vpy + b.height >= 0) {
			cxt.fillRect(vpx,vpy,b.width,b.height);
		}
	}
}

function renderParticle() {
	for(var i=0; i<particle.array.length; i++) {
		var p = particle.array[i];
		var vpx = map.x + p.min_x;
		var vpy = map.y + p.min_y;
		if(vpx <= canvas.width && vpy <= canvas.height && vpx + p.radius*2 >= 0 && vpy + p.radius*2 >= 0) {
			cxt.fillStyle = p.color;
			cxt.globalAlpha = p.alpha;
			for(var am=0; am<p.amount; am++) {
				var x = getRandomInt(p.min_x, p.max_x);
				var y = getRandomInt(p.min_y, p.max_y);
				cxt.fillRect(map.x + x, map.y + y, p.width, p.height);
			}
			cxt.fillStyle = "black";
			cxt.globalAlpha = 1.0;
		}
	}
}



function createTileEntity(type, row, col) {
	if(type == tile.craft) {
		tile.entity.craft.array.push({
			x: col * tile.width,
			y: row * tile.height,
			array: []
		});
		for(var i=0; i<10; i++) {
			tile.entity.craft.array[tile.entity.craft.array.length-1].array.push({
				type: 0,
				amt: 0,
				x: 0,
				y: 0,
				width: 32,
				height: 32
			});
		}
	}
	if(type == tile.chest) {
		tile.entity.chest.array.push({
			x: col * tile.width,
			y: row * tile.height,
			array: []
		});
		for(var i=0; i<36; i++) {
			tile.entity.chest.array[tile.entity.chest.array.length-1].array.push({
				type: 0,
				amt: 0,
				x: 0,
				y: 0,
				width: 32,
				height: 32
			});
		}
	}
	if(type == tile.furnace) {
		tile.entity.furnace.array.push({
			x: col * tile.width,
			y: row * tile.height,
			array: [],
			fuel: 0,
			percent: 0
		});
		for(var i=0; i<3; i++) {
			tile.entity.furnace.array[tile.entity.furnace.array.length-1].array.push({
				type: 0,
				amt: 0,
				x: 0,
				y: 0,
				width: 32,
				height: 32
			});
		}
	}
}

function createPlayer() {
	player.array.push({
		x: 512 * tile.width,
		y: 1 * tile.height,
		width: 32,
		height: 32,
		
		jump: {
			state: false,
			vel: {
				init: 6,
				cur: 0,
				max: -15
			}
		},
		
		tile: {
			percent: 0,
			mult: 1,
			cur: null
		},
		
		col: 0,
		row: 0,
		vel: 2,
		wall: 3,
		dir: 3,
		state: 0,
		model: 2,
		health: 100,
		pos: {
			current: 0,
			upleft: 0,
			up: 0,
			upright: 0,
			right: 0,
			downright: 0,
			down: 0,
			downleft: 0,
			left: 0
		},
		weapon: {
			type: "None",
			ammo: 20,
			firerate: 30,
			disable: false,
			dtime: 0
		},
		animation: {
			frame: 0,
			max: 6,
			index: 2
		}
	});
	map.x = -1 * (player.array[0].x - 12 * tile.width);
	map.y = - 1* (player.array[0].y - 7 * tile.height);
}

function createEnemy() {
	var coord = getRandomTile(tile.grass, 8, player.array[0].col, player.array[0].row);
	if(coord == null) {
		return;
	}
	enemy.array.push({
		x: tile.width * coord[0],
		y: tile.height * coord[1] - tile.height,
		width: 32,
		height: 32,
		vel: 1,
		dir: 3,
		range: 4,
		state: 0,
		health: 100,
		jump: {
			state: false,
			vel: {
				init: 6,
				cur: 0,
				max: -15
			}
		},
		pos: {
			current: 0,
			upleft: 0,
			up: 0,
			upright: 0,
			right: 0,
			downright: 0,
			down: 0,
			downleft: 0,
			left: 0
		},
		weapon: {
			type: "None",
			firerate: 60,
			disable: false,
			dtime: 0
		},
		path: {
			node: 0,
			start: [0, 0],
			goal: [0, 0],
			current: []
		},
		animation: {
			frame: 0,
			max: 12,
			index: 2
		}
	});
	var i = enemy.array.length - 1;
	var c = enemy.array[i];
	c.path.start = [c.x / tile.width, c.y / tile.height];
	if(c.state == 0) {
		var goal = getRandomTile(tile.air, 4, Math.floor(c.x / tile.width), Math.floor(c.y / tile.width));
		enemy.array[i].path.goal = [goal[0], goal[1]];
	}
	if(c.state == 1) {
		enemy.array[i].path.goal = [player.array[0].col, player.array[0].row];
	}
	getPath(enemy.array[i], c.path.start, c.path.goal, [tile.air, tile.water]);
}

function createItem(type, origin) {
	if(type == tile.air || type == null) {
		return;
	}
	item.array.push({
		type: type,
		x: 0,
		y: 0,
		width: 16,
		height: 16,
		min_y: 0,
		max_y: 0,
		vel: .2,
		
		wall: 3,
		
		pos: {
			current: 0,
			upleft: 0,
			up: 0,
			upright: 0,
			right: 0,
			downright: 0,
			down: 0,
			downleft: 0,
			left: 0
		},
		
		jump: {
			state: false,
			vel: {
				init: 15,
				cur: 0,
				max: -7
			}
		}
		
	});
	if(origin != null) {
		var e = item.array[item.array.length - 1];
		e.x = (Math.floor(origin.x / tile.width) * tile.width) + (origin.width/2 - 8);
		e.y = (Math.floor(origin.y / tile.height) * tile.height) + (origin.height/2 - 8);
		e.min_y = e.y - 8;
		e.max_y = e.y + 8;
	}
}

function createBullet(origin, damage) {
	bullet.array.push({
		origin: origin,
		x: origin.x + origin.width/2,
		y: origin.y + origin.height/2,
		width: 4,
		height: 4,
		vel: 8,
		dir: origin.dir,
		age: 0,
		max: 60 * 1,
		dmg: damage || 10
	});
}

function createParticle(origin, radius, amount, seconds, color, alpha) {
	particle.array.push({
		origin: origin,
		radius: radius,
		max_x: (origin.x + origin.width/2) + radius,
		min_x: (origin.x + origin.width/2) - radius,
		max_y: (origin.y + origin.height/2) + radius,
		min_y: (origin.y + origin.height/2) - radius,
		width: 4,
		height: 4,
		amount: amount,
		color: color,
		alpha: alpha,
		age: 0,
		max: 60 * seconds
	});
}


	
function init() {
	resize();
	loadSprites();
	initMap();
	initRecipe();
	initGui();
	createPlayer();
	
	var UpdateLoop = setInterval(function() {update();},1000/game.ups);
    var RenderLoop = requestAnimationFrame(render);
	var FpsLoop = setInterval(function() {game.fps = game.frame; game.frame = 0;}, 1000);
}

function resize() { 
	canvas.width = 800;
	canvas.height = 480;
	
	var screenheight = window.innerHeight - 32;
	var screenwidth = screenheight / 3 * 5;
	
	canvas.style.width =  screenwidth + "px";
	canvas.style.height = screenheight + "px";
}