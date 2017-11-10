---
layout: post
title:  "React Native Image组件"
date:   2017-11-10 10:49:42 +0800
description: "React Native 可以从给定的网址、给定的本地文件或者项目的资源文件中加载图片"
categories: front article
---

RN默认支持JPG 和 PNG格式的图片。IOS平台还支持GIF 和 WebP格式，Android不支持这两种格式, 可以通过修改Android工程配置让Android平台也支持。

{% highlight javascript %}
dependencies {
    compile: 'com.facebook.fresco:animated-gif:0.11.0' //需要GIF动画支持请添加本行语句
    compile: 'com.facebook.fresco:webpsupport:0.11.0'  //需要Webp格式支持请添加本行语句
    compile: 'com.facebook.fresco:animated-webp:0.11.0'//需要Webp动画支持请添加本行语句
}
{% endhighlight %}

React Native 自身不支持SVG图片，变通的办法是在React Native的WebView组件中载入SVG图片，或者使用其他支持SVG图片的RN插件。

#### 加载网络图片

{% highlight javascript %}
var imageAddress = 'https://facebook.github.io/react/img/logo_og.png';
return (
    <View>
        <Image source={{uri: imageAddress}} />
    </View>
);
{% endhighlight %}

有些http或者https服务器可能需要一些认证信息才能返回图片。为了满足这个需求，开发者可以在source中放入这些信息.

{% highlight javascript %}
var imageAddress = {
    uri: 'https://facebook.github.io/react/img/logo_og.png',
    header: {
        Authorization1: 'someAuthToken',
        Authorization2: 'someAuthToken',
    }
};
return (
    <View>
        <Image source={imageAddress} />
    </View>
);
{% endhighlight %}

Header中的健值对可以是任意数量，它们都可以放在获取图片的HTTP或者HTTPS消息头中。

Image组件的静态函数getSize可以取得指定URI地址图片的宽和高

{% highlight javascript %}
componentDidMount: function () {
    const imageAddress = {
        uri: 'https://facebook.github.io/react/img/logo_og.png'
    };
    Image.getSize(imageAddress).then(
        (width, height) => {
            ...   //正确取到宽和高，进行相应处理
        }
    ).catch (
        (error) => {
            console.log(error); //取宽，高出错
        }
    );
}
{% endhighlight %}

调用getSize函数取图片的宽，高，React Native实际上会去下载图片，并把图放入缓存中，所以getSize函数可以作为预加载图片资源的一个方法。

开发者可以使用Image 组件的静态函数prefetch来预下载某张网络图片。代码如下：

{% highlight javascript %}
componentWillMount() {
    const imageAddress = {
        uri: 'https://facebook.github.io/react/img/logo_og.png'
    };
    Image.prefetch(imageAddress).then(
        (result) => {
            ...   //当预下载成功时，返回值是true，不需要做任何处理
        }
    ).catch (
        (error) => {
            console.log(error); //取宽，高出错
        }
    );
    this.image1 = require('./girl.jpg');
}
{% endhighlight %}

#### 加载静态图片资源

{% highlight javascript %}
<View>
    <Image source={require('./image/redicon.png')} />
</View>
{% endhighlight %}

上述代码中,require等同于使用了var 声明了变量，因为var的变量提升效应，等同于在代码顶部预先加载了图片

{% highlight javascript %}
var imageName = './image/redicon.png';
<View>
    <Image source={require({imageName})} />
</View>
{% endhighlight %}

在React Native开发中，不允许使用字符串变量来指定需要预先加载的图片名称。因为React Native在编译代码时处理所有的require声明，还不是在运行时动态的处理，所以不能动态加载图片。

#### 加载资源文件中的图片

React Native可以加载Android项目或者ios项目中的图片资源文件。

下面代码加载了每个ios工程都会有的资源图片。

{% highlight javascript %}
let nativeImageSource = require('nativeImageSource'); //导入nativeImageSource函数
export default class LearnRN extends Component {
    render () {
        let ades = {
            ios: 'story-background',
            width: 60,
            height: 60
        };
        return (
            <View>
                <Image source={nativeImageSource(ades)} />
            </View>
        );
    }
}
{% endhighlight %}

使用nativeImageSource函数时导入资源文件中的图片的关键。它的js文件路径是当前项目目录\node_moudles\react-native\Libraries\Image\nativeImageSource.js.

如果是Android平台，将render函数中的ades变量改为：

{% highlight javascript %}
let ades = {
    android: 'android_search_white',
    width: 96,
    height:96
};
{% endhighlight %}

开发者将代码示例中的图片资源名称改为自己需要的图片资源名称，就可以显示相应的图片。

React Native在加载资源文件中的图片时，使用的是不检查机制。也就是说，在编译代码时不会检查资源图片是否真的存在，有可能发生在代码运行到需要取资源文件中的图片时，才发现图片不存在的情况，代码容易出错。需要特别注意这点。

#### 动态加载手机中的图片资源

React Native 可以用CameraRoll API读取手机中存储的图片资源，还支持加载以Base64编码格式存储的图片。

#### Image 组件的样式

Image组件必须在样式中声明图片的宽和高。如果没有声明，则图片不会被呈现在界面上。

##### 样式属性

<ul>
    <li>resizeMode, 取值：contain, cover(默认值), stretch, center, repeat(只对ios有效)</li>
    <li>backgroundColor</li>
    <li>borderWidth</li>
    <li>overflow</li>
    <li>opacity</li>
    <li>borderRadius</li>
    <li>tintColor(ios专有属性)</li>
    <li>overlayColor(Android专有属性)</li>
</ul>

#### Image 组件显示特征

Image组件宽高都小于所需宽高，大于所需宽高，或者其中宽或高分别试一下resizeMode, 取值：contain, cover(默认值), stretch, center，这几个值显示的效果。

#### Image 组件的其他属性

<ul>
    <li>onLoadStart</li>
    <li>onLoadEnd</li>
    <li>onLoad</li>
    <li>onError</li>
</ul>

onLoadStart, onLoadEnd, onLoad这三个回调函数都会有一个event参数，但参数中只有一个event.timeStamp对开发者有用，它记录了事件发生的时间。

onLayout函数在Image组件也是可以调用的，同View组件。

#### Image 组件的缓存

##### Android平台

在Android平台，这意味着移动应用与移动应用服务器采用了以图形文件名为同步标志的图片缓存机制。当图形文件名不变时，移动应用只读取一次图形文件，缓存在本地，以后一直使用这个缓存，不管服务器该文件是否发生改变。

##### ios平台

在ios平台，RN框架要求移动应用服务器在返回图片时，必须在HTTPS响应的HTTP头中，有Cache-Control这个头，对应的值形如：max-age=36000000(以秒为单位，这个值代表一万小时后超时)。RN框架将使用这个最大有效期来进行图片缓存操作。

如果HTTPS中没有这个HTTP头，则没有缓存机制。

如果使用HTTP协议获取图片，也没有缓存机制。

{% highlight javascript %}
<Image source={{
    uri: '****',
    cache: 'only-if-cached' //指定图片缓存策略
}} />
{% endhighlight %}

cache键的取值：only-if-cached, default, reload, force-cache, 这4个键值的作用与它们的英文名字相同。

#### 尽量使用网络图片

1. 使用网络图片，可以使RN的热更新的包的体积大大减小，加快更新速度；

2. RN的图片缓存机制，让使用网络图片与使用本地图片仅在第一次加载时有速度区别。所以应用尽量使用网络图片。
