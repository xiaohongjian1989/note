var WaterFull = (function () {
    var $ct;
    var $items;

    function render($c) {
        $ct = $c;
        $items = $ct.children();

        var nodeWidth = $items.outerWidth(true),
            colNum = parseInt($(window).width() / nodeWidth),
            colSumHeight = [];

        for (var i = 0; i < colNum; i++) {
            colSumHeight[i] = 0;
        } 

        $items.each(function () {
            var $cur = $(this);

            var minSumHeight = Math.min.apply(null, colSumHeight),
                idx = [].indexOf.call(colSumHeight, minSumHeight);

            $cur.css({
                top: minSumHeight,
                left: idx * nodeWidth
            });

            colSumHeight[idx] += $cur.outerHeight(true);
        });
    }

    $(window).on('resize', function () {
        render($ct);
    })
    
    return {
        init: render
    }
})();


module.exports = WaterFull;