chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.action == 'parseData') {
			var formula = request.formula;
			var result = [];
			if(formula.row) {
				// Row mode
			} else {
				// Col mode
				var subresult = [];
				formula.cols.forEach(function(el){
					var col = [];
					col.push(el.title);
					$(el.selector).each(function(){
						col.push($(this).text());
					});
					subresult.push(col);
				});

				if(subresult.length) {
					for (var i in subresult[0]) {
						var row = [];
						subresult.forEach(function(el){
							row.push(el[i] || '-');
						});
						result.push(row);
					}
				}
			}
			sendResponse(result);
		}
	}
);