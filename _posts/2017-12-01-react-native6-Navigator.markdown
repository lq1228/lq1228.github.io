---
layout: post
title:  "React Native Navitator组件"
date:   2017-11-30 10:49:42 +0800
description: "React Native Navitator组件"
categories: front article
---

#### 导航组件的属性

##### 回调函数

开发者可以通过指定Navitator组件的configureScene属性来定制场景切换时的动画效果。这是一个回调函数类型的属性，它接收场景切换的数据，然后返回开发者希望的场景切换动画效果。

configureScene指定的回调函数被执行时，会收到一个导航路径参数，开发者可以根据导航路径中的信息（由开发者在要求切换场景时提供）来决定场景切换适用何种效果。

返回值可以是

<ul>
    <li>PushFormRight</li>
    <li>FloatFormRight</li>
    <li>FloatFormLeft</li>
    <li>FloatFormBottom</li>
    <li>FloatFormBottomAndroid</li>
    <li>FadeAndroid</li>
    <li>HorizontalSwipeJump</li>
    <li>VerticalUpSwipeJump</li>
    <li>VerticalDownSwipeJump</li>
    <li>PushFormLeft</li>
    <li>HorizontalSwipeJumpFormLeft</li>
</ul>

onDidFocus属性用来制定一个回调函数。当导航组件导入初始场景后，或者每一个新的场景切换完成时，这个回调函数被调用。它可以接受一个保存有新场景路径信息的参数。

现在React Native不建议使用onDidFocus属性，而是鼓励开发者适用navigationContext.addListener('didfocus', callback)事件监听器来实现相同的功能。

onWillFocus属性用来制定一个回调函数。在导航组件准备进行场景切换前，这个回调函数被调用。

现在React Native不建议使用onWillFocus属性，而是鼓励开发者适用navigationContext.addListener('willfocus', callback)事件监听器来实现相同的功能。

renderScene属性用来指定一个回调函数。导航组件必须要提供这个属性。它用来为特定路径实现洁面的渲染。当它被调用时，会提供一个renter对象（导航路径）与一个navigator对象（导航器本身）。

##### 其他属性

<ul>
    <li>sceneStyle, style类型的属性</li>
    <li>initialRoute, 类类型的属性</li>
    <li>initialRouteStack, 类类型的属性</li>
    <li>navigationBar</li>
</ul>

#### 导航器

导航器可以应用函数：push, pop和replace函数的使用。导航器用于各界面导航的函数有：

<ul>
    <li>getCurrentRoutes()函数，用来得到当前的路径列表</li>
    <li>jumpBack()函数，退回到上一个界面而不卸载当前界面</li>
    <li>jumpForward()函数，沿界面路径向前跳一个界面而不卸载当前界面</li>
    <li>jumpTo(route)函数，跳转到某个界面而不卸载任何界面</li>
    <li>push(route)函数，导航组件在路径列表最前端添加一个新的界面，并马上跳转到这个界面</li>
    <li>pop()函数，导航器退回一个界面并卸载原界面</li>
    <li>replace(route)函数，导航器将当前界面用一个新的界面替代</li>
    <li>replaceAtIndex(route, index)函数，使用一个新的界面替代路径列表中的第index个界面（下标从0开始），但不改变当前显示界面</li>
    <li>replacePrevious(route)函数，将当前导航路径的上一个界面使用指定的界面替代</li>
    <li>immediatelyRouteStack(routeStack)函数，使用给定的路径列表替换当前的路径列表</li>
    <li>popToRoute(route)函数，导航器将退回到指定的界面，并在这个过程中将回退过的界面都一一卸载</li>
    <li>popToTop()函数，导航器会回到界面路径列表中的第一个界面，并且卸载其他所有界面</li>
    <li>popN()函数，接受一个数值型参数，导航器会退回多个界面并写在退回的多个界面</li>
</ul>

#### NavigationBar

Navigator组件的导航栏是三个显示区域，开发者可以在这三个显示区域中显示任何React Native组件，如文字，图片，按钮，输入框等。开发者需要能：

<ul>
    <li>设置三个区域的大小；</li>
    <li>控制在这三个区域中显示的内容；</li>
    <li>如果三个区域中有列表或者输入框，要能够控制用户按下按钮或者输入文字后的业务逻辑。</li>
</ul>

当开发者决定使用NavigationBar来进行界面导航时，大部分应用界面的导航栏都具有相同的格式（同样大小的按钮、标题栏等），只是按钮的图片或者标题栏中的文字各有不同。如果各应用界面的导航栏有不同的格式，这些导航的元素就应当在各个界面中被单独实现，而不是使用NavigationBar来实现。

{% highlight javascript %}
    navigationBar={
        <Navigator.NavigationBar routeMapper={NavigationBarRouteMapper}
    }
{% endhighlight %}

其中的Navigator.NavigationBar是一个可显示的React Native组件，它必须有一个routeMapper属性。

开发者必须将一个对象指定给routeMapper属性。这个对象可以有三个成员变量：LeftButton,RightButton和Title.其中，Title成员变量必须要有，其他两个视开发者需要来提供。这三个成员变量要求都是函数类型的，Navigator组件渲染导航栏时，使用这三个函数的返回值渲染导航栏的对应区域。

每个函数可以接收4个参数，示例如下：

{% highlight javascript %}
    LeftButton:function(route, navigator, index, navState)
{% endhighlight %}

在三个成员函数返回的可渲染节点的样式中设置三个区域的大小。这三个函数返回的可渲染节点就是三个区域中显示的内容。

不同的页面需要控制这三个区域中显示不同的内容，开发者需要将不同页面待显示的不同内容（文字，图片）通过route传入这三个函数中，然后这三个函数从route的成员变量中取出传入的供显示的内容，最后渲染显示。

对按钮或输入框的处理，通常都需要调用父组件的函数，这就需要将这个父组件的函数以某种方式传入routeMapper属性中。开发者无法直接给routeMapper属性再传值，但可以放在route中，由Navigator组件在渲染时交给routeMapper属性。而route中的成员变量，都是由开发者提供的，并且对每个事件只能提供一个回调函数（准确的说，是最近一次提供的回调函数会覆盖上一次提供的回调函数）。这也正是NavigationBar组件目前使用不多的原因。
