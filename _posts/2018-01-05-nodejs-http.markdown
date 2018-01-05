---
layout: post
title:  "Node.js -- http"
date:   2018-01-04 10:49:42 +0800
description: "要使用 HTTP 服务器与客户端，需要 require('http')。"
categories: front article
---

### http

要使用 HTTP 服务器与客户端，需要 require('http')。

Node.js 中的 HTTP 接口被设计成支持协议的许多特性。 比如，大块编码的消息。 这些接口不缓冲完整的请求或响应，用户能够以流的形式处理数据。

HTTP 消息头由一个对象表示，例如：

{% highlight javascript %}
{ 
  'content-length': '123',
  'content-type': 'text/plain',
  'connection': 'keep-alive',
  'host': 'mysite.com',
  'accept': '*/*'
}
{% endhighlight %}

为了支持各种可能的 HTTP 应用，Node.js 的 HTTP API 是非常底层的。 它只涉及流处理与消息解析。 它把一个消息解析成消息头和消息主体，但不解析具体的消息头或消息主体。

查看 message.headers 了解如何处理重复的消息头。

接收到的原始消息头保存在 rawHeaders 属性中，它是一个 [key, value, key2, value2, ...] 数组。 例如，上面的消息头对象有一个类似以下的 rawHeaders 列表：

{% highlight javascript %}
[ 
  'ConTent-Length', '123456',
  'content-LENGTH', '123',
  'content-type', 'text/plain',
  'CONNECTION', 'keep-alive',
  'Host', 'mysite.com',
  'accepT', '*/*' 
]
{% endhighlight %}

#### http.Agent 类

Agent 负责为 HTTP 客户端管理连接的持续与复用。 它为一个给定的主机与端口维护着一个等待请求的队列，且为每个请求重复使用一个单一的 socket 连接直到队列为空，此时 socket 会被销毁或被放入一个连接池中，在连接池中等待被有着相同主机与端口的请求再次使用。 是否被销毁或被放入连接池取决于 keepAlive 选项。

连接池中的连接的 TCP Keep-Alive 是开启的，但服务器仍然可能关闭闲置的连接，在这种情况下，这些连接会被移出连接池，且当一个新的 HTTP 请求被创建时再为指定的主机与端口创建一个新的连接。 服务器也可能拒绝允许同一连接上有多个请求，在这种情况下，连接会为每个请求重新创建，且不能被放入连接池。 Agent 仍然会创建请求到服务器，但每个请求会出现在一个新的连接。

但一个连接被客户端或服务器关闭时，它会被移出连接池。 连接池中任何未被使用的 socket 会被释放，从而使 Node.js 进程在没有请求时不用保持运行。 （查看 socket.unref()）。

当 Agent 实例不再被使用时，建议 destroy() 它，因为未被使用的 socket 也会消耗操作系统资源。

当 socket 触发 'close' 事件或 'agentRemove' 事件时，它会被移出代理。 当打算长时间保持打开一个 HTTP 请求且不想它留在代理中，则可以如下处理：

{% highlight javascript %}
http.get(options, (res) => {
  // 处理事情
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
{% endhighlight %}

代理也可被用于单独的请求。 使用 {agent: false} 作为 http.get() 函数或 http.request() 函数的选项，则会为客户端连接创建一个默认配置的一次性使用的 Agent。

{% highlight javascript %}
agent:false:

http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false  // 创建一个新的代理，只用于本次请求
}, (res) => {
  // 对响应进行处理
});
{% endhighlight %}

##### new Agent([options])

options (Object) 代理的配置选项。有以下字段：

<ul>
	<li> keepAlive (boolean) 保持 socket 可用即使没有请求，以便它们可被将来的请求使用而无需重新建立一个 TCP 连接。默认为 false。 </li>
	<li> keepAliveMsecs (number) 当使用了 keepAlive 选项时，该选项指定 TCP Keep-Alive 数据包的 初始延迟。 当 keepAlive 选项为 false 或 undefined 时，该选项无效。 默认为 1000。 </li>
	<li> maxSockets (number) 每个主机允许的最大 socket 数量。 默认为 Infinity。 </li>
	<li> maxFreeSockets (number) 在空闲状态下允许打开的最大 socket 数量。 仅当 keepAlive 为 true 时才有效。 默认为 256。 </li>
</ul>

http.request() 使用的默认 http.globalAgent 的选项均为各自的默认值。

若要配置其中任何一个，则需要创建自定义的 http.Agent 实例。

{% highlight javascript %}
const http = require('http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
{% endhighlight %}

##### agent.createConnection(options[, callback])

<ul>
    <li> options (Object) 包含连接详情的选项。查看 net.createConnection() 了解选项的格式。 </li>
    <li> callback (Function) 接收被创建的 socket 的回调函数。 </li>
    <li> 返回: (net.Socket) </li>
</ul>

创建一个用于 HTTP 请求的 socket 或流。

默认情况下，该函数类似于 net.createConnection()。 但是如果期望更大的灵活性，自定义的代理可以重写该方法。

socket 或流可以通过以下两种方式获取：从该函数返回，或传入 callback。

callback 有 (err, stream) 参数。

##### agent.keepSocketAlive(socket)

<ul>
	<li>socket (net.Socket)</li>
</ul>

在 socket 被请求分离的时候调用, 可能被代理持续使用. 默认行为: 

{% highlight javascript %}
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
{% endhighlight %}

这个方法可以被一个特定的 Agent 子类重写. 如果这个方法返回假值, socket 会被销毁而不是 在下一次请求时持续使用. 

##### agent.reuseSocket(socket, request)

<ul>
    <li> socket (net.Socket) </li>
    <li> request (http.ClientRequest) </li>
</ul>

由于 keep-alive 选项被保持持久化, 在 socket 附加到 request 时调用. 默认行为是:

socket.ref();

这个方法可以被一个特定的 Agent 子类重写.

##### agent.destroy()

销毁当前正被代理使用的任何 socket。

通常不需要这么做。 但是如果使用的代理启用了 keepAlive，则当确定它不再被使用时，最好显式地关闭代理。 否则，在服务器终止它们之前，socket 可能还会长时间保持打开。

##### agent.freeSockets

<ul>
    <li> (Object) </li>
</ul>

返回一个对象，包含当前正在等待被启用了 keepAlive 的代理使用的 socket 数组。 不要修改该属性。

##### agent.getName(options)

options 

<ul>
    <li> (Object) 为名称生成程序提供信息的选项。 </li>
    <li> host (string) 请求发送至的服务器的域名或 IP 地址。 </li>
    <li> port (number) 远程服务器的端口。 </li>
    <li> localAddress (string) 当发送请求时，为网络连接绑定的本地接口。 </li>
</ul>

返回: (string)

为请求选项的集合获取一个唯一的名称，用来判断一个连接是否可以被复用。 对于 HTTP 代理，返回 host:port:localAddress 或 host:port:localAddress:family。 对于 HTTPS 代理，名称会包含 CA、证书、密码、以及其他 HTTPS/TLS 特有的用于判断 socket 复用性的选项。

##### agent.maxFreeSockets

(number)

默认为 256。 对于已启用 keepAlive 的代理，该属性可设置要保留的空闲 socket 的最大数量。

##### agent.maxSockets

(number)

默认为不限制。 该属性可设置代理为每个来源打开的并发 socket 的最大数量。 来源是 agent.getName() 的返回值。

##### agent.requests

(Object)

返回一个对象，包含还未被分配到 socket 的请求队列。 不要修改。

##### agent.sockets

(Object)

返回一个对象，包含当前正被代理使用的 socket 数组。 不要修改。

#### http.ClientRequest 类

该对象在 http.request() 内部被创建并返回。 它表示着一个正在处理的请求，其请求头已进入队列。 请求头仍可使用 setHeader(name, value)、getHeader(name) 和 removeHeader(name) API 进行修改。 实际的请求头会与第一个数据块一起发送或当调用 request.end() 时发送。

要获取响应，需为 'response' 事件添加一个监听器到请求对象上。 当响应头被接收到时，'response' 事件会从请求对象上被触发 。 'response' 事件被执行时带有一个参数，该参数是一个 http.IncomingMessage 实例。

在 'response' 事件期间，可以添加监听器到响应对象上，比如监听 'data' 事件。

如果没有添加 'response' 事件处理函数，则响应会被整个丢弃。 如果添加了 'response' 事件处理函数，则必须消耗完响应对象的数据，可通过调用 response.read()、或添加一个 'data' 事件处理函数、或调用 .resume() 方法。 数据被消耗完时会触发 'end' 事件。 在数据被读取完之前会消耗内存，可能会造成 'process out of memory' 错误。

注意：Node.js 不会检查 Content-Length 与已传输的请求主体的长度是否相等。

该请求实现了 可写流 接口。 它是一个包含以下事件的 EventEmitter：

##### 'abort' 事件

当请求已被客户端终止时触发。 该事件仅在首次调用 abort() 时触发。

##### 'connect' 事件

<ul>
    <li> response (http.IncomingMessage) </li>
    <li> socket (net.Socket) </li>
    <li> head (Buffer) </li>
</ul>

每当服务器响应 CONNECT 请求时触发。 如果该事件未被监听，则接收到 CONNECT 方法的客户端会关闭连接。

例子，用一对客户端和服务端来演示如何监听 'connect' 事件：

{% highlight javascript %}
const http = require('http');
const net = require('net');
const url = require('url');

// 创建一个 HTTP 代理服务器
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, cltSocket, head) => {
  // 连接到一个服务器
  const srvUrl = url.parse(`http://${req.url}`);
  const srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    srvSocket.write(head);
    srvSocket.pipe(cltSocket);
    cltSocket.pipe(srvSocket);
  });
});

// 代理服务器正在运行
proxy.listen(1337, '127.0.0.1', () => {

  // 发送一个请求到代理服务器
  const options = {
    port: 1337,
    hostname: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80'
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('已连接！');

    // 通过代理服务器发送一个请求
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
{% endhighlight %}

##### 'continue' 事件

当服务器发送了一个 100 Continue 的 HTTP 响应时触发，通常是因为请求包含 Expect: 100-continue。 这是客户端将要发送请求主体的指令。

##### 'response' 事件

<ul>
    <li> response (http.IncomingMessage) </li>
</ul>

当请求的响应被接收到时触发。 该事件只触发一次。

##### 'socket' 事件

<ul>
    <li> socket (net.Socket) </li>
</ul>

当 socket 被分配到请求后触发。

##### Event: 'timeout'

当底层 socket 超时的时候触发。该方法只会通知空闲的 socket。请求必须手动停止。

也可以查看 request.setTimeout()。

##### 'upgrade' 事件

<ul>
    <li> response (http.IncomingMessage) </li>
    <li> socket (net.Socket) </li>
    <li> head (Buffer) </li>
</ul>

每当服务器响应 upgrade 请求时触发。 如果该事件未被监听，则接收到 upgrade 请求头的客户端会关闭连接。

例子，用一对客户端和服务端来演示如何监听 'upgrade' 事件：

{% highlight javascript %}
const http = require('http');

// 创建一个 HTTP 服务器
const srv = http.createServer( (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
srv.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket);
});

// 服务器正在运行
srv.listen(1337, '127.0.0.1', () => {

  // 发送一个请求
  const options = {
    port: 1337,
    hostname: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket'
    }
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
{% endhighlight %}

##### request.abort()

标记请求为终止。 调用该方法将使响应中剩余的数据被丢弃且 socket 被销毁。

##### request.aborted

如果请求已被终止，则该属性的值为请求被终止的时间，从 1 January 1970 00:00:00 UTC 到现在的毫秒数。

##### request.connection

<ul>
	<li>(net.Socket)</li>
</ul>

See request.socket

##### request.end([data[, encoding]][, callback])

<ul>
    <li> data (string) | (Buffer) </li>
    <li> encoding (string) </li>
    <li> callback (Function) </li>
</ul>

结束发送请求。 如果部分请求主体还未被发送，则会刷新它们到流中。 如果请求是分块的，则会发送终止字符 '0\r\n\r\n'。

如果指定了 data，则相当于调用 request.write(data, encoding) 之后再调用 request.end(callback)。

如果指定了 callback，则当请求流结束时会被调用。

##### request.flushHeaders()

刷新请求头。

出于效率的考虑，Node.js 通常会缓存请求头直到 request.end() 被调用或第一块请求数据被写入。 然后 Node.js 会将请求头和数据打包成一个单一的 TCP 数据包。

通常那是期望的（因为它节省了 TCP 往返），除非第一个数据块很长时间之后才被发送。 request.flushHeaders() 可以绕过最优选择并提前开始请求。

##### request.getHeader(name)

<ul>
    <li> name (string) </li>
    <li> Returns: (string) </li>
</ul>

读出请求头，注意:参数name是大小写敏感的

Example:

{% highlight javascript %}
const contentType = request.getHeader('Content-Type');
{% endhighlight %}

##### request.removeHeader(name)

<ul>
    <li> name (string) </li>
</ul>

移除一个已经在 headers 对象里面的 header。

例如：

{% highlight javascript %}
request.removeHeader('Content-Type');
{% endhighlight %}

##### request.setHeader(name, value)

<ul>
    <li> name (string) </li>
	<li> value (string) </li>
</ul>

为 headers 对象设置一个单一的 header 值。如果该 header 已经存在了，则将会被替换。这里使用一个字符串数组来设置有相同名称的多个 headers。

例如：

{% highlight javascript %}
request.setHeader('Content-Type', 'application/json');
//或
request.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
{% endhighlight %}

##### request.setNoDelay([noDelay])

<ul>
    <li> noDelay (boolean) </li>
</ul>

一旦 socket 被分配给请求且已连接，socket.setNoDelay() 会被调用。

##### request.setSocketKeepAlive([enable][, initialDelay])

<ul>
    <li> enable (boolean) </li>
    <li> initialDelay (number) </li>
</ul>

一旦 socket 被分配给请求且已连接，socket.setKeepAlive() 会被调用。

##### request.setTimeout(timeout[, callback])

<ul>
    <li> timeout (number) 请求被认为是超时的毫秒数。 </li>
    <li> callback (Function) 可选的函数，当超时发生时被调用。等同于绑定到 timeout 事件。 </li>
</ul>

一旦 socket 被分配给请求且已连接，socket.setTimeout() 会被调用。

返回 request。

##### request.socket   

<ul>
	<li>net.Socket</li>
</ul>

引用底层socket。 通常用户不想访问此属性。 特别地，由于协议解析器连接到socket的方式，socket将不会触发'readable'事件。 在response.end()之后，该属性为null。 也可以通过request.connection来访问socket。

例如:

{% highlight javascript %}
const http = require('http');
const options = {
  host: 'nodejs.cn',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`你的IP地址是 ${ip}，你的源端口是 ${port}。`);
  // consume response object
});
{% endhighlight %}

##### request.write(chunk[, encoding][, callback])

<ul>
    <li> chunk (string) | (Buffer) </li>
    <li> encoding (string) </li>
    <li> callback (Function) </li>
</ul>

发送请求主体的一个数据块。 通过多次调用该方法，一个请求主体可被发送到一个服务器，在这种情况下，当创建请求时，建议使用 ['Transfer-Encoding', 'chunked'] 请求头。

encoding 参数是可选的，仅当 chunk 是一个字符串时才有效。默认为 'utf8'。

callback 参数是可选的，当数据块被刷新时调用。

返回 request。

#### http.Server 类

该类继承自 net.Server，且具有以下额外的事件：

##### 'checkContinue' 事件

<ul>
    <li> request (http.IncomingMessage) </li>
    <li> response (http.ServerResponse) </li>
</ul>

每当接收到一个带有 HTTP Expect: 100-continue 请求头的请求时触发。 如果该事件未被监听，则服务器会自动响应 100 Continue。

处理该事件时，如果客户端应该继续发送请求主体，则调用 response.writeContinue()，否则生成一个适当的 HTTP 响应（例如 400 错误请求）。

注意，当该事件被触发且处理后，'request' 事件不会被触发。

##### 'checkExpectation' 事件

<ul>
    <li> request (http.IncomingMessage) </li>
    <li> response (http.ServerResponse) </li>
</ul>

每当接收到一个带有 HTTP Expect 请求头（值不为 100-continue）的请求时触发。 如果该事件未被监听，则服务器会自动响应 417 Expectation Failed。

注意，当该事件被触发且处理后，'request' 事件不会被触发。

##### 'clientError' 事件

<ul>
    <li> exception (Error) </li>
    <li> socket (net.Socket) </li>
</ul>

如果客户端触发了一个 'error' 事件，则它会被传递到这里。 该事件的监听器负责关闭或销毁底层的 socket。 例如，用户可能希望更温和地用 HTTP '400 Bad Request' 响应关闭 socket，而不是突然地切断连接。

默认情况下，请求异常时会立即销毁 socket。

socket 参数是发生错误的 net.Socket 对象。

{% highlight javascript %}
const http = require('http');

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
{% endhighlight %}

当 'clientError' 事件发生时，不会有 request 或 response 对象，所以发送的任何 HTTP 响应，包括响应头和内容，必须被直接写入到 socket 对象。 注意，确保响应是一个被正确格式化的 HTTP 响应消息。

##### 'close' 事件

当服务器关闭时触发。

##### 'connect' 事件

<ul>
    <li> request (http.IncomingMessage) HTTP 请求，同 'request' 事件。 </li>
    <li> socket (net.Socket) 服务器与客户端之间的网络 socket。 </li>
    <li> head (Buffer) 流的第一个数据包，可能为空。 </li>
</ul>

每当客户端发送 HTTP CONNECT 请求时触发。 如果该事件未被监听，则发送 CONNECT 请求的客户端会关闭连接。

当该事件被触发后，请求的 socket 上没有 'data' 事件监听器，这意味着需要绑定 'data' 事件监听器，用来处理 socket 上被发送到服务器的数据。

##### 'connection' 事件

<ul>
    <li> socket (net.Socket) </li>
</ul>

当一个新的 TCP 流被建立时触发。 socket 是一个 net.Socket 类型的对象。 通常用户无需访问该事件。 注意，因为协议解析器绑定到 socket 的方式，socket 不会触发 'readable' 事件。 socket 也可以通过 request.connection 访问。

##### 'request' 事件

<ul>
    <li> request (http.IncomingMessage) </li>
    <li> response (http.ServerResponse) </li>
</ul>

每次接收到一个请求时触发。 注意，每个连接可能有多个请求（在 HTTP keep-alive 连接的情况下）。

##### 'upgrade' 事件

<ul>
    <li> request (http.IncomingMessage) HTTP 请求，同 'request' 事件。 </li>
    <li> socket (net.Socket) 服务器与客户端之间的网络 socket。 </li>
    <li> head (Buffer) 流的第一个数据包，可能为空。 </li>
</ul>

每当客户端发送 HTTP upgrade 请求时触发。 如果该事件未被监听，则发送 upgrade 请求的客户端会关闭连接。

当该事件被触发后，请求的 socket 上没有 'data' 事件监听器，这意味着需要绑定 'data' 事件监听器，用来处理 socket 上被发送到服务器的数据。

##### server.close([callback])

<ul>
    <li> callback (Function) </li>
</ul>

停止服务端接收新的连接。详见 net.Server.close()。

##### server.listen()

开启HTTP服务器监听连接。方法与net.Server的server.listen()相同。

##### server.listening

<ul>
    <li> (boolean) </li>
</ul>

返回一个布尔值，表示服务器是否正在监听连接。

##### server.maxHeadersCount

<ul>
    <li> (number) 默认为 2000。 </li>
</ul>

限制请求头的最大数量，默认为 2000。 如果设为 0，则没有限制。

##### server.setTimeout([msecs][, callback])

<ul>
    <li> msecs (number) 默认为 120000 (2 分钟)。 </li>
    <li> callback (Function) </li>
</ul>

设置 socket 的超时时间。 如果发生超时，则触发服务器对象的 'timeout' 事件，并传入 socket 作为一个参数。

默认情况下，服务器的超时时间是 2 分钟，且超时后的 socket 会被自动销毁。 但是，如果你为服务器的 'timeout' 事件分配了一个回调函数，则超时必须被显式地处理。

返回 server。

##### server.timeout

<ul>
    <li> (number) 超时时间，以毫秒为单位。默认为 120000 (2 分钟)。 </li>
</ul>

socket 被认定为超时的空闲毫秒数。

值设为 0 可禁用请求连接的超时行为。

注意，socket 的超时逻辑是在连接上设定的，所以改变这个值只影响服务器新建的连接，而不会影响任何已存在的连接。

##### server.keepAliveTimeout

<ul>
    <li> (number) 超时毫秒. 默认为 5000 (5秒).  </li>
</ul>

服务器完成最后的响应之后需要等待的额外的传入数据的活跃毫秒数, socket 才能被销毁.
如果服务器在 keep-alive 计时已激活时接收到新的数据, 他会重置常规的非活动计时, 即server.timeout.

值为 0 时禁用传入连接 keep-alive 的超时行为.

注意: scoket 的超时逻辑上取决于服务器连接, 所以改变这个值只影响服务器的新连接, 不影响任何已存在的连接.

#### http.ServerResponse 类

该对象在 HTTP 服务器内部被创建。 它作为第二个参数被传入 'request' 事件。

这个类实现了（而不是继承自）可写流 接口。 它是一个有以下事件的 EventEmitter：

##### 'close' 事件

当底层连接在 response.end() 被调用或能够刷新之前被终止时触发。

##### 'finish' 事件

当响应已被发送时触发。 更具体地说，当响应头和响应主体的最后一部分已被交给操作系统通过网络进行传输时，触发该事件。 这并不意味着客户端已接收到任何东西。

该事件触发后，响应对象上不再触发其他事件。

##### response.addTrailers(headers)

<ul>
    <li> headers (Object) </li>
</ul>

该方法会添加 HTTP 尾部响应头（一种在消息尾部的响应头）到响应。

仅当响应使用分块编码时，尾部响应头才会被发送；否则（比如请求为 HTTP/1.0），尾部响应头会被丢弃。

注意，发送尾部响应头之前，需先发送 Trailer 响应头，并在值里带上尾部响应头字段的列表。 例如：

{% highlight javascript %}
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
{% endhighlight %}

如果尾部响应头字段的名称或值包含无效字符，则抛出 TypeError 错误。

##### response.connection

<ul>
    <li> (net.Socket) </li>
</ul>

See response.socket.

##### response.end([data][, encoding][, callback])

<ul>
    <li> data (string) | (Buffer) </li>
    <li> encoding (string) </li>
    <li> callback (Function) </li>
</ul>

该方法会通知服务器，所有响应头和响应主体都已被发送，即服务器将其视为已完成。 每次响应都必须调用 response.end() 方法。

如果指定了 data，则相当于调用 response.write(data, encoding) 之后再调用 response.end(callback)。

如果指定了 callback，则当响应流结束时被调用。

##### response.finished

<ul>
    <li> (boolean) </li>
</ul>

返回一个布尔值，表示响应是否已完成。 默认为 false。 执行 response.end() 之后，该值会变为 true。

##### response.getHeader(name)

<ul>
    <li> name (string) </li>
    <li> 返回: (string) </li>
</ul>

读取一个已入队列但尚未发送到客户端的响应头。 注意，名称不区分大小写。

例子：

{% highlight javascript %}
const contentType = response.getHeader('content-type');
{% endhighlight %}

##### response.getHeaderNames()

<ul>
    <li> Returns: (Array) </li>
</ul>

返回一个包含当前响应唯一名称的 http 头信息名称数组. 名称均为小写.

示例:

{% highlight javascript %}
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
{% endhighlight %}

##### response.getHeaders()

<ul>
    <li> Returns: (Object) </li>
</ul>

返回当前响应头文件的浅拷贝。 由于使用了浅拷贝，因此数组值可能会改变，无需对各种与响应头相关的http模块方法进行额外调用。 返回对象的键是响应头名称，值是各自的响应头值。 所有响应头名称都是小写的。

注意：response.getHeaders() 方法返回的对象不会原型继承 JavaScript Object。 这意味着，没有定义典型的Object方法，如obj.toString()，obj.hasOwnProperty() 和其他方法，并且不起作用。

例子：

{% highlight javascript %}
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
{% endhighlight %}

##### response.hasHeader(name)

<ul>
    <li> name (string) </li>
    <li> Returns: (boolean) </li>
</ul>

如果响应头当前有设置 name 头部，返回 true。请注意，名称匹配不区分大小写。

例子：

{% highlight javascript %}
const hasContentType = response.hasHeader('content-type');
{% endhighlight %}

##### response.headersSent

<ul>
    <li> (boolean) </li>
</ul>

返回一个布尔值（只读）。 如果响应头已被发送则为 true，否则为 false。

##### response.removeHeader(name)     

<ul>
    <li> name (string) </li>
</ul>

从隐式发送的队列中移除一个响应头。

例子：

{% highlight javascript %}
response.removeHeader('Content-Encoding');
{% endhighlight %}

##### response.sendDate

<ul>
    <li> (boolean) </li>
</ul>

当为 true 时，如果响应头里没有日期响应头，则日期响应头会被自动生成并发送。默认为 true。

该属性只可在测试时被禁用，因为 HTTP 响应需要包含日期响应头。

##### response.setHeader(name, value)

<ul>
    <li> name (string) </li>
    <li> value (string) | (string[]) </li>
</ul>

为一个隐式的响应头设置值。 如果该响应头已存在，则值会被覆盖。 如果要发送多个名称相同的响应头，则使用字符串数组。

例子：

{% highlight javascript %}
response.setHeader('Content-Type', 'text/html');
//或

response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
如果响应头字段的名称或值包含无效字符，则抛出 TypeError 错误。

response.setHeader() 设置的响应头会与 response.writeHead() 设置的响应头合并，且 response.writeHead() 的优先。

// 返回 content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
{% endhighlight %}

##### response.setTimeout(msecs[, callback])

<ul>
    <li> msecs (number) </li>
    <li> callback (Function) </li>
</ul>

设置 socket 的超时时间为 msecs。 如果提供了回调函数，则它会作为监听器被添加到响应对象的 'timeout' 事件。

如果没有 'timeout' 监听器被添加到请求、响应或服务器，则 socket 会在超时后被销毁。 如果在请求、响应或服务器的 'timeout' 事件上分配了回调函数，则超时的 socket 必须被显式地处理。

返回 response。

##### response.socket

<ul>
    <li> net.Socket </li>
</ul>

引用底层socket。 通常用户不想访问此属性。 特别地，由于协议解析器连接到socket的方式，socket将不会发出'readable'事件。 在response.end()之后，该属性为null。 也可以通过response.connection来访问socket。

例如:

{% highlight javascript %}
const http = require('http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`你的IP地址是 ${ip}，你的源端口是 ${port}。`);
}).listen(3000);
{% endhighlight %}

##### response.statusCode

<ul>
    <li> (number) </li>
</ul>

当使用隐式的响应头时（没有显式地调用 response.writeHead()），该属性控制响应头刷新时将被发送到客户端的状态码。

例子：

{% highlight javascript %}
response.statusCode = 404;
{% endhighlight %}

响应头被发送到客户端后，该属性表示被发出的状态码。

##### response.statusMessage

<ul>
    <li> (string) </li>
</ul>

当使用隐式的响应头时（没有显式地调用 response.writeHead()），该属性控制响应头刷新时将被发送到客户端的状态信息。 如果该值为 undefined，则使用状态码的标准信息。

例子：

{% highlight javascript %}
response.statusMessage = 'Not found';
{% endhighlight %}

响应头被发送到客户端后，该属性表示被发出的状态信息。

##### response.write(chunk[, encoding][, callback])

<ul>
    <li> chunk (string) | (Buffer) </li>
    <li> encoding (string) </li>
    <li> callback (Function) </li>
    <li> 返回: (boolean) </li>
</ul>

如果该方法被调用且 response.writeHead() 没有被调用，则它会切换到隐式响应头模式并刷新隐式响应头。

该方法会发送一块响应主体。 它可被多次调用，以便提供连续的响应主体片段。

请注意在http模块中，当请求是HEAD请求时，响应主体被省略。 类似地，204和304响应 不能 包括消息体。

chunk 可以是一个字符串或一个 buffer。 如果 chunk 是一个字符串，则第二个参数指定如何将它编码成一个字节流。 encoding 默认为 'utf8'。 当数据块被刷新时，callback 会被调用。

注意：这是原始的 HTTP 主体，且与可能被使用的高级主体编码无关。

response.write() 首次被调用时，会发送缓冲的响应头信息和响应主体的第一块数据到客户端。 response.write() 第二次被调用时，Node.js 会以流的形式处理数据，并将它们分别发送。 也就是说，响应会被缓冲到响应主体的第一个数据块。

如果全部数据被成功刷新到内核缓冲区，则返回 true。 如果全部或部分数据还在内存中排队，则返回 false。 当缓冲区再次空闲时，则触发 'drain' 事件。

##### response.writeContinue()

发送一个 HTTP/1.1 100 Continue 消息到客户端，表示请求主体可以开始发送。 参阅 Server 的 'checkContinue' 事件。

##### response.writeHead(statusCode[, statusMessage][, headers])

<ul>
    <li> statusCode (number) </li>
    <li> statusMessage (string) </li>
    <li> headers (Object) </li>
</ul>

发送一个响应头给请求。 状态码是一个三位数的 HTTP 状态码，如 404。 最后一个参数 headers 是响应头。 第二个参数 statusMessage 是可选的状态描述。

例子：

{% highlight javascript %}
const body = 'hello world';
response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain' });
{% endhighlight %}

该方法在消息中只能被调用一次，且必须在 response.end() 被调用之前调用。

如果在调用该方法之前调用 response.write() 或 response.end()，则隐式的响应头会被处理并调用该函数。

response.setHeader() 设置的响应头会与 response.writeHead() 设置的响应头合并，且 response.writeHead() 的优先。

{% highlight javascript %}
// 返回 content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
{% endhighlight %}

注意，Content-Length 是以字节（而不是字符）为单位的。 上面的例子行得通是因为字符串 'hello world' 只包含单字节字符。 如果响应主体包含高级编码的字符，则应使用 Buffer.byteLength() 来确定在给定编码中的字节数。 Node.js 不会检查 Content-Length 与已发送的响应主体的长度是否相同。

如果响应头字段的名称或值包含无效字符，则抛出 TypeError 错误。

#### http.IncomingMessage 类

IncomingMessage 对象由 http.Server 或 http.ClientRequest 创建，并作为第一个参数分别递给 'request' 和 'response' 事件。 它可以用来访问响应状态、消息头、以及数据。

它实现了 可读流 接口，还有以下额外的事件、方法、以及属性。

##### 'aborted' 事件

当请求已被终止且网络 socket 已关闭时触发。

##### 'close' 事件

当底层连接被关闭时触发。 同 'end' 事件一样，该事件每个响应只触发一次。

##### message.destroy([error])

<ul>
	<li> error (Error) </li>
</ul>

调用接收到 IncomingMessage 的 socket 上的 destroy() 方法。 如果提供了 error，则触发 'error' 事件，且把 error 作为参数传入事件的监听器。

##### message.headers

<ul>
	<li> (Object) </li>
</ul>

请求头或响应头的对象。

头信息的名称与值的键值对。 头信息的名称为小写。 例如：

{% highlight javascript %}
// 输出类似以下的东西：
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
{% endhighlight %}

原始头信息中的重复数据会按以下方式根据头信息名称进行处理：

重复的 age 、 authorization 、 content-length 、 content-type 、 etag 、 expires 、 from 、 host 、 if-modified-since 、 if-unmodified-since 、 last-modified 、 location 、 max-forwards 、 proxy-authorization 、 referer 、 retry-after 、或 user-agent 会被丢弃。
set-cookie 始终是一个数组。重复的会被添加到数组。
对于其他头信息，其值使用 , 拼接。

##### message.httpVersion

<ul>
	<li> (string) </li>
</ul>

在服务器请求中，该属性返回客户端发送的 HTTP 版本。 在客户端响应中，该属性返回连接到的服务器的 HTTP 版本。 可能的值有 '1.1' 或 '1.0'。

message.httpVersionMajor 返回 HTTP 版本的第一个整数值，message.httpVersionMinor 返回 HTTP 版本的第二个整数值。

##### message.method

<ul>
	<li> (string) </li>
</ul>

仅在 http.Server 返回的请求中有效。

返回一个字符串，表示请求的方法。 该属性只读。 例如：'GET'、'DELETE'。

##### message.rawHeaders

<ul>
	<li> (Array) </li>
</ul>

接收到的原始的请求头或响应头列表。

注意，键和值在同一个列表中。 偶数位的是键，奇数位的是对应的值。

头信息的名称不会被转换为小写，重复的也不会被合并。

{% highlight javascript %}
// 输出类似以下的东西：
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders);
{% endhighlight %}

##### message.rawTrailers

<ul>
	<li> (Array) </li>
</ul>

接收到的原始的 Trailer 请求头或响应头的的键和值。 只在 'end' 事件时被赋值。

##### message.setTimeout(msecs, callback)

<ul>
	<li> msecs (number) </li>
	<li> callback (Function) </li>
</ul>

调用 message.connection.setTimeout(msecs, callback)。

返回 message。

##### message.socket

<ul>
	<li> (net.Socket) </li>
</ul>

返回与连接关联的 net.Socket 对象。

通过 HTTPS 的支持，使用 request.socket.getPeerCertificate() 获取客户端的认证信息。

##### message.statusCode

<ul>
	<li> (number) </li>
</ul>

仅在 http.ClientRequest 返回的响应中有效。

返回一个三位数的 HTTP 响应状态码。 如 404。

##### message.statusMessage

<ul>
	<li> (string) </li>
</ul>

仅在 http.ClientRequest 返回的响应中有效。

返回 HTTP 响应状态消息（原因描述）。 如 OK 或 Internal Server Error。

##### message.trailers

<ul>
	<li> (Object) </li>
</ul>

返回 Trailer 请求头或响应头对象。 只在 'end' 事件时被赋值。

##### message.url

<ul>
    <li> (string) </li>
</ul>
仅在 http.Server 返回的请求中有效。

返回请求的 URL 字符串。 仅包含实际 HTTP 请求中的 URL。 如果请求是：

{% highlight javascript %}
GET /status?name=ryan HTTP/1.1\r\n
Accept: text/plain\r\n
\r\n
{% endhighlight %}

则 request.url 会是：

{% highlight javascript %}
'/status?name=ryan'
{% endhighlight %}

如果想将 url 解析成各个部分，可以使用 require('url').parse(request.url)。 例子：

{% highlight javascript %}
$ node
> require('url').parse('/status?name=ryan')
Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '?name=ryan',
  query: 'name=ryan',
  pathname: '/status',
  path: '/status?name=ryan',
  href: '/status?name=ryan' }
{% endhighlight %}

如果想从查询字符串中提取参数，可以使用 require('querystring').parse 函数、或为 require('url').parse 的第二个参数传入 true。 例子：

{% highlight javascript %}
$ node
> require('url').parse('/status?name=ryan', true)
Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '?name=ryan',
  query: { name: 'ryan' },
  pathname: '/status',
  path: '/status?name=ryan',
  href: '/status?name=ryan' }
{% endhighlight %}

#### http.METHODS

<ul>
	<li> (Array) </li>
</ul>

返回解析器支持的 HTTP 方法的列表。

#### http.STATUS_CODES

<ul>
	<li> (Object) </li>
</ul>

返回标准的 HTTP 响应状态码的集合，以及各自的简短描述。 例如，http.STATUS_CODES[404] === 'Not Found'。

#### http.createServer([requestListener])

<ul>
	<li> requestListener (Function) </li>
	<li> 返回: (http.Server) </li>
</ul>

返回一个新建的 http.Server 实例。

requestListener 是一个函数，会被自动添加到 'request' 事件。

#### http.get(options[, callback])

<ul>
	<li> options (Object) | (string) | (URL) 接收与http.request()相同的设置。 method一直设置为GET，忽略继承自原型的属性 </li>
	<li> callback (Function) </li>
	<li> 返回: (http.ClientRequest) </li>
</ul>

因为大多数请求都是 GET 请求且不带请求主体，所以 Node.js 提供了该便捷方法。 该方法与 http.request() 唯一的区别是它设置请求方法为 GET 且自动调用 req.end()。 注意，回调函数务必消耗掉响应数据，原因详见 http.ClientRequest 章节。

callback 被调用时只传入一个参数，该参数是 http.IncomingMessage 的一个实例。

一个获取 JSON 的例子：

{% highlight javascript %}
http.get('http://nodejs.org/dist/index.json', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('请求失败。\n' +
                      `状态码: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('无效的 content-type.\n' +
                      `期望 application/json 但获取的是 ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // 消耗响应数据以释放内存
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`错误: ${e.message}`);
});
{% endhighlight %}

#### http.globalAgent

<ul>
	<li> (http.Agent) </li>
</ul>

Agent 的全局实例，作为所有 HTTP 客户端请求的默认 Agent。

#### http.request(options[, callback])

options (Object) | (string) | (URL)

<ul>
	<li> protocol (string) 使用的协议。默认为 http:。 </li>
	<li> host (string) 请求发送至的服务器的域名或 IP 地址。默认为 localhost。 </li>
	<li> hostname (string) host 的别名。为了支持 url.parse()，hostname 优先于 host。 </li>
	<li> family (number) 当解析 host 和 hostname 时使用的 IP 地址族。 有效值是 4 或 6。当未指定时，则同时使用 IP v4 和 v6。 </li>
	<li> port (number) 远程服务器的端口。默认为 80。 </li>
	<li> localAddress (string) 为网络连接绑定的本地接口。 </li>
	<li> socketPath (string) Unix 域 Socket（使用 host:port 或 socketPath）。 </li>
	<li> method (string) 指定 HTTP 请求方法的字符串。默认为 'GET'。 </li>
	<li> path (string) 请求的路径。默认为 '/'。 应包括查询字符串（如有的话）。如 '/index.html?page=12'。 当请求的路径中包含非法字符时，会抛出异常。 目前只有空字符会被拒绝，但未来可能会变化。 </li>
	<li> headers (Object) 包含请求头的对象。 </li>
	<li> auth (string) 基本身份验证，如 'user:password' 用来计算 Authorization 请求头。 </li>
	<li> 
		agent (http.Agent) | (boolean) 控制 Agent 的行为。 可能的值有： 
		<ol>
			<li> undefined (默认): 对该主机和端口使用 http.globalAgent。 </li>
			<li> Agent 对象：显式地使用传入的 Agent。 </li>
			<li> false: 创建一个新的使用默认值的 Agent。 </li>
		</ol>
	</li>
</ul>
<ul>
	<li> createConnection (Function) 当不使用 agent 选项时，为请求创建一个 socket 或流。 这可以用于避免仅仅创建一个自定义的 Agent 类来覆盖默认的 createConnection 函数。详见 agent.createConnection()。 </li>
	<li> timeout (number): 指定 socket 超时的毫秒数。 它设置了 socket 等待连接的超时时间。 </li>
</ul>

callback <Function>

返回: <http.ClientRequest>

Node.js 为每台服务器维护多个连接来进行 HTTP 请求。 该函数允许显式地发出请求。

options 可以是一个对象、或字符串、或 URL 对象。 如果 options 是一个字符串，它会被自动使用 url.parse() 解析。 如果它是一个 URL 对象, 它会被默认转换成一个 options 对象。

可选的 callback 参数会作为单次监听器被添加到 'response' 事件。

http.request() 返回一个 http.ClientRequest 类的实例。 ClientRequest 实例是一个可写流。 如果需要通过 POST 请求上传一个文件，则写入到 ClientRequest 对象。

例子：

{% highlight javascript %}
const postData = querystring.stringify({
  'msg' : 'Hello World!'
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`响应主体: ${chunk}`);
  });
  res.on('end', () => {
    console.log('响应中已无数据。');
  });
});

req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

// 写入数据到请求主体
req.write(postData);
req.end();
{% endhighlight %}

注意，在例子中调用了 req.end()。 使用 http.request() 必须总是调用 req.end() 来表明请求的结束，即使没有数据被写入请求主体。

如果请求过程中遇到任何错误（DNS 解析错误、TCP 级的错误、或实际的 HTTP 解析错误），则在返回的请求对象中会触发 'error' 事件。 对于所有的 'error' 事件，如果没有注册监听器，则抛出错误。

以下是需要注意的几个特殊的请求头。

发送 'Connection: keep-alive' 会通知 Node.js，服务器的连接应一直持续到下一个请求。

发送 'Content-Length' 请求头会禁用默认的块编码。

发送 'Expect' 请求头会立即发送请求头。 通常情况下，当发送 'Expect: 100-continue' 时，超时时间与 continue 事件的监听器都需要被设置。 详见 RFC2616 章节 8.2.3。

发送 Authorization 请求头会替代 auth 选项计算基本身份验证。

Example using a URL as options:

{% highlight javascript %}
const { URL } = require('url');

const options = new URL('http://abc:xyz@example.com');

const req = http.request(options, (res) => {
  // ...
});
{% endhighlight %}
