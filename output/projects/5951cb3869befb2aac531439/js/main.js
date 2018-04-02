;
(function() {
    //页面项目对象
    var imgList = [
        'images/Zp1d7AjdosLSCBO4pPzCc-75.png',
    ];
    var item = new Item();
    //页面滑动对象 基于item创建
    var slider = new Slider({
        item: item
    });
    //控制滑动
    document.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false);
    $(document).on('swipeUp', function() {
        slider.next();
    }).on('swipeDown', function() {
        slider.pre();
    });
    window.slider = slider;
})();