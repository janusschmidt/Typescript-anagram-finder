interface IAnagramstartdata {
    subject: string;
    dictionary: string[];
    maxNoOfWords: number;
}

interface IAnagramOutData {
    anagram: string;
    done: boolean;
}



importScripts('computeAnagrams.js');
onmessage = function (oEvent) {
    var indData = <IAnagramstartdata>oEvent.data;
    var computer = new ComputeAnagrams(indData.subject);
    computer.compute(indData.maxNoOfWords, indData.dictionary);
    (<any>postMessage)(<IAnagramOutData>{ done: true });
};