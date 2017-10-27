---
layout: post
title:  "React Native 搭建开发环境"
date:   2017-10-27 10:49:42 +0800
description: "React Native 搭建开发环境"
categories: front article
---

#### 安装必须的软件

##### Homebrew

Homebrew, Mac系统的包管理器，用于安装NodeJS和一些其他必需的工具软件。

{% highlight javascript %}
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
{% endhighlight %}

译注：在Max OS X 10.11（El Capitan)版本中，homebrew在安装软件时可能会碰到/usr/local目录不可写的权限问题。可以使用下面的命令修复：

{% highlight javascript %}
sudo chown -R `whoami` /usr/local
{% endhighlight %}

##### Node

使用Homebrew来安装Node.js.

React Native需要NodeJS 4.0或更高版本。本文发布时Homebrew默认安装的是6.x版本，完全满足要求。

{% highlight javascript %}
brew install node
{% endhighlight %}

安装完node后建议设置npm镜像以加速后面的过程（或使用科学上网工具）。

{% highlight javascript %}
npm config set registry https://registry.npm.taobao.org --global
npm config set disturl https://npm.taobao.org/dist --global
{% endhighlight %}

##### React Native的命令行工具（react-native-cli）

React Native的命令行工具用于执行创建、初始化、更新项目、运行打包服务（packager）等任务。

{% highlight javascript %}
npm install -g react-native-cli
{% endhighlight %}

如果你看到EACCES: permission denied这样的权限报错，那么请参照上文的homebrew译注，修复/usr/local目录的所有权：

{% highlight javascript %}
sudo chown -R `whoami` /usr/local
{% endhighlight %}

##### Xcode

React Native目前需要Xcode 7.0 或更高版本。你可以通过App Store或是到Apple开发者官网上下载。这一步骤会同时安装Xcode IDE和Xcode的命令行工具。

虽然一般来说命令行工具都是默认安装了，但你最好还是启动Xcode，并在Xcode--Preferences--Locations菜单中检查一下是否装有某个版本的Command Line Tools。Xcode的命令行工具中也包含一些必须的工具，比如git等。

#### Android Studio

如果需要安装到Android平台的话，需要以下操作，如果是ios, 可以直接跳到推荐安装的工具或者测试安装了

React Native目前需要Android Studio2.0或更高版本。

Android Studio需要Java Development Kit [JDK] 1.8或更高版本。你可以在命令行中输入 javac -version来查看你当前安装的JDK版本。如果版本不合要求，则可以到 官网上下载。
Android Studio包含了运行和测试React Native应用所需的Android SDK和模拟器。

除非特别注明，请不要改动安装过程中的选项。比如Android Studio默认安装了 Android Support Repository，而这也是React Native必须的（否则在react-native run-android时会报appcompat-v7包找不到的错误）。

安装过程中有一些需要改动的选项：

选择Custom选项：

![android](/images/react-native/android1.png)

勾选Performance和Android Virtual Device

![android](/images/react-native/android2.png)

安装完成后，在Android Studio的启动欢迎界面中选择Configure | SDK Manager。

![android](/images/react-native/android3.png)

在SDK Platforms窗口中，选择Show Package Details，然后在Android 6.0 (Marshmallow)中勾选Google APIs、Intel x86 Atom System Image、Intel x86 Atom_64 System Image以及Google APIs Intel x86 Atom_64 System Image。

![android](/images/react-native/android4.png)

在SDK Tools窗口中，选择Show Package Details，然后在Android SDK Build Tools中勾选Android SDK Build-Tools 23.0.1。（必须是这个版本）

![android](/images/react-native/android5.png)

##### ANDROID_HOME环境变量

确保ANDROID_HOME环境变量正确地指向了你安装的Android SDK的路径。具体的做法是把下面的命令加入到~/.bash_profile文件中：(译注：~表示用户目录，即/Users/你的用户名/，而小数点开头的文件在Finder中是隐藏的，并且这个文件有可能并不存在。请在终端下使用sudo vi ~/.bash_profile命令创建或编辑。如不熟悉vi操作，请点击这里学习）

{% highlight javascript %}
//如果你不是通过Android Studio安装的sdk，则其路径可能不同，请自行确定清楚。
export ANDROID_HOME=~/Library/Android/sdk
{% endhighlight %}

然后使用下列命令使其立即生效（否则重启后才生效）：

{% highlight javascript %}
source ~/.bash_profile
{% endhighlight %}

可以使用echo $ANDROID_HOME检查此变量是否已正确设置。

#### 推荐安装的工具

##### Watchman

[Watchman](https://facebook.github.io/watchman/docs/install.html)是由Facebook提供的监视文件系统变更的工具。安装此工具可以提高开发时的性能（packager可以快速捕捉文件的变化从而实现实时刷新）。

{% highlight javascript %}
brew install watchman
{% endhighlight %}

##### Flow

[Flow](https://flow.org/)是一个静态的JS类型检查工具。译注：你在很多示例中看到的奇奇怪怪的冒号问号，以及方法参数中像类型一样的写法，都是属于这个flow工具的语法。这一语法并不属于ES标准，只是Facebook自家的代码规范。所以新手可以直接跳过（即不需要安装这一工具，也不建议去费力学习flow相关语法）。

{% highlight javascript %}
brew install flow
{% endhighlight %}

##### Nuclide

[Nuclide](https://nuclide.io/)是由Facebook提供的基于atom的集成开发环境，可用于编写、[运行](https://nuclide.io/docs/platforms/react-native/#running-applications)和 [调试](https://nuclide.io/docs/platforms/react-native/#debugging)React Native应用。

点击这里阅读[Nuclide的入门文档](https://nuclide.io/docs/quick-start/getting-started/)。

译注：我们更推荐使用[WebStorm](https://www.jetbrains.com/webstorm/)或[Sublime Text](http://www.sublimetext.com/)来编写React Native应用。

#### 测试安装

{% highlight javascript %}
react-native init AwesomeProject
cd AwesomeProject
react-native run-ios
{% endhighlight %}

你也可以在Nuclide中打开AwesomeProject文件夹 然后运行，或是双击ios/AwesomeProject.xcodeproj文件然后在Xcode中点击Run按钮。

#### 修改项目#

现在你已经成功运行了项目，我们可以开始尝试动手改一改了：

使用你喜欢的编辑器打开index.ios.js并随便改上几行。
在iOS Emulator中按下⌘-R就可以刷新APP并看到你的最新修改！
完成了！
恭喜！你已经成功运行并修改了你的第一个React Native应用。



{% highlight javascript %}
{% endhighlight %}

{% highlight javascript %}
{% endhighlight %}

{% highlight javascript %}
{% endhighlight %}
