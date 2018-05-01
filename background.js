document.addEventListener('copy', function(e){
    chrome.extension.sendRequest({event: "copy"});
}, true);