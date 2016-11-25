---
layout: post
title:  "css实现 图片加载前的占位高度预设"
date:   2016-11-24 12:49:42 +0800
description: "在一个有多张质量较高的图片的页面上，网速较慢的情况下，如何让页面看起来加载比较流畅，不出现闪屏，跳屏的情况..."
categories: front article
---

![例图](/images/css-image/img.png)

图片占位问题

如上图：在一个有多张质量较高的图片的页面上，网速较慢的情况下，如何让页面看起来加载比较流畅，不出现闪屏，跳屏的情况呢，让我们先给图片预留好它加载完成需要占用的位置如何，可以试试

解决思路：

1、一般情况下，我们会为img标签设置width和height属性来解决图片占位问题, 这在pc端可能还能这样解决，但是绝大多数用户都来自于移动端的今天，显然不能用此办法。

2、用占位图或min-height来占位,如果占位图或min-height与需要加载的图片尺寸差别很大的话， 会出现页面的内容跳动,这也不是我们想要的。

以上思路都行不通，我们需要换方向思考下:
例图中可以看到，banner图宽度100%,高度自适应，列表分为了2列，各自50%，图片在列表中也是宽度100%，高度自适应,现在宽度都有了，如果知道图片的宽高比例的话（在服务器取数据的时候可返回图片的宽高），是不是也相当于知道图片的高度呢, 给图片父容器使用padding-top百分比值,这样就能够纯CSS实现图片的真实高度了。

例如：图片是500*300，那么    宽:高=5:3，可以计算出当宽是100%的时候，高就是宽的60%

所以padding-top应该是60%。


代码如下:
{% highlight javascript %}
<style>
.lazyload-img {
    display: block;
    max-width: 100%;
    margin: 0 auto;
}
.lazyload-img > i { 
    position: relative;
    display: block;
    width: 100%;
    padding-top: 60%; //这里的60%，就是通过上面的算法得出的
    background: #ccc no-repeat center center; //图片未加载完成前可以给个背景色用以占位
}
.lazyload-img > i > img {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    will-change: transform; //https://developer.mozilla.org/zh-CN/docs/Web/CSS/will-change
}
</style>
<i role="img" class="lazyload-img">
    <i>
        <img src="banner.png">
    </i>
</i>
{% endhighlight %}


