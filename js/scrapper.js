$(function(){
    chrome.storage.sync.get('formulas', function(data) {
        var formulas = data.formulas || [];

        var changeCurrentFormula = function() {
            if(formulas.length) {
                var formula = formulas[$('#formulaList').val()];
                if(formula) {
                    $('#rowSelector').val(formula.row);
                    $('.selectors tbody tr').remove();
                    formula.rows.forEach(function(val){
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
                    formula.rows = [];
                    $('.selectors tbody tr').each(function(){
                        var self = $(this);
                        var title = self.find('input:eq(0)').val();
                        var selector = self.find('input:eq(1)').val();
                        if(selector) {
                            formula.rows.push({
                                title: title,
                                selector: selector
                            });
                        }
                    });
                }
            }
            chrome.storage.sync.set({'formulas': formulas});
        };

        var i = 0;
        formulas.forEach(function(value){
            $('#formulaList').append($('<option>').val(i++).text(value.title));
        });
        changeCurrentFormula();
        $('#formulaList').change(changeCurrentFormula);

        $( document ).on( 'click', '.selectors .green', function(){
            $('.selectors tbody').append('<tr><td><input class="u-full-width" type="text"></td><td><input class="u-full-width" type="text"></td><td><button class="red" title="Delete row">-</button></td></tr>');
        });

        var SetFormulaInput = $('#SetFormulaInput');

        $('#AddFormula').click(function(){
            SetFormulaInput.val('');
            $('.overlay').show();
        });

        $('#SetFormulaName').click(function(){
            if(SetFormulaInput.val()) {
                formulas.push({
                    title: SetFormulaInput.val(),
                    row: '',
                    rows: []
                });
                chrome.storage.sync.set({'formulas': formulas});
                SetFormulaInput.val('');
                $('.overlay').hide();
            }
        });

        $('#CancelFormulaName').click(function(){
            $('.overlay').hide();
        });

        $('#SaveButton').click(saveCurrentFormula);
    });
});