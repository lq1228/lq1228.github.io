---
layout: post
title: GitHub Pages（Jekyll + markdown + less）
---

> 2016.5.1 后，github page 有较大的更新，以下文章不再完全适用，各为可以直接去官方配置站点查看。
[https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/)


# 用 github + jekyll 搭建个人站点

> 
在 GITHUB 上搭建个人技术站点

## github IO repositorie

首先你得有个 github 的 IO 站点，这个在 [github page](https://pages.github.com/) 里有详情的说明，我这大概的总结一下

1. 建立一个名称如 yourname.github.io 的 repositorie
2. 在项目 settings 中，生成 Github Pages
3. 系统会自动生成一个纯静态的站点目录结构，以及初始化的一些样式文件和首页
4. 把这个 repositorie clone 到本地，随便在主页上修改一些东西，push 上去你就会在 `yourname.github.io` 上看到结果了 ^0^

## 本地 jekyll 安装及设置

[jekyll](http://jekyllrb.com/)是一个非常好用在静态站点生成器，完善模板功能和丰富的插件，还支持各类文档语言。

github 对 jekyll 提供原生的支持，非常好用。

### *gem sources

天朝的网络目前无法访问默认的 gem sources，好在万能的淘宝镜像了一个，提供给大家。

执行如下命令，添加 taobao source 进去，再把第一行命令所看到的默认 sources URL 删除掉。

```
gem sources         #这里会看到一个默认的 url ，设为___url___
gem sources -a https://ruby.taobao.org
gem sources -r ___url___
```

### 安装bundle

直接

~~~
gem install bundler
~~~

### 安装jekyll (github-pages)

在本地的 github IO repositorie 里安装 jekyll Github 也给出了[详情的说明](https://help.github.com/articles/using-jekyll-with-pages/)。在此也为不愿看洋文的朋友们大致说一下步骤。

**首先要进入你之前 clone 到本地的 IO repositorie 目录里**

现在开始安装 jekyll，安装这个有两种方法，都不麻烦，大家可以选择其一。

* 在本地的 github IO 项目下新建 Gemfile 文件，添加 `gem 'github-pages'` ，然后执行 `bundle install`

* 在本地的 github IO 项目下新建 Gemfile 文件，内容如下

~~~
source 'https://ruby.taobao.org'
gem 'github-pages'
~~~

再执行 `gem install github-pages`

### jekyll 配置

在本地的 github IO 项目下新建 _config.yml 文件，内容如下：

~~~
github: {
    "version": {},
    "author": "yj1438",
    "hostname": "https://github.com/yj1438/",
    "pages_hostname": "http://yj1438.github.io/"
}
source: ./
destination: ./_site
plugins: ./_plugins
safe: true

# Conversion
#markdown: kramdown
highlighter: pygments
markdown: rdiscount
rdiscount:
   extensions:
     - footnotes
lsi: false
excerpt_separator: "\n\n\n\n"
incremental: false

# Serving
detach: false
port: 4000
host: 127.0.0.1
baseurl: "" # does not include hostname

encoding: "utf-8"
markdown_ext: markdown,mkd,mkdn,md

~~~

官方给出的默认配置与网上许多配置都会在翻译 Markdown 语法时出各种情况，
以上配置是个人尝试后给出的最靠谱配置，尤其对 Markdown 中的代码样式翻译的最好，
加上 highlight.js 和 gist.css, 所呈现出来的各类语言的样式都很优秀

### 启动 jekyll

~~~
bundle exec jekyll serve
~~~

如果没有指定端口的话，打开`127.0.0.1:4000`就可以看到你发布的站点了。

本地写完了 push 到 github 上，过几分种就可以看到和本地一模一样的结果了^_^。

## jekyll 基本使用方法

呃，，，这个可以写本书了，在此就不说了。大家可去 [jekyll 官网看](http://jekyllrb.com/)。

## less 插件使用

首先要说一下 github 下不支持自定义插件，可以在编写的时候用 less-watch 及时转译 less 文件。但在非 github page 的情况下使用 jekyll 时，有 less 的帮助还是很方便的。

这里提供一个 jekyll 官方推荐的 [less 插件](https://gist.github.com/jasongraham/639920);

一定注意，每个 LESS 文件前面必须添加空 **YAML font matter**，这样 jekyll 才能自动识别需要构建的 less 文件

~~~
---
---
~~~

别忘了安装`gem install less`
