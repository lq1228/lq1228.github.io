/*eslint-env jquery */
(function(global){
    var $h2List = $('#main-cont').find('h2'),
        anchorArr = [],
        li_html = '';
    
    $h2List.each(function (i) {
        var anchorId = 'anchor' + i;
        this.id = anchorId;
        anchorArr.push({id: anchorId, text: $.trim($(this).text())});
    });
    
    $.each(anchorArr, function (i, value) {
        li_html = li_html + '<li><a href="#' + value.id + '">' + value.text + '</a></li>';
    });
    
    $('#sidebar').find('.side-nav').html(li_html);
})(window);