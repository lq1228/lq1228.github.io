---
layout: post
title:  "命令模式"
date:   2017-09-21 10:49:42 +0800
description: "命令模式是最简单和优雅的模式之一， 模式中的命令(command)指的是一个执行某些特定事情的指令。"
categories: front article
---

#### 什么是命令模式

命令模式是最简单和优雅的模式之一，  模式中的命令(command)指的是一个执行某些特定事情的指令。

用于将一个请求封装为一个对象，从而可用不同的请求对客户进行参数化；可以对请求排队或记录请求日志以及执行可撤销的操作。也就是说该模式旨在将函数的调用、请求和操作封装成一个单一的对象，然后对这个对象进行一系列的处理。此外，可以降低调用对象和接受对象之间的耦合，提高了模块化程度。

#### 应用场景

命令模式最常见的应用场景是： 

1. 需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。 此时希望用一种松耦合的方式设计程序，使得请求发送者和请求接收者能够消除彼此之间的耦合关系。

2. 请求需要排队延迟、不受限制地取消，那么就可以使用该模式。

#### 命令模式的优点

1.减小代码间的耦合程度；

2.避免重复代码，并便于扩充；

3.提高代码效率，减小内存使用量；

命令模式，就是为了代码耦合，使操作和执行分离，便于扩展，修改。下面我们看一个例子:

{% highlight javascript %}
var command=function(receiverObj){
    this.receiver=receiverObj;
}
command.prototype={
    exec:function(){
        this.receiver.doSomthing();//接收者的具体操作
    },
    undo:function(){
        this.reciver.backout();//撤销操作
    }
};

var invoker=function(cmdObj){
    this.command=cmdObj;
}
invoker.prototype={
    handle:function(){//调用者的一个操作
    this.command.exec();
    //不需要知道操作的对象是谁，有接收者负责，仅执行操作即可，
    //这样可以随意更改command参数，只要它实现了exec方法；
    }
};
{% endhighlight %}

说明一下，接收者即具体的代码执行者，如在一个富文本编辑器的代码中，receiverObj就是一个具体执行execCommand的对象，他有自己的属性’选中文本’。command是一个中间过度区，像个包装器，提供一个或几个命令接口，如exec，undo。

调用者，就是调用命令的对象，它不需要知道具体执行者是谁，执行对象是谁，怎样执行，仅调用执行命令即可，而执行命令是通过command的一个属性转向具体的执行者。

例如在富文本编辑器中:

{% highlight javascript %}
var commands={
    blod:function(){},
    font_family;function(){},
    font_color:function(){},
    code:function(){}
    //等等
};//命令集合

var Cmd=(function(){
    var track=[];
    return function(cmds,type){
        this.command=cmds[type];
        this.exec=function(){
            var that=this;
            track.push(that.command);
            this.command();
        };
        this.undo=function(){
            var handle=track.pop();
            //do something;
        };
    }
})();

var blodCmd=new Cmd(commands,'blod');//定义一个命令

var menuItemBlod=new menuItem('blod',blodCmd);//一个菜单选项
{% endhighlight %}

在这个例子里命令的执行者menuItemBlod和具体实现者commands[‘blod’]两者分开, 这样如果要修改具体实现，仅需要修改commands.blod即可，另外在Cmd中定义了track数组，用来存储操作，便于撤销，和保存操作。如果要添加一个新的菜单选项，那么，只要在commands中定义实现代码，然后创建Cmd对象，并在定义菜单项是传递此命令对象即可。

命令模式，通过command对象，连接接收者和调用者，降低了两者的耦合度，便于代码的修改和维护。命令模式提高了代码的模块化程度， 但降低了代码的可阅读性（毕竟谁都不愿意看个代码的具体实现要逐层找半天，从调用者，到接收者），增加了代码的难度，所以只有在需要把操作和调用分离时，或需要对操作进行规范化处理时再用它。
