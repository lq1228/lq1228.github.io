---
layout: post
title: CSS3 transform 对HTML文档流带来的影响
---

# CSS3 transform 对HTML文档流带来的影响

> html 总是那么的惊奇

## 来源于“硬件加速”

很多网上文章都说建议打开浏览器的硬件加速，这样页面渲染速度、动画流畅性会提高。这几乎成了页面制作的标配，管实际有没有用都来一个：

~~~css
    body {
        transform: translate3d(0,0,0);
    }
~~~

但这在很多情况下会引起 html 层级文档流的“异常”。 [W3C spec](http://www.w3.org/TR/css3-2d-transforms/#transform-rendering) 中有如下描述: 

> In the HTML namespace, any value other than none for the transform results in the creation of both a stacking context and a containing block. 
The object acts as a containing block for fixed positioned descendants.

意思是：
在 HTML 的命名空间内，没有比对一个即是层叠对象又是容器块的（DOM）产物进行 `transform` 变换更没有意义的了。
这类对象一般扮演者 `positioned` 子孙元素容器的角色。

。。。翻译能力有限，不理解的人估计这句话看了后更晕，下面详述。


## 标准文档流

**页面中的 dom 元素按照其在 HTML 中的标签位置顺序进行从上到下、从左往右的排布过程**

想必大家对这个基础的定义已经很熟悉了吧。但是，这个究竟在实际中有什么体现呢？

如果你在页面中放置一大堆 `display: inline-block` 的元素，它们会很乖巧的 **上 ->** **左 -> 右** 排的很整齐。这就是`标准文档流`的基础体现。

当你用`position`、`float`等属性使其脱离文档流时，就会又产生一个页面 `层级` 的概念。(扯远了...)

## transform 改变定位默认属性

例子代码如下：

~~~html
    <body>
        <header style="position: fixed; top: 0;"></header>
        <div style="height: 2000px;"></div>
        <footer style="position: fixed; bottom: 0;"></footer>
    </body>
~~~

大家都知道，dom 元素的默认定位属性是 `position: static;` 这也是标准文档流的标准定位方式。  
例子中，不管 div 怎么上下滚动，header 和 footer 会永远置于屏幕的最上和最下部。

但是如最初所述，给 `body` 加上一个 `transform: translate3d(0,0,0);`，你再去试，就会发现，原本 `position: fixed;` 的两个元素都不听话了，会随着屏幕进行滚动。

实际上，`position: fixed;` 的参考对象并不是大家所说的屏幕，而是一个 `viewport` 的html对象，一般地一个页面(一个 `document.documentElement` 标签)会生成一个 viewport。

你用 `document.documentElement.clientHeight` 就可以的看到实际 viewport 的高度，其中 `fixed` 的元素都是以此为容器进行定位的。

body 加了 `transform` 属性以后，整个 `body` DOM 既会产生相应的变换，但此时的“整个”仅是指 body 下标准文档流元素，对于那些 `position: absolute;` / `position: fixed;` 元素，
因为已经脱离了 body 所属的文档流，所以无法凭借 body 的变换使自己也自然的达到相应的变换效果。

此时，浏览器为了让此类 DOM 得到相应的变化，会产生一个新的 viewport，这个 viewport 作为定位元素的容器存在，会响应 body 的 `transform` 变换效果，从而让里面那些脱离文档流的 `positioned` 元素也能进行变换。

这个 viewport 会严重影响 `position: fixed;` 的定位，当它随着“本尊”dom同步滚动的时候，会带着 `fixed` 元素一块滚，此时会产生一种类似 `absolute` 的诡异效果：

`fixed` 元素似乎变成了 `absolute`，存在于一个和`document.documentElement`大小一致的“透明”容器内。

## 总结

其实上面的情况不只会发生在 `body` 上，一个任意的 dom 添加了 `transform` 之后都会生产一个类似 viewport 的效果，有兴趣可以去尝试。

## *同类情况

在一些移动端设备(或APP)上，给 `<video>` 标签的播放默认开启的硬解码，此时也会产生上述现象，视频会"浮"在页面上面，不会随页面元素正常滚动。






