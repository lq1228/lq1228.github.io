---
layout: post
title:  "React Native ListView组件"
date:   2017-11-24 11:49:42 +0800
description: "ListView组件用来呈现一个列表，也可以通过上、下滑动来展示原来显示在屏幕外的内容"
categories: front article
---

ListView组件用来呈现一个列表，也可以通过上、下滑动来展示原来显示在屏幕外的内容

ListView组件支持列表的一些高级特性，比如给每段／组（section）数据添加一个分段头部，在列表头部和尾部增加单独的内容等。

ListView组件继承了View和ScrollView组件的所有属性。除此之外，它还有自己特殊的属性。

#### ListView组件的回调函数

<ul>
    <li>onEndReached</li>
    <li>renderFooter</li>
    <li>renderHeader</li>
    <li>renderRow</li>
    <li>renderScrollComponent</li>
    <li>renderSectionHeader</li>
    <li>renderSeparator</li>
    <li>onChangeVisibleRows</li>
</ul>

#### ListView组件的其他属性

<ul>
    <li>dataSource</li>
    <li>initialListSize</li>
    <li>onEndReachedThreshold</li>
    <li>pageSize</li>
    <li>removeClippedSubviews</li>
    <li>scrollRenderAheadDistance</li>
    <li>automaticallyAdjustContentInsets</li>
</ul>

#### ListView组件的成员函数

scrollTo(destY, destX)

#### 带分段标志的列表

ReactNative的ListView组件可以给列表设置分栏和尾栏。

ListView组件在ios和android平台上绝大部分的表现是一样的，只是在分栏显示上，ios和android平台上的呈现有些差异。

当列表开始展示时，第一个分栏区域（由开发者指定的代码绘制）会出现在列表的最顶端。在ios手机上，当用户向上滑动列表时，第一个分栏区域会保持在列表的最顶端不动，而是下方的列表动，直到第一个分栏中所有的行都移出屏幕，第一个分栏区域此时会被第二个分栏区域顶出列表顶端，第二个分栏会保持在列表的最顶端区域不动。

在Android手机上，当列表开始展示时，第一个分栏区域（由开发者指定的代码绘制）会出现在列表的最顶端。当用户上下滑动列表时，分栏会跟随列表一起移动（而不是像在ios手机上那样保持在列表的顶端不动）。

尾栏时由开发者指定代码渲染的一块区域。它作为列表的尾部，显示在列表的最下方。在ios和android手机在尾栏显示上没有区别

##### 定义如何渲染每个分栏

既然实现的是带分栏的列表，那么渲染分栏是必不可少的。开发者通过renderSectionHeader回调函数定义如何渲染每个分栏，这个函数返回一个可渲染的JSX结构。

在函数的两个参数中，sectionData是一个对象，对应着本分栏的所有数据；sectionID是一个字符串，代表着分栏字符串。

{% highlight javascript %}
    renderSectionHeader(sectionData, sectionID) {
        return(
            <View>
                <Text>sectionID</Text>
            </View>
        );
    }
{% endhighlight %}

##### 定义如何渲染首、尾栏

开发者可以给列表加上首栏和尾栏，首栏会固定显示在列表首，而尾栏会固定显示在列表尾。它们都没有任何参数，需要返回一个可渲染的JSX结构。

不管是简单列表还是复杂列表，都可以有首尾栏。

{% highlight javascript %}
    renderHeader() {
        return(
            <View>
                <Text>我是Header</Text>
            </View>
        );
    }

    renderFooter() {
        return(
            <View>
                <Text>我是Footer</Text>
            </View>
        );
    }
{% endhighlight %}

##### 列表间隔渲染

开发者可以给ListView组件提供renderSeparator回调函数，在这个回调函数中定义如何渲染列表中每个元素的间隔，这个回调函数没有参数。

{% highlight javascript %}
    renderSeparator() {
        return(
            <View>
                <Text>我是Separator</Text>
            </View>
        );
    }
{% endhighlight %}

##### 实现带分段标志的列表

最后在需要呈现ListView的组件中加入ListView结构，这个机构至少需要三个属性。

{% highlight javascript %}
    <ListView
        datasource={this.props.diaryListDataSource}    //必须提供
        renderRow={this.renderListItem}                //必须提供
        renderSectionHeader={this.renderSectionHeader} //必须提供
        renderSeparator={this.renderSeparator}
        renderHeader={this.renderHeader}
        renderFooter={this.renderFooter} />
{% endhighlight %}
