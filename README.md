
# myplugin插件集

***可能以后会用到的插件***

[TOC]

## [mescroll](http://www.mescroll.com/index.html)移动端加载插件

> 下拉加载和上拉刷新、懒加载

### 1.  安装

```javascript
npm install --save mescroll.js    //不要使用cnpm安装
```

### 2.  引入

```html
<script src="jquery.min.js"></script>
<link rel="stylesheet" href="mescroll.min.css">
<script src="mescroll.min.js"></script>
<!-- 插件集 -->
<script src='myplugin.js'></script>
```

### 3.  使用

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
        // TODO
        data.curPageData && data.curPageData.forEach(item => {
            content += `<div class="list-item">
                            <div class="item-row row-1">
                                <div class="left">${item.phone}消费${item.pay_point}点积分</div>
                                <div class="right orange">+ ${ Number(item['income_point']) + Number(item['team_point'])}</div>
                            </div>
                            <div class="item-row row-2">${item.pay_time}</div>
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

### 4. 图片懒加载

```html
img标签: <img imgurl="网络图" src="占位图"/> // 占位图直接在src设置; 图片加载成功,就会替换src的占位图
div或其他标签: <div imgurl="网络图" style="background-image: url(占位图)"><div> // 占位图在css中设置; 图片以背景图的形式展示
```

## [photoClip](https://github.com/baijunjie/PhotoClip.js)截图插件

> 对上传的图片截取压缩

### 1. 安装

```javascript
npm install photoclip
```

### 2. 引入

```html
<script src="jquery.min.js"></script>
<script src="iscroll-zoom.js"></script>
<script src="hammer.min.js"></script>
<script src="lrz.all.bundle.js"></script>
<script src="PhotoClip.min.js"></script>
<!-- 插件集 -->
<script src='myplugin.js'></script>
```

### 3. 使用

- 需要写一个文件上传的input标签

```html
<label for="upload" class="avatar" style="background: url(img.png) center/cover no-repeat;"></label>
<input type="file" hidden id="upload" name='avatar' accept="image/*" />
```

```javascript
 new MyPlugin({
    plugin: 'photoclip',// 插件名
    stage: 'mobile', // 移动端 ,默认是mobile
    btnColor: '#eb526e',// 按钮主题色，默认#3c8fe1
    size: [document.body.clientWidth * 2 / 3, document.body.clientWidth * 2 / 3],// 截取框大小 宽高，默认屏幕宽度2/3大小
    outputSize: 500, // 截取图片大小，可以理解为截取质量 不要超过3000，默认500
    file: document.querySelector('#upload'),// input文件上传元素
    done(file) {// 截取完成的回调函数，file:截取的图片file(blob)
        // TODO 可以将图片上传或在页面预览
        fileLoad(file)
    }
})

function fileLoad(file) {
    var formData = new FormData()
    formData.append('avatar', file)

    $.ajax({
        url: "ava_upload",
        type: 'POST',
        data: formData,
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
        success(res) {
            if (res.error != 0) {
                alert(res.errmsg)

            } else {
                // 预览
                var reader = new FileReader();
                // 读取文件
                reader.readAsDataURL(file);
                // 读取完毕
                reader.onload = function () {
                    /*读取完毕 base64位数据  表示图片*/
                    // 显示预览图片
                    document.querySelector('.avatar').style = 'background: url(' + this.result + ') center/cover no-repeat'
                }
            }

        },
    });
}
```