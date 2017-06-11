var Game = {
    running: false,
    round: 1,
    highscore: 0,
    restart: function() {
        setTimeout(function() {
            location.reload();
        }, 1000);
    }
};

var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 50;
    this.speed = Math.random() * 5 + 1;
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt, i) {
    this.x += this.speed;
    if(this.x > 500) {
        allEnemies.splice(i, 1);
        allEnemies.push(new Enemy(this.x - 600, this.y));
    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.waypointX = x;
    this.waypointY = y;
    this.width = 100;
    this.height = 50;
    this.speed = 5;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt) {
    if(this.y <= 0) {
        this.y = 404;
        this.waypointY = this.y;
        Game.round++;
        document.getElementById("message").innerHTML = "Round: " + Game.round;
    }
    if(this.x < this.waypointX) this.x += this.speed;
    if(this.x > this.waypointX) this.x -= this.speed;
    if(this.y < this.waypointY) this.y += this.speed;
    if(this.y > this.waypointY) this.y -= this.speed;
    if(this.x < 0) this.x = 0;
    if(this.y > 400) this.y = 400;
    if(this.x > 400) this.x = 400;
    var rect1 = player;
    for(var i = 0; i < allEnemies.length; i++) {
        var rect2 = allEnemies[i];
        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y) {
            Game.highscore = Game.round;
            document.getElementById("message").innerHTML = "Game Over";
            document.getElementById("highscore").innerHTML = "";
            if(Game.running) Game.restart();
            Game.running = false;
        }
    }
};

Player.prototype.render = function() {
    if(Game.running) ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    else {
        for(var i = 0; i < characters.length; i++) {
            var c = characters[i];
            ctx.drawImage(Resources.get(c.sprite), i * 100, 300);
            ctx.font="30px Arial";
            ctx.fillText(i + 1 + "", i * 100, 400);
        }
    }
};

Player.prototype.handleInput = function(key) {
    if(key == 'up') {
        if(this.y > 0) this.waypointY -= 85;
    }
    if(key == 'down') {
        if(this.y < 400) this.waypointY += 85;
    }
    if(key == 'left') {
        if(this.x > 0) this.waypointX -= 101;
    }
    if(key == 'right') {
        if(this.x < 400) this.waypointX += 101;
    }
};

var player = new Player(202, 404);
var characters = [];
var allEnemies = [
    new Enemy(0, 50),
    new Enemy(100, 50 + 85),
    new Enemy(0, 170 + 50)
];

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    for(var i = 0; i < characters.length; i++) {
        if(e.keyCode == 49 + i) {
            player.speed = characters[i].speed;
            player.sprite = characters[i].sprite;
            Game.running = true;
        }
    }
    if(Game.running) player.handleInput(allowedKeys[e.keyCode]);
});

var request = new XMLHttpRequest();
request.open('GET', 'data.json');
request.onreadystatechange = function() {
    if(request.status == 200 && request.readyState == 4) {
        var data = JSON.parse(request.responseText);
        Game.highscore = data.highscore;
        //document.getElementById("highscore").innerHTML = "High Score: " + Game.highscore;
        for(var i = 0; i < data.characters.length; i++) {
            characters.push(data.characters[i]);
        }
    }
};
request.send();