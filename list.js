var cutofflength = 45;
var cutoffURLlength = 25;

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (request.event == "copy") {
            document.getElementById("copy-extention-copy-field").value = "";
            document.getElementById("copy-extention-copy-field").focus();
            document.execCommand('paste');
            var text = document.getElementById("copy-extention-copy-field").value;

            chrome.storage.sync.get(['stored-copy'], function (result) {
                console.log(result);
                var list = (result["stored-copy"] !== undefined) ? result["stored-copy"] : [];

                chrome.tabs.getSelected(null, function (tab) {
                    var tablink = tab.url;
                    list.push({
                        url: tablink.trim(),
                        text: text.trim(),
                    });

                    addNewRow(tablink, text);

                    chrome.storage.sync.set({ ["stored-copy"]: list }, function () {
                        console.log("List saved");
                        console.log(list);
                    });
                });
            });
        }
        sendResponse({});
    });


function addNewRow(url, text) {
    var table = document.getElementById("copy-extention-main-table");

    var row = table.insertRow(0);
    row.className += " text-left";

    var cell1 = row.insertCell(0); // copied text
    var cell2 = row.insertCell(1); // url

    var wrapperDiv = document.createElement("div");
    var textDiv = document.createElement("div");
    var copyButton = document.createElement("button");

    wrapperDiv.className = "copy-extention-text-wrapper";
    wrapperDiv.title = (text.length > cutofflength) ? text : "";

    textDiv.innerHTML = (text.length > cutofflength) ? text.substring(0, cutofflength - 3) + "..." : text;

    copyButton.innerHTML = "Copy";
    copyButton.setAttribute("data-text", text);
    copyButton.addEventListener("click", copyTextToClipboard);

    wrapperDiv.appendChild(textDiv);
    wrapperDiv.appendChild(copyButton);

    cell1.appendChild(wrapperDiv);
    cell2.innerHTML = (url.length > cutoffURLlength) ? url.substring(0, cutoffURLlength - 3) + "..." : url;
}

function copyTextToClipboard() {
    var text = this.getAttribute("data-text");
    document.getElementById("copy-extention-copy-field").value = text;
    document.getElementById("copy-extention-copy-field").select();
    console.log("Copy success: ", document.execCommand('copy'));
}

function openNewTab() {
}

function loadTexts() {
    chrome.storage.sync.get(['stored-copy'], function (result) {
        console.log(result);
        if (result['stored-copy']) {
            for (var i = 0; i < result['stored-copy'].length; i++) {
                var text = result['stored-copy'][i].text;
                var tablink = result['stored-copy'][i].url;
                addNewRow(tablink, text);
            }
        }
        else {
            console.log("No result");
        }
    });
}

window.onload = loadTexts();