<template>
	<div class="mutualCircle" >
		<van-nav-bar :border="false"  title="互助圈子"   left-arrow @click-left="leftBack">
            <template #right>
                <div class="right-con" @click.stop="onClickRight">
                    个人中心
                </div>
            </template>
        </van-nav-bar>
        <div class="top-operate-con">
            <div class="operate-item" @click="toRouter('/likeList')">
                <img src="../../images/mutualCircle/like-bg.png" alt="">
            </div>
            <div class="operate-item" @click="toRouter('/commentList')">
                <img src="../../images/mutualCircle/comment-bg.png" alt="">
            </div>
            <div class="operate-item" @click="toRouter('/addArticle')">
                <img src="../../images/mutualCircle/edit-bg.png" alt="">
            </div>
        </div>
        <van-sticky>
            <div class="tab-box">
                <div class="tab-con">
                    <div class="tab-item" @click="handleTabClick(1)">
                        <img :src="status == 1 ? tabImgArr[0] : tabImgArr[1]" alt="">
                    </div>
                    <div class="tab-item" @click="handleTabClick(2)">
                        <img :src="status == 1 ? tabImgArr[3] : tabImgArr[2]" alt="">
                    </div>
                </div>
                <div style="flex:1"></div>
            </div>
        </van-sticky>
        <div class="article-box">
            <div class="article-con">
                <van-pull-refresh style="min-height: 50vh;" v-model="isLoading" @refresh="onRefresh" :disabled="!data || data.length == 0">
                    <van-list v-model="loading" :immediate-check="false" :finished="finished" @load="getData" :finished-text="data && data.length > 0 ? '没有更多了' : ''" >
                        <template #loading>
                            <div class="list-loading-con">
                                <img  src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                                <span>加载中...</span>
                            </div>
                        </template>
                        <template #finished>
                            <template v-if="data && data.length > 0">
                                没有更多了
                            </template>
                            <template v-else>
                                <div class="no-data-con">
                                    <template v-if="status == 1">
                                        <span>还没有人发布圈子</span>
                                        <div class="no-btn-con">
                                            <div class="btn-item" @click="toAddArticle">去发圈</div>
                                        </div>
                                    </template>
                                    <template v-if="status == 2">
                                        <span>您关注的人暂没有发圈</span>
                                        <div class="no-btn-con">
                                            <div class="btn-item" @click="toInitTab1Data">查看更多圈子</div>
                                        </div>
                                    </template>
                                </div>
                            </template>
                        </template>
                        <template >
                            <div class="article-item" v-for="(item,index) in data" :key="index" @click="toDetail(item)">
                                <div class="top-user-con">
                                    <div class="user-avatar">
                                        <img  :src="item.photo ? item.photo : '../../images/mutualCircle/default-avatar.png'" alt="" @click.stop="toUcenter(item)">
                                    </div>
                                    <div class="user-info">
                                        <div class="name">{{item.name}}</div>
                                        <div class="info">
                                            <div class="info-item addr-con" v-if="item.address">
                                                <img src="../../images/mutualCircle/location-icon.png" alt="">
                                                <span>{{item.address}}</span>
                                            </div>
                                            <div class="info-item time-con">
                                                <img src="../../images/mutualCircle/time-icon.png" alt="">
                                                <span>{{item.add_time}}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- <div class="user-status" @click.stop >
                                        <template v-if="item.is_guan == 2">
                                            <img class="follow-icon" @click.stop="toFollow(item)" src="../../images/mutualCircle/follow-icon.png" alt="">
                                        </template>
                                        <template v-if="item.is_guan == 1">
                                            <img class="follow-icon" @click.stop="toFollow(item)" src="../../images/mutualCircle/follow-checked-icon.png" alt="">
                                        </template>
                                    </div> -->
                                </div>
                                <div class="detail-con">
                                    <div class="text-con">
                                        {{item.content}}
                                    </div>
                                    <div class="img-con clearfix">
                                        <van-image fit="cover" class="img-item" v-for="(subItem,subIndex) in item.img_list" :key="subIndex" :src="subItem" @click.stop="imgPreview(item,subIndex)">
                                            <!-- <template v-slot:error>加载失败</template> -->
                                        </van-image>
                                    </div>
                                </div>
                                <div class="bottom-con">
                                    <div class="avatar-con" v-if="item.zlist && item.zlist.length > 0">
                                        <div class="cu-avatar-group">
                                            <div class="cu-avatar round sm" v-for="(item,index) in item.zlist" :key="index" :style="[{ backgroundImage:'url(' + item.photo + ')','z-index': 999-(index+1) }]"></div>
                                        </div>
                                        <span>刚刚赞过</span>
                                    </div>
                                    <div class="status-con">
                                        <div class="status-item like-con" @click.stop="addLike(item)">
                                            <template v-if="item.is_dz == 2">
                                                <img class="icon" src="../../images/mutualCircle/like-icon.png" alt="">
                                            </template>
                                            <template v-if="item.is_dz == 1">
                                                <img class="icon" src="../../images/mutualCircle/like-selected-icon.png" alt="">
                                            </template>
                                            <span>{{item.dz}}</span>
                                        </div>
                                        <div class="status-item comment-con">
                                            <template v-if="item.is_pj == 2">
                                                <img class="icon" src="../../images/mutualCircle/comment-icon.png" alt="">
                                            </template>
                                            <template v-if="item.is_pj == 1">
                                                <img class="icon" src="../../images/mutualCircle/comment-selected-icon.png" alt="">
                                            </template>
                                            <span>{{item.pl}}</span>
                                        </div>
                                        <div class="status-item share-con" @click.stop="toShare(item)">
                                            <!-- <template v-if="item.is_zf == 2"> -->
                                                <img class="icon" src="../../images/mutualCircle/share-icon.png" alt="">
                                            <!-- </template>
                                            <template v-if="item.is_zf == 1">
                                                <img class="icon" src="../../images/mutualCircle/share-icon.png" alt="">
                                            </template> -->
                                            <span>分享</span>
                                        </div>
                                    </div>
                                    <!-- <div ></div> -->
                                </div>
                            </div>
                        </template>
                    </van-list>
                </van-pull-refresh>
            </div>
        </div>
	</div>
</template>
<script>
    import { ImagePreview } from 'vant';
	export default {
		name: "mutualCircle",
		data() {
			return {
                tabImgArr: [require('../../images/mutualCircle/tab-select-icon1.png'),require('../../images/mutualCircle/tab-icon1.png'),require('../../images/mutualCircle/tab-select-icon2.png'),require('../../images/mutualCircle/tab-icon2.png')],
                loading: false,
                finished: false,
                isErr: false,
                page: 0,
                size: 10,
                data: [],
                status: 1,
                lastStatus: 1,

                isLoading: false,

                userInfo: null
			};
        },
        // 互助圈子内页面跳转逻辑  进入下个页面记录当前页面滚动距离 
        // 如果从下个页面再次返回时 判断记录的滚动距离如果大于100 不请求接口保留离开时的数据与滚动距离 
        // 若小于100重新请求数据并清空滚动距离
		activated() { 
            window.leftBack = this.leftBack
            let meta = this.$route.meta
            if (meta && meta.scrollPosition && Number(meta.scrollPosition.y) > 100) {
                this.lastStatus = ''
                document.querySelector('.mutualCircle').scrollTop = meta.scrollPosition.y
            } else  {
                this.status = 1
                this.lastStatus = this.status
                this.page = 0
                this.loading = true
                this.finished = false
                this.getData()
                this.getUserInfo()
            }
        },
        beforeRouteEnter (to, from, next) {
            next(self =>{
                if (from.path == '/ucenter' || from.path == '/') {
                    
                    self.status = 1
                    self.lastStatus = self.status
                    self.page = 0
                    self.loading = true
                    self.finished = false
                    self.getData(true)
                    self.getUserInfo()
                } 
            })
        },
        beforeRouteLeave (to, from, next) {
            from.meta.scrollPosition.y = document.querySelector('.mutualCircle').scrollTop
			next()
	    },
		methods: {
			// 返回
			leftBack () {
				this.$router.push('/')
            },
            // 个人中心
            onClickRight () {
                this.$router.push({
                    path: '/mutualUcenter',
                    query: {
                        userId: this.userInfo.user_id,
                        lastPath: '/mutualCircle'
                    }
                })
            },
            // 路由跳转
            toRouter (path) {
                this.$router.push({
                    path: path,
                    query: {
                        lastPath: '/mutualCircle'
                    }
                })
            },
            // 去发圈
            toAddArticle () {
                this.$router.push({
                    path: '/addArticle',
                    query: {
                        lastPath: '/mutualCircle',
                        // lastScrollTop: document.querySelector('.likeList').scrollTop
                    }
                })
            },
            // 跳转圈子详情
            toDetail (row) {
                this.$router.push({
                    path: '/mutualDetail',
                    query: {
                        id: row.circle_id,
                        lastPath: '/mutualCircle'
                    }
                })
            },
            onRefresh() {
                this.page = 0
                this.loading = true
                this.finished = false
                this.getData()
            },
            // 获取用户信息
            getUserInfo () {
                this.$api.userDetail({
                    user_id: ''
                }).then(res => {
					if (res.errno == 0) {
                        this.userInfo = res.data
                        localStorage.setItem('userIdByCirle', res.data.user_id)
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
                    this.$toast('服务异常,请稍后重试')
				})
            },
            // 初始化tab1数据
            toInitTab1Data () {
                this.status = 1
                this.lastStatus = this.status
                this.page = 0
                this.loading = true
                this.finished = false
                this.data = [];
                this.getData()
            },
            // 切换任务完成状态
            handleTabClick(type) {
                this.status = type;
                if (this.status == this.lastStatus && !this.isErr) return
                this.lastStatus = this.status
                this.page = 0
                this.loading = true
                this.finished = false
                this.data = [];
                this.getData()
            },
            // 获取圈子列表
            getData (isFirst) {
                if (this.status == 1) {
                    this.circleLists(isFirst)
                } else if (this.status == 2) {
                    this.myGuanLists()
                }
            },
            circleLists (isFirst) {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
                let params = {
                    page: page,
                    size: this.size,
                }
				this.$api.circleLists(params).then(res => {
                    this.loading = false
                    this.isLoading = false
                   
					if (res.errno == 0) {
                        res.data.data.forEach(item => {
                            item.add_time = this.utils.getTimeResult(new Date(item.add_time.replace(/-/g,'/')).getTime()/1000)
                        });
						let data = res.data.data
						if (data && data.length > 0) {
							if (page == 1) {
                                this.data = []
								this.data = data
							} else {
								this.data = this.data.concat(data)
							}
                        } else {
                            this.data = []
                        }
						this.page = page
						if (this.page >= res.data.total) {
							this.finished = true
						} else {
							this.finished = false
						}
					} else {
						this.$toast(res.errmsg)	
						this.finished = true
                        this.page = 0
                        this.data = []
                    }
                    
                    setTimeout(() =>{
                        if (isFirst) {
                            if (document.querySelector('.mutualCircle')) {
                                document.querySelector('.mutualCircle').scrollTop = 0
                            }
                        }
                    })
				}).catch(err=>{
                    this.$toast('服务异常,请稍后重试')
                    this.isLoading = false
					this.loading = false
					this.finished = true
                    this.page = 0
                    this.data = []
                    this.isErr = true
                    if (isFirst) {
                        if (document.querySelector('.mutualCircle')) {
                            document.querySelector('.mutualCircle').scrollTop = 0
                        }
                    }
				})
            },
            myGuanLists () {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
                let params = {
                    page: page,
                    size: this.size,
                }
				this.$api.guanUserCircleList(params).then(res => {
                    this.loading = false
                    this.isLoading = false
					if (res.errno == 0) {
                        res.data.data.forEach(item => {
                            item.add_time = this.utils.getTimeResult(new Date(item.add_time.replace(/-/g,'/')).getTime()/1000)
                        });
						let data = res.data.data
						if (data && data.length > 0) {
							if (page == 1) {
                                this.data = []
								this.data = data
							} else {
								this.data = this.data.concat(data)
							}
                        } else {
                            this.data = []
                        }
						this.page = page
						if (this.page >= res.data.total) {
							this.finished = true
						} else {
							this.finished = false
						}
					} else {
						this.$toast(res.errmsg)	
						this.finished = true
                        this.page = 0
                        this.data = []
					}
				}).catch(err=>{
                    this.$toast('服务异常,请稍后重试')
                    this.isLoading = false
					this.loading = false
					this.finished = true
                    this.page = 0
                    this.data = []
					this.isErr = true
				})
            },
            // 显示图片
            imgPreview (row,index) {
                let that = this
                ImagePreview({
                    images: row.img_list,
                    startPosition: index,
                    closeable: true
                });
            },
            // 跳转个人中心
            toUcenter (row) {
                this.$router.push({
                    path: '/mutualUcenter',
                    query: {
                        userId: row.user_id,
                        lastPath: '/mutualCircle'
                    }
                })
            },
            // 点赞添加/取消
            addLike (row) {
                this.$api.giveAdd({
                    circle_id: row.circle_id
                }).then(res => {
					if (res.errno == 0) {
                        row.is_dz = row.is_dz == 2 ? 1 : 2
                        if (row.is_dz == 1) {
                            row.dz+=1
                            let curIndex = 'no'
                            if (row.zlist && row.zlist.length > 0) {
                                row.zlist.forEach((item, index) =>{
                                    if (this.userInfo.user_id == item.z_user_id) {
                                        curIndex = index
                                    }
                                })
                            }
                            if (curIndex == 'no') {
                                row.zlist.unshift({
                                    name: this.userInfo.name,
                                    photo: this.userInfo.photo,
                                    z_user_id: this.userInfo.user_id
                                })
                            }
                        } else {
                            row.dz-=1
                            let curIndex = 'no'
                            if (row.zlist && row.zlist.length > 0) {
                                row.zlist.forEach((item, index) =>{
                                    if (this.userInfo.user_id == item.z_user_id) {
                                        curIndex = index
                                    }
                                })
                            }
                            if (curIndex != 'no') {
                                row.zlist.splice(curIndex,1)
                            }
                        }
                        this.$toast(row.is_dz == 1 ? '点赞成功' : '已取消点赞')
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
                    this.$toast('服务异常,请稍后重试')
				})
            },
            // 添加/取消关注
            toFollow (row) {
                this.$api.guanUserAdd({
                    user_id: row.user_id
                }).then(res => {
					if (res.errno == 0) {
                        let isGuan = row.is_guan == 2 ? 1 : 2
                        this.data.forEach(item =>{
                            if(item.user_id == row.user_id) {
                                item.is_guan = isGuan
                                // this.$set(row,'is_guan', isGuan)
                            }
                        })
                        this.$toast(row.is_guan == 1 ? '关注用户成功' : '已取消关注')
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
                    this.$toast('服务异常,请稍后重试')
				})
            },
            // 转发
            toShare () {
                this.$toast('转发功能暂未开放')
            },
		},
	}
</script>
<style lang="less">
	.mutualCircle {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: url(../../images/mutualCircle/index-bg.png) no-repeat;
		background-size: 100% 4.5rem;
		background-color: #f0f6fc;	
        overflow-y: auto;
		div {
			box-sizing: border-box;
        }
        .right-con {
            padding: 0.1rem 0.4rem;
            color: #333;
            background: #f9f9f9;
            opacity: 0.6;
            border-radius: 1000px;
            border: 1px solid #666;
        }
        .clearfix:after{
            content:"";/*设置内容为空*/
            height:0;/*高度为0*/
            line-height:0;/*行高为0*/
            display:block;/*将文本转为块级元素*/
            visibility:hidden;/*将元素隐藏*/
            clear:both;/*清除浮动*/
        }
        .clearfix{ zoom:1;/*为了兼容IE*/ }
		.van-nav-bar {
			// background: url(../../images/bgHeader5.png) no-repeat top center;
			// background-size: 100% 227px;
			background: transparent;

			.van-icon {
				color: #222222;
			}

			.van-nav-bar__title {
				font-size: 16px;
				font-weight: bold;
			}
        }
        .top-operate-con {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 0.4rem;
            margin: 20px 0;
            .operate-item {
                flex: 1;
                margin-right: 0.4rem;
                img {
                    width: 100%;
                }
            }
            .operate-item:nth-child(3) {
                margin-right: 0;
            }
        }
        .tab-box {
            display: flex;
            align-items: center;
            flex-direction: column;
            background: linear-gradient(0deg,#f0f6fc 0%, #ffffff 100%);
            height: 5.3rem;
            border-radius: 0.53rem 0.53rem 0 0;
            .tab-con {
                display: flex;
                align-items: center;
                width: 100%;
                .tab-item {
                    width: 50%;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding-top: 0.3rem;
                    height: 1rem;
                    img {
                        // height: 0.38rem;
                        width: 32%;
                    }
                }
            }
        }
        .van-sticky--fixed {
            z-index: 9999;
            .tab-box {
                border-radius: inherit;
                height: 1.2rem;
            }
        }
        .article-box {
            padding: 0 0.4rem;
            margin-top: -3.8rem;
            .article-con {
                width: 100%;
                display: flex;
                align-items: center;
                flex-direction: column;
                .list-loading-con {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    img {
                        width: 1rem;
                        animation: cuIcon-spin 1s infinite linear;
                    }
                    @keyframes cuIcon-spin {
                        0% {
                            -webkit-transform: rotate(0);
                            transform: rotate(0);
                        }

                        100% {
                            -webkit-transform: rotate(359deg);
                            transform: rotate(359deg);
                        }
                    }
                }
                .van-pull-refresh {
                    width: 100%;
                    min-height: 100%;
                }
                .no-data-con {
                    position: relative;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    justify-content: center;
                    min-height: 10rem;
                    .btn-item {
                        color: #fff;
                        background: #1989fa;
                        border-radius: 1000px;
                        width: 3rem;
                        height: 1rem;
                        line-height: 1rem;
                        font-size: 0.36rem;
                    }
                    .btn-item:active {
                        opacity: 0.6;
                    }
                }
                .article-item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    background: #fff;
                    border-radius: 10px;
                    padding: 0.4rem;
                    margin-bottom: 0.39rem;
                    .top-user-con {
                        width: 100%;
                        display: flex;
                        .user-avatar {
                            width: 1.05rem;
                            height: 1.05rem;
                            border-radius: 50%;
                            margin-right: 10px;
                            background: #f9f9f9;
                            overflow: hidden;
                            padding: 3px;
                            img {
                                width: 100%;
                                height: 100%;
                                border-radius: 1000px;
                                overflow: hidden;
                                object-fit: cover;
                            }
                        }
                        .user-info {
                            flex: 1;
                            .name {
                                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                                font-size: 0.4rem;
                                font-weight: bold;
                                margin-bottom: 10px;
                                line-height: 1.2;
                            }
                            .info {
                                display: flex;
                                align-items: center;
                                .info-item {
                                    display: flex;
                                    align-items: center;
                                    background: #f0f6fc;
                                    border-radius: 100px;
                                    color: #9aa8b6;
                                    padding: 3px 8px;
                                    font-size: 0.32rem;
                                    img {
                                        width: 0.3rem;
                                        margin-right: 3px;
                                    }
                                }
                                .addr-con {
                                    margin-right: 10px;
                                    max-width: 3.5rem;
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                    white-space: nowrap;
                                }
                                .time-con {
                                    max-width: 3rem;
                                    white-space: nowrap;
                                    overflow: hidden;
                                }
                            }
                        }
                        .user-status {
                            .follow-icon {
                                width: 0.5rem;
                            }
                        }
                    }
                    .detail-con {
                        width: 100%;
                        .text-con {
                            width: 100%;
                            font-size: 0.38rem;
                            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                            font-weight: 400;
                            text-align: justifyLeft;
                            color: #444444;
                            line-height: 1.5;
                            margin: 10px 0;
                        }
                        .img-con {
                            width: 100%;
                            .img-item {
                                --foo: calc((100% - 7.95rem)/2); // 发布的图片间隙距离
                                width: 2.65rem;
                                height: 1.85rem;
                                display: block;
                                float: left;
                                margin-right: var(--foo);
                                margin-bottom: var(--foo);
                            }
                            .img-item:nth-child(3n) {
                                margin-right: 0;
                            }
                        }
                    }
                }
            }
        }
        .bottom-con {
            display: flex;
            align-items: center;
            width: 100%;
            .avatar-con {
                flex: 1;
                color: #9aa8b6;
                .cu-avatar {
                    font-variant: small-caps;
                    margin: 0;
                    padding: 0;
                    display: inline-flex;
                    text-align: center;
                    justify-content: center;
                    align-items: center;
                    background-color: #f9f9f9;
                    color: #ffffff;
                    white-space: nowrap;
                    position: relative;
                    width: 1rem;
                    height: 1rem;
                    background-size: cover;
                    background-position: center;
                    vertical-align: middle;
                    border-radius: 50%;
                }

                .cu-avatar.sm {
                    width: 0.6rem;
                    height: 0.6rem;
                }

                .cu-avatar-group {
                    direction: rtl;
                    unicode-bidi: bidi-override;
                    display: inline-block;
                }

                .cu-avatar-group .cu-avatar {
                    margin-left: -0.4rem;
                    vertical-align: middle;
                }

                .cu-avatar-group .cu-avatar.sm {
                    margin-left: -0.26rem;
                    border: 1px solid #f9f9f9;
                }
            }
            .status-con {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                .status-item {
                    display: flex;
                    align-items: center;
                    color: #9aa8b6;
                    margin-left: 6px;
                    font-size: 0.35rem;
                    img {
                        width: 0.4rem;
                        margin-right: 5px;
                    }
                }
            }
        }
	}
</style>
