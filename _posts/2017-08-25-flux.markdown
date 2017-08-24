---
layout: post
title:  "cropperjs的翻译和学习"
date:   2017-08-24 10:49:42 +0800
description: "这个插件，经测试，也可以用在react项目中哦~"
categories: front article
---

原文地址：[https://github.com/fengyuanchen/cropperjs](https://github.com/fengyuanchen/cropperjs)

例子：[https://fengyuanchen.github.io/cropperjs/](https://fengyuanchen.github.io/cropperjs/)

### Cropper.js

一个基于javascript的图片裁切功能的库

通过canvas实现图片裁剪，最后在通过canvas获取裁剪区域的图片base64串.

#### Features特征

<ul>
    <li>支持38个选项</li>
    <li>支持的27种方法</li> 
    <li>支持6事件</li> 
    <li>支持触摸（移动）</li> 
    <li>支持缩放</li> 
    <li>支持旋转</li> 
    <li>支持缩放（翻转）</li> 
    <li>支持多个尺寸裁剪</li> 
    <li>在canvas上获取裁剪区域图片</li> 
    <li>支持在浏览器端通过canvas生成裁剪区域图片</li> 
    <li>跨浏览器支持 </li> 
</ul>

#### Main主要

dist/

├── cropper.css       ( 5 KB)

├── cropper.min.css   ( 4 KB)

├── cropper.js        (90 KB, UMD)

├── cropper.min.js    (33 KB, UMD, compressed)

├── cropper.common.js (90 KB, CommonJS)

└── cropper.esm.js    (90 KB, ES Module)

#### Getting started 入门

##### 快速启动

四快速启动选项：
<ul>
    <li>下载最新版本。</li>
    <li>克隆库：git clone https://github.com/fengyuanchen/cropperjs.git。</li>
    <li>NPM安装: npm install cropperjs。</li>
    <li>Bower安装：bower install cropperjs。</li>
</ul>

##### 安装后，引入文件

{% highlight javascript %}
    <link  href="/path/to/cropper.css" rel="stylesheet">
    <script src="/path/to/cropper.js"></script>
{% endhighlight %}

##### Usage使用

Cropper的构造函数初始化

<ul>
    <li> Browser: window.Cropper </li>
    <li> CommonJS: var Cropper = require('cropperjs') </li>
    <li> ES2015: import Cropper from 'cropperjs' </li>
</ul>

{% highlight javascript %}
	// Wrap the image or canvas element with a block element (container)
	<div>
	  <img id="image" src="picture.jpg">
	</div>
	//Limit image width to avoid overflow the container 
	img {
	  max-width: 100%; //This rule is very important, please do not ignore this!
	}
	var image = document.getElementById('image');
	var cropper = new Cropper(image, {
	  aspectRatio: 16 / 9,
	  crop: function(e) {
		console.log(e.detail.x);
		console.log(e.detail.y);
		console.log(e.detail.width);
		console.log(e.detail.height);
		console.log(e.detail.rotate);
		console.log(e.detail.scaleX);
		console.log(e.detail.scaleY);
	  }
	});
{% endhighlight %}

##### 注意事项

<ul>
    <li>cropper的大小会从图像的父元素的大小继承，所以，一定要有一个可见的块元素包装;如果你在一个modal中使用cropper,应该在modal显示完全后，初始化cropper，否则，你不会得到一个正确的裁切区域</li>
    <li>输出的裁剪数据基于原始图像大小，所以你可以使用它们来直接裁剪图像</li>
    <li>如果你想在跨域图像上开始裁剪，请确保您的浏览器支持HTML5的CORS设置属性，你的图像服务器支持访问允许来源选项[参见HTTP访问控制CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)</li>
</ul>

##### 已知问题

<ul>
    <li>已知的IOS资源限制：由于ios设备限制内存，当你在裁剪一个大的图像的时候，浏览器可能会崩溃; 为了避免这种情况，你可以控制图片大小，最好低于1024像素</li>
    <li>已知图像尺寸的增加:当使用HTMLCanvasElement.toDataURL方法导出图像时，图像大小可能大于原始图像；建议使用cropper.getCroppedCanvas().toDataURL('image/jpeg')来导出图像</li>
</ul>

#### Options选项

<img src="/images/cropper/cropper.png" alt="cropper" />

##### viewMode(显示模式)

Type: Number

Default: 0

Options:

0: 裁剪框只能在1内移动

1: 裁剪框只能在2内移动

2: 2图片 不全部铺满1 （即缩小时可以有一边出现空隙）

3: 2图片 全部铺满1 （即 再怎么缩小也不会出现空隙）

##### dragMode(拖动模式)

Type: String

Default: 'crop'

Options:

'crop': 当鼠标点击一处时根据这个点重新生成一个裁剪框

'move': 可以拖动图片

'none': 图片就不能拖动了

##### aspectRatio(裁剪框比例,如:1：1)

Type: Number

Default: NaN

##### data

Type: Object

Default: null

如果你有以前的裁剪数据存储，将传递给SetData方法时自动建立

##### preview (裁剪选框内的图像预览)

Type: Element or String

Default: ''

一个元素或一个有效的选择器，如：document.querySelectorAll

##### Notes

最大宽度是预览容器初始宽度。

最大高度是预览容器的初始高度。

如果你设置一个分辨率选项，一定要设置相同的纵横比的预览容器。

如果预览是没有得到正确的显示，设置溢出：隐藏式的预览容器。

##### responsive (是否在窗口尺寸改变的时候重置cropper)

Type: Boolean

Default: true

##### restore (是否调整窗口大小后恢复裁剪区域)

Type: Boolean

Default: true

##### checkCrossOrigin (检查当前图像时否跨域)

Type: Boolean

Default: true

如果图像是跨域图像，当克隆这个图像的时候，一个crossorigin属性和时间戳将添加到源图像的src属性中，避免浏览器缓存错误

通过添加crossorigin属性的图像将停止添加时间戳的图像的URL,并停止加载图像

如果图像的crossorigin属性的值是“use-credentials”，然后withCredentials属性设置为true时，读取图像数据通过 XMLHttpRequest

##### checkOrientation (检查当前图像的方向的EXIF信息)

Type: Boolean

Default: true

更确切地说，读取旋转或翻转图像的方向值，然后用1（默认值）覆盖定位值，以避免iOS设备上的某些问题（1, 2）。

需要设置的可旋转和可扩展的选项真的同时。

注意：不要一直相信这一点，因为一些JPG图像有不正确的（不是标准的）定位值。

##### modal (是否在剪裁框上显示黑色的模态窗口)

Type: Boolean

Default: true

##### guides (是否在剪裁框上显示虚线)

Type: Boolean

Default: true

##### center (是否显示裁剪框 中间的+)

Type: Boolean

Default: true

##### highlight (是否在剪裁框上显示白色的模态窗口)

Type: Boolean

Default: true

##### background (是否在容器上显示网格背景。 想改背景,可以修改cropper.css样式中的 cropper-bg)

Type: Boolean

Default: true

##### autoCrop (是否允许在初始化时自动出现裁剪框)

Type: Boolean

Default: true

##### autoCropArea (默认值0.8（图片的80%）。0-1之间的数值，定义自动剪裁框的大小)

Type: Number

Default: 0.8 (80% of the image)

##### movable (是否允许移动图片)

Type: Boolean

Default: true

##### rotatable (是否允许旋转图片)

Type: Boolean

Default: true

##### scalable (是否允许扩展图片)

Type: Boolean

Default: true

##### zoomable (是否允许缩放图片)

Type: Boolean

Default: true

##### zoomOnTouch (是否允许触摸缩放图片,触摸屏上两手指操作。)

Type: Boolean

Default: true

##### zoomOnWheel (是否允许鼠标滚轴 缩放图片)

Type: Boolean

Default: true

##### wheelZoomRatio (默认0.1 表示滚轴缩放图片比例。即滚一下。图片缩放多少。如 0.1 就是图片的10%)

Type: Number

Default: 0.1

##### cropBoxMovable (是否允许拖动裁剪框)

Type: Boolean

Default: true

##### cropBoxResizable (是否允许拖动 改变裁剪框大小)

Type: Boolean

Default: true

##### toggleDragModeOnDblclick (是否允许 拖动模式 “crop” 跟“move” 的切换状态。。即当点下为crop 模式，如果未松开拖动这时就是“move”模式。放开后又为“crop”模式)

Type: Boolean

Default: true

##### minContainerWidth (容器的最小宽度)

Type: Number

Default: 200

##### minContainerHeight (容器的最小高度)

Type: Number

Default: 180

##### minCanvasWidth (canvas 的最小宽度image wrapper)

Type: Number

Default: 0

##### minCanvasHeight (canvas 的最小高度image wrapper)

Type: Number

Default: 0

##### minCropBoxWidth (裁剪区域的最小宽度)

Type: Number

Default: 0

##### minCropBoxHeight (裁剪区域的最小高度)

Type: Number

Default: 0

##### ready

Type: Function

Default: null

##### cropstart

Type: Function

Default: null

##### cropmove

Type: Function

Default: null

##### cropend

Type: Function

Default: null

##### crop

Type: Function

Default: null

##### zoom

Type: Function

Default: null

#### 方法

如果一个方法不需要返回任何值，它将返回cropper实例

{% highlight javascript %}
new Cropper(image, {
  ready: function () {
    // this.cropper[method](argument1, , argument2, ..., argumentN);
    this.cropper.move(1, -1);

    // Allows chain composition
    this.cropper.move(1, -1).rotate(45).scale(1, -1);
  }
});
{% endhighlight %}

##### crop() (手动显示裁切框)

{% highlight javascript %}
new Cropper(image, {
  autoCrop: false,
  ready: function () {
    // Do something here
    // ...

    // And then
    this.cropper.crop();
  }
});
{% endhighlight %}

##### reset() (重置图像裁切框的初始状态)

##### clear() ()

##### replace(url[, onlyColorChanged]) (替换图像的src和重建cropper)

url: Type: String

A new image url.

onlyColorChanged (optional): Type: Boolean

如果只改变颜色，没有大小，那么cropper只需要改变所有相关图像的采样率转换器，不需要重建的cropper。这可用于应用过滤器

如果不存在，其默认值为false

##### enable() (解封cropper)

##### disable() (禁用cropper)

##### destroy() (销毁cropper和从图像中删除实例)

##### move(offsetX[, offsetY])

offsetX:

Type: Number

Moving size (px) in the horizontal direction.

offsetY (optional):

Type: Number

Moving size (px) in the vertical direction.

If not present, its default value is offsetX.

{% highlight javascript %}
//Move the canvas (image wrapper) with relative offsets.
cropper.move(1);
cropper.move(1, 0);
cropper.move(0, -1);
{% endhighlight %}

##### moveTo(x[, y])

x:

Type: Number

The left value of the canvas

y (optional):

Type: Number

The top value of the canvas

If not present, its default value is x.

Move the canvas (image wrapper) to an absolute point.

##### zoom(ratio) (缩放画布（image wrapper）与相对比例)

ratio:

Type: Number

Zoom in: requires a positive number (ratio > 0)

Zoom out: requires a negative number (ratio < 0)

Zoom the canvas (image wrapper) with a relative ratio.

{% highlight javascript %}
cropper.zoom(0.1);
cropper.zoom(-0.1);
{% endhighlight %}

##### zoomTo(ratio) (缩放画布（image wrapper）到绝对比)

ratio: 

Type: Number

{% highlight javascript %}
cropper.zoomTo(1); // 1:1 (canvasData.width === canvasData.naturalWidth)
{% endhighlight %}

##### rotate(degree)

degree:

Type: Number

Rotate right: requires a positive number (degree > 0)

Rotate left: requires a negative number (degree < 0)

{% highlight javascript %}
cropper.rotate(90);
cropper.rotate(-90);
{% endhighlight %}

##### rotateTo(degree) (图像旋转到绝对的程度)

degree:

Type: Number

##### scale(scaleX[, scaleY])

scaleX:

Type: Number

Default: 1

当它不等于1的时候，缩放因子来对图像的横坐标的应用

scaleY (optional):

Type: Number

缩放因子为纵坐标的图像应用,如果不存在，其默认值是scaleX

{% highlight javascript %}
//Scale the image.
//Requires CSS3 2D Transforms support (IE 9+).
cropper.scale(-1); // Flip both horizontal and vertical
cropper.scale(-1, 1); // Flip horizontal
cropper.scale(1, -1); // Flip vertical
{% endhighlight %}

##### scaleX(scaleX) (尺度图像的横坐标)

scaleX:

Type: Number

Default: 1

当它不等于1的时候，缩放因子来对图像的横坐标的应用

##### scaleY(scaleY) (尺度图像的纵坐标)

scaleY:

Type: Number

Default: 1

当它不等于1的时候，缩放因子来对图像的纵坐标的应用

##### getData([rounded]) (输出最终的裁剪区域的位置和大小的数据（基于原始图像的自然大小）)

rounded (optional):

Type: Boolean

Default: false

Set true to get rounded values.
(return value):

Type: Object

Properties:

x: the offset left of the cropped area

y: the offset top of the cropped area

width: the width of the cropped area

height: the height of the cropped area

rotate: the rotated degrees of the image

scaleX: the scaling factor to apply on the abscissa of the image

scaleY: the scaling factor to apply on the ordinate of the image

<img src="/images/cropper/getData.jpg" alt="cropper" />

##### setData(data) (改变裁剪区域的位置和大小的新数据)

data:

Type: Object

Properties: See the getData method.

You may need to round the data properties before pass it in.

##### getContainerData() (输出尺寸数据)

(return value):

Type: Object

Properties:

width: the current width of the container

height: the current height of the container

<img src="/images/cropper/getContainerData.jpg" alt="cropper" />

##### getImageData() (输出图像的位置，大小和其他数据)

(return value):

Type: Object

Properties:

left: the offset left of the image

top: the offset top of the image

width: the width of the image

height: the height of the image

naturalWidth: the natural width of the image

naturalHeight: the natural height of the image

aspectRatio: the aspect ratio of the image

rotate: the rotated degrees of the image if rotated

scaleX: the scaling factor to apply on the abscissa of the image if scaled

scaleY: the scaling factor to apply on the ordinate of the image if scaled

##### getCanvasData() ( 输出画布（image wrapper）的位置和大小的数据)

(return value):

Type: Object

Properties:

left: the offset left of the canvas

top: the offset top of the canvas

width: the width of the canvas

height: the height of the canvas

naturalWidth: the natural width of the canvas (read only)

naturalHeight: the natural height of the canvas (read only)

{% highlight javascript %}
var imageData = cropper.getImageData();
var canvasData = cropper.getCanvasData();

if (imageData.rotate % 180 === 0) {
  console.log(canvasData.naturalWidth === imageData.naturalWidth); // true
}
{% endhighlight %}

##### setCanvasData(data) (改变画布（image wrapper）的位置和新的数据大小)

data:

Type: Object

Properties:

left: the new offset left of the canvas

top: the new offset top of the canvas

width: the new width of the canvas

height: the new height of the canvas

##### getCropBoxData() (输出裁剪框的位置和大小的数据)

(return value):

Type: Object

Properties:

left: the offset left of the crop box

top: the offset top of the crop box

width: the width of the crop box

height: the height of the crop box

##### setCropBoxData(data) (改变裁剪框的位置和新的数据的大小)

data:

Type: Object

Properties:

left: the new offset left of the crop box

top: the new offset top of the crop box

width: the new width of the crop box

height: the new height of the crop box

##### getCroppedCanvas([options]) (返回画布上绘制的裁切图像)

options (optional):

Type: Object

Properties:

width: the destination width of the output canvas

height: the destination height of the output canvas

fillColor: a color to fill any alpha values in the output canvas

imageSmoothingEnabled: set to change if images are smoothed (true, default) or not (false)

imageSmoothingQuality: set the quality of image smoothing, one of "low", "medium", or "high"

(return value):

Type: HTMLCanvasElement

A canvas drawn the cropped image.

注意事项：

输出的canvas的纵横比将安装到裁切框的长宽比自动。

如果你想得到一个JPEG图像输出的画布，你应该设置的设置选项，如果没有，在JPEG图像的透明部分，默认情况下会变黑。

浏览器支持情况：

Basic image: requires Canvas support (IE 9+).

Rotated image: requires CSS3 2D Transforms support (IE 9+).

Cross-origin image: requires HTML5 CORS settings attributes support (IE 11+).

{% highlight javascript %}
cropper.getCroppedCanvas();

cropper.getCroppedCanvas({
  width: 160,
  height: 90,
  fillColor: '#fff',
  imageSmoothingEnabled: false,
  imageSmoothingQuality: 'high',
});

// Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`
cropper.getCroppedCanvas().toBlob(function (blob) {
  var formData = new FormData();

  formData.append('croppedImage', blob);

  // Use `jQuery.ajax` method
  $.ajax('/path/to/upload', {
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function () {
      console.log('Upload success');
    },
    error: function () {
      console.log('Upload error');
    }
  });
});
{% endhighlight %}

##### setAspectRatio(aspectRatio) (改变裁剪框的纵横比)

aspectRatio:

Type: Number

Requires a positive number.

##### setDragMode([mode]) (改变拖动模式)

mode (optional):

Type: String

Default: 'none'

Options: 'none', 'crop', 'move'

你可以通过双击cropper切换crop和move模式

#### Events事件

##### ready

这个事件当目标图像已加载并准备生成实例

{% highlight javascript %}
var cropper;

image.addEventListener('ready', function () {
  console.log(this.cropper === cropper);
  // -> true
});

cropper = new Cropper(image);
{% endhighlight %}

##### cropstart (这个事件，当canvas（image wrapper）或裁切框开始变化)

event.detail.originalEvent:

Type: Event

Options: mousedown, touchstart and pointerdown

event.detail.action:

Type: String

Options:

'crop': create a new crop box

'move': move the canvas (image wrapper)

'zoom': zoom in / out the canvas (image wrapper) by touch.

'e': resize the east side of the crop box

'w': resize the west side of the crop box

's': resize the south side of the crop box

'n': resize the north side of the crop box

'se': resize the southeast side of the crop box

'sw': resize the southwest side of the crop box

'ne': resize the northeast side of the crop box

'nw': resize the northwest side of the crop box

'all': move the crop box (all directions)

{% highlight javascript %}
image.addEventListener('cropstart', function (e) {
  console.log(e.detail.originalEvent);
  console.log(e.detail.action);
});
{% endhighlight %}

##### cropmove (这个事件当画布（image wrapper）或裁切框的变化)

event.detail.originalEvent:

Type: Event

Options: mousemove, touchmove and pointermove.

event.detail.action: the same as "cropstart".

##### cropend (这个事件当画布（image wrapper）或裁切框停止改变)

event.detail.originalEvent:

Type: Event

Options: mouseup, touchend, touchcancel, pointerup and pointercancel.

event.detail.action: the same as "cropstart".

##### crop (当画布有改变时触发)

event.detail.x

event.detail.y

event.detail.width

event.detail.height

event.detail.rotate

event.detail.scaleX

event.detail.scaleY

##### zoom (这一事件触发时，马上启动实例来放大或缩小画布)

event.detail.originalEvent:

Type: Event

Options: wheel, touchmove.

event.detail.oldRatio:

Type: Number

The old (current) ratio of the canvas

event.detail.ratio:

Type: Number

The new (next) ratio of the canvas (canvasData.width / canvasData.naturalWidth)

{% highlight javascript %}
image.addEventListener('zoom', function (e) {

  // Zoom in
  if (e.detail.ratio > e.detail.oldRatio) {
    e.preventDefault(); // Prevent zoom in
  }

  // Zoom out
  // ...
});
{% endhighlight %}

#### 浏览器支持
<ul>
	<li>Chrome (latest)</li>
	<li>Firefox (latest)</li> 
	<li>Safari (latest)</li> 
	<li>Opera (latest)</li> 
	<li>Edge (latest)</li> 
	<li> Internet Explorer 9+</li> 
</ul>
