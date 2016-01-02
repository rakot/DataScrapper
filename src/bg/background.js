var tab_map = {};

chrome.browserAction.onClicked.addListener(function(tab){
    var w = 800;
    var h = Math.round(screen.height*0.6);

    chrome.windows.create({url: chrome.extension.getURL('/src/browser_action/interface.html'), width: w, height: h, left: 100, top: 100},function(window){
        tab_map[window.id] = tab.id;
    });
});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.action == 'whatIsMyOpenerId') {
            sendResponse(tab_map[sender.tab.windowId] || 0);
        }
});