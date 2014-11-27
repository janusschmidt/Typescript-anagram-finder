# Typescript anagram finder


typescript/javascript that lets you enter a text. The app will then proceed to find all 
anagrams (width first) to a depth of 3 words. It uses a file of english words as dictionary.

The project uses webworkers to get a responsive UI, so it only works in modern browsers. (Chrome being the fastest by far)

The algorithm is basically like this:
 - Read dictionary
 - Remove all bad whitespace and redundant entries.
 - Remove words that has too many letters of some kind, as they can never be part of the anagram.
 - Alfabetize all words. By that i mean group and sort by chars in word. That way we only have to find one combination for each group of one word partial anagrams.
 - Use recursion to check for anagrams.
 - As anagrams are commutative, the algorithm is optimized to leave out looking for permutations of word combinations, and instead supplying all permutations when a match is found.
 - When an anagram is found permute all combinations of the words in the anagram, then further expand the results by computing all combinations by looking up alfabetized words in the alfabetizedWordToGroup dictionary.
 - Finally check if anagram has the right md5 hash (As this project is the solution to a challenge where a certain anagram should be found)



I've optimized a version in c# and f# as well. f# was painfully slow, and c# was a lot faster than the javascript version.