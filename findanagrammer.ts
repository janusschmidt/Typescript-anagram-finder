declare var CryptoJS: any;
$(function () {
    var worker: Worker;
    var md5hashtofind = '4624d200580677270a54ccff86b9610e';
    var annagrammerdiv = $('#anagrammer');
    var antalsekunder = $('#antalsekunder');
    var antalFundne = 0;
    var start;
    var timer;

    var init = function () {
        start = new Date().getTime();
        antalFundne = 0;
        $('#antalfundne').text(antalFundne);
        annagrammerdiv.empty();
        antalsekunder.text(0);
        timer = setInterval(() => {
            antalsekunder.text(Math.round((new Date().getTime() - start) / 1000));
        }, 1000);
    };

    $('#buttonStart').click(function () {
        $.get('wordlist.txt').done(function (data) {
            init();

            worker = new Worker('computeWebWorker.js');

            worker.onmessage = (ev) => {
                var data = <IAnagramOutData> ev.data;
                if (data.done) {
                    annagrammerdiv.prepend('<div style="font-size:xx-large">Færdig!!</div>');
                    clearInterval(timer);
                } else {
                    //har det den rette hash
                    if (md5hashtofind === CryptoJS.MD5(data.anagram).toString(CryptoJS.enc.Hex)) {
                        annagrammerdiv.prepend('<div style="color:green;font-size:xx-large">' + data.anagram + '</div>');
                        worker.terminate();
                        clearInterval(timer);
                    } else {
                        annagrammerdiv.prepend('<div>' + data.anagram + '</div>');
                    }
                    $('#antalfundne').text(++antalFundne);
                }
            };

            worker.onerror = function (error) {
                throw error;
            };

            worker.postMessage(<IAnagramstartdata>{
                subject: $('#anagramsubject').val(),
                dictionary: data.split('\n'),
                maxNoOfWords: 3
            });
        });
    });

    $('#buttonStop').click(function () {
        worker.terminate();
        if (timer) {
            clearInterval(timer);
        }
    });
});