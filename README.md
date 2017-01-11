### 关于 Shadow Slide

Shadow Slide 是一个基于 <a target="_blank" href="https://github.com/rewgt/shadow-server">Shadow Widget 系统</a> 与 <a target="_blank" href="https://en.wikipedia.org/wiki/Markdown">Markdown 语法</a> 的简易演示胶片制作系统，经本工具制作的胶片可用浏览器在线或离线阅读。

Shadow Slide 是一款开源的免费软件，发行版已将它所依赖的 <a target="_blank" href="https://github.com/facebook/react">react 库</a> 与 <a target="_blank" href="https://github.com/rewgt/shadow-server"> shadow-widget 库</a> 打包，安装后即可启动胶片制作。

### 安装 Shadow Slide

先安装 Shadow Widget：

```
  md user
  cd user
  git clone https://github.com/rewgt/shadow-server.git
```

然后安装 Shadow Slide：

```
  git clone https://github.com/rewgt/shadow-slide.git
```

### 在本机启动 Web 服务

```
  cd shadow-server
  npm start
```

运行后，请在 Web 浏览器访问 `http://localhost:3000/shadow-slide/`，看看是否正常打开一份演示胶片样例。

在 Web 浏览器访问 `http://localhost:3000/shadow-slide/output/doc/doc_zh/`，可查阅 Shadow Slide 用户手册。
