---
layout: post
title:  "input[type='file']打开文件选择框缓慢问题"
date:   2016-12-02 13:49:42 +0800
description: ""
categories: front article
---

项目中遇到的问题

{% highlight javascript %}
<input type="file" name="file" accept="image/*">
{% endhighlight %}

我在代码中使用了HTML5的input[file]标签去上传图片，同时，使用了 accept=”image/*” 去过滤所有非图片的文件。

点击input之后，会有一定概率出现文件选择框弹出非常慢的问题，正常情况下，不到1S就能弹出文件选择框。但是慢的时候，可能达到7 ~ 10秒。


当时想这个组件可能存在兼容性问题，在mac电脑上的测试了safari电脑上发现基本没区别，又升级了chrome版本(54)，也未能得到改善。

无意中在同事电脑操作的时候，发现打开文件选择框的速度比我电脑快多了，也同为chrome浏览器（52）

那就排查下属性吧，对属性进行逐一排查后，发现是accept=”image/*”的问题。


将accept=”image/*”改为指定的图片格式就不会出现上述问题，所以我将上传图片的过滤格式指定为了常用的几种格式

{% highlight javascript %}
<input type="file" name="file"  accept="image/jpg,image/jpeg,image/png">
{% endhighlight %}

原因初步猜想是当设置accept=”image/*”时，浏览器会在弹出框中处理所有的非图片元素，包含所有的图片格式，如果文件较多会增加处理时间，而这个时候可能在这几个版本的chrome中有bug（也许是底层没实现好），导致概率性时间增长(<52chrome浏览器未测)。

当然，如果希望过滤所有的非图片格式，那么这个问题还是会存在。


原文出处：http://www.foreverpx.cn




