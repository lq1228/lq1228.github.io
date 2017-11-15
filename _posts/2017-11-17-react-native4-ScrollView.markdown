---
layout: post
title:  "ScrollView"
date:   2017-11-17 10:49:42 +0800
description: "ScrollView组件允许用户左、右、或者上、下滑动查看原来显示在屏幕外的内容"
categories: front article
---

ScrollView组件允许用户左、右、或者上、下滑动查看原来显示在屏幕外的内容

ScrollView组件封装了两大操作系统平台提供的滚动视图功能，并将滚动视图功能与触摸响应系统集成起来。

ScrollView组件支持View组件的所有属性，也就是支持View组件的所有样式设置。ScrollView组件没有自己独有的样式设置。

#### ScrollView组件属性

<ul>
    <li>contentContainerStyle</li>
    <li>horizontal</li>
    <li>KeyboardDismissMode</li>
    <li>keyboardShouldPersistTaps</li>
    <li>onContentSizeChange</li>
    <li>onScroll</li>
    <li>pagingEnabled</li>
    <li>scrollEnabled</li>
    <li>showHorizontalScrollIndicator</li>
    <li>showsVerticalScrollIndicator</li>
</ul>

#### ScrollView组件ios平台专有属性

<ul>
    <li>alwaysBounceHorizontal</li>
    <li>alwaysBounceVertical</li>
    <li>automaticallyAdjustContentInsets</li>
    <li>bounces</li>
    <li>bouncesZoom</li>
    <li>canCancelContentTouches</li>
    <li>centerContent</li>
    <li>contentInset</li>
    <li>contentOffset</li>
    <li>decelerationRate</li>
    <li>directionalLockEnabled</li>
    <li>indicatorStyle</li>
    <li>maximumZoomScale</li>
    <li>onScrollAnimationEnd</li>
    <li>scrollEventThrottle</li>
    <li>scrollIndicatorInsets</li>
    <li>scrollsToTop</li>
    <li>SnapToInterval</li>
    <li>snapToAlignment</li>
    <li>stickyHeaderIndices</li>
</ul>

#### ScrollView组件Android平台专有属性

<ul>
    <li>endFillColor</li>
</ul>

#### ScrollView组件的公开成员函数

除了大部分组件都有的公开成员函数setNativeProps和measure函数外，ScrollView组件还提供了scrollTo函数，以让当前的ScrollView快速地定位到指定屏幕位置。

scrollTo函数要求提供一个对象作为调用它的参数。这个对象的数据结构是：

{% highlight javascript %}
{
    x: nNumber,  //欲定位位置的横坐标
    y: nNumber,  //欲定位位置的纵坐标
    animated: aBool,  //定位到指定位置时需要动画效果还是一下子跳过去
}
{% endhighlight %}

假设已经得到一个ScrollView组件的引用为aScrollViewRef, 使用这个成员函数的示例代码如下：

{% highlight javascript %}
    aScrollViewRef.scrollTo({x: 0, y: 50, animated: true});
{% endhighlight %}

#### RefreshControl组件

RefreshControl组件是专门为ScrollView组件服务的组件。当ScrollView被拉到顶部（y: 0）时，如果给ScrollView的refreshControl属性赋值一个RefreshControl组件，则会显示这个RefreshControl组件。开发者通常用它从网络侧获取最新数据，并在获取到最新数据后让RefreshControl组件消失。

RefreshControl组件支持View组件的所有属性。

##### RefreshControl组件属性

<ul>
    <li>onRefresh</li>
    <li>refreshing</li>
</ul>

##### RefreshControl组件Android平台特有属性

<ul>
    <li>colors</li>
    <li>enabled</li>
    <li>progressBackgroundColor</li>
    <li>size</li>
</ul>

##### RefreshControl组件ios平台特有属性

<ul>
    <li>tintColor</li>
    <li>title</li>
</ul>

#### ScrollView组件基本用法

在使用ScrollView组件时，有一点需要注意：ScrollView组件必须要有明确的高度值限制，如没有设置高度，将会导致应用出错退出。

<ul>
    <li> 1、在ScrollView组件的样式中设置（不推荐） </li>
    <li> 2、在它的父组件或者更高层组件设置 </li>
</ul>
