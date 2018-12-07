
# myplugin插件集

## `mescroll`移动端加载插件

> 下拉加载和上拉刷新

### 1. 安装 [mescroll](http://www.mescroll.com/index.html)

```javascript
npm install --save mescroll.js    //不要使用cnpm安装
```

### 2. 引入

```html
<link rel="stylesheet" href="lib/mescroll/mescroll.min.css">
<script src="lib/mescroll/mescroll.min.js"></script>
```

### 3. 使用

```html
    <div class="content"><!-- 父容器 -->
        <div class="top-row">顶部栏</div>

        <div class="content-list">
            <!-- 列表内容区域 -->
        </div>
    </div>
```

```javascript
new MyPlugin({
    plugin: 'mescroll',// 指定的插件名
    wrapper: document.querySelector('.content'),// 父容器
    reqUrl: 'team',// 请求的路径，实际路径为team?ajax=1&num=页码&size=每页数量
    top: '12vw',// 父容器距离顶部距离，默认是0
    size: 10, // 每页数据数量 默认10
    render(data, append) {// 数据返回函数
        // 服务端需要返回的data数据格式：
        // {
        //     curPageData: [] // 当前页数据,
        //     totalPage: // 总页数,
        // }
        // append 是否是追加
        let content = ''
        // 将数据渲染到页面中
        data.curPageData && data.curPageData.forEach(item => {
            content += `<div class="list-item">
                            <div class="item-row row-1">
                                <div class="left">${item.phone}消费${item.pay_point}点积分</div>
                                <div class="right orange">+ ${ Number(item['income_point']) + Number(item['team_point'])}</div>
                            </div>
                            <div class="item-row row-2">
                                ${item.pay_time}
                            </div>
                        </div>`
        });
        if (append) {
            document.querySelector('.content-list').innerHTML += content
        } else {
            document.querySelector('.content-list').innerHTML = content
        }
    }
})
```