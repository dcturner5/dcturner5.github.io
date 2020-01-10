
function getAngle(object, target) {
	var angle = Math.atan2(target.y - object.y, target.x - object.x );
	angle *= (180/Math.PI);
	if(angle < 0) {
		angle = 360 - (-angle);
	}
	angle += 90;
	return angle*(Math.PI/180);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTile(tile, radius, orgin_col, orgin_row) {
	var tilelist = [];
	var range = {
		min: {
			col: 0,
			row: 0
		},
		max: {
			col: map.width,
			row: map.height
		}
	}
	
	if(radius != null && orgin_col != null && orgin_row != null) {
		range.min.col = Math.max(orgin_col - radius, 0);
		range.min.row = Math.max(orgin_row - radius, 0);
		range.max.col = Math.min(orgin_col + radius, map.width);
		range.max.row = Math.min(orgin_row + radius, map.height);
	}
	
	for(var row = range.min.row; row < range.max.row; row++) {
		for(var col = range.min.col; col < range.max.col; col++) {
			if(map.array[row][col] == tile) {
				tilelist.push({
					row: row,
					column: col
				});
			}
		}
	}
	if(tilelist.length == 0) {
		return;
	}
	var random = getRandomInt(0, tilelist.length - 1);
	var tilecoord = [tilelist[random].column, tilelist[random].row];
	return tilecoord;
}

function getCollision(firstEntity,secondEntity) {
    if (firstEntity.x > secondEntity.x && firstEntity.x < secondEntity.x + secondEntity.width &&
            firstEntity.y > secondEntity.y && firstEntity.y < secondEntity.y + secondEntity.height) {
        return true;
    }else {
        return false;
    }
}

function getPath(entity, start, goal, tiles, weight, diagonals) {
	var easystar = new EasyStar.js();
	easystar.setGrid(map.array);
	if(tiles != null) {
		easystar.setAcceptableTiles(tiles);
	}
	if(weight != null) {
		easystar.setTileCost(weight, 2);
	}
	if(diagonals) {
		easystar.enableDiagonals();
	}
	easystar.findPath(start[0], start[1], goal[0], goal[1], function(path) {
		entity.path.current = path;
	});
	easystar.calculate();
}

function getDistance(firstPoint,secondPoint) {
    var distance = 0;
    var xd = 0;
    var yd = 0;
    xd = secondPoint.x - firstPoint.x;
    xd = xd * xd;
    yd = secondPoint.y - firstPoint.y;
    yd = yd * yd;
    distance = Math.sqrt(xd + yd);
    return distance;
}