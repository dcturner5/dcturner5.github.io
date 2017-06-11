//Vehicle constructor, this will become the prototype for th parent class of all //Vehicles
var Animal = function(name, age, maxAge, health) {
    this.name = name;
    this.age = age;
    this.maxAge = maxAge;
    this.health = health;
};

// encapsulates a method to display any Animal
Animal.prototype.display = function() {
    document.write("<input type='text' size='100' value=\'" + this.name +
        ": top speed = " + this.age + " " + this.maxAge +
        ", costs $" + this.health.toFixed(2)  + "\'><br><br>");
    this.sleep();
};

// encapsulates a method to launch the Animal
Animal.prototype.sleep = function () {
    document.write("<textarea rows = '6' cols='50' id=\'" + this.name + "\'>" + "Text area" + "</textarea><br><br>");
    document.getElementById(this.name).innerHTML = "Cannot launch a " + this.name;
};

// define a constructor for a subclass of Animal
function Bull(name, age, maxAge, health, horns) {
    // call the parent constructor
    // this will set the inherited properties for the subclass
    Animal.call(this, name, age, maxAge, health);
    // set the subclass specific properties
    this.horns = horns;
}

// create the subclass prototype that inherits from
// the parent prototype by cloning it
Bull.prototype = Object.create(Animal.prototype);

// set the constructor property of the new prototype to point to
// the subclass constructor
Bull.prototype.constructor = Bull;

// override the parent display method for a Bull
Bull.prototype.display = function() {
    document.write("<input type='text' size='100' value=\'" + this.name +
        ": is " + this.age + " years old, lives until " + this.maxAge +
        ", has " + this.health.toFixed(2)  + " health and has " +
        this.horns + " horns"  + "\'><br><br>");
    this.sleep();
};

// override the parent sleep method for a Bull
Bull.prototype.sleep = function() {
    document.write("<textarea rows = '6' cols='50' id=\'" + this.name + "\'>" +
        "Text area" + "</textarea><br><br>");
    var output = "";
    for (var gear = 1; gear <= 5; gear++) {
        output += "The bull grew another horn!";
    }
    document.getElementById(this.name).innerHTML = output;
};

//define a constructor for a subclass of Animal
function Cow(name, age, maxAge, health, bells) {
    // call the parent constructor
    // this will set the inherited properties for the subclass
    Animal.call(this, name, age, maxAge, health);
    // set the subclass specific properties
    this.bells = bells;
}

// create the subclass prototype that inherits from
// the parent prototype by cloning it
Cow.prototype = Object.create(Animal.prototype);

// set the constructor property of the new prototype to point to
// the subclass constructor
Cow.prototype.constructor = Cow;

// override the parent display method for a Bull
Cow.prototype.display = function() {
    document.write("<input type='text' size='100' value=\'" + this.name +
        ": is " + this.age + " years old, lives until " + this.maxAge +
        ", has " + this.health.toFixed(2)  + " health and has " +
        this.bells + " bells"  + "\'><br><br>");
    this.sleep();
};

// override the parent sleep method for a Bull
Cow.prototype.sleep = function() {
    document.write("<textarea rows = '6' cols='50' id=\'" + this.name + "\'>" +
        "Text area" + "</textarea><br><br>");
    var output = "";
    for(var i = 1; i <= this.bells; i++) output += "Bell #" + i + " rang!\n";
    document.getElementById(this.name).innerHTML = output;
};

//define a constructor for a subclass of Animal
function Rooster(name, age, maxAge, health, teeth) {
    // call the parent constructor
    // this will set the inherited properties for the subclass
    Animal.call(this, name, age, maxAge, health);
    // set the subclass specific properties
    this.teeth = teeth;
}

// create the subclass prototype that inherits from
// the parent prototype by cloning it
Rooster.prototype = Object.create(Animal.prototype);

// set the constructor property of the new prototype to point to
// the subclass constructor
Rooster.prototype.constructor = Rooster;

// override the parent display method for a Rooster
Rooster.prototype.display = function() {
    document.write("<input type='text' size='100' value=\'" + this.name +
        ": is " + this.age + " years old, lives until " + this.maxAge +
        ", has " + this.health.toFixed(2)  + " health and has " +
        this.teeth + " teeth"  + "\'><br><br>");
    this.sleep();
};

// override the parent sleep method for a Rooster
Rooster.prototype.sleep = function() {
    document.write("<textarea rows = '6' cols='50' id=\'" + this.name + "\'>" +
        "Text area" + "</textarea><br><br>");
    var output = "";
    for (var i = 0; i < this.age; i++) output += "The rooster woke someone up!\n";
    document.getElementById(this.name).innerHTML = output;
};

//define a constructor for a subclass of Animal
function Chicken(name, age, maxAge, health, weight) {
    // call the parent constructor
    // this will set the inherited properties for the subclass
    Animal.call(this, name, age, maxAge, health);
    // set the subclass specific properties
    this.weight = weight;
}

// create the subclass prototype that inherits from
// the parent prototype by cloning it
Chicken.prototype = Object.create(Animal.prototype);

// set the constructor property of the new prototype to point to
// the subclass constructor
Chicken.prototype.constructor = Chicken;

// override the parent display method for a Rooster
Chicken.prototype.display = function() {
    document.write("<input type='text' size='100' value=\'" + this.name +
        ": is " + this.age + " years old, lives until " + this.maxAge +
        ", has " + this.health.toFixed(2)  + " health and weighs " +
        this.weight+ " pounds"  + "\'><br><br>");
    this.sleep();
};

// override the parent sleep method for a Chicken
Chicken.prototype.sleep = function() {
    document.write("<textarea rows = '6' cols='50' id=\'" + this.name + "\'>" +
        "Text area" + "</textarea><br><br>");
    var output = "";
    for(var i = 0; i < this.weight; i++) output += "The chicken gained a pound!\n";
    document.getElementById(this.name).innerHTML = output;
};

function main() {
    var animals = [];
    animals.push(new Bull("Billy the Bull", 195, 200, 1, 3));
    animals.push(new Cow("Bessy the Cow", 35, 50, 1, 9));
    animals.push(new Rooster("Rooster Booster", 3, 4, 1, 0));
    animals.push(new Chicken("Jeffrey the Chicken", 50, 100, 1, 5));
    for(var i = 0; i < animals.length; i++) {
        animals[i].display();
    }
};