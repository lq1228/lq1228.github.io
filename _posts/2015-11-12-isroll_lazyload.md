---
layout: post
title: lazyload + iscroll5 滑动延时加载的方法
---

# lazyload + iscroll5 滑动延时加载的方法

iscroll 和 lazyload 应该都是大家很常用的插件了，iscroll 在移动端很好的兼容性和滑动性能帮了我们很多忙，lazyload 就不用再说了，老牌图片延迟加载的插件了。  
不过当它两一块使用时，因为 iscroll 是用 transform 及时改变页面的位置来模拟滑动，而 lazyload 是以滑动图片相对“真实”滑动窗口的位置来断送图片是否需要加载的。
lazyload 遇到 iscroll ，会认为窗口没有滑动，所以不延迟加载的功能就彻底失效了。  
知道原理后，解决的方法就很简单了。就是在 iscroll “滑动”结束的回调方法中手动调用一下滑动元素的 `scroll` 事件

~~~javascript

//lazyload
var $scrollEle = $("#wrapper")
$("img.lazy").lazyload({
     effect: 'fadeIn',
     container: $scrollEle
});

//iscroll
var myscroll = new IScroll('#wrapper', {
    mouseWheel: false,
    click: true,
    preventDefault: false,
    usetransform: false
});
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
myscroll.on('scrollEnd', function () {
    $scrollEle.trigger('scroll');
}
~~~