interface IAlfabetisizedList {
    keys: string[];
    lookup: any;
}

class ComputeAnagrams {
    OKchars: string[];
    noOfCharsInAnagram: number;
    optimizedDict: IAlfabetisizedList;

    constructor(private phrase: string) {
        this.OKchars = phrase.replace(/ /g, '').split('');
        this.noOfCharsInAnagram = this.OKchars.length;
    }

    //check om et ord eller anagram ikke indeholder forkerte eller for mange af en slags bogstaver
    charsOk(str: string) {
        var i = 0;
        var res = true;
        var okcharstmp = this.OKchars.slice();
        var c: string;
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
    }

    private convertAlfabetizedAnagramToRealAnagrams(alfabetisizedAnagram: string[], preWords:string[] = []) : string[][] {
        var anagrams: string[][] = [];
        var anagram: string[];
        var ord: string;
        var copyOfAlphabetizisedAnagram = alfabetisizedAnagram.slice();
        var key = copyOfAlphabetizisedAnagram.pop();
        var alphabetizisedEquivalents = <string[]>this.optimizedDict.lookup[key].slice();
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
    }

    private static permuteArray(words: string[]) {
            var permutations: string[][] = [];
            var word: string[];
            var tmpwords: string[];
            var subwords: string[];
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
    }

    //returner alle afalfabetiserede permutationer
    private anagramFound(wordsInAnagram: string[]) {
        var p:string[];
        var anagram: string[];
        var anagrams: string[][];
        var permutationer = ComputeAnagrams.permuteArray(wordsInAnagram);
        while (p = permutationer.pop()) {
            anagrams = this.convertAlfabetizedAnagramToRealAnagrams(p);
            while (anagram = anagrams.pop()) {
                (<any>postMessage)(<IAnagramOutData>{ anagram: anagram.join(' '), done: false });
            }
        }
    }

    private getAnagrams(maxNoWordsInAnagram: number, wordsToTry: string[], wordsInAnagram: string[]= []) {
        var tmp: string[], tryWordsInAnagram: string[], tmpword: string;
        if (maxNoWordsInAnagram > 0 && wordsToTry.length > 0) {
            tmp = wordsToTry.slice();
            do {
                tryWordsInAnagram = wordsInAnagram.slice();
                tryWordsInAnagram.push(tmp[0]);
                //forsøg at kombinere med flere ord via rekursion, 
                //hvis det ikke er et anagram og hvis de ord der forsøges med nu ikke er for lange
                tmpword = tryWordsInAnagram.join('');
                if ((maxNoWordsInAnagram === 1 && tmpword.length === this.noOfCharsInAnagram) ||
                    (maxNoWordsInAnagram > 1 && tmpword.length <= this.noOfCharsInAnagram)) {
                    if (this.charsOk(tmpword)) {
                        if (tmpword.length === this.noOfCharsInAnagram) {
                            this.anagramFound(tryWordsInAnagram);
                        } else {
                            this.getAnagrams(maxNoWordsInAnagram - 1, tmp, tryWordsInAnagram);
                        }
                    }
                }
            } while (tmp.shift());
        }
    }


    private computePositivelist(dict: string[]) {
        var oklistwords = [];
        for (var i = 0; i < dict.length; i++) {
            //fjern whitespace
            var word = dict[i].replace(/\s/g, '');
            if (this.charsOk(word)) {
                oklistwords.push(word);
            }
        }
        return oklistwords;
    }


    private alphabetize(dict: string[]) {
        var optimizedDict: any = [];
        var keys: string[] = [];
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
        return <IAlfabetisizedList>{ lookup: optimizedDict, keys: keys };
    }

    private unique = function (arr) {
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

    compute(maxNoWordsInAnagram: number, dict: string[]) {
        //Fjern dubletter.
        dict = this.unique(dict);
        //Først konstrueres en positiv liste fra ordbogen
        var oklistwords = this.computePositivelist(dict);
        //så alfabetiseres denne liste
        this.optimizedDict = this.alphabetize(oklistwords);
        //så findes anagrammer
        this.getAnagrams(maxNoWordsInAnagram, this.optimizedDict.keys);
    }
}
