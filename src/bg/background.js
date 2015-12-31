chrome.browserAction.onClicked.addListener(function(){
    var w = 550;
    var h = Math.round(screen.height*0.6);

    chrome.windows.create({url: chrome.extension.getURL('/src/browser_action/interface.html'), width: w, height: h, left: 100, top: 100});
});