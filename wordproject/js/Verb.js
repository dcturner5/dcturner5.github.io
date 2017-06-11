var A_VERBS = ["accept", "add", "admire", "admit", "advise", "afford", "agree", "alert", "allow", "amuse", "analyze", "announce", "annoy", "answer", "apologize", "appear", "applaud", "appreciate", "approve", "argue", "arrange", "arrive", "ask", "attach", "attack", "attempt", "attend", "attract", "avoid"];
var B_VERBS = ["back", "bake", "balance", "ban", "bang", "bare", "bat", "bathe", "battle", "beam", "beg", "behave", "belong", "benefit", "bleach", "bless", "blind", "blink", "blot", "blush", "boast", "boil", "bolt", "bomb", "book", "bore", "borrow", "bounce", "bow", "box", "brake", "branch", "breathe", "bruise", "brush", "bubble", "budget", "bump", "burn", "bury", "buzz"];
var C_VERBS = ["calculate", "call", "camp", "care", "carry", "carve", "cause", "challenge", "change", "charge", "chase", "cheat", "check", "cheer", "chew", "choke", "chop", "claim", "clap", "clean", "clear", "clip", "close", "coach", "coil", "collect", "color", "comb", "command", "commit", "communicate", "compare", "compete", "complain", "complete", "concentrate", "concern", "confess", "confuse", "connect", "conquer", "consider", "consist", "contain", "continue", "control", "copy", "correct", "cough", "count", "cover", "crack", "crap", "crash", "crawl", "cross", "crush", "cry", "cure", "curl", "curve", "cycle"];
var D_VERBS = ["dam", "damage", "dance", "dare", "decay", "deceive", "decide", "decorate", "delay", "delight", "deliver", "depend", "describe", "desert", "deserve", "destroy", "detect", "develop", "die", "disagree", "disappear", "disapprove", "disarm", "discover", "dislike", "divide", "double", "doubt", "drag", "drain", "dream", "dress", "drip", "drop", "drown", "drum", "dry", "dump", "dust"];
var E_VERBS = ["earn", "edit", "educate", "eject", "elect", "embarrass", "employ", "empty", "encourage", "end", "enjoy", "enter", "entertain", "escape", "examine", "excite", "excuse", "exercise", "exist", "expand", "expect", "explain", "explode", "extend"];
var F_VERBS = ["face", "fade", "fail", "fancy", "fasten", "fax", "fear", "fence", "fetch", "file", "fill", "film", "fire", "fish", "fit", "fix", "flap", "flash", "flick", "float", "flood", "flow", "flower", "fold", "follow", "fool", "force", "form", "found", "frame", "frighten", "fry", "fund"];
var G_VERBS = ["gather", "gaze", "glow", "glue", "grab", "grate", "grease", "greet", "grin", "grip", "groan", "guarantee", "guard", "guess", "guide"];
var H_VERBS = ["hammer", "hand", "handle", "hang", "happen", "harass", "harm", "hate", "haunt", "head", "heal", "heap", "heat", "help", "hook", "hop", "hope", "hover", "hug", "hum", "hump", "hunt", "hurry"];
var I_VERBS = ["identify", "ignore", "imagine", "impress", "improve", "include", "increase", "influence", "inform", "inject", "injure", "instruct", "intend", "interest", "interfere", "interrupt", "introduce", "invent", "invite", "irritate", "itch"];
var J_VERBS = ["jab", "jail", "jam", "jiggle", "jog", "join", "joke", "judge", "juggle", "jump"];
var K_VERBS = ["kick", "kill", "kiss", "kneel", "knit", "knock", "knot"];
var L_VERBS = ["label", "land", "last", "laugh", "launch", "learn", "level", "license", "lick", "lie", "lighten", "like", "list", "listen", "live", "load", "lock", "long", "look", "love"];
var M_VERBS = ["man", "manage", "march", "mark", "marry", "match", "mate", "matter", "measure", "meddle", "melt", "memorize", "mend", "milk", "mine", "miss", "mix", "moan", "model", "monetize", "moor", "mourn", "move", "muddle", "mug", "multiply", "murder"];
var N_VERBS = ["nail", "name", "need", "nest", "nod", "note", "notice", "number"];
var O_VERBS = ["obey", "object", "observe", "obtain", "occur", "offend", "offend", "offer", "open", "order", "overflow", "owe", "own"];
var P_VERBS = ["pack", "paddle", "paint", "park", "part", "pass", "paste", "pat", "pause", "peck", "pedal", "peel", "peep", "perform", "permit", "phone", "pick", "pinch", "pine", "place", "place", "plan", "plant", "play", "please", "plug", "point", "poke", "polish", "pop", "position", "possess", "post", "postpone", "pour", "practice", "prank", "pray", "preach", "precede", "prefer", "prepare", "present", "preserve", "press", "pretend", "prevent", "prick", "print", "produce", "program", "promise", "protect", "provide", "pull", "pump", "punch", "protect", "provide", "pull", "pump", "punch", "puncture", "punish", "push"];
var Q_VERBS = ["question", "queue"];
var R_VERBS = ["race", "radiate", "rain", "raise", "rank", "rap", "reach", "realize", "receive", "recognize", "record", "reduce", "refer", "reflect", "refuse", "regret", "reign", "reject", "rejoice", "relax", "release", "rely", "remain", "remember", "remind", "remove", "repair", "repeat", "replace", "reply", "report", "reproduce", "request", "rescue", "retire", "return", "rhyme", "rinse", "risk", "rob", "rock", "roll", "rot", "rub", "ruin", "rule", "rush", "rust"];
var S_VERBS = ["sack", "sail", "satisfy", "save", "saw", "scare", "scatter", "scold", "scorch", "scrape", "scratch", "scream", "screw", "scribble", "scrub", "seal", "search", "separate", "serve", "settle", "shade", "share", "sharpen", "shave", "shelter", "shiver", "shock", "shop", "shrug", "sigh", "sign", "signal", "sin", "sip", "ski", "skip", "slap", "slip", "slow", "smash", "smell", "smile", "smoke", "snatch", "sneeze", "sniff", "snore", "snow", "soak", "soil", "soothe", "sound", "spare", "spark", "sparkle", "spell", "spill", "spit", "spoil", "spoof", "spot", "spray", "sprout", "squash", "squeak", "squeal", "squeeze", "stab", "stain", "stamp", "stare", "start", "stay", "steer", "step", "stir", "stitch", "stop", "store", "strap", "strength", "stretch", "strip", "stroke", "stuff", "subtract", "succeed", "suck", "suffer", "suggest", "suit", "supply", "support", "suppose", "surprise", "surround", "suspect", "suspend", "swerve", "switch"];
var T_VERBS = ["talk", "tame", "tap", "taste", "tease", "telephone", "tempt", "terrify", "test", "thank", "thaw", "tick", "tickle", "tie", "time", "tip", "tire", "touch", "tour", "tow", "trace", "trade", "train", "transport", "trap", "travel", "treat", "tremble", "trick", "trip", "trot", "trouble", "trust", "try", "tug", "tumble", "turn", "twist", "type"];
var U_VERBS = ["undress", "unfasten", "unite", "unlock", "unpack", "untidy", "use"];
var V_VERBS = ["vanish", "visit"];
var W_VERBS = ["wail", "wait", "walk", "wander", "want", "warm", "warn", "wash", "waste", "watch", "water", "wave", "weigh", "welcome", "whine", "whip", "whirl", "whisper", "whistle", "wiggle", "will", "wink", "wipe", "wish", "wobble", "wonder", "work", "worry", "wrap", "wreck", "wrestle", "wriggle"];
var X_VERBS = ["x-ray"];
var Y_VERBS = ["yawn", "yell"];
var Z_VERBS = ["zip", "zoom"];

var IRREGULAR_VERBS = [
    ["arise", "arose", "arisen"],
    ["awake", "awoke", "awoken", "", "awakened", "awakened"],
    ["backslide", "backslid", "backslid"],
    ["be", "was", "been", "", "were", ""],
    ["bear", "bore", "born", "", "", "borne"],
    ["beat", "beat", "beaten", "", "", "beat"],
    ["become", "became", "become"],
    ["begin", "began", "begun"],
    ["bend", "bent", "bent"],
    ["bet", "bet", "bet"],
    ["bid", "bid", "bidden", "", "bade", ""],
    ["bind", "bound", "bound"],
    ["bite", "bit", "bitten"],
    ["bleed", "bled", "bled"],
    ["blow", "blew", "blown"],
    ["break", "broke", "broken"],
    ["breed", "bred", "bred"],
    ["bring", "brought", "brought"],
    ["build", "built", "built"],
    ["burst", "burst", "burst"],
    ["buy", "bought", "bought"],
    ["cast", "cast", "cast"],
    ["catch", "caught", "caught"],
    ["choose", "chose", "chosen"],
    ["cling", "clung", "clung"],
    ["come", "came", "come"],
    ["cost", "cost", "cost"],
    ["creep", "crept", "crept"],
    ["cut", "cut", "cut"],
    ["deal", "dealt", "dealt"],
    ["dig", "dug", "dug"],
    ["dive", "dove", "dived"],
    ["do", "did", "done"],
    ["draw", "drew", "drawn"],
    ["drink", "drank", "drunk"],
    ["drive", "drove", "driven"],
    ["eat", "ate", "eaten"],
    ["fall", "fell", "fallen"],
    ["feed", "fed", "fed"],
    ["feel", "felt", "felt"],
    ["fight", "fought", "fought"],
    ["find", "found", "found"],
    ["flee", "fled", "fled"],
    ["fling", "flung", "flung"],
    ["fly", "flew", "flown"],
    ["forbid", "forbade", "forbidden"],
    ["forecast", "forecast", "forecast"],
    ["forego", "forewent", "foregone"],
    ["foresee", "foresaw", "foreseen"],
    ["foretell", "foretold", "foretold"],
    ["forget", "forgot", "forgotten"],
    ["forgive", "forgave", "forgiven"],
    ["forsake", "forsook", "forsaken"],
    ["freeze", "froze", "frozen"],
    ["frostbite", "frostbit", "frostbitten"],
    ["get", "got", "got"],
    ["give", "gave", "given"],
    ["go", "went", "gone"],
    ["grind", "ground", "ground"],
    ["grow", "grew", "grown"],
    ["hang", "hung", "hung"],
    ["have", "had", "had"],
    ["hear", "heard", "heard"],
    ["hide", "hid", "hidden"],
    ["hit", "hit", "hit"],
    ["hold", "held", "held"],
    ["hurt", "hurt", "hurt"],
    ["keep", "kept", "kept"],
    ["know", "knew", "known"],
    ["lay", "laid", "laid"],
    ["lead", "led", "led"],
    ["leave", "left", "left"],
    ["lend", "lent", "lent"],
    ["let", "let", "let"],
    ["lie", "lay", "lain"],
    ["light", "lit", "lit"],
    ["lose", "lost", "lost"],
    ["make", "made", "made"],
    ["mean", "meant", "meant"],
    ["meet", "met", "met"],
    ["mishear", "misheard", "misheard"],
    ["mislead", "misled", "misled"],
    ["misread", "misread", "misread"],
    ["misunderstand", "misunderstood", "misunderstood"],
    ["offset", "offset", "offset"],
    ["pay", "paid", "paid"],
    ["put", "put", "put"],
    ["quit", "quit", "quit"],
    ["read", "read", "read"],
    ["rid", "rid", "rid"],
    ["ride", "rode", "ridden"],
    ["ring", "rang", "rung"],
    ["rise", "rose", "risen"],
    ["run", "ran", "run"],
    ["say", "said", "said"],
    ["see", "saw", "seen"],
    ["seek", "sought", "sought"],
    ["sell", "sold", "sold"],
    ["send", "sent", "sent"],
    ["set", "set", "set"],
    ["shake", "shook", "shaken"],
    ["shoot", "shot", "shot"],
    ["show", "showed", "shown"],
    ["shut", "shut", "shut"],
    ["sing", "sang", "sung"],
    ["sink", "sank", "sunk"],
    ["sit", "sat", "sat"],
    ["sleep", "slept", "slept"],
    ["slide", "slid", "slid"],
    ["sling", "slung", "slung"],
    ["slit", "slit", "slit"],
    ["sneak", "snuck", "snuck"],
    ["speak", "spoke", "spoken"],
    ["speed", "sped", "sped"],
    ["spend", "spent", "spent"],
    ["spin", "spun", "spun"],
    ["split", "split", "split"],
    ["spread", "spread", "spread"],
    ["spring", "sprang", "sprung"],
    ["stand", "stood", "stood"],
    ["steal", "stole", "stolen"],
    ["stick", "stuck", "stuck"],
    ["sting", "stung", "stung"],
    ["stink", "stunk", "stunk"],
    ["stride", "strode", "stridden"],
    ["strike", "struck", "struck", "", "", "stricken"],
    ["string", "strung", "strung"],
    ["strive", "strove", "striven"],
    ["swear", "swore", "sworn"],
    ["sweep", "swept", "swept"],
    ["swell", "swelled", "swollen"],
    ["swim", "swam", "swum"],
    ["swing", "swung", "swung"],
    ["take", "took", "taken"],
    ["teach", "taught", "taught"],
    ["tear", "tore", "torn"],
    ["tell", "told", "told"],
    ["think", "thought", "thought"],
    ["throw", "threw", "thrown"],
    ["thrust", "thrust", "thrust"],
    ["tread", "trod", "trodden"],
    ["understand", "understood", "understood"],
    ["unwind", "unwound", "unwound"],
    ["upset", "upset", "upset"],
    ["wake", "woke", "woken"],
    ["wear", "wore", "worn"],
    ["weave", "wove", "woven"],
    ["wed", "wed", "wed"],
    ["win", "won", "won"],
    ["wind", "wound", "wound"],
    ["withdraw", "withdrew", "withdrawn"],
    ["withhold", "withheld", "withheld"],
    ["wring", "wrung", "wrung"],
    ["write", "wrote", "written"]
];

var VERB_COUNT = A_VERBS.length + B_VERBS.length + C_VERBS.length + D_VERBS.length + E_VERBS.length + F_VERBS.length + G_VERBS.length + H_VERBS.length + I_VERBS.length + J_VERBS.length + K_VERBS.length + L_VERBS.length + M_VERBS.length + N_VERBS.length + O_VERBS.length + P_VERBS.length + Q_VERBS.length + R_VERBS.length + S_VERBS.length + T_VERBS.length + U_VERBS.length + V_VERBS.length + W_VERBS.length + X_VERBS.length + Y_VERBS.length + Z_VERBS.length + IRREGULAR_VERBS.length;

function isVerb(word) {
    var data = {
        base: "",
        state: false,
        tense: "",
        type: ""
    };
    var modified = false;
    var raw = word;
    word = word.toLowerCase();
    if(word.slice(-3) === "ing") {
        word = word.slice(0, -3);
        if(word.slice(-1) === "y" && word.length === 2) word = word.slice(0, -1) + "i";
        modified = true;
        data.tense = "progressive";
    }
    else if(word.slice(-2) === "ed") {
        word = word.slice(0, -2);
        if(word.slice(-1) === "e") word += "e";
        else if(word.slice(-1) === "i" && word.length > 2) {
            word = word.slice(0, -1) + "y";
        }
        modified = true;
        data.tense = "past";
    }
    else if(word.slice(-1) === "s") {
        word = word.slice(0, -1);
        data.tense = "present";
    }
    else {
        data.tense = "present";
    }

    var list = [];
    if(word.charAt(0) === "a") list = A_VERBS;
    if(word.charAt(0) === "b") list = B_VERBS;
    if(word.charAt(0) === "c") list = C_VERBS;
    if(word.charAt(0) === "d") list = D_VERBS;
    if(word.charAt(0) === "e") list = E_VERBS;
    if(word.charAt(0) === "f") list = F_VERBS;
    if(word.charAt(0) === "g") list = G_VERBS;
    if(word.charAt(0) === "h") list = H_VERBS;
    if(word.charAt(0) === "i") list = I_VERBS;
    if(word.charAt(0) === "j") list = J_VERBS;
    if(word.charAt(0) === "k") list = K_VERBS;
    if(word.charAt(0) === "l") list = L_VERBS;
    if(word.charAt(0) === "m") list = M_VERBS;
    if(word.charAt(0) === "n") list = N_VERBS;
    if(word.charAt(0) === "o") list = O_VERBS;
    if(word.charAt(0) === "p") list = P_VERBS;
    if(word.charAt(0) === "q") list = Q_VERBS;
    if(word.charAt(0) === "r") list = R_VERBS;
    if(word.charAt(0) === "s") list = S_VERBS;
    if(word.charAt(0) === "t") list = T_VERBS;
    if(word.charAt(0) === "u") list = U_VERBS;
    if(word.charAt(0) === "v") list = V_VERBS;
    if(word.charAt(0) === "w") list = W_VERBS;
    if(word.charAt(0) === "x") list = X_VERBS;
    if(word.charAt(0) === "y") list = Y_VERBS;
    if(word.charAt(0) === "z") list = Z_VERBS;

    for(var i = 0; i < list.length; i++) {
        var verb = list[i];
        if(modified) {
            if(verb.slice(-1) === "e" && verb.slice(-2) !== "ee") verb = verb.slice(0, -1);

            else if(verb.slice(-1) === "b" && isVowel(verb.slice(-2, -1)) && !isVowel(verb.slice(-3, -2)) && getSyllableCount(verb) < 3) {
                verb += "b";
            }
            else if(verb.slice(-1) === "l" && isVowel(verb.slice(-2, -1)) && !isVowel(verb.slice(-3, -2)) && getSyllableCount(verb) < 3) {
                if(verb !== "model" && verb !== "travel") verb += "l";
            }
            else if(verb.slice(-1) === "m" && isVowel(verb.slice(-2, -1)) && !isVowel(verb.slice(-3, -2)) && getSyllableCount(verb) < 3) {
                verb += "m";
            }
            else if(verb.slice(-1) === "n" && isVowel(verb.slice(-2, -1)) && !isVowel(verb.slice(-3, -2)) && getSyllableCount(verb) < 3) {
                if(verb !== "happen" && verb !== "listen") verb += "n";
            }
            else if(verb.slice(-1) === "p" && isVowel(verb.slice(-2, -1)) && !isVowel(verb.slice(-3, -2)) && getSyllableCount(verb) < 3) {
                verb += "p";
            }
            else if(verb.slice(-1) === "r" && isVowel(verb.slice(-2, -1)) && !isVowel(verb.slice(-3, -2)) && getSyllableCount(verb) < 3) {
                verb += "r";
            }
            else if(verb.slice(-1) === "t" && isVowel(verb.slice(-2, -1)) && !isVowel(verb.slice(-3, -2)) && getSyllableCount(verb) < 3) {
                if(verb !== "budget" && verb !== "edit" && verb !== "visit") verb += "t";
            }
        }
        //console.log(word + " " + verb);
        if(word === verb) {
            data.base = list[i];
            data.state = true;
            data.type = "regular";
            return data;
        }
    }

    modified = false;
    word = raw;
    if(word.slice(-3) === "ing") {
        word = word.slice(0, -3);
        modified = true;
    }
    list = IRREGULAR_VERBS;
    for(var i = 0; i < list.length; i++) {
        var verbset = list[i];
        for(var j = 0; j < verbset.length; j++) {
            var verb = verbset[j];

            if(modified) {
                if(verb.slice(-1) === "b" && isVowel(verb.slice(-2, -1)) && !isVowel(verb.slice(-3, -2)) && getSyllableCount(verb) < 3) {
                    verb += "b";
                }
                else if(verb.slice(-1) === "m" && isVowel(verb.slice(-2, -1)) && !isVowel(verb.slice(-3, -2)) && getSyllableCount(verb) < 3) {
                    verb += "m";
                }
                else if(verb.slice(-1) === "n" && isVowel(verb.slice(-2, -1)) && !isVowel(verb.slice(-3, -2)) && getSyllableCount(verb) < 3) {
                    if(verb !== "happen" && verb !== "listen") verb += "n";
                }
                else if(verb.slice(-1) === "p" && isVowel(verb.slice(-2, -1)) && !isVowel(verb.slice(-3, -2)) && getSyllableCount(verb) < 3) {
                    verb += "p";
                }
                else if(verb.slice(-1) === "r" && isVowel(verb.slice(-2, -1)) && !isVowel(verb.slice(-3, -2)) && getSyllableCount(verb) < 3) {
                    verb += "r";
                }
                else if(verb.slice(-1) === "t" && isVowel(verb.slice(-2, -1)) && !isVowel(verb.slice(-3, -2)) && getSyllableCount(verb) < 3) {
                    if(verb !== "budget" && verb !== "edit" && verb !== "visit") verb += "t";
                }
            }

            if(word === verb) {
                if(modified && j !== 0) return data;
                data.base = verbset[0];
                data.state = true;
                data.type = "irregular";
                if(j === 0 && data.tense === "") data.tense = "present";
                else if(j === 1) data.tense = "past";
                else if(j === 2) data.tense = "past participle";
                return data;
            }
        }
    }

    return data;
}