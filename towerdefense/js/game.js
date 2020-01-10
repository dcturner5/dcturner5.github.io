//Graphics Context
var canvas = document.getElementById("Canvas");
var cxt = canvas.getContext("2d");

var game = {
	running: false,
	gameover: false,
	ups: 60,
	fps: 0,
	level: {
		running: false,
		ready: false,
		wave: 1
	}
}

var gui = {
	startscreen: {
		sprite: new Image()
	},
	gameover: {
		sprite: new Image()
	},
	shop: {
		select: false,
		x: 32,
		y: canvas.height - 96,
		width: 288,
		height: 64,
		sprite: new Image(),
		
		cannon: {
			select: false,
			hover: false,
			value: 100,
			x: 32 + 72,
			y: canvas.height - 96 + 16,
			width: 32,
			height: 32,
			sprite: new Image()
		},
		
		mortar: {
			select: false,
			hover: false,
			value: 400,
			x: 32 + 72 + 40,
			y: canvas.height - 96 + 16,
			width: 32,
			height: 32,
			sprite: new Image()
		},
		
		catapult: {
			select: false,
			hover: false,
			value: 800,
			x: 32 + 72 + 80,
			y: canvas.height - 96 + 16,
			width: 32,
			height: 32,
			sprite: new Image()
		},
		
		ballista: {
			select: false,
			hover: false,
			value: 1600,
			x: 32 + 72 + 120,
			y: canvas.height - 96 + 16,
			width: 32,
			height: 32,
			sprite: new Image()
		},
		
		icon: {
			x: 32,
			y: canvas.height - 96,
			width: 64,
			height: 64,
			sprite: new Image()
		}
	},
	sButton: {
		select: false,
		icon: {
			x: canvas.width - 96,
			y: canvas.height - 96,
			width: 64,
			height: 64,
			sprite: new Image()
		}
	}
}

var particle = {
	array: []
}

var map = {
	x: 0,
	y: 0,
	column: 0,
	row: 0,
	width: canvas.width/32,
	height: canvas.height/32,
	array: new Array()
}

var tile = {
	x: 0,
	y: 0,
	width: 32,
	height: 32,
	grass: 0,
	dirt: 1,
	lead: 2,
	concrete: 3,
	sprite: {
		sheet: new Image()
    }
}

var player = {
	money: 500
}

var tower = {
	array: new Array(),
	bullet: {
		sprite: new Image()
	},
	cannon: {
		id: 1,
		range: 4,
		rate: 2,
		damage: 1,
		sprite: new Image()
	},
	mortar: {
		id: 2,
		range: 3,
		rate: 4,
		damage: 5,
		sprite: new Image()
	},
	catapult: {
		id: 3,
		range: 5,
		rate: 1,
		damage: 3,
		sprite: new Image()
	},
	ballista: {
		id: 4,
		range: 7,
		rate: .5,
		damage: 2,
		sprite: new Image()
	}
}

var enemy = {
	array: new Array(),
	sprite: new Image()
}

function update() {
	if(game.running) {
		updateTower();
		updateEnemy();
		updateBullet();
		updateParticle();
	}
}

function updateTower() {
	for(var i=0; i < tower.array.length; i++) {
	
		if(tower.array[i].animation.running) {
				if(tower.array[i].animation.frame < tower.array[i].animation.max) {
					tower.array[i].animation.frame += 1;
				} else{
					tower.array[i].animation.frame = 0;
					if(tower.array[i].animation.index < 4) {
						tower.array[i].animation.index += 1;
					} else { 
						tower.array[i].animation.index = 1;
						tower.array[i].animation.running = false;
					}
				}
			}
	
		if(game.level.running) {
			
			var closest = "";
			var closestDist = tower.array[i].range * tile.width;
			for(var j=0; j < enemy.array.length; j++) {
				var dist = getDistance(tower.array[i], enemy.array[j]);
				if(dist < closestDist)  {
					closestDist = dist;
					closest = enemy.array[j];
				} 
			}
			
			if(tower.array[i].bullets.disable) {
				if(tower.array[i].bullets.dtime > tower.array[i].firerate * game.ups) {
					tower.array[i].bullets.disable = false;
					tower.array[i].bullets.dtime = 0;
				} else {
					tower.array[i].bullets.dtime += 1;
				}
			}
			
			if(closest != "") {
				if(!tower.array[i].bullets.disable) {
					createBullet(i, tower.array[i].x + tower.array[i].width/2, tower.array[i].y + tower.array[i].height/2, closest);
					tower.array[i].bullets.disable = true;
					tower.array[i].animation.running = true;
				}
				var num = tower.array[i].bullets.array.length - 1;
				tower.array[i].angle = getAngle(tower.array[i], closest);
			}
		}
	}
}

function updateEnemy() {
	if(game.level.running && game.level.ready && enemy.array.length == 0) {
		endWave();
	}
	if(game.level.running) {
		for(var i=0; i<enemy.array.length; i++) {
			var e = enemy.array[i];
			if(e.animation.frame < e.animation.max) {
				e.animation.frame += 1;
			} else{
				e.animation.frame = 0;
				if(e.animation.index < 4) {
					e.animation.index += 1;
				} else{ 
					e.animation.index = 1;
				}
			}
			
			if(e.health <= 0) {
				createParticle(e, 16, 4, .5, "red", .6);
				enemy.array.splice(i,1);
				player.money += 25;
			}

			var path = e.path.current;
			var waypoint = e.path.node;
			
			if (e.y > path[waypoint].y * tile.height) {
				e.y -= e.vel;
				e.dir = 1;
				if(e.y < path[waypoint].y * tile.height) {
					e.y = path[waypoint].y * tile.height;
				}
			}
			if (e.y < path[waypoint].y * tile.height) {
				e.y += e.vel;
				e.dir = 3;
				if(e.y > path[waypoint].y * tile.height) {
					e.y = path[waypoint].y * tile.height;
				}
			}
			if (e.x < path[waypoint].x * tile.height) {
				e.x += e.vel;
				e.dir = 2;
				if(e.y > path[waypoint].y * tile.height) {
					e.y = path[waypoint].y * tile.height;
				}
			}
			if (e.x > path[waypoint].x * tile.height) {
				e.x -= e.vel;
				e.dir = 4;
				if(e.x < path[waypoint].x * tile.height) {
					e.x = path[waypoint].x * tile.height;
				}
			}
			if(e.x == path[waypoint].x * tile.width && e.y == path[waypoint].y * tile.height) {
				if(waypoint < e.path.current.length - 1) {
					e.path.node += 1;
				} else {
					e.path.current = [];
					e.path.node = 0;
					
					gameover();
				}
			}
		}
	}
	
}

function updateBullet() {
	for(var i=0; i < tower.array.length; i++) {
		for(var j=0; j < tower.array[i].bullets.array.length; j++) {
			var b = tower.array[i].bullets.array[j];
			
			b.x += b.slope[1] * b.vel;
			b.y += b.slope[0] * b.vel;
			
			if(b.age > b.maxAge) {
				tower.array[i].bullets.array.splice(j,1);
			} else {
				b.age += 1;
			}
			
			for(var x=0; x < enemy.array.length; x++) {
				if(getCollision(b, enemy.array[x])) {
					createParticle(b, 8, 2, .1, "black", .6);
					tower.array[i].bullets.array.splice(j,1);
					enemy.array[x].health -= b.damage;
				}
			}
			
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
	if(game.running) {
		renderMap();
		renderTower();
		renderEnemy();
		renderBullet();
		renderParticle();
		renderGui();
	} else {
		if(game.gameover) {
			renderGameover();
		} else {
			renderStart();
		}
	}
	
	requestAnimationFrame(render);
}

function renderStart() {
	cxt.drawImage(gui.startscreen.sprite,0,0,canvas.width,canvas.height);
}

function renderGameover() {
	cxt.drawImage(gui.gameover.sprite,0,0,canvas.width,canvas.height);
}	

function renderMap() {
	tile.x = 0;
    tile.y = 0;
    cxt.clearRect(0,0,canvas.width,canvas.height);
    for (var i=0; i < map.height; i++) {
        for (var j=0; j < map.width; j++) {
            var id = (parseInt(map.array[i][j]));
            var sx = (id - (Math.floor(id / 10) * 10)) * 32;
            var sy = Math.floor(id / 10) * 32;
			cxt.drawImage(tile.sprite.sheet,sx,sy,32,32,tile.x,tile.y,tile.width,tile.height);
			tile.x += tile.width;
        }
        tile.x = 0;
        tile.y += tile.height;
    }
}

function renderTower() {
	for(var i=0; i<tower.array.length; i++) {
		var t = tower.array[i];
		cxt.save();
		cxt.translate(t.x + t.width/2, t.y + t.height/2);
		cxt.rotate(t.angle);
		var sx = (t.animation.index * 32) - 32;
		
		switch(t.type) {
			case tower.cannon.id: cxt.drawImage(tower.cannon.sprite, sx, 0, 32, 32, -1 * (t.width/2), -1 * (t.height/2), t.width, t.height); break;
			case tower.mortar.id: cxt.drawImage(tower.mortar.sprite, sx, 0, 32, 32, -1 * (t.width/2), -1 * (t.height/2), t.width, t.height); break;
			case tower.catapult.id: cxt.drawImage(tower.catapult.sprite, sx, 0, 32, 32, -1 * (t.width/2), -1 * (t.height/2), t.width, t.height); break;
			case tower.ballista.id: cxt.drawImage(tower.ballista.sprite, sx, 0, 32, 32, -1 * (t.width/2), -1 * (t.height/2), t.width, t.height); break;
		}
		cxt.restore();
	}
}

function renderEnemy() {
	var order = enemy.array;
	order.sort(function(a, b){
		if(a.y != b.y) {
			return a.y - b.y;
		}
		if(a.x != b.x) {
			return a.x - b.x;
		}
	});
	for(var i=0; i<order.length; i++) {
		var e = enemy.array[i];
		var sx = (e.animation.index * 32) - 32;
		var sy = (e.dir * 32) - 32;
		cxt.drawImage(enemy.sprite,sx,sy,32,32,e.x,e.y,e.width,e.height);
	}
}

function renderBullet() {
	for(var i=0; i < tower.array.length; i++) {
		for(var j=0; j < tower.array[i].bullets.array.length; j++) {
			var b = tower.array[i].bullets.array[j];
			cxt.drawImage(tower.bullet.sprite, b.x, b.y, b.width, b.height);
		}
	}
}

function renderParticle() {
	for(var i=0; i<particle.array.length; i++) {
		var p = particle.array[i];
		cxt.fillStyle = p.color;
		cxt.globalAlpha = p.alpha;
		for(var am=0; am<p.amount; am++) {
			var x = getRandomInt(p.min_x, p.max_x);
			var y = getRandomInt(p.min_y, p.max_y);
			cxt.fillRect(x, y, p.width, p.height);
		}
		cxt.fillStyle = "black";
		cxt.globalAlpha = 1.0;
	}
}



function createTower(building) {
	tower.array.push({
		type: building,
		x: mousemove.column * tile.width,
		y: mousemove.row * tile.height,
		width: 32,
		height: 32,
		
		angle: 0,
		range: 0,
		firerate: 0,
		bullets: {
			array: new Array(),
			disable: false,
			dtime: 0
		},
		animation: {
			running: false,
			frame: 0,
			index: 1,
			max: 2
		}
	});
	var id = tower.array.length - 1;
	var t = tower.array[id];
	switch(building) {
		case tower.cannon.id:
			t.range = tower.cannon.range;
			t.firerate = tower.cannon.rate;
			break;
		case tower.mortar.id:
			t.range = tower.mortar.range;
			t.firerate = tower.mortar.rate;
			break;
		case tower.catapult.id:
			t.range = tower.catapult.range;
			t.firerate = tower.catapult.rate;
			break;
		case tower.ballista.id:
			t.range = tower.ballista.range;
			t.firerate = tower.ballista.rate;
			break;
	}
}

function createEnemy() {
	enemy.array.push({
		x: 0,
		y: 0,
		width: 32,
		height: 32,
		health: 5,
		vel: 1,
		dir: 2,
		path: {
			node: 0,
			start: [0, 0],
			goal: [0, 0],
			current: []
		},
		animation: {
			frame: 0,
			max: 15,
			index: 2
		}
	});
	var id = enemy.array.length - 1;
	var e = enemy.array[id];
	if(game.level.wave < 10) {
		e.vel = 1;
		e.health = 3;
	}
	else if(game.level.wave >= 10 && game.level.wave < 15) {
		e.vel =  2;
		e.health = 5;
	}
	else if(game.level.wave >= 15 && game.level.wave < 20) {
		e.vel =  3;
		e.health = 8;
	}
	else if(game.level.wave >= 20 && game.level.wave < 30) {
		e.vel =  4;
		e.health = 10;
	}
	else {
		e.vel =  6;
		e.health = game.level.wave;
	}
	
	for(var i = 0; i < map.height; i++) {
		if(map.array[i][0] == tile.dirt) {
			e.x = -32;
			e.y = i * tile.height;
			e.path.start = [0, e.y / tile.height];
		}
		if(map.array[i][map.width - 1] == tile.concrete) {
			e.path.goal = [map.width - 1, i];
		}
	}
	getPath(e, e.path.start, e.path.goal, [tile.dirt, tile.concrete], null, false);
}

function createBullet(id, xPos, yPos, target) {
	var t = tower.array[id];
	t.bullets.array.push({
		x: xPos,
		y: yPos,
		width: 0,
		height: 0,
		
		age: 0,
		maxAge: 60,
		damage: 0,
		target: target,
		slope: [0, 0],
		vel: 0
	});
	var num = t.bullets.array.length - 1;
	var b = t.bullets.array[num];
	
	/*Find Bullet Slope*/
	var xDist = b.target.x - b.x;
	var yDist = b.y - b.target.y;
	var rise = 0;
	var run = 0;
	
	if(Math.abs(xDist) >= Math.abs(yDist)) {
		if(xDist == 0) {
			if(yDist < 0) {
				rise = -1;
			} else if(yDist > 0) {
				rise = 1;
			}
		} else {
			rise = (yDist / Math.abs(xDist)) * -1;
			rise = rise.toFixed(1);
		}
		if(xDist < 0) {
			run = -1;
		} else if(xDist > 0) {
			run = 1;
		}
	} else {
		if(yDist == 0) {
			if(xDist < 0) {
				run = 1;
			} else if(xDist > 0) {
				run = -1;
			}
		} else {
			run = xDist / Math.abs(yDist);
			run = run.toFixed(1);
		}
		if(yDist < 0) {
			rise = 1;
		} else if(yDist > 0) {
			rise = -1;
		}
	}
	b.slope[0] = rise;
	b.slope[1] = run;
	
	switch(tower.array[id].type) {
		case tower.cannon.id:
			t.bullets.array[num].width = 4;
			t.bullets.array[num].height = 4;
			t.bullets.array[num].vel = 3;
			t.bullets.array[num].damage = tower.cannon.damage;
			break;
		case tower.mortar.id:
			t.bullets.array[num].width = 8;
			t.bullets.array[num].height = 8;
			t.bullets.array[num].vel = 2;
			t.bullets.array[num].damage = tower.mortar.damage;
			break;
		case tower.catapult.id: 
			t.bullets.array[num].width = 6;
			t.bullets.array[num].height = 6;
			t.bullets.array[num].vel = 3;
			t.bullets.array[num].damage = tower.catapult.damage;
			break;
		case tower.ballista.id: 
			t.bullets.array[num].width = 2;
			t.bullets.array[num].height = 2;
			t.bullets.array[num].vel = 4;
			t.bullets.array[num].damage = tower.ballista.damage;
			break;
	}
}

function createParticle(origin, radius, amount, seconds, color, alpha) {
	if(particle.array.length > 25) {
		return;
	}
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

function startWave() {
	var amount = game.level.wave * game.level.wave;
	var delay = 3000/game.level.wave + 25;
	var times = 0;
	for(var i=0; i<amount; i++) {
		setTimeout(function() {	
			times++;
			createEnemy();
			if(times == amount) {
				game.level.ready = true;
			}
		}, delay * i);
		
	}
	game.level.running = true;
}

function endWave() {
	game.level.ready = false;
	game.level.running = false;
	game.level.wave += 1;
}

function gameover() {
	game.running = false;
	endWave();
	game.level.wave = 1;
	player.money = 500;
	map.array = [];
	tower.array = [];
	enemy.array = [];
	particle.array = [];
	createMap();
	game.gameover = true;
}


	
function init() {
	resize();
	
	cxt.fillStyle = "black";
	cxt.fillRect(0,0,canvas.width,canvas.height);
	cxt.font = "14px arial black";
	cxt.fillStyle="white";
	cxt.fillText("Loading...", canvas.width/2 - 28, canvas.height/2);
	
	loadSprites();
	createMap();
	
	var UpdateLoop = setInterval(function() {update();},1000/game.ups);
	var RenderLoop = requestAnimationFrame(render);
}

function resize() { 
	//Set Resolution
	canvas.width = 800;
	canvas.height = 480;
	
	//Adjust Screen Size
	var screenheight = window.innerHeight - 32;
	var screenwidth = screenheight / 3 * 5;
	
	canvas.style.width =  screenwidth + "px";
	canvas.style.height = screenheight + "px";
}
