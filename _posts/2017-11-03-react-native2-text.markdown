---
layout: post
title:  "React Native Text组件"
date:   2017-10-29 10:49:42 +0800
description: ""
categories: front article
---

Text元素在布局上不同于其它组件：在Text内部的元素不再使用flexbox布局，而是采用文本布局。这意味着Text内部的元素不再是一个个矩形，而可能会在行末进行折叠。
 
基于这个特性，开发者可以只设定Text组件样式的宽度，而不设置它的高度，Text组件的高度将由组件的宽度、需要显示的字符串的长度、字体大小共同动态确定。

#### 属性

##### 通用样式键设置

<ul>
    <li>fontFamily</li>
    <li>fontStyle</li>
    <li>fontSize</li>
    <li>fontWeight</li>
    <li>textAlign</li>
    <li>textDecorationLine</li>
    <li>lineHeight</li>
    <li>numberOfLines</li>
    <li>onLongPress</li>
    <li>Selectable</li>
</ul>

三个与阴影有关的样式

<ul>
    <li>textShadowOffset</li>
    <li>textShadowRadius</li>
    <li>textShadowColor</li>
</ul>


##### ios 平台独有样式键设置

<ul>
    <li>fontVariant</li>
    <li>letterSpacing</li>
    <li>writingDirection</li>
    <li>textDecorationStyle</li>
    <li>textDecorationColor</li>
    <li>adjustsFontSizeToFit</li>
    <li>allowFontScaling</li>
    <li>minimumFontScale</li>
    <li>suppressHighlighting</li>
</ul>

##### Android 平台独有样式键设置

<ul>
    <li>includeFontPadding</li>
    <li>selectionColor</li>
    <li>textAlignVertical</li>
    <li>textBreakStrategy</li>
</ul>

cllipsizeMode时字符串类型属性。它的取值为：head,middle,tail,clip.它决定了当Text组件无法全部显示需要显示的字符串时，如何用省略号进行修饰。

需要注意的是，ellipsizeMode属性需要与numberOfLines属性配合使用，numberOfLines属性值被赋予1，但开发者可以视需要赋给它任意正整数。

依照官方文档，ellipsizeMode是一个跨平台属性。但截止RN0.40,只有ios平台支持了前三种属性。android平台，所有取值效果都与clip属性相同。

#### Text组件的嵌套

在嵌套的Text组件中，子Text组件将继承它的父Text组件的样式。子Text组件不能覆盖从父Text组件继承而来的样式，只能增加父Text组件没有指定的样式。

#### Text居中显示

需要在Text组件外套一层view才能设置Text组件的水平垂直居中

{% highlight javascript %}
<View style={styles.viewForTextStyle}>
    <Text style={styles.textStyle}>happy</Text>
</View>

var styles = StyleSheet.create({
    viewForTextStyle: {
        width: 200,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        fontSize: 30
    }
});
{% endhighlight %}

#### 在字符串中插入图像

在React Native 0.20.0 版本后，开发者可以在Text组件中更方便的插入图像

{% highlight javascript %}
var aImage = require('./1.jpg');
<Text style={styles.welcome}>
    Welcome to <Image source={aImage} style={styles.imageInTextStyle} /> React Native.
</Text>

var styles = StyleSheet.create({
    welcome: {
        fontSize: 20,
        textAlign: 'center',
    },
    imageInTextStyle: {
        width: 30,
        height: 30,
        resizeMode: 'cover'
    }
});
{% endhighlight %}

#### Text组件在两个平台上的不同表现

##### 只指定fontSize，不指定height

在这种情况下，Text组件在两个平台上显示都正常。

ios: 两个汉字上、下方富余的空间基本相等；

android: 上方富余空间的高度大概是下方空间的1.5倍。除非字体比较大，否则用户不容易发现。

##### 只指定height, 不指定fontSize

在这种极端情况下，不论height是何值，fontSize的值都是13。

##### fontSize 等于 height

ios: 字体偏下，下方部分显示不全

android：字体比ios还偏下，上方留有空间，下方显示不全。

这种情况下，在Text组件样式中加入 padding: 0 或者 paddingTop: 0 或者 paddingBottom: 0，也不会有任何变化。

##### height 大于 fontSize

ios: 当height等于fontSize的1.2倍时，显示效果与只指定fontSize，不指定height类似；如果height继续增大，此时Text组件中显示字符的上方空间保持不变，而下方空间会随着height增大而增大。

android: 当height等于fontSize的1.35倍时，显示效果与只指定fontSize，不指定height类似；如果height继续增大，此时Text组件中显示字符的上方空间保持不变，而下方空间会随着height增大而增大。

##### 边框在两个平台上的不同表现

给Text组件增加border属性，android不显示边框。兼容两端的话，需要在Text组件外套一层view，然后设置相关border属性。
