Shadow Slide 用户手册
------------------------

-----

&nbsp;

Shadow Slide 是一个基于 <a target="_blank" href="https://github.com/rewgt/shadow-server">Shadow Widget 系统</a> 与 <a target="_blank" href="https://en.wikipedia.org/wiki/Markdown">Markdown 语法</a> 的简易演示胶片制作系统，经本工具制作的胶片可用浏览器在线或离线阅读。

Shadow Slide 是一款开源的免费软件，发行版已将它所依赖的 <a target="_blank" href="https://github.com/facebook/react">react 库</a> 与 <a target="_blank" href="https://github.com/rewgt/shadow-server"> shadow-widget 库</a> 打包，安装后即可启动胶片制作。

#### 安装 Shadow Slide

先安装 Shadow Widget：

``` bash
  mkdir user
  cd user
  git clone https://github.com/rewgt/shadow-server.git
```

然后安装 Shadow Slide：

``` bash
  git clone https://github.com/rewgt/shadow-slide.git
```

#### 在本机启动 Web 服务

``` bash
  cd shadow-server
  npm start
```

运行后，请在 Web 浏览器访问 `http://localhost:3000/shadow-slide/`，看看是否正常打开一份演示胶片样例。

#### 版权

Copyright 2016, PINP.ME Development Group. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

  - Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above
    copyright notice, this list of conditions and the following
    disclaimer in the documentation and/or other materials provided
    with the distribution.
  - Neither the name of PINP.ME nor the names of its contributors 
    may be used to endorse or promote products derived from this 
    software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

&nbsp;
