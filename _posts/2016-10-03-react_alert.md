---
layout: post
title: react 实现全局 alert
---

# react 实现全局 alert

react 已经用了有一段时间了，和之前用过的几个前端框架相比，对我来说，总体上更贴合个人的思维习惯。

但是，总有几个点还是不太顺心。比如层层传输的单向数据流(这个已经由 redux 完美解决)，还是就是今天要说的这个弹框插件也算是其中之一。

## 背景

早前常规页面开发中，肯定会遇到很多的弹框提示。当然，为了用其来方便，本人都是将其写成一个小插件，用的时候直接 `Dialog.alert('这是一个提示')` 这样就 OK，
不用在页面添加 HTML 代码(当然是由 JS 动态写入和消除啦)，引入 JS 后随手就用，非常方便。

但在 react 里，不能再像上述 JS 插件一样，实时的在页面时写入一个弹框 DOM ，即使可以，这也违背了 react 的初衷。

网上找了些 react 的弹出框，比如 `react-modal` 、`react-alert` 之类，都是弹出框的组件，需要的时候都要是写自身 component 里，
不能共用。非常不爽。

## 实现方式

实际上要实现一个全局的 alert 也很简单，写一个自定义的顶级 component ，实现如下功能：

1. 包含一个 alert 的完整 html 和 功能；
2. 有一个 alert(msg) 方法，功能是显示这个 alert 信息；
3. 通过 `React.cloneElement` 将 alert 方法合并入这个 component 的所有子 component。

这样的话，被此 component 包裹的所有子 component 都会在 `props` 中“继承”这个 `alert` 方法。
用的时候直接调用就行。

## 简单示例

`BaseComponent.jsx`

~~~javascript
    import React, {Component} from 'react';

    import Modal from 'react-modal';

    class DialogFrame extends Component {
        constructor(props) {
            super(props);
            this.state = {
                openDialog: false,
                alertMsg: null
            };
        }

        _alert(msg) {
            this.setState({
                openDialog: true,
                alertMsg: msg
            });
        }

        _alertClose() {
            this.setState({
                openDialog: false,
                alertMsg: ''
            });
        }

        render() {
            return (
                <div>
                    {
                        /*
                        * 一个子元素是 [object Object]
                        * 多个子元素晨 [object Array]
                        */
                        Object.prototype.toString.apply(this.props.children) === '[object Array]' ? 
                            this.props.children.map((ele, index) => {
                                return React.cloneElement(ele, {key: index, alert: this._alert.bind(this)})
                            }) : 
                            React.cloneElement(this.props.children, {alert: this._alert.bind(this)})
                    }
                    <Modal
                        isOpen={this.state.openDialog}
                        className="modal-cont"
                        shouldCloseOnOverlayClick={false}
                        overlayClassName="modal-overlay before"
                        >
                        <h1 className="title">提示</h1>
                        <div className="cont">
                            <p>{this.state.alertMsg}</p>
                            <p className="btn" onClick={this._alertClose.bind(this)}><span className="ok">确定</span></p>
                        </div>
                    </Modal>
                </div>
            );
        }
    }

    export default DialogFrame;
~~~

`ChildComponent.jsx`

~~~javascript

    <DialogFrame>
        <Header />
        <Content />
    </DialogFrame>

~~~