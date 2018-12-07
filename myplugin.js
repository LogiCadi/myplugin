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
        } else {

        }

    }
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
                this.render(data.curPageData);//自行实现 TODO
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
                if(page.num > 1){
                    this.render(data.curPageData, true);//自行实现 TODO
                }
            },
            error: () => {
                //联网失败的回调,隐藏下拉刷新和上拉加载的状态
                this.mescroll.endErr();
            }
        });
    }

}