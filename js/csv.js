function exportToCsv(filename, rows, options) {
    options = options || {};
    var search_regexp = new RegExp("(\"|\\"+options.separator.split('').join('\\')+"|\\n)", 'g');
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            }
            var result = innerValue.replace(/"/g, '""');
            if (result.search(search_regexp) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += options.separator;
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = "";
    if(options.excel_mode === 'yes') {
        csvFile = "sep="+options.separator+"\n";
    }
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    if (navigator.msSaveBlob) { // IE 10+
        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = "data:text/csv;charset=utf-8," + encodeURIComponent(csvFile);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}