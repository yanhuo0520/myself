<template>
	<div class="articleDetail" >
		<van-nav-bar :border="false"  title="圈子详情" left-arrow @click-left="leftBack"/>
        <!-- <div class="tab-box"></div> -->
        <div class="article-box">
            <div class="article-con">
                <div class="article-item">
                    <template v-if="detail">
                        <div class="top-user-con">
                            <div @click="toUcenterByTop" class="user-avatar" >
                                <img :src="detail.photo" alt="">
                            </div>
                            <div class="user-info">
                                <div class="name">{{detail.name}}</div>
                                <div class="info">
                                    <div class="info-item time-con">
                                        <img src="../../images/mutualCircle/time-icon.png" alt="">
                                        <span>{{detail.add_time}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="user-status">
                                <template v-if="detail.is_to == 2">
                                    <img  @click.stop="toFollow" class="follow-icon" src="../../images/mutualCircle/follow-icon.png" alt="">
                                </template>
                                <template v-if="detail.is_to == 1">
                                    <img @click.stop="toFollow" class="follow-icon" src="../../images/mutualCircle/follow-checked-icon.png" alt="">
                                </template>
                            </div>
                        </div>
                        <div class="detail-con">
                            <div class="text-con">
                                {{detail.content}}
                            </div>
                            <div class="img-con clearfix">
                                <van-image fit="cover"  class="img-item" v-for="(item,index) in detail.img_list" :key="index" :src="item" @click.stop="imgPreview(detail,index)">
                                    <!-- <template v-slot:error>加载失败</template> -->
                                </van-image>
                            </div>
                        </div>
                        <div class="addr-box" v-if="detail.address">
                            <div class="addr-con">
                                <img src="../../images/mutualCircle/location-icon.png" alt="">
                                <span>{{detail.address}}</span>
                            </div>
                        </div>
                    </template>
                    <van-tabs v-model="tabActive" @change="handleTabChange" sticky background="transparent" color="#3B6AF1" line-width="35px" line-height="2px" title-active-color="#3B6AF1">
                        <van-tab title="评论" name="1"></van-tab>
                        <van-tab title="转发" name="2"></van-tab>
                        <van-tab title="点赞" name="3"></van-tab>
                        <van-list v-model="loading" :finished="finished" @load="getData" :finished-text="data && data.length > 0 ? '没有更多了' : ''" >
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
                                        <span>暂无{{tabActive == 1 ? '评论' : tabActive == 2 ? '转发' : '点赞'}}</span>
                                    </div>
                                </template>
                            </template>
                            <template v-if="tabActive == 1">
                                <div class="tab-con">
                                    <div class="tab-item van-hairline--bottom" v-for="(item,index) in data" :key="index">
                                        <div class="top-user-con">
                                            <div class="user-avatar" @click="toUcenter(item)"  >
                                                <img :src="item.photo" alt="">
                                            </div>
                                            <div class="user-info">
                                                <div class="name">{{item.user_name}}</div>
                                                <div class="info">
                                                    <div class="time-con">
                                                        <span>{{item.add_time}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="user-status">
                                                <!-- <img class="follow-icon" src="../../images/mutualCircle/follow-icon.png" alt=""> -->
                                            </div>
                                        </div>
                                        <div class="detail-con">
                                            <div class="text-con">
                                                {{item.comment}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-if="tabActive == 2">
                                <div class="tab-con">
                                    <div class="tab-item van-hairline--bottom" v-for="(item,index) in data" :key="index">
                                        <div class="top-user-con">
                                            <div @click="toUcenter(item)" class="user-avatar">
                                                <img  :src="item.photo" alt="">
                                            </div>
                                            <div class="user-info">
                                                <div class="name">{{item.user_name}}</div>
                                                <div class="info">
                                                    <div class="time-con">
                                                        <span>{{item.add_time}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="user-status">
                                                <!-- <img class="follow-icon" src="../../images/mutualCircle/follow-icon.png" alt=""> -->
                                            </div>
                                        </div>
                                        <div class="detail-con">
                                            <div class="text-con">
                                                转发动态
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-if="tabActive == 3">
                                <div class="tab-con">
                                    <div @click="toUcenter(item)" class="tab-item van-hairline--bottom" v-for="(item,index) in data" :key="index">
                                        <div class="top-user-con tab3-top">
                                            <div @click="toUcenter(item)" class="user-avatar">
                                                <img :src="item.photo" alt="">
                                            </div>
                                            <div class="user-info">
                                                <div class="name tit">{{item.user_name}}</div>
                                            </div>
                                            <div class="user-status">
                                                <!-- <img class="follow-icon" src="../../images/mutualCircle/follow-icon.png" alt=""> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </van-list>
                    </van-tabs>
                </div>
            </div>
        </div>
        <div style="height:60px"></div>
        <div class="footer-con">
            <form action="#" style="flex:1"> 
                <van-field ref="sendMsg" type="text" v-model="msg" placeholder="请输入您的评论" clearable  @keyup.13="submitComment"/>
            </form>
            <div class="btn-con" v-if="detail">
                <template v-if="detail.is_dz == 2">
                    <img class="icon" @click="addLike" src="../../images/mutualCircle/like-icon.png" alt="">
                </template>
                <template v-if="detail.is_dz == 1">
                    <img class="icon" @click="addLike" src="../../images/mutualCircle/like-selected-icon.png" alt="">
                </template>

                <template v-if="detail.is_zf == 2">
                    <img class="icon" @click="toShare" src="../../images/mutualCircle/share-icon.png" alt="">
                </template>
                <template v-if="detail.is_zf == 1">
                    <img class="icon" @click="toShare" src="../../images/mutualCircle/share-icon.png" alt="">
                </template>
                <!-- <van-icon name="good-job-o" size="22"/>
                <van-icon name="share-o" size="22"/> -->
            </div>
        </div>

        <div class="fixed-full-con" @click.stop v-if="isDetailLoading">
            <div class="load-modal">
                <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                <span class="text">加载中...</span>
            </div>
        </div>
	</div>
</template>
<script>
    import { ImagePreview } from 'vant';
	export default {
		name: "articleDetail",
		data() {
			return {
                user_id: '',
                userAvatar: '',
                user_name: '',

                circle_id: null,
                detail: null,
                loading: false,
                finished: false,
                isErr: false,
                page: 0,
                size: 10,
                data: [],
                msg: '',

                tabActive: "1",

                isLoading: false,
                isDetailLoading: false
			};
		},
		activated() {
            window.leftBack = this.leftBack
            let lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : ''
            if (lastPath == '/mutualCircle') {
                this.status = 1
                this.lastStatus = 1
                this.circle_id = this.$route.query.id ? this.$route.query.id : null
                if (this.circle_id) {
                    this.isDetailLoading = true
                    this.getDetail()
                    this.getUserDetail('')
                    this.getData()
                } else {
                    this.isDetailLoading = false
                    this.$toast('ID参数错误,正在返回首页')
                    setTimeout(() =>{
                        this.$router.push('/mutualCircle')
                    },500)
                }
            } else {
                let meta = this.$route.meta
                if (meta && meta.scrollPosition && Number(meta.scrollPosition.y) > 100) {
                    this.isDetailLoading = false
                    this.lastStatus = ''
                    document.querySelector('.articleDetail').scrollTop = meta.scrollPosition.y
                } else  {
                    this.status = 1
                    this.lastStatus = 1
                    this.circle_id = this.$route.query.id ? this.$route.query.id : null
                    if (this.circle_id) {
                        this.isDetailLoading = true
                        this.getDetail()
                        this.getUserDetail('')
                        this.getData()
                    } else {
                        this.$toast('ID参数错误,正在返回首页')
                        setTimeout(() =>{
                            this.$router.push('/mutualCircle')
                        },500)
                    }
                }
            }
        },
        beforeRouteLeave (to, from, next) {
            from.meta.scrollPosition.y = document.querySelector('.articleDetail').scrollTop
			next()
	    },
		methods: {
			// 返回
			leftBack () {
                this.$router.go(-1)
            },
            // 路由跳转
            toRouter (path) {
                this.$router.push(path)
            },
            // onRefresh() {
            //     this.page = 0
            //     this.loading = true
            //     this.finished = false
            //     this.getData()
            // },
            // 获取用户信息
            getUserDetail (userId) {
                this.$api.userDetail({
                    user_id: userId
                }).then(res => {
					if (res.errno == 0) {
                        if (userId) {
                            this.$set(this.detail, 'is_to', res.data.is_to)
                            this.$set(this.detail, 'is_me', res.data.is_me)
                        } else {
                            this.user_id = res.data.user_id
                            this.userAvatar = res.data.photo
                            this.user_name = res.data.name
                        }
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
                    this.$toast('服务异常,请稍后重试')
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
            // 跳转用户中心 顶部头像点击
            toUcenterByTop () {
                this.$router.push({
                    path: '/mutualUcenter',
                    query: {
                        lastPath: '/mutualDetail',
                        userId: this.detail.user_id
                    }
                })
            },
            // 跳转用户中心
            toUcenter (row) {
                this.$router.push({
                    path: '/mutualUcenter',
                    query: {
                        lastPath: '/mutualDetail',
                        userId: row.user_id
                    }
                })
            },
            // 获取圈子详情
            getDetail () {
                this.$api.circleDetail({
                    circle_id: this.circle_id
                }).then(res => {
                    this.isDetailLoading = false
					if (res.errno == 0) {
                        res.data.add_time = this.utils.getTimeResult(new Date(res.data.add_time.replace(/-/g,'/')).getTime()/1000)
                        this.detail = res.data
                        this.getUserDetail(res.data.user_id)
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
                    this.isDetailLoading = false
                    this.$toast('服务异常,请稍后重试')
				})
            },
            // 发布评论
            submitComment () {
                this.$api.circleCommentAdd({
                    circle_id: this.circle_id,
                    comment: this.msg
                }).then(res => {
					if (res.errno == 0) {
                        if (this.tabActive == 1) {
                            let tmpObj = {
                                user_id: this.user_id,
                                photo: this.userAvatar,
                                user_name: this.user_name,
                                comment: this.msg,
                                is_user: 1,
                                add_time: this.utils.dateFormat('yyyy-MM-dd HH:mm:ss')
                            }
                            this.data.unshift(tmpObj)
                        }
                        this.msg = ''
                        this.$toast('评论成功')
                        this.$refs.sendMsg.blur()
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
                    this.$toast('服务异常,请稍后重试')
				})
            },
            // 点赞
            addLike () {
                this.$api.giveAdd({
                    circle_id: this.circle_id
                }).then(res => {
					if (res.errno == 0) {
                        if (this.tabActive == 3) {
                            let curIndex = null
                            if (this.detail.is_dz == 2) {
                                let tmpObj = {
                                    user_name: this.user_name,
                                    user_id: this.user_id,
                                    photo: this.userAvatar,
                                    is_user: 1
                                }
                                this.data.unshift(tmpObj)
                            } else {
                                this.data.forEach((item,index) =>{
                                    if (item.is_user == 1) {
                                        curIndex = index
                                    }
                                })
                                this.data.splice(curIndex,1)
                            }
                        }
                        this.detail.is_dz = this.detail.is_dz == 2 ? 1 : 2
                        this.$toast(this.detail.is_dz == 1 ? '点赞成功' : '已取消点赞')
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
            // 切换任务完成状态
            handleTabChange(type) {
                this.tabActive = type;
                this.page = 0
                this.loading = true
                this.finished = false
                this.data = [];
                this.getData()
            },
            getData () {
                if (this.tabActive == 1) {
                    this.commentLists()
                } else if (this.tabActive == 2) {
                    this.circleZfLists()
                } else if (this.tabActive == 3) {
                    this.giveLists()
                }
            },
            // 获取评论列表
            commentLists () {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
                let params = {
                    page: page,
                    size: this.size,
                    circle_id: this.circle_id
                }
				this.$api.circleCommentLists(params).then(res => {
                    this.loading = false
                    this.isLoading = false
					if (res.errno == 0) {
						let data = res.data.data
						if (data && data.length > 0) {
							if (page == 1) {
                                this.data = []
                                this.data = data
							} else {
								this.data = this.data.concat(data)
							}
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
            // 获取转发列表
            circleZfLists () {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
                let params = {
                    page: page,
                    size: this.size,
                    circle_id: this.circle_id
                }
				this.$api.circleZfLists(params).then(res => {
                    this.loading = false
                    this.isLoading = false
					if (res.errno == 0) {
						let data = res.data.data
						if (data && data.length > 0) {
							if (page == 1) {
                                this.data = []
                                this.data = data
							} else {
								this.data = this.data.concat(data)
							}
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
            // 获取点赞列表
            giveLists () {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
                let params = {
                    page: page,
                    size: this.size,
                    circle_id: this.circle_id
                }
				this.$api.giveLists(params).then(res => {
                    this.loading = false
                    this.isLoading = false
					if (res.errno == 0) {
						let data = res.data.data
						if (data && data.length > 0) {
							if (page == 1) {
                                this.data = []
                                this.data = data
							} else {
								this.data = this.data.concat(data)
							}
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
            // 添加/取消关注
            toFollow () {
                this.$api.guanUserAdd({
                    user_id: this.detail.user_id
                }).then(res => {
					if (res.errno == 0) {
                        let isGuan = this.detail.is_to == 2 ? 1 : 2
                        this.$set(this.detail,'is_to', isGuan)
                        this.$toast(isGuan == 1 ? '关注用户成功' : '已取消关注')
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
                    this.$toast('服务异常,请稍后重试')
				})
            },
		},
	}
</script>
<style lang="less">
	.articleDetail {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: url(../../images/bgHeader5.png) no-repeat;
		background-size: 100% 227px;
		background-color: #f0f6fc;	
        overflow-y: auto;
		div {
			box-sizing: border-box;
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

        .article-box {
            margin: 0 0.4rem;
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
                .no-data-con {
                    position: relative;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    justify-content: center;
                    min-height: 5rem;
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
                    .top-user-con {
                        width: 100%;
                        display: flex;
                        .user-avatar {
                            width: 1.05rem;
                            height: 1.05rem;
                            border-radius: 50%;
                            margin-right: 10px;
                            background: #f9f9f9;
                            padding: 3px;
                            img {
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
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
                                        width: 10px;
                                        margin-right: 3px;
                                    }
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
                                width: 18px;
                            }
                        }
                    }
                    .addr-box {
                        width: 100%;
                       display: flex;
                       align-items: center;
                        .addr-con {
                            width: auto;
                            display: flex;
                            align-items: center;
                            background: #f0f6fc;
                            border-radius: 100px;
                            color: #9aa8b6;
                            padding: 3px 8px;
                            font-size: 0.32rem;
                            img {
                                width: 10px;
                                margin-right: 3px;
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
                    .van-tabs {
                        width: 100%;
                    }
                }
                .tab-con {
                    .tab-item {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        background: #fff;
                        border-radius: 10px;
                        padding: 0.3rem 0;
                        .top-user-con {
                            width: 100%;
                            display: flex;
                            .user-avatar {
                                width: 0.8rem;
                                height: 0.8rem;
                                border-radius: 50%;
                                margin-right: 6px;
                                background: #f9f9f9;
                                padding: 3px;
                                img {
                                    width: 100%;
                                    height: 100%;
                                    object-fit: cover;
                                }
                            }
                            .user-info {
                                flex: 1;
                                .name {
                                    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                                    font-size: 0.32rem;
                                    margin-bottom: 6px;
                                    line-height: 1.2;
                                }
                                .tit {
                                    margin: 0;
                                    line-height: inherit;
                                    width: 100%;
                                    height: 100%;
                                    display: flex;
                                    align-items: center;
                                }
                                .info {
                                    display: flex;
                                    align-items: center;
                                    .time-con {
                                        overflow: inherit;
                                        color: #999;
                                        font-size: 0.3rem;
                                    }
                                }
                            }
                            .user-status {
                                .follow-icon {
                                    width: 18px;
                                }
                            }
                        }
                        .tab3-top {
                            // padding: 6px 0;
                        }
                        .detail-con {
                            width: 100%;
                            .text-con {
                                width: 95%;
                                font-size: 0.34rem;
                                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                                font-weight: 400;
                                text-align: justifyLeft;
                                color: #444444;
                                line-height: 1.5;
                                margin: 6px 0;
                                margin-left: 2.5%;
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
                        .van-tabs {
                            width: 100%;
                        }
                    }
                }
            }
        }
        .footer-con {
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            background: #fff;
            display: flex;
            align-items: center;
            border-top: 1px solid #f1f1f1;
            padding: 6px 10px;
            .van-cell  {
                background: #f1f1f1;
                border-radius: 1000px;
                padding: 0.16rem 0.32rem;
            }
            .btn-con {
                display: flex;
                width: 2.5rem;
                padding: 0 0.5rem;
                align-items: center;
                justify-content: space-between;
                .icon {
                    width: 0.5rem;
                }
            }
        }
        .fixed-full-con {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background:  rgba(0, 0, 0, 0.3);
			z-index: 9999;
            .cu-load::before {
                font-family: "cuIcon";
                display: inline-block;
                margin-right: 6px;
            }
            .load-modal {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 4rem;
                height: 4rem;
                transform: translate(-50%,-50%);
                background-color: #ffffff;
                border-radius: 10px;
                // box-shadow: 0 0 0px 2000px rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                font-size: 28px;
                z-index: 9999;
                text-align: center;
                .logo {
                    width: 1.2rem;
                }
                .text {
                    font-size: 0.4rem;
                    margin-top: 10px;
                }
            }
            .load-modal::after {
                content: "";
                position: absolute;
                background-color: #ffffff;
                border-radius: 50%;
                width: 75%;
                height: 75%;
                font-size: 14px;
                border-top: 5px solid rgba(0, 0, 0, 0.05);
                border-right: 5px solid rgba(0, 0, 0, 0.05);
                border-bottom: 5px solid rgba(0, 0, 0, 0.05);
                border-left: 5px solid #f37b1d;
                animation: cuIcon-spin 1s infinite linear;
                z-index: -1;
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
	}
</style>
