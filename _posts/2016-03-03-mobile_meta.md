---
layout: post
title: 移动端 meta 整理
---

# 移动端 meta 整理

平常写移动端的页面很多，经常会遇到一些兼容性问题，在常规找寻解决方法的同时，有些问题可以直接用 meta 给解决掉，以下整理了用过的一些 meta 标签和其解释：

~~~html
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /><!-- 默认使用最新浏览器 -->
    <meta http-equiv="Cache-Control" content="no-siteapp" /><!-- 不被网页(加速)转码 -->
    <meta name="robots" content="index,follow"/> <!-- 搜索引擎抓取 -->
    <meta name="renderer" content="webkit" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui" />
    <meta name="apple-mobile-web-app-capable" content="yes" /><!-- 删除苹果默认的工具栏和菜单栏 -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /><!-- 设置苹果工具栏颜色 -->
    <meta name="apple-mobile-web-app-title" content="数胎动" /><!-- 添加到主屏后的标题（iOS 6 新增） -->
    <meta name="apple-touch-fullscreen" content="yes" />
    <meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL">
    
    <meta name="msapplication-TileColor" content="#000"/> <!-- Windows 8 磁贴颜色 -->
    <meta name="msapplication-TileImage" content="icon.png"/> <!-- Windows 8 磁贴图标 -->
    
    <meta name="screen-orientation" content="portrait" /><!-- uc强制竖屏 -->
    <meta name="full-screen" content="yes" /><!-- UC强制全屏 -->
    <meta name="browsermode" content="application" /><!-- UC应用模式 -->
    <meta name="x5-orientation" content="portrait" /><!-- QQ强制竖屏 -->
    <meta name="x5-fullscreen" content="true" /><!-- QQ强制全屏 -->
    <meta name="x5-page-mode" content="app" /><!-- QQ应用模式 -->
    <meta name="format-detection" content="telephone=no, address=no, email=no" /><!-- 忽略页面中的数字识别\email识别\地址识别 -->
    <link rel="shortcut icon" type="image/ico" href="/favicon.ico"/>
    <title>移动端示例</title>
    <!-- css -->
    <link type="text/css" rel="stylesheet" href="css/normal.css">
</head>
<body>
    <div class="mask"><div class="loader"></div></div>
    <section class="page out">
        
    </section>
</body>
</html>
~~~