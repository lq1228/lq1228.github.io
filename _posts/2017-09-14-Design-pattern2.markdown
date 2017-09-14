---
layout: post
title:  "观察者模式与发布/订阅模式"
date:   2017-09-14 10:49:42 +0800
description: " 定义对象间的一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知"
categories: front article
---

定义对象间的一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。

这是在很多场合下都把观察者（Observer）模式 与 发布（Publish）/订阅（Subscribe）模式这两种模式看成是等同的原因。

同时它们之间也是存在差异的，下面2个图就很清晰的表现了出来

### 发布／订阅模式

![发布／订阅模式](/images/design-pattern/Publish.png)

### 观察者模式

![观察者模式](/images/design-pattern/Observer.png)

总结

<ul>
    <li>
        1. 从两张图片可以看到，最大的区别是调度的地方。

        虽然两种模式都存在订阅者和发布者（具体观察者可认为是订阅者、具体目标可认为是发布者），但是观察者模式是由具体目标调度的，而发布/订阅模式是统一由调度中心调的，所以观察者模式的订阅者与发布者之间是存在依赖的，而发布/订阅模式则不会。
    </li>
    <li>
        2. 两种模式都可以用于松散耦合，改进代码管理和潜在的复用。
    </li>
</ul>

{% highlight javascript %}
// 发布／订阅模式
var pubsub = {};
(function(myObject) {
    // Storage for topics that can be broadcast
    // or listened to
    var topics = {};
    // An topic identifier
    var subUid = -1;
    // Publish or broadcast events of interest
    // with a specific topic name and arguments
    // such as the data to pass along
    myObject.publish = function( topic, args ) {
        if ( !topics[topic] ) {
            return false;
        }
        var subscribers = topics[topic],
            len = subscribers ? subscribers.length : 0;
        while (len--) {
            subscribers[len].func( topic, args );
        }
        return this;
    };
    // Subscribe to events of interest
    // with a specific topic name and a
    // callback function, to be executed
    // when the topic/event is observed
    myObject.subscribe = function( topic, func ) {
        if (!topics[topic]) {
            topics[topic] = [];
        }
        var token = ( ++subUid ).toString();
        topics[topic].push({
            token: token,
            func: func
        });
        return token;
    };
    // Unsubscribe from a specific
    // topic, based on a tokenized reference
    // to the subscription
    myObject.unsubscribe = function( token ) {
        for ( var m in topics ) {
            if ( topics[m] ) {
                for ( var i = 0, j = topics[m].length; i < j; i++ ) {
                    if ( topics[m][i].token === token ) {
                        topics[m].splice( i, 1 );
                        return token;
                    }
                }
            }
        }
        return this;
    };
}( pubsub ));
{% endhighlight %}

{% highlight javascript %}
//观察者列表
function ObserverList(){
  this.observerList = [];
}
ObserverList.prototype.add = function( obj ){
  return this.observerList.push( obj );
};
ObserverList.prototype.count = function(){
  return this.observerList.length;
};
ObserverList.prototype.get = function( index ){
  if( index > -1 && index < this.observerList.length ){
    return this.observerList[ index ];
  }
};
ObserverList.prototype.indexOf = function( obj, startIndex ){
  var i = startIndex;
  while( i < this.observerList.length ){
    if( this.observerList[i] === obj ){
      return i;
    }
    i++;
  }
  return -1;
};
ObserverList.prototype.removeAt = function( index ){
  this.observerList.splice( index, 1 );
};

//目标
function Subject(){
  this.observers = new ObserverList();
}
Subject.prototype.addObserver = function( observer ){
  this.observers.add( observer );
};
Subject.prototype.removeObserver = function( observer ){
  this.observers.removeAt( this.observers.indexOf( observer, 0 ) );
};
Subject.prototype.notify = function( context ){
  var observerCount = this.observers.count();
  for(var i=0; i < observerCount; i++){
    this.observers.get(i).update( context );
  }
};

//观察者
function Observer(){
  this.update = function(){
    // ...
  };
}
{% endhighlight %}
