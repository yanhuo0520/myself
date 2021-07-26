<template>
	<div class="commentList" >
		<van-nav-bar :border="false"  title="我的评论" left-arrow @click-left="leftBack"/>
        <div class="article-box">
            <div class="article-con">
                <van-pull-refresh style="min-height:60vh" v-model="isLoading" @refresh="onRefresh" :disabled="!data || data.length == 0">
                    <van-list :immediate-check="false" v-model="loading" :finished="finished" @load="getData" >
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
                                    <span>暂无被评论的圈子</span>
                                    <div class="no-btn-con">
                                        <div class="btn-item" @click="toAddArticle">去发圈</div>
                                    </div>
                                </div>
                            </template>
                        </template>
                        <template >
                            <div class="article-item" v-for="(item,index) in data" :key="index" >
                                <div class="top-user-con">
                                    <div class="user-avatar" @click="toUcenter(item)">
                                        <img  :src="item.ping_photo" alt="">
                                    </div>
                                    <div class="user-info">
                                        <div class="name">{{item.ping_name}}</div>
                                        <div class="info">
                                            <div class="info-item time-con">
                                                <img src="../../images/mutualCircle/time-icon.png" alt="">
                                                <span>{{item.add_time}}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- <div class="user-status">
                                        <img class="follow-icon" src="../../images/mutualCircle/follow-icon.png" alt="">
                                    </div> -->
                                </div>
                                <div class="detail-con" >
                                    <div class="text-con">
                                        {{item.comment}}
                                    </div>
                                </div>
                                <div class="bottom-con" @click="toDetail(item)">
                                    <van-image fit="cover" class="main-img" :src="item.pic_index" >
                                        <!-- <template v-slot:error>加载失败</template> -->
                                    </van-image>
                                    <div class="my-article">
                                        <div class="tit">{{item.ben_name}}</div>
                                        <div class="info">
                                            {{item.content}}
                                        </div>
                                    </div>
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
	export default {
		name: "commentList",
		data() {
			return {
                loading: false,
                finished: false,
                isErr: false,
                page: 0,
                size: 10,
                data: [],

                isLoading: false,
			};
		},
		activated() {
            window.leftBack = this.leftBack
            let lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : ''
            if (lastPath == '/mutualCircle') {
                this.page = 0
                this.loading = true
                this.finished = false
                this.data = []
                this.getData()
            } else {
                let meta = this.$route.meta
                if (meta && meta.scrollPosition && Number(meta.scrollPosition.y) > 100) {
                    document.querySelector('.commentList').scrollTop = meta.scrollPosition.y
                } else  {
                    this.page = 0
                    this.loading = true
                    this.finished = false
                    this.data = []
                    this.getData()
                }
            }
        },
        beforeRouteLeave (to, from, next) {
            from.meta.scrollPosition.y = document.querySelector('.commentList').scrollTop
			next()
	    },
		methods: {
			// 返回
			leftBack () {
				this.$router.push('/mutualCircle')
            },
            onRefresh() {
                this.page = 0
                this.loading = true
                this.finished = false
                this.getData()
            },
             // 跳转圈子详情
            toDetail (row) {
                this.$router.push({
                    path: '/mutualDetail',
                    query: {
                        id: row.circle_id,
                        lastPath: '/commentList'
                    }
                })
            },
            // 去发圈
            toAddArticle () {
                this.$router.push({
                    path: '/addArticle',
                    query: {
                        lastPath: '/commentList',
                        // lastScrollTop: document.querySelector('.commentList').scrollTop
                    }
                })
            },
            // 跳转个人中心
            toUcenter (row) {
                this.$router.push({
                    path: '/mutualUcenter',
                    query: {
                        userId: row.user_id,
                        lastPath: '/commentList'
                    }
                })
            },
            getData () {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
                let params = {
                    page: page,
                    size: this.size,
                }
				this.$api.myCircleCommentLists(params).then(res => {
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
		},
	}
</script>
<style lang="less">
	.commentList {
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
            padding: 0 0.4rem;
            .article-con {
                width: 100%;
                display: flex;
                align-items: center;
                flex-direction: column;
                .van-pull-refresh {
                    width: 100%;
                }
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
                            padding: 3px;
                            background: #f9f9f9;
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
                                .addr-con {
                                    margin-right: 10px;
                                    max-width: 3.5rem;
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                    white-space: nowrap;
                                }
                                .time-con {
                                    max-width: 6rem;
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
            background: #f9f9f9;
            .main-img {
                width: 1.8rem;
                height: 1.8rem;
                border-radius: 4px;
            }
            .my-article {
                flex: 1;
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                padding-left: 10px;
                .tit {
                    font-weight: bold;
                    font-size: 0.35rem;
                }
                .info {
                    margin-top: 6px;
                    color: #888;
                    line-height: 1.2;
                    display: -webkit-box;
                    text-overflow: ellipsis;
                    word-wrap: break-word;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            }
        }
	}
</style>
