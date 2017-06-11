//CLEARS ALL WHITESPACE AND LINE BREAKS IN A STRING
String.prototype.clearWhiteSpace=function(){return this.replace(/\s/g,"") ;};

//FINDS ALL INDICES OF A STRING INSIDE A STRING
String.prototype.indicesOf=function(val){var indices=[];for(var i=0;i<this.length;i++){if(this.charAt(i)===val)indices.push(i);}if(indices.length===0)indices=-1;return indices;};

//FINDS LOCATION OF MATCHING BRACKET IN A STRING
String.prototype.getMatchingBrace=function(p){var s=this.charAt(p);var e;if(s==="(")e=")";else if(s==="[")e="]";else if(s==="{")e="}";else return -1;var i=1;while(i>0){p++;var c=this.charAt(p);if(c===s)i++;if(c===e)i--;if(p>=this.length)return -1;}return p;};

//KEYWORDS OF THE LANGUAGE
var SYNTAX = {
    method: "function",
    print: "print",
    if: "if",
    prompt: "input"
};

//MAIN INTERPRETER CLASS
//TAKES IN TWO HTML TEXTAREA ELEMENTS, ONE FOR INPUT AND ONE FOR OUTPUT
function ScriptEngine(input, output) {
    //DEFAULT DATASTORAGE FOR ENTIRE RUNTIME
    this.GLOBAL = new DataStorage(this);

    this.input = input;
    this.output = output;

    //ALLOW FOR TABBING WHILE WRITING IN THE INPUT TEXTAREA
    this.input.onkeydown = function(e) {
        var keyCode = e.keyCode || e.which;
        if(keyCode === 9) {
            var value = this.value;
            var start = this.selectionStart;
            var end = this.selectionEnd;
            this.value = value.substring(0, start) + "    " + value.substring(end);
            this.selectionStart = this.selectionEnd = start + 4;
            return false;
        }
    };

    //RESETS ALL MEMORY AND STARTS CODE EXECUTION
    //CALLED WHEN RUN BUTTON IS PRESSED
    this.run = function() {
        this.GLOBAL = new DataStorage(this);
        this.output.value = "";
        this.eval(this.input.value);
    };

    //MAIN EVALUATION METHOD
    //TAKES IN MULTIPLE LINES OF CODE TO PARSE
    this.eval = function(code, storage) {
        storage = storage || this.GLOBAL;
        code = code.clearWhiteSpace();

        //FIND ALL FUNCTIONS, STORE THEM IN MEMORY, THEN TAKE THEM OUT OF CODE
        while(code.indexOf(SYNTAX.method) !== -1) {
            var index = code.indexOf(SYNTAX.method);
            var open = code.indexOf("{");
            var close = code.getMatchingBrace(open);
            var method = code.substring(index, close + 1);
            this.updateMethod(method, storage);
            code = code.replace(method, "");
        }

        //ITERATE THROUGH ALL REMAINING LINES AND EXECUTE THEM PROCEDURALLY
        var lines = code.split(";");
        for(var i = 0; i < lines.length; i++) {
            this.evalLine(lines[i], storage);
        }
    };

    //EVALUATES A SPECIFIC LINE
    this.evalLine = function(code, storage) {
        storage = storage || this.GLOBAL;

        //TEST FOR KEYWORDS AND CHARACTERS, THEN HANDLE ACCORDINGLY
        if(code.indexOf(SYNTAX.if) !== -1) this.if(code, storage);
        else if(code.indexOf(SYNTAX.print) !== -1) this.print(code, storage);
        else if(code.indexOf(SYNTAX.prompt) !== -1) this.prompt(code, storage);
        else if(code.indexOf("=") !== -1) this.updateVariable(code, storage);
        else if(code.indexOf("(") !== -1 && code.indexOf(")") !== -1) this.runMethod(code, storage);
    };

    //EVALUATES A GIVEN EXPRESSION WITH JAVASCRIPT'S EVAL FUNCTION
    this.evalExpression = function(code, storage) {
        storage = storage || this.GLOBAL;

        //FIND ALL VARIABLES
        var variables = code.split(/[0-9|&!=<>*/+-.]/);
        for(var i = 0; i < variables.length; i++) {
            var v = variables[i];
            if(v !== "") {

                //REPLACE VARIABLE IN RAW CODE WITH VALUE OF THE VARIABLE
                var value = this.evalValue(v, storage);
                code = code.replace(v, value);
            }
        }
        return eval(code);
    };

    //FINDS THE VALUE OF EITHER A NUMBER OR A VARIABLE IN THE RAW CODE
    //RETURNS THE VALUE AS A NUMBER
    this.evalValue = function(code, storage) {
        storage = storage || this.GLOBAL;
        var variable = storage.getVariable(code);
        if(!variable) {
            return parseFloat(code);
        } else {
            return variable.data;
        }
    };

    //CREATES OR UPDATES A VARIABLE IF ITS VALUE IS CHANGED DURING RUNTIME
    this.updateVariable = function(code, storage) {
        storage = storage || this.GLOBAL;
        var name, data;

        //PARSE CODE
        var equal = code.indexOf("=");
        var semi = code.indexOf(";");
        if(semi !== -1) code = code.slice(0,-1);
        if(equal === -1) equal = code.length;

        //RETRIEVE NAME OF VARIABLE
        name = code.substring(0, equal).trim();

        //RETRIEVE NEW VALUE OF VARIABLE
        data = this.evalExpression(code.substring(equal+1, code.length).trim(), storage);

        //STORE NEW VALUE IN CORRECT DATASTORAGE
        storage.setVariable(name, data);
    };

    //CREATES OR UPDATES A METHOD IF ITS VALUE IS CHANGED DURING RUNTIME
    this.updateMethod = function(code, storage) {
        storage = storage || this.GLOBAL;
        var name, args, data;

        //PARSE CODE
        var open = code.indexOf("(");
        var close = code.getMatchingBrace(open);
        var semi = code.indexOf(";");
        if(semi !== -1) code = code.slice(0,-1);
        if(open === -1) open = code.length;

        //RETRIEVE NAME OF METHOD
        name = code.substring(SYNTAX.method.length, open).trim();

        //RETRIEVE ARGUMENTS OF METHOD
        args = code.substring(open, close + 1);

        //RETRIEVE NEW VALUE OF METHOD
        data = code.substring(close + 2, code.length).trim();

        //STORE NEW VALUE IN CORRECT DATASTORAGE
        storage.setMethod(name, args, data);
    };

    //PARSES AND EXECUTES THE LINE WHERE A METHOD IS CALLED
    this.runMethod = function(code, storage) {
        //PARSE CODE
        var open = code.indexOf("(");
        var semi = code.indexOf(";");
        if(semi !== -1) code = code.slice(0,-1);

        //RETRIEVE METHOD FROM STORAGE BASED ON NAME
        var method = storage.getMethod(code.substring(0, open));

        //IF IT EXISTS, EXECUTE METHOD
        if(method) method.run(code.substring(open, code.length), storage);
    };

    //PRINT VALUE TO OUTPUT/CONSOLE
    this.print = function(code, storage) {
        storage = storage || this.GLOBAL;

        //PARSE CODE
        code = code.replace(SYNTAX.print, "");

        //RETRIEVE VALUE TO BE PRINTED
        var value = this.evalExpression(code, storage);

        //ADD NEW VALUE TO OUTPUT TEXTAREA
        this.output.value += value + '\n';
    };

    //CALLED ON "INPUT" KEYWORD DURING RUNTIME
    this.prompt = function(code, storage) {
        storage = storage || this.GLOBAL;

        //GET NAME OF VARIABLE TO STORE
        code = code.replace(SYNTAX.prompt, "");

        //STORE VALUE IN DATASTORAGE BASED ON WHAT THE PROMPT RETURNS
        storage.setVariable(code, parseFloat(prompt("Enter Value For Variable \"" + code + "\"")));
    };

    //CALLED ON "IF" KEYWORD DURING RUNTIME
    this.if = function(code, storage) {
        //PARSE CODE
        var open = code.indexOf("(");
        var close = code.getMatchingBrace(open);
        var condition = code.substring(open + 1, close);
        code = code.substring(close + 1, code.length);

        //IF CONDITION OF "IF" STATEMENT IS TRUE, EVALUATE FOLLOWING LINE
        if(this.evalExpression(condition, storage)) this.evalLine(code, storage);
    };

    //OUTPUT ERROR TO CONSOLE
    this.error = function(message) {
        if(!message) message = "";
        this.output.value += "ERROR : " + message + "\n";
    };

}

//MAIN CLASS FOR DATA STORAGE DURING RUNTIME
//CAN HAVE PARENT DATA STORAGES THAT CAN BE REFERRED TO
function DataStorage(engine, parent) {
    this.engine = engine;
    this.parent = parent || null;

    //ARRAYS FOR ALL VARIABLES AND METHODS
    this.variables = [];
    this.methods = [];

    //GETTERS AND SETTERS FOR VARIABLES
    //IF VARIABLE OR METHOD DOES NOT EXIST IN CURRENT DATA STORAGE, LOOK IN PARENTS
    this.getVariable = function(name) {
        for(var i = 0; i < this.variables.length; i++) {
            var variable = this.variables[i];
            if(variable.name === name) return variable;
        }
        if(this.parent) {
            var parentVariable = this.parent.getVariable(name);
            if(parentVariable) parentVariable.isParent = true;
            return parentVariable;
        }
        return null;
    };
    this.setVariable = function(name, data) {
        var variable = this.getVariable(name);
        if(!variable || variable.isParent) {
            this.variables.push(new Variable(name, data));
        }
        else variable.data = data;
    };

    //GETTERS AND SETTERS FOR METHODS
    this.getMethod = function(name) {
        for(var i=0; i<this.methods.length; i++) {
            var method = this.methods[i];
            if(method.name === name) return method;
        }
        if(this.parent) return this.parent.getMethod(name);
    };
    this.setMethod = function(name, args, data) {
        var method = this.getMethod(name);
        if(!method) {
            this.methods.push(new Method(name, args, data, this.engine, this));
        } else {
            return method.data = data;
        }
    };
}

//BASIC CLASS FOR VARIABLES
//FORCES ALL DATA TO BE NUMBERS, NOT STRINGS
function Variable(name, data) {
    this.name = name.toString();
    this.data = parseFloat(data);
}

//CLASS FOR METHODS
function Method(name, args, data, engine, parent) {
    //NEEDS TO BE ABLE TO REFER TO RUNTIME ENGINE
    this.engine = engine;

    //NAME OF THE METHOD
    this.name = name.toString();

    //RAW CODE OF THE METHOD
    this.data = data.clearWhiteSpace();

    //DATASTORAGE SPECIFICALLY FOR THE METHOD
    this.storage = new DataStorage(this.engine, parent);

    //ARRAY FOR ARGUMENTS
    this.args = [];

    //EXECUTES METHOD
    //TAKES IN ARGUMENTS AND STORAGE FOR VARIABLE CONTEXT
    this.run = function(args, storage) {
        storage = storage || GLOBAL;

        //PARSE CODE
        args = args.clearWhiteSpace();
        var s = args.indexOf("(");
        var e = args.getMatchingBrace(s);
        var raw = args.substring(s+1,e);
        raw = raw.split(",");

        //STORE ARGUMENTS AS VARIABLES IN DATA STORAGE
        for(var i = 0; i < raw.length; i++) {
            this.storage.setVariable(this.args[i], this.engine.evalExpression(raw[i], storage));
        }

        //EXECUTE LINES PROCEDURALLY
        var lines = this.data.split(";");
        for(i = 0; i < lines.length; i++) {
            this.engine.evalLine(lines[i], this.storage);
        }

        //FIND ALL REFERENCE VARIABLES AND POINT THEM TO THE CORRECT DATA STORAGE
        for(i = 0; i < this.storage.variables.length; i++) {
            var v = this.storage.variables[i];
            if(v.name.charAt(0) === "$") {
                for(var j = 0; j < this.args.length; j++) {
                    if(v.name === this.args[j]) {
                        storage.setVariable(raw[j], v.data);
                    }
                }
            }
        }
    };

    //CALL THIS WHEN METHOD IS FIRST CREATED
    this.init = function(args) {
        //PARSE CODE
        args = args.clearWhiteSpace();
        var s = args.indexOf("(");
        var e = args.getMatchingBrace(s);
        var raw = args.substring(s+1,e);
        raw = raw.split(",");

        //FIND AND STORE ALL ARGUMENTS FOR LATER
        for(var i = 0; i < raw.length; i++) {
            this.args[i] = raw[i];
        }

        //FIND METHODS INSIDE THIS METHOD AND STORE THAT CHILD METHOD IN THE PARENT'S DATA STORAGE
        while(this.data.indexOf(SYNTAX.method) !== -1) {
            var index = this.data.indexOf(SYNTAX.method);
            var open = this.data.indexOf("{");
            var close = this.data.getMatchingBrace(open);
            var method = this.data.substring(index, close + 1);
            engine.updateMethod(method, this.storage);
            this.data = this.data.replace(method, "");
        }
    };

    this.init(args);
}