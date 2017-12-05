---
layout: post
title:  "React Native Modal组件"
date:   2017-12-04 10:49:42 +0800
description: "Modal组件可以在某个View上按开发者的需求呈现任意UI界面，并且处理这个UI界面的交互事件"
categories: front article
---

Modal组件可以在某个View上按开发者的需求呈现任意UI界面，并且处理这个UI界面的交互事件。

#### Modal组件的属性

<ul>
    <li>animationType: 这是一个字符串类型的属性，取值可能是none, slide, fade三者之一。它用来控制Modal组件的呈现方式。none 代表没有动画效果，直接呈现。slide 代表从底部滑上来。fade代表淡入淡出。</li>
    <li>onShow: 这是回调函数类型的属性。当Modal 组件在屏幕上完成显示后，这个回调函数将被执行。</li>
    <li>transparent: 这是一个布尔型的属性。它决定Modal组件是否是透明的。当它为true时，用户通过Modal 组件能看到原来的View 的内容（有半透明效果）。就好像Modal 组件浮在原来的View 上一样。</li>
    <li>visible: 这是一个布尔类型的属性。它决定Modal 组件何时显示，何时隐藏。</li>
    <li>onRequestClose: 这是安卓平台独有的回调函数类型的属性。当Modal 在显示时，用户按下返回键后，这个函数将被调用。在Android 平台，这个属性必须要有值，或者说开发者必须要写一个函数来处理当Modal 显示在界面时且返回键被按下时的业务逻辑。</li>
    <li>onOrientationChange: 这是ios平台独有的回调函数类型的属性。当Modal 在显示时，如果手机的放置方向改变，这个回调函数将被调用。</li>
    <li>supportedOrientations: 这是iOS 平台独有的字符串类型的属性。它的取值只能时portrait,portrait-upside-down,landscape,landscape-left,landscape-right之一。它用来声明Modal 组件支持的手机设置方向。</li>
</ul>

#### Modal组件与Navigator 组件的配合

从A界面跳转到B界面一般由Navigator 组件来完成。但是因为RN应用与网络服务器交互数据有延时，如果在交换数据时，用户又进行了一个操作，这个操作要求跳转到C界面，RN会怎么处理呢？

解决的办法之一是不让用户再进行操作。当用户执行一个操作后，将界面锁住，像用户显示等待信息，然后开始与网络服务器交换数据，直到数据交换完成并跳转到新的界面，才解锁界面，允许用户操作。

有很多方法锁住界面。最简介高效的做法是让Navigator 组件与Modal 组件配合实现。

#### Modal组件与Alert 组件

RN开发者在开发中需要注意Modal 组件与Alert API冲突的情况。当APP在显示一个Modal 组件时，不要再调用Alert API。因为Modal 组件会屏蔽掉Alert 弹出的询问框（或确认框），让用户看不到弹出询问框，更别说作出选择，而我们的业务在等待用户选择的结果，造成的结果就是应用卡死。
