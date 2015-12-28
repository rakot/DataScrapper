$(function(){
    $( document ).on( 'click', '.selectors .green', function(){
        $('.selectors tbody').append('<tr><td><input class="u-full-width" type="text"></td><td><input class="u-full-width" type="text"></td><td><button class="red" title="Delete row">-</button></td></tr>');
    });
});