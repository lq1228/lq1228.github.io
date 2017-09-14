---
layout: post
title:  "JavaScript设计模式 - 代理模式"
date:   2017-09-07 10:49:42 +0800
description: " 代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问"
categories: front article
---

代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问

代理模式使得代理对象控制具体对象的引用。代理几乎可以是任何对象：文件，资源，内存中的对象等。

为了说明代理的意义，需要引入一个[面向对象的设计原则](https://lq1228.github.io/front/article/2017/01/13/Basic-principle.html) - 单一指责原则。 单一职责原则，就一个类(通常也包括对象和函数等)而言，应该只专注于做一件事和仅有一个引起它变化的原因。所谓职责，我们可以理解他为功能，就是设计的这个类功能应该只有一个，而不是两个或更多。也可以理解为引用变化的原因，当你发现有两个变化会要求我们修改这个类，那么你就要考虑撤分这个类了。因为职责是变化的一个轴线，当需求变化时，该变化会反映类的职责的变化。

另外，在面向对象的程序设计中，大多数情况下，若违反其他任何原则，同时将违反开放 - 封闭原则。

代理模式是我们实现高内聚低耦合设计思路的一种实现方式，其中最常用的是虚拟代理和缓存代理:

#### 虚拟代理

虚拟代理是把一些开销很大的对象，延迟到真正需要它的时候才去创建执行

示例: 虚拟代理实现图片预加载

{% highlight javascript %}
// 图片加载函数
var myImage = (function(){
    var imgNode = document.createElement("img");
    document.body.appendChild(imgNode);

    return {
        setSrc: function(src) {
            imgNode.src = src;
        }
    }
})();

// 引入代理对象
var proxyImage = (function(){
    var img = new Image;
    img.onload = function(){
        // 图片加载完成，正式加载图片
        myImage.setSrc( this.src );
    };
    return {
        setSrc: function(src){
            // 图片未被载入时，加载一张提示图片
            myImage.setSrc("file://c:/loading.png");
            img.src = src;
        }
    }
})();
{% endhighlight %}

示例: 虚拟代理合并HTTP请求 

假设一个功能需要频繁的进行网络请求，这会造成相当大的开销，解决方案是通过一个代理函数来收集一段时间之内的请求，一次性发给服务器。

例如：做一个文件同步的功能，当我们选中一个文件时，就同步到另外一台备用服务器上

{% highlight javascript %}
// 文件同步函数
var synchronousFile = function( id ){
    console.log( "开始同步文件，id为：" + id );
}
// 使用代理合并请求
var proxySynchronousFile = (function(){
    var cache = [], // 保存一段时间内需要同步的ID
        timer; // 定时器指针

    return function( id ){
        cache[cache.length] = id;
        if( timer ){
            return;
        }

        timer = setTimeout( function(){
            proxySynchronousFile( cache.join( "," ) ); // 2s 后向本体发送需要同步的ID集合
            clearTimeout( timer ); // 清空定时器
            timer = null;
            cache = []; // 晴空id列表
        },2000 );
    }
})();

// 绑定点击事件
var checkbox = document.getElementsByTagName( "input" );

for(var i= 0, c; c = checkbox[i++]; ){
    c.onclick = function(){
        if( this.checked === true ){
            // 使用代理进行文件同步
            proxySynchronousFile( this.id );
        }
    }
}
{% endhighlight %}

#### 缓存代理

缓存代理可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数跟之前一致，则可以返回前面的运算结果。

示例: 为乘法、加法等创建缓存代理

{% highlight javascript %}
// 计算乘积
var mult = function(){
    var a = 1;
    for( var i = 0, l = arguments.length; i < l; i++){
        a = a * arguments[i];
    }
    return a;
};
// 计算加和
var plus = function () {
  var a = 0;
    for( var i = 0, l = arguments.length; i < l; i++ ){
        a += arguments[i];
    }
    return a;
};
// 创建缓存代理的工厂
var createProxyFactory = function( fn ){
    var cache = {}; // 缓存 - 存放参数和计算后的值
    return function(){
        var args = Array.prototype.join.call(arguments, "-");
        if( args in cache ){ // 判断出入的参数是否被计算过
            console.log( "使用缓存代理" );
            return cache[args];
        }
        return cache[args] = fn.apply( this, arguments );
    }
};
// 创建代理
var proxyMult = createProxyFactory( mult ),
    proxyPlus = createProxyFactory( plus );

console.log( proxyMult( 1, 2, 3, 4 ) ); // 输出： 24
console.log( proxyMult( 1, 2, 3, 4 ) ); // 输出： 缓存代理 24
console.log( proxyPlus( 1, 2, 3, 4 ) ); // 输出： 10
console.log( proxyPlus( 1, 2, 3, 4 ) ); // 输出： 缓存代理 10
{% endhighlight %}

#### 其他代理模式

<ul>
	<li>防火墙代理： 控制网络资源的访问，保护主题不让“坏人”接近</li>
	<li>远程代理：为一个对象在不同的地址空间提供局部代表，在Java中，远程代理可以是另一个虚拟机中的对象</li>
	<li>保护代理：用于对象应该有不同访问权限的情况</li>
	<li>智能引用代理：取代了简单的指针，它在访问对象时执行一些附加操作，比如计算一个对象被引用的次数</li>
	<li>写时复制代理：通常用于复制一个庞大对象的情况。写时复制代理延迟了复制的过程，当对象被真正修改时，才对它进行复制操作。写时复制代理是虚拟代理的一种变体，DLL（操作系统中的动态连接库）是其典型运用场景。</li>
</ul>
