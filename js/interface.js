$(function(){
    var formulas = [];
    var tab_opener = 0;
    if(localStorage.getItem('formulas')) {
        var json_formulas = JSON.parse(localStorage.getItem('formulas'));
        json_formulas.forEach(function(val){
            formulas.push(val);
        });
    }

    var saveFormulas = function() {
        localStorage.setItem('formulas', JSON.stringify(formulas));
    };

    var getCurrentFormula = function() {
        return formulas[$('#formulaList').val()];
    };

    var changeCurrentFormula = function() {
        if(formulas.length) {
            var formula = getCurrentFormula();
            if(formula) {
                $('#colselector').val(formula.row);
                $('.selectors tbody tr').remove();
                formula.cols.forEach(function(val){
                    var tr = $('<tr><td><input class="u-full-width" type="text"></td><td><input class="u-full-width" type="text"></td><td><button class="red" title="Delete row">-</button></td></tr>');
                    tr.find('input:eq(0)').val(val.title);
                    tr.find('input:eq(1)').val(val.selector);
                    $('.selectors tbody').append(tr);
                });
            }
        }
    };

    var saveCurrentFormula = function() {
        if(formulas.length) {
            var formula = formulas[$('#formulaList').val()];
            if(formula) {
                formula.row = $('#rowSelector').val();
                formula.cols = [];
                $('.selectors tbody tr').each(function(){
                    var self = $(this);
                    var title = self.find('input:eq(0)').val();
                    var selector = self.find('input:eq(1)').val();
                    if(selector) {
                        formula.cols.push({
                            title: title,
                            selector: selector
                        });
                    }
                });
            }
        }
        saveFormulas();
    };

    var updateFormulaList = function() {
        var i = 0;
        $('#formulaList').html('');
        formulas.forEach(function(value){
            $('#formulaList').append($('<option>').val(i++).text(value.title));
        });
    };
    updateFormulaList();
    changeCurrentFormula();
    $('#formulaList').change(changeCurrentFormula);

    $( document ).on( 'click', '.selectors .green', function(){
        $('.selectors tbody').append('<tr><td><input class="u-full-width" type="text"></td><td><input class="u-full-width" type="text"></td><td><button class="red" title="Delete row">-</button></td></tr>');
    });

    $( document ).on( 'click', '.selectors .red', function(){
        var self = $(this);
        self.parents('tr').remove();
    });

    var SetFormulaInput = $('#SetFormulaInput');

    $('#AddFormula').click(function(){
        SetFormulaInput.val('');
        $('#setNameOverlay').show();
    });

    $('#RemoveFormula').click(function(){
        if(confirm('This operation will delete current formula, are you sure?')) {
            var new_formulas = [];
            var to_remove = getCurrentFormula();

            formulas.forEach(function(el){
                if(el != to_remove) {
                    new_formulas.push(el);
                }
            });
            formulas = new_formulas;
            updateFormulaList();
            changeCurrentFormula();
        }
    });

    $('#SetFormulaName').click(function(){
        if(SetFormulaInput.val()) {
            formulas.push({
                title: SetFormulaInput.val(),
                row: '',
                cols: []
            });
            saveFormulas();
            SetFormulaInput.val('');
            $('.overlay').hide();
            updateFormulaList();
            $('#formulaList').val($('#formulaList option:last').val());
            changeCurrentFormula();
        }
    });

    $('#LoadButton').click(function(){
        $('#importFormulaInput').val('');
        $('#setImportFormula').show();
    });

    $('#ExportButton').click(function(){
        $('#exportFormulaInput').val(btoa(JSON.stringify(getCurrentFormula())));
        $('#setExportFormula').show();
    });

    $('#buttonImportFormula').click(function(){
        var json = atob($('#importFormulaInput').val());
        if(json) {
            var data = jQuery.parseJSON(json);
            if(data) {
                formulas[$('#formulaList').val()] = data;
                changeCurrentFormula();
                $('.overlay').hide();
            }
        }
    });

    $('.CloseOverlay').click(function(){
        $('.overlay').hide();
    });

    $('#SaveButton').click(function(){
        saveCurrentFormula();
        alert('Saved');
    });

    $('#RunButton').click(function(){
        chrome.tabs.sendMessage(tab_opener,{action: 'parseData', formula: getCurrentFormula()},{},function(response) {
            if(response && response.length) {
                exportToCsv(getCurrentFormula().title+'.csv',response);
            }
        });
    });

    chrome.runtime.sendMessage({action: "whatIsMyOpenerId"}, function(response) {
        tab_opener = response;
    });
});