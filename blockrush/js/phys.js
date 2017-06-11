
var physics = {
	gravity: .5
}

function getProxTilePos(entity) {
	entity.col = Math.floor((entity.x + entity.width/2) / tile.width);
	entity.row = Math.floor((entity.y + entity.height/2) / tile.height);
	entity.pos = {};
	entity.pos.current = getTileObject(entity.col, entity.row);
	entity.pos.upleft = getTileObject(entity.col - 1, entity.row - 1);
	entity.pos.up = getTileObject(entity.col, entity.row - 1);
	entity.pos.upright = getTileObject(entity.col + 1, entity.row - 1);
	entity.pos.right = getTileObject(entity.col + 1, entity.row);
	entity.pos.downright = getTileObject(entity.col + 1, entity.row + 1);
	entity.pos.down = getTileObject(entity.col, entity.row + 1);
	entity.pos.downleft = getTileObject(entity.col - 1, entity.row + 1);
	entity.pos.left = getTileObject(entity.col - 1, entity.row);
}

function getProxTileCollision(entity) {
	if(getCollision(entity,entity.pos.up) && getTileInfo(entity.pos.up.type).solid) {
		entity.y = entity.pos.up.y + entity.pos.up.height;
		endRise(entity);
	}
	if(getCollision(entity,entity.pos.right) && getTileInfo(entity.pos.right.type).solid) {
		entity.x = entity.pos.right.x - entity.width;
	}
	if(getCollision(entity,entity.pos.down) && getTileInfo(entity.pos.down.type).solid) {
		entity.y = entity.pos.down.y - entity.height;
		endFall(entity);
	}
	if(getCollision(entity,entity.pos.left) && getTileInfo(entity.pos.left.type).solid) {
		entity.x = entity.pos.left.x + entity.pos.left.width;
	}
	
	if(getCollision(entity,entity.pos.upleft) && getTileInfo(entity.pos.upleft.type).solid) {
		entity.y = entity.pos.upleft.y + entity.pos.upleft.height;
		endRise(entity);
	}
	if(getCollision(entity,entity.pos.upright) && getTileInfo(entity.pos.upright.type).solid) {
		entity.y = entity.pos.upright.y + entity.pos.upright.height;
		endRise(entity);
	}
	if(getCollision(entity,entity.pos.downright) && getTileInfo(entity.pos.downright.type).solid) {
		entity.y = entity.pos.downright.y - entity.pos.downright.height;
		endFall(entity);
	}
	if(getCollision(entity,entity.pos.downleft) && getTileInfo(entity.pos.downleft.type).solid) {
		entity.y = entity.pos.downleft.y - entity.pos.downleft.height;
		endFall(entity);
	}
	
	var leftcorner = getTileObject(Math.floor((entity.x + entity.width * .25) / tile.width), entity.row + 1);
	var rightcorner = getTileObject(Math.floor((entity.x + entity.width * .75) / tile.width), entity.row + 1);
	if(!getTileInfo(leftcorner.type).solid && !getTileInfo(rightcorner.type).solid) {
		createFall(entity);
	}
}

function createRise(entity) {
	entity.jump.state = true;
	entity.jump.vel.cur = entity.jump.vel.init;
}

function createFall(entity) {
	entity.jump.state = true;
}

function getJump(entity) {
	if(entity.jump.state) {
		entity.y -= entity.jump.vel.cur;
		if(entity.jump.vel.cur > entity.jump.vel.max) {
			entity.jump.vel.cur -= physics.gravity;
		}
		if(entity.pos.current.type == tile.water) {
			entity.jump.vel.max = -.5;
		} else {
			entity.jump.vel.max = -1 * (entity.height/2 - 1);
		}
		if(entity.jump.vel.cur < entity.jump.vel.max) {
			entity.jump.vel.cur = entity.jump.vel.max;
		}
	}
}

function endRise(entity) {
	entity.jump.vel.cur = 0;
}

function endFall(entity) {
	entity.jump.state = false;
	entity.jump.vel.cur = 0;
} 