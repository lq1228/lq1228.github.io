---
layout: post
title: 带event的兼容性事件绑定方法
---

# 带event的兼容性事件绑定方法

这个没什么技术含量，只是在一次写插件时，需要一个带event的兼容性事件绑定方法，然后就搞出来的。

~~~javascript
var addEvent = (function() {
   if (document.addEventListener) {
       return function(el, type, fn) {
           el.addEventListener(type, fn, false);
       };
   } else {
       return function(el, type, fn) {
           el.attachEvent('on' + type, function() {
               return fn.call(el, window.event);
           });
       };
   }
})();
~~~