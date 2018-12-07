class MyPlugin {

    constructor(conf) {
        if (conf.plugin == 'mescroll') {
            // 下拉刷新上拉加载插件 mescroll
            this.mescroll_init(conf.wrapper, conf.top)
            this.reqUrl = conf.reqUrl // 请求的操作名
            this.render = conf.render // 渲染回调函数
            this.size = conf.size || 10
            this.mescroll = new MeScroll("mescroll", { //第一个参数"mescroll"对应上面布局结构div的id (1.3.5版本支持传入dom对象)
                down: {
                    callback: () => {
                        this.mescroll_downCallback()
                    } //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
                },
                up: {
                    callback: page => {
                        this.mescroll_upCallback(page) //上拉加载回调,简写callback:function(page){upCallback(page);}
                    },
                    // page: {
                    //     num: 1, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    // },
                    htmlNodata: '<p class="upwarp-nodata">亲，没有更多数据了~</p>',
                    noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
                    empty: {
                        //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                        warpId: "mescroll", //父布局的id (1.3.5版本支持传入dom元素)
                        tip: "暂无相关数据" //提示
                    },
                    lazyLoad: {
                        use: true, // 是否开启懒加载,默认false
                        attr: 'imgurl', // 网络地址的属性名 (图片加载成功会移除该属性): <img imgurl='网络图  src='占位图''/>
                        showClass: 'mescroll-lazy-in', // 图片加载成功的显示动画: 渐变显示,参见mescroll.css
                        delay: 500, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
                        offset: 200 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
                    }
                }
            });
        } else if (conf.plugin == 'photoclip') {
            // photoClip
            this.photoclip_init(conf.stage, conf.btnColor)
            this.pc = new PhotoClip('.img-wrapper', {
                size: conf.size || document.body.clientWidth * 2 / 3 || 150,
                outputSize: conf.outputSize || 500,
                ok: '.clip-btn.yes',
                file: conf.file,
                loadStart: () => {
                    // console.log('开始读取照片');
                },
                loadComplete: () => {
                    // console.log('照片读取完成');
                    document.querySelector('.clip-wrapper').style.display = 'block'
                },
                done: (dataURL) => {
                    document.querySelector('.clip-wrapper').style.display = 'none'

                    //base64转blob
                    let blob = this.photoclip_dataURLtoBlob(dataURL);
                    conf.done && conf.done(blob)

                },
                fail: (msg) => {
                    alert(msg);
                }

            });
        }

    }
    /**mescroll */
    mescroll_init(wrapper, top = 0) {
        $(wrapper).wrap('<div id="mescroll" class="mescroll"></div>')
        $('.mescroll').css({ 'position': 'fixed', 'top': top, 'bottom': 0, 'height': 'auto' })
        $('.mescroll-empty .empty-tip').css({ 'font-size': '3.5vw', 'line-height': '20vw' })
    }

    //下拉刷新的回调
    mescroll_downCallback() {
        $.ajax({
            url: this.reqUrl + '?ajax=1&num=1&size=' + this.size,
            success: (data) => {
                //联网成功的回调,隐藏下拉刷新的状态;
                this.mescroll.endSuccess();//无参,注意此处无参
                //设置数据
                this.render(data);//自行实现 TODO
            },
            error: (data) => {
                //联网失败的回调,隐藏下拉刷新的状态
                this.mescroll.endErr();
            }
        });
    }

    //上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数
    mescroll_upCallback(page) {
        $.ajax({
            url: this.reqUrl + '?ajax=1&num=' + page.num + "&size=" + this.size,
            success: (data) => {
                //必传参数(当前页的数据个数, 总页数)
                this.mescroll.endByPage(data.curPageData.length, data.totalPage);

                //设置列表数据
                if (page.num > 1) {
                    this.render(data, true);//自行实现 TODO
                }
            },
            error: () => {
                //联网失败的回调,隐藏下拉刷新和上拉加载的状态
                this.mescroll.endErr();
            }
        });
    }

    /**photoclip */
    photoclip_init(stage = 'mobile', btnColor = '#3c8fe1') {
        if (stage == 'mobile') {

            $(document.body).append(`<div class="clip-wrapper">
                                        <div class="img-wrapper"></div>
                                        <div class="btn-wrapper">
                                            <div class="clip-btn yes">裁剪</div>
                                            <div class="clip-btn no">取消</div>
                                        </div>
                                    </div>`)

            $('.clip-wrapper').css({ 'top': 0, 'left': 0, 'right': 0, 'bottom': 0, 'position': 'fixed', 'z-index': 9, 'display': 'none', 'padding-bottom': '15vw' })
            $('.clip-wrapper .img-wrapper').css({ 'height': '100%' })
            $('.clip-wrapper .btn-wrapper').css({ 'position': 'absolute', 'display': 'flex', 'width': '100%', 'bottom': 0 })
            $('.clip-wrapper .clip-btn').css({ 'width': '50%', 'line-height': '15vw', 'font-size': '4vw', 'text-align': 'center', 'z-index': '11' })
            $('.clip-wrapper .clip-btn.yes').css({ 'background': btnColor, 'color': '#fff' })
            $('.clip-wrapper .clip-btn.no').css({ 'background': '#fff', 'color': btnColor })

            document.querySelector('.clip-btn.no').addEventListener('click', function () {
                document.querySelector('.clip-wrapper').style.display = 'none'
            })
        }
    }

    photoclip_dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
}