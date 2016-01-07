var tab_map = {};

chrome.browserAction.onClicked.addListener(function(tab){
    var w = 800;
    var h = Math.round(screen.height*0.6);

    var params = {url: chrome.extension.getURL('/src/browser_action/interface.html'), width: w, height: h, left: 100, top: 100, type: 'detached_panel'};
    try {
        chrome.windows.create(params, function (window) {
            tab_map[window.id] = tab.id;
        });
    } catch (e) {
        delete params['type'];
        chrome.windows.create(params, function (window) {
            tab_map[window.id] = tab.id;
        });
    }
});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.action == 'whatIsMyOpenerId') {
            sendResponse(tab_map[sender.tab.windowId] || 0);
        }
});