
function getTileInfo(id) {
	var result = {};
	switch(id) {
		case tile.air:
			result = {
				name: "Air",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 1,
				resistance: 0,
				stack: 64,
				group: tile.group.none,
				drop: tile.air
			};
		break;
		case tile.water:
			result = {
				name: "Water",
				clickable: false,
				breakable: false,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: 0,
				stack: 64,
				group: tile.group.none,
				drop: tile.water
			};
		break;
		case tile.water + 1:
			result = {
				name: "Water",
				clickable: false,
				breakable: false,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 0,
				stack: 64,
				group: tile.group.none,
				drop: tile.water
			};
		break;
		case tile.stone:
			result = {
				name: "Stone",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 3,
				stack: 64,
				group: tile.group.pick,
				drop: tile.cobble
			};
		break;
		case tile.cobble:
			result = {
				name: "Cobble",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 3,
				stack: 64,
				group: tile.group.pick,
				drop: tile.cobble
			};
		break;
		case tile.dirt:
			result = {
				name: "Dirt",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 1,
				stack: 64,
				group: tile.group.shov,
				drop: tile.dirt
			};
		break;
		case tile.grass:
			result = {
				name: "Grass",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 1,
				stack: 64,
				group: tile.group.shov,
				drop: tile.dirt
			};
		break;
		case tile.sand:
			result = {
				name: "Sand",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 1,
				stack: 64,
				group: tile.group.shov,
				drop: tile.sand
			};
		break;
		case tile.wood:
			result = {
				name: "Wood",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 2,
				stack: 64,
				group: tile.group.axe,
				drop: tile.wood
			};
		break;
		case tile.leaf:
			result = {
				name: "Leaf",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: .5,
				stack: 64,
				group: tile.group.axe,
				drop: tile.air
			};
		break;
		case tile.plank:
			result = {
				name: "Wood Plank",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 2,
				stack: 64,
				group: tile.group.axe,
				drop: tile.plank
			};
		break;
		case tile.ironore:
			result = {
				name: "Iron Ore",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 3,
				stack: 64,
				group: tile.group.pick,
				drop: tile.ironore
			};
		break;
		case tile.goldore:
			result = {
				name: "Gold Ore",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 3,
				stack: 64,
				group: tile.group.pick,
				drop: tile.goldore
			};
		break;
		case tile.diamondore:
			result = {
				name: "Diamond Ore",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 3,
				stack: 64,
				group: tile.group.pick,
				drop: tile.diamondbar
			};
		break;
		case tile.redore:
			result = {
				name: "Red Ore",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 3,
				stack: 64,
				group: tile.group.pick,
				drop: tile.redwire
			};
		break;
		case tile.ironblock:
			result = {
				name: "Iron Block",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 3,
				stack: 64,
				group: tile.group.pick,
				drop: tile.ironblock
			};
		break;
		case tile.goldblock:
			result = {
				name: "Gold Block",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 3,
				stack: 64,
				group: tile.group.pick,
				drop: tile.goldblock
			};
		break;
		case tile.diamondblock:
			result = {
				name: "Diamond Block",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 3,
				stack: 64,
				group: tile.group.pick,
				drop: tile.diamondblock
			};
		break;
		case tile.brick:
			result = {
				name: "Brick",
				clickable: true,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 3,
				stack: 64,
				group: tile.group.pick,
				drop: tile.brick
			};
		break;
		case tile.stonebrick:
			result = {
				name: "Stone Brick",
				clickable: true,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 3,
				stack: 64,
				group: tile.group.pick,
				drop: tile.stonebrick
			};
		break;
		case tile.craft:
			result = {
				name: "Crafting Table",
				clickable: true,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 2,
				stack: 64,
				group: tile.group.axe,
				drop: tile.craft
			};
		break;
		case tile.furnace:
			result = {
				name: "Furnace",
				clickable: true,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 3,
				stack: 64,
				group: tile.group.pick,
				drop: tile.furnace
			};
		break;
		case tile.chest:
			result = {
				name: "Chest",
				clickable: true,
				breakable: true,
				placeable: true,
				solid: true,
				multiplier: 1,
				resistance: 2,
				stack: 64,
				group: tile.group.axe,
				drop: tile.chest
			};
		break;
		
		
		case tile.stick:
			result = {
				name: "Stick",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 1,
				resistance: 0,
				stack: 64,
				group: tile.group.none,
				drop: tile.stick
			};
		break;
		case tile.ironbar:
			result = {
				name: "Iron Ingot",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 1,
				resistance: 0,
				stack: 64,
				group: tile.group.none,
				drop: tile.ironbar
			};
		break;
		case tile.goldbar:
			result = {
				name: "Gold Ingot",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 1,
				resistance: 0,
				stack: 64,
				group: tile.group.none,
				drop: tile.goldbar
			};
		break;
		case tile.diamondbar:
			result = {
				name: "Diamond",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 1,
				resistance: 0,
				stack: 64,
				group: tile.group.none,
				drop: tile.diamondbar
			};
		break;
		case tile.woodpick:
			result = {
				name: "Wood Pickaxe",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 4,
				resistance: 0,
				stack: 1,
				group: tile.group.pick,
				drop: tile.air
			};
		break;
		case tile.stonepick:
			result = {
				name: "Stone Pickaxe",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 8,
				resistance: 0,
				stack: 1,
				group: tile.group.pick,
				drop: tile.air
			};
		break;
		case tile.ironpick:
			result = {
				name: "Iron Pickaxe",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 12,
				resistance: 0,
				stack: 1,
				group: tile.group.pick,
				drop: tile.air
			};
		break;
		case tile.goldpick:
			result = {
				name: "Gold Pickaxe",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 8,
				resistance: 0,
				stack: 1,
				group: tile.group.pick,
				drop: tile.air
			};
		break;
		case tile.diamondpick:
			result = {
				name: "Diamond Pickaxe",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 24,
				resistance: 0,
				stack: 1,
				group: tile.group.pick,
				drop: tile.air
			};
		break;
		case tile.woodshov:
			result = {
				name: "Wood Shovel",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 2,
				resistance: 0,
				stack: 1,
				group: tile.group.shov,
				drop: tile.air
			};
		break;
		case tile.stoneshov:
			result = {
				name: "Stone Shovel",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 4,
				resistance: 0,
				stack: 1,
				group: tile.group.shov,
				drop: tile.air
			};
		break;
		case tile.ironshov:
			result = {
				name: "Iron Shovel",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 8,
				resistance: 0,
				stack: 1,
				group: tile.group.shov,
				drop: tile.air
			};
		break;
		case tile.goldshov:
			result = {
				name: "Gold Shovel",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 4,
				resistance: 0,
				stack: 1,
				group: tile.group.shov,
				drop: tile.air
			};
		break;
		case tile.diamondshov:
			result = {
				name: "Diamond Shovel",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 12,
				resistance: 0,
				stack: 1,
				group: tile.group.shov,
				drop: tile.air
			};
		break;
		case tile.woodaxe:
			result = {
				name: "Wood Axe",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 2,
				resistance: 0,
				stack: 1,
				group: tile.group.axe,
				drop: tile.air
			};
		break;
		case tile.stoneaxe:
			result = {
				name: "Stone Axe",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 4,
				resistance: 0,
				stack: 1,
				group: tile.group.axe,
				drop: tile.air
			};
		break;
		case tile.ironaxe:
			result = {
				name: "Iron Axe",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 8,
				resistance: 0,
				stack: 1,
				group: tile.group.axe,
				drop: tile.air
			};
		break;
		case tile.goldaxe:
			result = {
				name: "Gold Axe",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 4,
				resistance: 0,
				stack: 1,
				group: tile.group.axe,
				drop: tile.air
			};
		break;
		case tile.diamondaxe:
			result = {
				name: "Diamond Axe",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 12,
				resistance: 0,
				stack: 1,
				group: tile.group.axe,
				drop: tile.air
			};
		break;
		case tile.woodsword:
			result = {
				name: "Wood Sword",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 1,
				resistance: 0,
				stack: 1,
				group: tile.group.none,
				drop: tile.air
			};
		break;
		case tile.stonesword:
			result = {
				name: "Stone Sword",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 1,
				resistance: 0,
				stack: 1,
				group: tile.group.none,
				drop: tile.air
			};
		break;
		case tile.ironsword:
			result = {
				name: "Iron Sword",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 1,
				resistance: 0,
				stack: 1,
				group: tile.group.none,
				drop: tile.air
			};
		break;
		case tile.goldsword:
			result = {
				name: "Gold Sword",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 1,
				resistance: 0,
				stack: 1,
				group: tile.group.none,
				drop: tile.air
			};
		break;
		case tile.diamondsword:
			result = {
				name: "Diamond Sword",
				clickable: false,
				breakable: false,
				placeable: false,
				solid: false,
				multiplier: 1,
				resistance: 0,
				stack: 1,
				group: tile.group.none,
				drop: tile.air
			};
		break;
		
		case tile.redwire:
			result = {
				name: "Red Wire",
				clickable: false,
				breakable: false,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: 0,
				stack: 64,
				group: tile.group.none,
				drop: tile.air
			};
		break;
		case tile.flat_redwire:
			result = {
				name: "Red Wire [Flat]",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.redwire
			};
		break;
		case tile.left_redwire:
			result = {
				name: "Red Wire [Left]",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.redwire
			};
		break;
		case tile.right_redwire:
			result = {
				name: "Red Wire [Right]",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.redwire
			};
		break;
		case tile.both_redwire:
			result = {
				name: "Red Wire [Both]",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.redwire
			};
		break;
		case tile.flat_redtorch:
			result = {
				name: "Red Torch",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.flat_redtorch
			};
		break;
		case tile.left_redtorch:
			result = {
				name: "Red Torch [Left]",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.flat_redtorch
			};
		break;
		case tile.right_redtorch:
			result = {
				name: "Red Torch [Right]",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.flat_redtorch
			};
		break;
		
		case tile.left_repeater1:
			result = {
				name: "Repeater",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.left_repeater1
			};
		break;
		case tile.left_repeater2:
			result = {
				name: "Repeater [Left] [2]",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.left_repeater1
			};
		break;
		case tile.left_repeater3:
			result = {
				name: "Repeater [Left] [3]",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.left_repeater1
			};
		break;
		case tile.left_repeater4:
			result = {
				name: "Repeater [Left] [4]",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.repeater
			};
		break;
		case tile.right_repeater1:
			result = {
				name: "Repeater [Right] [1]",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.left_repeater1
			};
		break;
		case tile.right_repeater2:
			result = {
				name: "Repeater [Right] [2]",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.left_repeater1
			};
		break;
		case tile.right_repeater3:
			result = {
				name: "Repeater [Right] [3]",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.left_repeater1
			};
		break;
		case tile.right_repeater4:
			result = {
				name: "Repeater [Right] [4]",
				clickable: false,
				breakable: true,
				placeable: true,
				solid: false,
				multiplier: 1,
				resistance: .2,
				stack: 64,
				group: tile.group.none,
				drop: tile.left_repeater1
			};
		break;
	}
	
	return result;
}

function initRecipe() {
	recipe.craft.push({
		input: [tile.wood, 0, 0, 0, 0, 0, 0, 0, 0],
		output: tile.plank,
		amt: 4
	});
	recipe.craft.push({
		input: [tile.plank, 0, 0, tile.plank, 0, 0, 0, 0, 0],
		output: tile.stick,
		amt: 4
	});
	recipe.craft.push({
		input: [tile.plank, tile.plank, 0, tile.plank, tile.plank, 0, 0, 0, 0],
		output: tile.craft,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.plank, tile.plank, tile.plank, tile.plank, 0, tile.plank, tile.plank, tile.plank, tile.plank],
		output: tile.chest,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.cobble, tile.cobble, tile.cobble, tile.cobble, 0, tile.cobble, tile.cobble, tile.cobble, tile.cobble],
		output: tile.furnace,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.stone, tile.stone, 0, tile.stone, tile.stone, 0, 0, 0, 0],
		output: tile.stonebrick,
		amt: 4
	});
	recipe.craft.push({
		input: [tile.ironbar, tile.ironbar, tile.ironbar, tile.ironbar, tile.ironbar, tile.ironbar, tile.ironbar, tile.ironbar, tile.ironbar],
		output: tile.ironblock,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.goldbar, tile.goldbar, tile.goldbar, tile.goldbar, tile.goldbar, tile.goldbar, tile.goldbar, tile.goldbar, tile.goldbar],
		output: tile.goldblock,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.diamondbar, tile.diamondbar, tile.diamondbar, tile.diamondbar, tile.diamondbar, tile.diamondbar, tile.diamondbar, tile.diamondbar, tile.diamondbar],
		output: tile.diamondblock,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.ironblock, 0, 0, 0, 0, 0, 0, 0, 0],
		output: tile.ironbar,
		amt: 9
	});
	recipe.craft.push({
		input: [tile.goldblock, 0, 0, 0, 0, 0, 0, 0, 0],
		output: tile.goldbar,
		amt: 9
	});
	recipe.craft.push({
		input: [tile.diamondblock, 0, 0, 0, 0, 0, 0, 0, 0],
		output: tile.diamondbar,
		amt: 9
	});
	
	recipe.craft.push({
		input: [tile.plank, tile.plank, tile.plank, 0, tile.stick, 0, 0, tile.stick, 0],
		output: tile.woodpick,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.cobble, tile.cobble, tile.cobble, 0, tile.stick, 0, 0, tile.stick, 0],
		output: tile.stonepick,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.ironbar, tile.ironbar, tile.ironbar, 0, tile.stick, 0, 0, tile.stick, 0],
		output: tile.ironpick,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.goldbar, tile.goldbar, tile.goldbar, 0, tile.stick, 0, 0, tile.stick, 0],
		output: tile.goldpick,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.diamondbar, tile.diamondbar, tile.diamondbar, 0, tile.stick, 0, 0, tile.stick, 0],
		output: tile.diamondpick,
		amt: 1
	});
	
	recipe.craft.push({
		input: [tile.plank, 0, 0, tile.stick, 0, 0, tile.stick, 0, 0],
		output: tile.woodshov,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.cobble, 0, 0, tile.stick, 0, 0, tile.stick, 0, 0],
		output: tile.stoneshov,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.ironbar, 0, 0, tile.stick, 0, 0, tile.stick, 0, 0],
		output: tile.ironshov,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.goldbar, 0, 0, tile.stick, 0, 0, tile.stick, 0, 0],
		output: tile.goldshov,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.diamondbar, 0, 0, tile.stick, 0, 0, tile.stick, 0, 0],
		output: tile.diamondshov,
		amt: 1
	});
	
	recipe.craft.push({
		input: [tile.plank, tile.plank, 0, tile.plank, tile.stick, 0, 0, tile.stick, 0],
		output: tile.woodaxe,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.cobble, tile.cobble, 0, tile.cobble, tile.stick, 0, 0, tile.stick, 0],
		output: tile.stoneaxe,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.ironbar, tile.ironbar, 0, tile.ironbar, tile.stick, 0, 0, tile.stick, 0],
		output: tile.ironaxe,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.goldbar, tile.goldbar, 0, tile.goldbar, tile.stick, 0, 0, tile.stick, 0],
		output: tile.goldaxe,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.diamondbar, tile.diamondbar, 0, tile.diamondbar, tile.stick, 0, 0, tile.stick, 0],
		output: tile.diamondaxe,
		amt: 1
	});
	
	recipe.craft.push({
		input: [tile.plank, 0, 0, tile.plank, 0, 0, tile.stick, 0, 0],
		output: tile.woodsword,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.cobble, 0, 0, tile.cobble, 0, 0, tile.stick, 0, 0],
		output: tile.stonesword,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.ironbar, 0, 0, tile.ironbar, 0, 0, tile.stick, 0, 0],
		output: tile.ironsword,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.goldbar, 0, 0, tile.goldbar, 0, 0, tile.stick, 0, 0],
		output: tile.goldsword,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.diamondbar, 0, 0, tile.diamondbar, 0, 0, tile.stick, 0, 0],
		output: tile.diamondsword,
		amt: 1
	});
	
	recipe.craft.push({
		input: [tile.redwire, 0, 0, tile.stick, 0, 0, 0, 0, 0],
		output: tile.flat_redtorch,
		amt: 1
	});
	recipe.craft.push({
		input: [tile.flat_redtorch, tile.redwire, tile.flat_redtorch, tile.stone, tile.stone, tile.stone, 0, 0, 0],
		output: tile.left_repeater1,
		amt: 1
	});
	
	recipe.furnace.push({
		input: tile.cobble,
		output: tile.stone,
		amt: 1
	});
	recipe.furnace.push({
		input: tile.ironore,
		output: tile.ironbar,
		amt: 1
	});
	recipe.furnace.push({
		input: tile.goldore,
		output: tile.goldbar,
		amt: 1
	});
	recipe.furnace.push({
		input: tile.diamondore,
		output: tile.diamondbar,
		amt: 1
	});
}
