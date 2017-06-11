
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTileObject(col, row) {
	var tile = {
		type: map.array[row][col],
		x: col * 32,
		y: row * 32, 
		width: 32,
		height: 32,
		col: col,
		row: row,
		pos: {
			right: null,
			down: null,
			left: null
		}
	}
	return tile;
}

function getTiles(tile, radius, origin_col, origin_row) {
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
	
	if(range != null && origin_col != null && origin_row != null) {
		range.min.col = Math.max(origin_col - radius, 0);
		range.min.row = Math.max(origin_row - radius, 0);
		range.max.col = Math.min(origin_col + radius, map.width);
		range.max.row = Math.min(origin_row + radius, map.height);
	}
	
	for(var row = range.min.row; row < range.max.row; row++) {
		for(var col = range.min.col; col < range.max.col; col++) {
			if(Math.floor(map.array[row][col]) == tile) {
				tilelist.push({
					row: row,
					column: col
				});
			}
		}
	}
	var tiles = [];
	for(var i=0; i< tilelist.length; i++) {
		tiles.push(getTileObject(tilelist[i].column, tilelist[i].row));
	}
	return tiles;
}

function getRandomTile(tile, radius, origin_col, origin_row) {
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
	
	if(range != null && origin_col != null && origin_row != null) {
		range.min.col = Math.max(origin_col - radius, 0);
		range.min.row = Math.max(origin_row - radius, 0);
		range.max.col = Math.min(origin_col + radius, map.width);
		range.max.row = Math.min(origin_row + radius, map.height);
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
    if (firstEntity.x + firstEntity.width > secondEntity.x && firstEntity.x < secondEntity.x + secondEntity.width &&
            firstEntity.y + firstEntity.height > secondEntity.y && firstEntity.y < secondEntity.y + secondEntity.height) {
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

function getStringToInt(string) {
	if(string == null || string == "") {
		return;
	}
	var result = "";
	var exit = false;
	var numbers = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
	for(var i=0; i<string.length; i++) {
		for(var j=0; j<numbers.length; j++) {
			if(string.charCodeAt(i) == numbers[j]) {
				result += j;
				exit = true;
			}
		}
		if(!exit) {
			result += string.charCodeAt(i);
		}
	}
	result = parseInt(result);
	return result;
}