---
layout: post
title:  "UEditor上传图片问题"
date:   2017-1-5 10:49:42 +0800
description: ""
categories: front article
---

### 问题

我厂在做一个后台需求的时候选用了[UEditor](http://ueditor.baidu.com/website/)富文本编辑器，近期运维同事为了安全起见，对上传图片的域名做了限制，只允许upload的域名做上传操作,故出现上传图片失败的问题。

### 思考 
那就修改成upload域名吧！然，UEditor是一个多页面都在调用的组件，不能修改全局的配置，会影响到其他调用该控件的页面，后果不好估量。只能考虑[单独修改该页面的请求接口](http://fex.baidu.com/ueditor/#qa-customurl)，由于所有ueditor请求都通过editor对象的getActionUrl方法获取请求地址，可以直接通过复写这个方法实现。

{% highlight javascript %}
UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
UE.Editor.prototype.getActionUrl = function(action) {
    if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage') {
        return 'http://upload.*.com/controller.php';
    } else if (action == 'uploadvideo') {
        return 'http://upload.*.com/video.php';
    } else {
        return this._bkGetActionUrl.call(this, action);
    }
}
{% endhighlight %}

### 单图上传问题

上面的代码生效后，跨域问题跟着就来了，单图上传暂时不支持跨域设置，为了兼容低版本浏览器，使用了提交表单到iframe提交。通过iframe的onload事件，触发回调函数，这时候再读取iframe里面的内容，得到的服务器返回数据。 跨域情况下，产生了跨域的iframe访问，可以解决方法都需要前后端一起改变。要解决这个问题，百度还未给出解决方案。（此刻，心中已是万马奔腾，淡定淡定～～）

### 多图方案

“楠神”说了用多图上传吧，多图不是用的iframe。[UEditor 的 dialogs 主要使用webuploader做上传请求](http://fex.baidu.com/ueditor/#dev-crossdomain)。默认情况下，使用webuploader时，如果浏览器支持html5上传，会使用html5的形式上传，否则使用flash上传。

果然，查看了该控件的配置文件，在‘ueditor/1.4.3/dialogs/image/image.js’这个文件中已经配置了多图上传域名‘upload.*.com’，看来前人已经踩过这些坑了，路已铺好。

{% highlight javascript %}
uploader.on('all', function (type, files) {
    switch (type) {
        case 'uploadFinished':
	    setState('confirm', files);
	    break;
        case 'startUpload':
	    /* 添加额外的GET参数 */
	    var params = utils.serializeParam(editor.queryCommandValue('serverparam')) || '',
	        url = utils.formatUrl(actionUrl + (actionUrl.indexOf('?') == -1 ? '?':'&') + 'encode=utf-8&' + params);
	    if (!/baidu\-test|\.test\./.test(location.host)) {
	        url = 'http://upload.*.com' + url; 
	        uploader.option('withCredentials', true);
	    }    
	    uploader.option('server', url);
	    setState('uploading', files);
	    break;
        case 'stopUpload':
	    setState('paused', files);
	    break;
    }    
});  
{% endhighlight %}

接下来，只需要解决一下跨域问题，就ok啦～～～

跨域情况下，假如不做任何修改，使用html5上传，会有一个提示：

![跨域提示](/images/ueditor-uploadimg/error.png)

这个时候需要在后端设置允许跨域的header，php设置方式如下：

{% highlight javascript %}
header("Access-Control-Allow-Origin: http://a.com"); // 允许a.com发起的跨域请求
//如果需要设置允许所有域名发起的跨域请求，可以使用通配符 *
header("Access-Control-Allow-Origin: *"); // 允许任意域名发起的跨域请求
{% endhighlight %}

做了以上的修改之后，有一些请求还是会出错，例如下面这种，某些header属性不支持跨域：

![跨域提示](/images/ueditor-uploadimg/error2.png)

解决这个错误，需要在后端设置允许跨域的header属性，php设置方式如下：

{% highlight javascript %}
header('Access-Control-Allow-Headers: X-Requested-With,X_Requested_With'); //多个值用逗号隔开
{% endhighlight %}

至此，ueditor上传图片问题就解决啦，可以回家看娃啦～
