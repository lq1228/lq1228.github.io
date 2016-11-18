---
layout: post
title: 手动实现 swipe 效果
---

# 手动实现 swipe 效果

在 web 中是没有原生的 swipe 事件的，但是在很多情况下都需要实现 swipe 或是类似的效果，当然你可以借助 zepto-touch 来直接实现。  
也可以在理解它实现原理的情况下自己编写一个小功能，这样在复杂页面 swipe 的情况下也可以掌控自如。

~~~javascript
var count = 0;
//判断用户是否第一次进行touchmove操作
var startX, startY;
var endX, endY;
var distanceX, distanceY;
$('body').on('touchstart', function (event) {
    count = 0;
    //每次开始点击时清零
    startX = event.targetTouches[0].clientX; startY = event.targetTouches[0].clientY;
}).on('touchmove', function (event) {
    if (count === 0) {
        //如果是第一次滑动
        endX = event.changedTouches[0].clientX;
        endY = event.changedTouches[0].clientY;
        distanceX = Math.abs(startX - endX);
        distanceY = Math.abs(startY - endY);
        if (distanceX > distanceY) {
            //如果X绝对距离大于Y绝对距离
            event.preventDefault();
        }
    }
    count++;
}).on('touchend', function (event) {
    endX = event.changedTouches[0].clientX;
    endY = event.changedTouches[0].clientY;
    distanceX = Math.abs(startX - endX);
    distanceY = Math.abs(startY - endY);
    if (distanceX > distanceY) {
        startX - endX > 0 ? swipeLeft() : swipeRight();
    }
});
~~~