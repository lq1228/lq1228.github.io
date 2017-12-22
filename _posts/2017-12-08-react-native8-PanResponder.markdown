---
layout: post
title:  "React Native PanResponder组件"
date:   2017-12-18 10:49:42 +0800
description: "PanResponder API将多种触摸行为协调成一个手势。它可以很方便的追踪一个单点触摸的后续发展，也可以用于识别简单的多点触摸手势。"
categories: front article
---

#### PanResponder API

PanResponder API将多种触摸行为协调成一个手势。它可以很方便的追踪一个单点触摸的后续发展，也可以用于识别简单的多点触摸手势。

#### 监视器

PanResponder API 的基本思想是：监视屏幕上指定大小、位置的矩形区域，当用手指按压这个区域中的某点后，开发者会收到这个事件；当按压后拖动手指时，开发者会收到手势引发的各类事件；当手指离开这个矩形区域时，开发者也会收到相应事件。

开发者可以在屏幕上制定多个监视区域，但不能同时监视多个区域中的不同触摸事件，也就是无法利用PanResponder API来处理多点触摸事件。当第一个触摸事件发生后并没有结束时，无法通过PanResponder API获取此期间发生的其他触摸事件。

PanResponder API与React Native框架的View组件，或者从View组件继承来的组件，联系非常紧密，它监视的矩形区域的大小和位置都是由与它挂接的组件来指定的。

如果我们不希望监视区域改变当前手机UI的显示，则可以使用View组件来指定监视区域，同时将这个View组件的背景色设为全透明。

如果我们希望监视区域在当前手机UI上有可视效果，则可以与某个View（或者某个Image）紧密联系，开发者可以针对这个View轻松实现手势的视觉效果。比如检测到某事件后，按业务逻辑改变该View的位置（实现跟随用户手指效果）、透明度、颜色、大小、圆角率、子组件各种属性等。

不论显示区域是否改变当前UI的显示，都会阻止被监视区域覆盖的组件接收触摸事件。比如监视区域盖住了一个按钮，那么就无法通过按钮来触发其对应的事件，开发者只能在监视器的事件处理函数中对触摸行为进行处理。

##### 指定监视区域

当需要监视多个区域时，一定要注意不能让任意两个监视区域有任何重叠。当两个监视区域有重叠时，会导致两个监视区域的监视器都不能正常工作。

为了实现触摸事件的可视化效果，我们有时会动态改变监视区域在手机屏幕上的效果，这时就更要注意不能与其他监视区域产生任何重叠。

##### 定义监视区域相关变量

与监视器相关的变量有：

<ul>
    <li>指向监视器的变量。这个变量必须存在。</li>
    <li>用来指向监视器监视区域的变量。可以不定义这个变量，但当触摸发生需要给用户视觉上的反馈时，有这个变量可以很容易实现反馈。</li>
    <li>用来记录监视区域左上角顶点坐标的两个数值变量。可以不定义这个变量，但党触摸发生需要给用户视觉上的反馈时，有这个变量可以很容易实现反馈。</li>
    <li>上一次触摸点的横、纵坐标变量。可以不定义这两个变量，但有这两个变量，便于分析、处理触摸事件。</li>
</ul>

##### 准备监视器的事件处理函数

监视器可能会上报给我们的事件共有13个：

<ul>
    <li>onMoveShouldSetPanResponder</li>
    <li>onMoveShouldSetPanResponderCapture</li>
    <li>onStartShouldSetPanResponder</li>
    <li>onStartShouldSetPanResponderCapture</li>
    <li>onPanResponderRejet</li>
    <li>onPanResponderGrant</li>
    <li>onPanResponderStart</li>
    <li>onPanResponderEnd</li>
    <li>onPanResponderRelease</li>
    <li>onPanResponderMove</li>
    <li>onPanResponderTerminationRequest</li>
    <li>onShouldBlockNativeResponder</li>
</ul>

##### 建立监视器

利用PanResponder API提供的静态函数create，开发者可以建立起一个监视器。在建立监视器时，需要指明开发者准备了哪些事件处理函数并把这些函数与对应事件挂接。

{% highlight javascript %}
this.watcher = PanResponder.create({
    onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
    onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
    onPanResponderGrant: this._handlePanResponderGrant,
    onPanResponderMove: this._handlePanResponderMove,
    onPanResponderEnd: this._handlePanResponderEnd,
});
{% endhighlight %}

##### 将监视器与监视区域挂接

最后一步是将监视器与监视区域挂接

{% highlight javascript %}
<View 
    ref = { (aViewID) => { this.watchingAreaViewID = aViewID; }}
    style = {}
    { ... this.watcher.panHandlers} 
/>
{% endhighlight %}

第一句是将系统生成的涌来饮用监视区域的组件ID记录在成员变量中，以便开发者在后续处理流程中通过这个成员变量对监视区域进行操作。

第三句是正式挂接的语句。它通过JSX的延展属性语法，将this.watcher.panHandlers中的所有属性传递给监视区域组件。用一句简单的语句完成了很多复杂的操作。

#### 监视事件的生命周期

在单次点击的生命周期中被回调函数都会收到两个参数，其中一个是原生事件的nativeEvent，另一个是手势状态gestureState

原生事件有以下成员变量：

<ul>
    <li>changedTouches - 在上一次事件之后，所有发生变化的触摸事件的数组集合（即上一次事件后，所有移动过的触摸点）</li>
    <li>identifier - 触摸点的ID</li>
    <li>location - 触摸点相对于父元素的横坐标</li>
    <li>location - 触摸点相对于父元素的纵坐标</li>
    <li>pageX - 触摸点对于根元素的横坐标</li>
    <li>pageY - 触摸点对于根元素的纵坐标</li>
    <li>target - 触摸点所在的元素ID</li>
    <li>timestamp - 触摸事件的时间戳，可用于移动速度的计算；</li>
    <li>touches - 当前屏幕上的所有触摸点的集合</li>
</ul>

虽然原生事件定义得很完备，但在PanResponder API中，在所有事件上报来的nativeEvent中只有target字段有值，并且开发者通常不关心这个值。因此在事件处理函数中，通常都不处理原生事件参数。

手势状态有以下成员变量：

<ul>
    <li>stateID - 出没状态的ID。在屏幕上至少有一个触摸点的情况下，这个ID会一直有效；</li>
    <li>moveX - 最近一次移动时的屏幕横坐标</li>
    <li>moveY - 最近一次移动时的屏幕纵坐标</li>
    <li>x0 - 当响应器产生时的屏幕坐标</li>
    <li>y0 - 当响应器产生时的屏幕坐标</li>
    <li>dx - 从触摸操作开始的累计横向路程；</li>
    <li>dy - 从触摸操作开始的累计纵向路程；</li>
    <li>vx - 当前的横向移动速度；</li>
    <li>vy - 当前的纵向移动速度；</li>
    <li>numberActiveTouches - 当前在屏幕上有效触摸点的数量。</li>
</ul>

##### 单次点击事件的生命周期

单次点击事件的完整生命周期按发生时间顺序排列如下：

1. onStartShouldSetPanResponderCapture

如果onStartShouldSetPanResponderCapture返回true，将跳过第2步，直接进入第3步，否则进入第2步。

2. onStartShouldSetPanResponder

3. onPanResponderGrant

4. onShouldBlockNativePanResponder

5. onPanResponderStart

6. onPanResponderEnd

7. onPanResponderRelease

##### 单次点击事件处理

处理事件的流程：

1. 实现对第二个事件onStartShouldSetPanResponder的处理函数，按业务逻辑判断是否监视本次触摸事件。

2. 实现对第五个事件onPanResponderStart的处理函数，将这个事件视为点击事件的开始点。

3. 实现对第六个事件onPanResponderEnd的处理函数，将这个事件视为点击事件的结束点。

##### 移动手势事件的生命周期

当手指按压在监视区域后，没有马上离开，而是在屏幕上移动时，就形成了移动手势。移动手势事件的生命周期有两种：

1. 点击事件演化为移动手势事件

点击事件进展到第五步后，手指开始移动，这时开发者会不定时收到一个onPanResponderMove事件。在PanResponder API中，onPanResponderMove事件的触发规则是：

<ul>
    <li>当向某个方向移动停止时会上报onPanResponderMove事件；</li>
    <li>当向某个方向移动了足够长的距离后会上报onPanResponderMove事件；</li>
    <li>如果手势在移动中停下来但又没有离开屏幕，那么在手势停止期间都不会上报事件，直到下一次移动开始或者手指离开屏幕。</li>
</ul>

按照上述的触发规则，当手势移动速度足够快时，onPanResponderMove事件可以达到每25毫秒甚至更短时间上报一次。

onPanResponderMove会按触发规则上报给处理函数，直到手指离开监视区域。

2. 专注移动手势处理

如果我们不需要处理点击事件，只希望处理移动手势，那第一个事件和第二个事件都返回false，就可以不处理点击事件。这时如果手势从点击发展为移动，那么移动手势的生命周期按时间顺序排列如下：

a. onStartShouldSetPanResponderCapture
b. onStartShouldSetPanResponder
c. onPanResponderGrant
d. onShouldBlockNativePanResponder

##### 监视器异常事件

PanResponder API提供了onPanResponderReject事件用来上报开发者要求监视某个区域被拒绝。

<ul>
    <li>onPanResponderTerminationRequest事件用来上报开发者监视器被要求终止。这个事件处理函数返回false表示不同意终止，或者不处理这个事件。</li>
    <li>onPanResponderTermination事件通知开发者监视器被异常终止。终止的原因可能是另一个组件已经成为新的响应者，也有可能是其他程序（比如电话呼入系统）抢占了手机屏幕</li>
</ul>
