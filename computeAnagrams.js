var ComputeAnagrams = (function () {
    function ComputeAnagrams(phrase) {
        this.phrase = phrase;
        this.unique = function (arr) {
            var o = {}, i, l = arr.length, r = [];
            for (i = 0; i < l; i += 1) {
                o[arr[i]] = arr[i];
            }
            for (i in o) {
                if (o.hasOwnProperty(i)) {
                    r.push(o[i]);
                }
            }
            return r;
        };
        this.OKchars = phrase.replace(/ /g, '').split('');
        this.noOfCharsInAnagram = this.OKchars.length;
    }
    //returnerer null hvis anagram indeholder for mange af en slags bogstaver
    ComputeAnagrams.prototype.charsOk = function (str, okcharstmpIn) {
        var i = 0;
        var res = true;
        var okcharstmp = okcharstmpIn.slice();
        var c;
        var chars = str.split('');

        if (str.length === 0) {
            return null;
        }

        while (c = chars.pop()) {
            if (c === '\'') {
                continue;
            }

            i = okcharstmp.indexOf(c);
            if (i === -1) {
                return null;
            }

            okcharstmp.splice(i, 1);
        }
        return okcharstmp;
    };

    ComputeAnagrams.prototype.convertAlfabetizedAnagramToRealAnagrams = function (alfabetisizedAnagram, preWords) {
        if (typeof preWords === "undefined") { preWords = []; }
        var anagrams = [];
        var anagram;
        var ord;
        var copyOfAlphabetizisedAnagram = alfabetisizedAnagram.slice();
        var key = copyOfAlphabetizisedAnagram.pop();
        var alphabetizisedEquivalents = this.optimizedDict.lookup[key].slice();
        while (ord = alphabetizisedEquivalents.pop()) {
            anagram = preWords.slice();
            anagram.push(ord);
            if (copyOfAlphabetizisedAnagram.length === 0) {
                anagrams.push(anagram);
            } else {
                anagrams = anagrams.concat(this.convertAlfabetizedAnagramToRealAnagrams(copyOfAlphabetizisedAnagram, anagram));
            }
        }
        return anagrams;
    };

    ComputeAnagrams.permuteArray = function (words) {
        var permutations = [];
        var word;
        var tmpwords;
        var subwords;
        for (var i = 0; i < words.length; i++) {
            tmpwords = words.slice();
            word = tmpwords.splice(i, 1);
            if (tmpwords.length === 0) {
                permutations.push(word);
            } else {
                var subpermutations = ComputeAnagrams.permuteArray(tmpwords);
                while (subwords = subpermutations.pop()) {
                    permutations.push(word.concat(subwords));
                }
            }
        }
        return permutations;
    };

    //returner alle afalfabetiserede permutationer
    ComputeAnagrams.prototype.anagramFound = function (wordsInAnagram) {
        var p;
        var anagram;
        var anagrams;
        var permutationer = ComputeAnagrams.permuteArray(wordsInAnagram);
        while (p = permutationer.pop()) {
            anagrams = this.convertAlfabetizedAnagramToRealAnagrams(p);
            while (anagram = anagrams.pop()) {
                postMessage({ anagram: anagram.join(' '), done: false });
            }
        }
    };

    ComputeAnagrams.prototype.getAnagrams = function (maxNoWordsInAnagram, wordsToTry, tmpCharsOk, wordsInAnagram) {
        if (typeof tmpCharsOk === "undefined") { tmpCharsOk = this.OKchars; }
        if (typeof wordsInAnagram === "undefined") { wordsInAnagram = []; }
        var tmp, tryWordsInAnagram, anagramlength, word, newTmpCharsOk;
        if (wordsToTry.length > 0) {
            tmp = wordsToTry.slice();
            do {
                word = tmp[0];

                //forsøg at kombinere med flere ord via rekursion,
                //hvis det ikke er et anagram og hvis de ord der forsøges med nu ikke er invalide (forkerte chars eller for lange)
                anagramlength = wordsInAnagram.join('').length + word.length;
                if ((maxNoWordsInAnagram === 1 && anagramlength === this.noOfCharsInAnagram) || (maxNoWordsInAnagram > 1 && anagramlength <= this.noOfCharsInAnagram)) {
                    newTmpCharsOk = this.charsOk(word, tmpCharsOk);
                    if (newTmpCharsOk != null) {
                        tryWordsInAnagram = wordsInAnagram.slice();
                        tryWordsInAnagram.push(word);
                        if (anagramlength === this.noOfCharsInAnagram) {
                            this.anagramFound(tryWordsInAnagram);
                        } else if (maxNoWordsInAnagram > 1) {
                            this.getAnagrams(maxNoWordsInAnagram - 1, tmp, newTmpCharsOk, tryWordsInAnagram);
                        }
                    }
                }
                tmp.shift();
            } while(tmp.length > 0);
        }
    };

    ComputeAnagrams.prototype.computePositivelist = function (dict) {
        var oklistwords = [];
        for (var i = 0; i < dict.length; i++) {
            //fjern whitespace
            var word = dict[i].replace(/\s/g, '');
            if (this.charsOk(word, this.OKchars) != null) {
                oklistwords.push(word);
            }
        }
        return oklistwords;
    };

    ComputeAnagrams.prototype.alphabetize = function (dict) {
        var optimizedDict = [];
        var keys = [];
        for (var i = 0; i < dict.length; i++) {
            var word = dict[i];
            var chars = word.replace(/'/g, '').split('');
            var sortedchars = chars.sort().join('');
            if (optimizedDict[sortedchars]) {
                optimizedDict[sortedchars].push(word);
            } else {
                optimizedDict[sortedchars] = [word];
                keys.push(sortedchars);
            }
        }
        return { lookup: optimizedDict, keys: keys };
    };

    ComputeAnagrams.prototype.compute = function (maxNoWordsInAnagram, dict) {
        //Fjern dubletter.
        dict = this.unique(dict);

        //Først konstrueres en positiv liste fra ordbogen
        var oklistwords = this.computePositivelist(dict);

        //så alfabetiseres denne liste
        this.optimizedDict = this.alphabetize(oklistwords);

        //så findes anagrammer
        this.getAnagrams(maxNoWordsInAnagram, this.optimizedDict.keys);
    };
    return ComputeAnagrams;
})();
//# sourceMappingURL=computeAnagrams.js.map
