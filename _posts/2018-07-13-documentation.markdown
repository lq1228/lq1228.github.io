---
layout: post
title:  "JavaScript代码的自文档化"
date:   2018-07-13 1:00:42 +0800
description: "为了使代码易读好维护，除了加注释之外，还可以让代码自文档化"
categories: front article
---

为了使代码易读好维护，除了加注释之外，还可以让代码自文档化，我们可以把自文档化代码归为三大类：

<ul>
    <li> 结构类自文档化。使用代码的结构和目录来让代码变得清晰 </li>
    <li> 命名自文档化。例如函数或变量命名让代码更易理解 </li>
    <li> 语句相关自文档化。我们利用语言的特性来让代码变得清晰 </li>
</ul>

#### 一、结构类自文档化

##### 将代码移动到函数里面

{% highlight javascript %}
var width = (value - 0.5) * 16;

//修改后
var width = emToPixels(value);
function emToPixels() {
    return (ems - 0.5) * 16;
}
{% endhighlight %}

我们把计算放到函数里的好处：

<ul>
    <li> 1. 函数的名称描述了代码的作用。 </li>
    <li> 2. 这个函数也增强了代码复用性。 </li>
</ul>

##### 用函数代替条件表达式

{% highlight javascript %}
if (!el.offsetWidth || !el.offsetHeight) {
}

//修改后
function isVisible (el) {
    return el.offsetWidth && el.offsetHeight;
}
if (!isVisible(el)) {
}
{% endhighlight %}

用函数代替含有多个操作运算的语句,代码会变得容易理解

##### 使用变量代替表达式

{% highlight javascript %}
if (!el.offsetWidth || !el.offsetHeight) {
}

//修改后
var isVisible = el.offsetWidth && el.offsetHeight;
if (!isVisible) {
}
{% endhighlight %}

在数学表达式中，也可以将复杂的表达式换成变量，来给表达式代码添加本身的含义

{% highlight javascript %}
return a * b + (c / d);

//修改后
var multiplier = a * b;
var divisor = c / d;
return multiplier + divisor;
{% endhighlight %}

##### 类和模块接口

接口不仅是类或模块的公用方法和属性，而且在使用中能起到自文档化的作用。来看下这个例子：

{% highlight javascript %}
class Box {
    setState(state) {
        this.state = state;
    }
    getState() {
        return this.state;
    }
}

//修改后
class Box {
    open() {
        this.state = 'open';
    }
    close() {
        this.state = 'closed';
    }
    isOpen() {
        return this.state === 'open';
    }
}
{% endhighlight %}

我们只改变了公用接口，内部生命仍然使用this.state,现在一眼就知道Box类怎么使用了。

##### 代码分块

{% highlight javascript %}
var foo = 1;

blah();
xyz();

bar(foo);
baz(1337);
quux(foo);

//修改后
var foo = 1;
bar(foo);
quux(foo);

blah();
xyz();

baz(1337);
{% endhighlight %}

##### 使用纯函数

什么是纯函数？当使用同样的参数调用，如果输出的内容相同，这就是所谓的”纯函数”。可以看下这篇文章《FunctionalProgramming: Pure Functions》。

纯函数符合纯文档化的原因：

很多影响他们输出结果的值都被明确制定了，我们不用研究某个东西到底从哪里来，或者什么东西会影响输出，可以信任它们的输出。


##### 目录和文件结构

在文件或目录命名时，根据项目中的命名规范进行命名。如果没有明确的规范，那就根据你语言选择合适的标准。

#### 二、命名自文档化

计算机科学领域有句名言：

在计算机凌云有量大难题：缓存失效和命名。–PhilKarlton

怎样使用命名来使我们的代码自文档化:

##### 重命名函数

函数命名有一些简单的规则我们可以参考：

<ul>
    <li> 1、避免使用想handle或manage这类词：handleObject，manageObject。这些什么意思。    </li>
    <li> 2、使用主动词：cutGruss()，sendFile。根据函数的具体功能来决定。    </li>
    <li> 3、使用返回值：getMagicBullet()，readFile。这种情况并不经常使用，但是在语义化方面很有作用    </li>
    <li> 4、使用强类型语言编码能明确知道返回值是什么类型 </li>
</ul>

##### 重命名变量

对于变量，有两个比较好的方法:

<ul>
    <li> 1、指明单位：如果你含有数字参数，你可以带上单位。例如widthPx就比 width要好。    </li>
    <li> 2、不要使用简写：例如a和b，这些是不能理解的变量，除非是在循环计数里面。 </li>
</ul>

##### 遵循已有的命名规范

代码中尽量使用原有的规范。

如果你遵循原有规范，任何一个读代码的人都能正确的认为某个东西在任何地方出现的含义都是相同的。

##### 使用有含义的错误

Undefined is notan object。很多人都喜欢这样提示到页面上，所以让我们提示一些具有提示意义的内容给页面使用者。怎样让错误变得有含义：

<ul>
    <li> 1、应该描述具体问题所在。   </li>
    <li> 2、如果可能，应该包含是哪个变量或数据导致的问题。    </li>
    <li> 3、关键一点：错误应该能帮助我们找到哪里出了问题。例如错误上报的方式收集解决问题。 </li>
</ul>

#### 三、 声明类自文档化

<ul>
    <li> 使用命名常量。例如constMEANING_OF_LIFE = 42; </li>
    <li> 避免bool值。例如 myThing.setData({ x: 1 }, true); </li>
    <li> 使用编程语言的优势。 </li>
</ul>

{% highlight javascript %}
imTricky && doMagic();

//尽量这样写
if (imTricky) {
    doMagic();
}
{% endhighlight %}

{% highlight javascript %}
var ids = [];
for (var i = 0; i < things.length; i ++) {
    ids.push(things[i].id);
}

//可修改为
var ids = things.map(function (thing) {
    return thing.id;
});
{% endhighlight %}

#### 四、反模式

<ul>
    <li> 提取更短的函数</li>
    <li> 不要强迫去使用 </li>
</ul>

通常，没有绝对正确的方式，所以，不强制使用任何方式，根据情况而定。

#### 结论

消除代码注释是一件很好的事情,然而，自文档化代码并不能代替文档或注释。例如，代码在表达方面是有限的，所以你也需要很好的注释来补充。API文档对于代码库来说是很重要的，除非你的代码很小，否则自文档化的方式并不可行。
