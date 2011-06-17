iCapt is a web screen capture system for IE*, WebKit ..

## Author

* 季札 (http://oldj.net/)
* 云谦 (http://www.chencheng.org/)


## Client Flow

1. 客户端每 10s 获取一次服务器端的数据，接口格式为 url/type, type 为浏览器类型
2. 服务端以数组形式传回数据
   1) 单条任务
      [[url, taskId]]
   2) 多条任务
      [[url, taskId], [url, taskId], ...]
   3) 无任务
      []
3. 如果有任务，调用客户端命令执行截图
4. 将截图的图片 post 服务端, 接口形式为 url/type/taskId


## Tools

* http://iecapt.sourceforge.net/
* http://www.mewsoft.com/Products/ieSnapshotter.html
* http://www.phantomjs.org/
* http://pearlcrescent.com/products/pagesaver/


## Language

* Client: Python
* Server: NodeJS

