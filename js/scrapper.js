$(function(){
    chrome.storage.sync.get('formulas', function(data) {
        var formulas = data.formulas || [];

        formulas.forEach(function(value){
            $('#formulaList').append($('<option>').text(value.title));
        });

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
    });
});