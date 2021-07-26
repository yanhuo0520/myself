<template>
	<div class="articleDetail">
		<div class="header"></div>
        <van-nav-bar :border="false" :title="title ? '【'+title+'】' : '文章详情'" left-arrow  @click-left="leftBack"/>
        <div class="task-box">
            <van-cell :title="title"  :label="'最近更新时间:'+date" />
            <div class="article-detail" v-html="content"></div>
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
	export default {
		name: "articleDetail",
		data() {
			return {
                id: '',
                title: '',
                date: '',
                content: '',
                isDetailLoading: true
			};
		},
		mounted() {
            window.leftBack = this.leftBack
            this.id = this.$route.query.id ? this.$route.query.id : ''
            this.getDetail()
		},
		methods: {
            leftBack() {
                let lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : ''
                if (lastPath) {
                    if (lastPath == '/addTask') {
                        this.$router.push({
                            path: '/addTask',
                            query: {
                                lastPath: '/articleDetail'
                            }
                        })
                    } else {
                        this.$router.go(-1)  
                    }
                } else {
    				this.$router.go(-1)
                }
            },
            getDetail () {
                this.isDetailLoading = true
				this.$api.helpDetail({
                    id: this.id
                }).then(res => {
                     this.isDetailLoading = false
					if (res.errno == 0) {
                        this.title = res.data.content
                        this.content = res.data.content_text
                        this.date = res.data.update_time ? res.data.update_time : res.data.add_time
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
                     this.isDetailLoading = false
					this.$toast('服务异常,请稍后重试')
				})
            },
        }
	};
</script>
<style lang="less">
	.articleDetail {
		background: #f0f6fc;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        
        .van-nav-bar {
            background: transparent;
			.van-icon {
				color: #222222;
			}
			.van-nav-bar__title {
				font-size: 16px;
				font-weight: bold;
			}
        }
        .header {
            position: fixed;
            top: 0;
            left: 0;
			background: url(../../images/bgHeader1.png) no-repeat;
			background-size: 100% 100%;
			width: 100%;
			height: 115px;
        }
        .task-box {
            position: relative;
            flex: 1;
            overflow-y: auto;
            border-radius: 10px;
            width: 94%;
            margin: 10px auto;
            box-shadow: 3px 3px 6px #ccc;
            .van-cell__title {
                font-weight: bold;
                .van-cell__label {
                    font-weight: normal;
                }
            }
            .article-detail {
                background: #fff;
                padding: 10px;
                font-size: 0.35rem;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
                line-height: 1.5;
                img {
                    width: 100%;
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
