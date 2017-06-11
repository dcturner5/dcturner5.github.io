function reformat(raw) {
    var sentence = raw.toLowerCase();
    sentence = sentence.replace(".", "");
    var phrases = getSentencePhrases(sentence);
    if(sentence.indexOf(phrases[0][0].content) == 0) {
        try {
            var newSentence = phrases[2][phrases[2].length-1].content + ", " + phrases[0][0].content + " " + phrases[1][0].content;
            for(var i = 0; i < phrases[2].length - 1; i++) {
                newSentence += " " + phrases[2][i].content;
            }
            newSentence = newSentence.charAt(0).toUpperCase() + newSentence.slice(1);
            newSentence += ".";
            newSentence = newSentence.replace(" i ", " I ");
            return newSentence;
        }
        catch (e) {
            return raw;
        }
    }
    if(sentence.indexOf(phrases[1][0].content) == 0) {
        return raw;
    }
    if(sentence.indexOf(phrases[2][0].content) == 0) {
        try {
            var newSentence = phrases[0][0].content + " " + phrases[1][0].content;
            for(var i = phrases[2].length-1; i >= 0; i--) {
                newSentence += " " + phrases[2][i].content;
            }
            newSentence = newSentence.charAt(0).toUpperCase() + newSentence.slice(1);
            newSentence += ".";
            newSentence = newSentence.replace(" i ", " I ");
            return newSentence;
        }
        catch (e) {
            return raw;
        }
    }
}

function isVowel(char) {
    char = char.charAt(0);
    if(char === "a" || char === "e" || char === "i" || char === "o" || char === "u") return true;
    return false;
}

function getSyllableCount(word) {
    word = word.toLowerCase();
    if(word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    return word.match(/[aeiouy]{1,2}/g).length;
}

function getSentencePhrases(sentence) {
    var phrases = sentence.split(",");
    var subjects = [];
    var verbs = [];
    var prepositions = [];
    var length = 0;
    for(var i = 0; i < phrases.length; i++) {
        phrases[i] = phrases[i].trim();
        var words = phrases[i].split(" ");
        var subject = "";
        var verb = "";
        var preposition = "";
        var currentPhrase = "subject";
        var prevPhrase = "";
        var subjectIndex, verbIndex, prepositionIndex;
        for(var j = 0; j < words.length; j++) {
            var word = words[j].toLowerCase();
            if(j == 0 && isVerb(word).state) {
                subjects.push({content: "you"});
            }
            if(!isPreposition(word) && !isVerb(word).state && currentPhrase === "subject") {
                prevPhrase = currentPhrase;
                currentPhrase = "subject";
            }
            if(isVerb(word).state && !isArticle(words[j-1]) && (subject !== "" || preposition !== "") && prevPhrase === "subject") {
                if(!(currentPhrase == "preposition" && isVerb(word).tense == "progressive")) {
                    prevPhrase = currentPhrase;
                    currentPhrase = "verb";
                }
            }
            if(isPreposition(word) || isConjunction(word)) {
                if(currentPhrase === "preposition") {
                    preposition = preposition.trim();
                    prepositions.push({content: preposition});
                    preposition = "";
                    prevPhrase = currentPhrase;
                }
                else {
                    length++;
                    prepositionIndex = length;
                }
                prevPhrase = currentPhrase;
                currentPhrase = "preposition";
            }
            if(word.indexOf("#") != -1) {
                word = word.replace("#", "");
                prevPhrase = currentPhrase;
                currentPhrase = "subject";
            }
            if(word.indexOf("$") != -1) {
                word = word.replace("$", "");
                prevPhrase = currentPhrase;
                currentPhrase = "verb";
            }
            if(word.indexOf("%") != -1) {
                word = word.replace("%", "");
                prevPhrase = currentPhrase;
                currentPhrase = "preposition";
            }
            switch(currentPhrase) {
                case "subject": subject += word + " ";
                    break;
                case "verb": verb += word + " ";
                    break;
                case "preposition": preposition += word + " ";
                    break;
            }
        }
        subject = subject.trim().toLowerCase();
        verb = verb.trim().toLowerCase();
        preposition = preposition.trim().toLowerCase();
        if(subject !== "") {
            subjects.push({content: subject});
        }
        if(verb !== "") {
            verbs.push({content: verb});
        }
        if(preposition !== "") {
            prepositions.push({content: preposition});
        }
    }
    return [subjects, verbs, prepositions];
}

var ARTICLES = ["a", "an", "some", "the"];
var ARTICLE_COUNT = ARTICLES.length;
function isArticle(word) {
    if(word === undefined) return false;
    word = word.toLowerCase();
    var list = ARTICLES;
    for(var i = 0; i < list.length; i++) {
        if(word === list[i]) return true;
    }
    return false;
}

var CONJUNCTIONS = ["and", "because", "but", "or", "while"];
var CONJUNCTION_COUNT = CONJUNCTIONS.length;
function isConjunction(word) {
    word = word.toLowerCase();
    var list = CONJUNCTIONS;
    for(var i = 0; i < list.length; i++) {
        if(word === list[i]) return true;
    }
    return false;
}

var PREPOSITIONS = ["aboard", "about", "above", "across", "after", "against", "along", "amid", "among", "anti", "around", "as", "at", "before", "behind", "below", "beneath", "beside", "besides", "between", "beyond", "but", "by", "concerning", "considering", "despite", "down", "during", "except", "excepting", "excluding", "following", "for", "from", "in", "inside", "into", "like", "minus", "near", "of", "off", "on", "onto", "opposite", "outside", "over", "past", "per", "plus", "regarding", "round", "save", "since", "than", "through", "to", "toward", "towards", "under", "underneath", "unlike", "until", "up", "upon", "versus", "via", "with", "within", "without", "yesterday"];
var PREPOSITION_COUNT = PREPOSITIONS.length;
function isPreposition(word) {
    word = word.toLowerCase();
    var list = PREPOSITIONS;
    for(var i = 0; i < list.length; i++) {
        if(word === list[i]) return true;
    }
    return false;
}

