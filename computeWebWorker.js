importScripts('computeAnagrams.js');
onmessage = function (oEvent) {
    var indData = oEvent.data;
    var computer = new ComputeAnagrams(indData.subject);
    computer.compute(indData.maxNoOfWords, indData.dictionary);
    postMessage({ done: true });
};
//# sourceMappingURL=computeWebWorker.js.map
