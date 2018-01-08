---
layout: post
title:  "Node.js -- https"
date:   2018-01-12 10:49:42 +0800
description: "HTTPS 是 HTTP 基于 TLS/SSL 的版本。在 Node.js 中，它被实现为一个独立的模块。"
categories: front article
---

### https

HTTPS 是 HTTP 基于 TLS/SSL 的版本。在 Node.js 中，它被实现为一个独立的模块。

#### https.Agent 类

HTTPS 的一个类似于 http.Agent 的代理对象。查看 https.request() 获取更多信息。

#### https.Server 类

这个类是 tls.Server 的子类，跟 http.Server 一样触发事件。查看http.Server 获取更多信息。

##### server.close([callback])

<ul>
    <li> callback (Function) </li>
</ul>

详见 HTTP 模块的 server.close() 方法。

##### server.listen()

开启监听加密连接的HTTPS服务器。 方法与net.Server的server.listen()同。

##### server.setTimeout([msecs][, callback])

<ul>
    <li> msecs (number) 默认值是 120000 (2 分钟).  </li>
    <li> callback (Function) </li>
</ul>

查看 http.Server#setTimeout()。

##### server.timeout

<ul>
    <li> (number) 默认值是 120000 (2 分钟).  </li>
</ul>

查看 http.Server#timeout。

##### server.keepAliveTimeout

(number) 默认值是 5000 (5 秒钟). 查看 http.Server#keepAliveTimeout.

#### https.createServer([options][, requestListener])

<ul>
    <li> options (Object) 接受来自 tls.createServer() 和 tls.createSecureContext() 的 options .  </li>
    <li> requestListener (Function) 添加到 request 事件的监听器.  </li>
</ul>

{% highlight javascript %}
// curl -k https://localhost:8000/
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
  cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
{% endhighlight %}

或：

{% highlight javascript %}
const https = require('https');
const fs = require('fs');

const options = {
  pfx: fs.readFileSync('test/fixtures/test_cert.pfx'),
  passphrase: 'sample'
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
{% endhighlight %}

#### https.get(options[, callback])

<ul>
    <li> options (Object) | (string) | (URL) 接受与 https.request() 相同的 options, method 始终设置为 GET.  </li>
    <li> callback (Function) </li>
</ul>

类似 http.get()，但是用于 HTTPS。

参数 options 可以是一个对象、或字符串、或 URL 对象。 如果参数 options 是一个字符串, 它自动被 url.parse() 所解析。 如果它是一个URL 对象， 它会被自动转换为一个普通的 options 对象.

例子:

{% highlight javascript %}
const https = require('https');

https.get('https://encrypted.google.com/', (res) => {
  console.log('状态码：', res.statusCode);
  console.log('请求头：', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
{% endhighlight %}

#### https.globalAgent

https.Agent 的全局实例，用于所有 HTTPS 客户端请求。

#### https.request(options[, callback])


<ul>
    <li> 
		options (Object) | (string) | (URL) Accepts all options from http.request(), with some differences in default values: 
		<ol>
			<li> protocol Defaults to https: </li>
			<li> port Defaults to 443.  </li>
			<li> agent Defaults to https.globalAgent.  </li>
		</ol>
	</li>
    <li> callback (Function) </li>
</ul>

向一个安全的服务器发起一个请求。

The following additional options from tls.connect() are also accepted when using a custom Agent: pfx, key, passphrase, cert, ca, ciphers, rejectUnauthorized, secureProtocol, servername

参数 options 可以是一个对象、或字符串、或 URL 对象。 如果参数 options 是一个字符串, 它自动被 url.parse() 所解析。 If it is a URL object, it will be automatically converted to an ordinary options object.

例子:

{% highlight javascript %}
const https = require('https');

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET'
};

const req = https.request(options, (res) => {
  console.log('状态码：', res.statusCode);
  console.log('请求头：', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
{% endhighlight %}

Example using options from tls.connect():

{% highlight javascript %}
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
  cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
};
options.agent = new https.Agent(options);

const req = https.request(options, (res) => {
  // ...
});
{% endhighlight %}

也可以不对连接池使用 Agent。

例子:

{% highlight javascript %}
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
  cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem'),
  agent: false
};

const req = https.request(options, (res) => {
  // ...
});
{% endhighlight %}

Example using a URL as options:

{% highlight javascript %}
const { URL } = require('url');

const options = new URL('https://abc:xyz@example.com');

const req = https.request(options, (res) => {
  // ...
});
{% endhighlight %}
