---
layout: post
title:  "面向对象的七大基本原则-里氏代换原则LSP"
date:   2017-1-20 10:49:42 +0800
description: "里氏代换原则是实现抽象化的一种规范,是使代码符合开闭原则的一个重要保证"
categories: front article
---

### 什么是里氏代换原则 

里氏代换原则是由麻省理工学院（MIT）计算机科学实验室的Liskov女士，在1987年的OOPSLA大会上发表的一篇文章《Data Abstraction and Hierarchy》里面提出来的，主要阐述了有关继承的一些原则，也就是什么时候应该使用继承，什么时候不应该使用继承，以及其中的蕴涵的原理。2002年，软件工程大师Robert C. Martin，出版了一本《Agile Software Development Principles Patterns and Practices》，在文中他把里氏代换原则最终简化为一句话：“Subtypes must be substitutable for their base types”。也就是，子类必须能够替换成它们的基类。

![里氏替换原则](/images/Basic-principle/lsp.jpg)

1. 里氏替换原则通俗讲就是：子类可以扩展父类的功能，但不能改变父类原有的功能。

2. 里氏替换原则告诉我们：由于使用父类对象的地方都可以使用子类对象，因此在程序中尽量使用父类类型来对对象进行定义，而在运行时再确定其子类类型，用子类对象来替换父类对象。

3. 里氏替换原则是实现开闭原则的重要方式之一：实现开闭原则的关键步骤是抽象化，基类与子类之间的继承关系就是一种抽象化的体现。里氏代换原则是实现抽象化的一种规范。违反里氏代换原则意味着违反了开闭原则，反之未必。里氏代换原则是使代码符合开闭原则的一个重要保证。




