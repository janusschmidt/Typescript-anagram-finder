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
    //check om et ord eller anagram ikke indeholder forkerte eller for mange af en slags bogstaver
    ComputeAnagrams.prototype.charsOk = function (str) {
        var i = 0;
        var res = true;
        var okcharstmp = this.OKchars.slice();
        var c;
        var chars = str.split('');

        if (str.length === 0) {
            return false;
        }

        while (c = chars.pop()) {
            if (c === '\'') {
                continue;
            }
            i = okcharstmp.indexOf(c);
            if (i > -1) {
                okcharstmp.splice(i, 1);
            } else {
                res = false;
                break;
            }
        }
        return res;
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

    ComputeAnagrams.prototype.getAnagrams = function (maxNoWordsInAnagram, wordsToTry, wordsInAnagram) {
        if (typeof wordsInAnagram === "undefined") { wordsInAnagram = []; }
        var tmp, tryWordsInAnagram, tmpword;
        if (maxNoWordsInAnagram > 0 && wordsToTry.length > 0) {
            tmp = wordsToTry.slice();
            do {
                tryWordsInAnagram = wordsInAnagram.slice();
                tryWordsInAnagram.push(tmp[0]);

                //forsøg at kombinere med flere ord via rekursion,
                //hvis det ikke er et anagram og hvis de ord der forsøges med nu ikke er for lange
                tmpword = tryWordsInAnagram.join('');
                if ((maxNoWordsInAnagram === 1 && tmpword.length === this.noOfCharsInAnagram) || (maxNoWordsInAnagram > 1 && tmpword.length <= this.noOfCharsInAnagram)) {
                    if (this.charsOk(tmpword)) {
                        if (tmpword.length === this.noOfCharsInAnagram) {
                            this.anagramFound(tryWordsInAnagram);
                        } else {
                            this.getAnagrams(maxNoWordsInAnagram - 1, tmp, tryWordsInAnagram);
                        }
                    }
                }
            } while(tmp.shift());
        }
    };

    ComputeAnagrams.prototype.computePositivelist = function (dict) {
        var oklistwords = [];
        for (var i = 0; i < dict.length; i++) {
            //fjern whitespace
            var word = dict[i].replace(/\s/g, '');
            if (this.charsOk(word)) {
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
