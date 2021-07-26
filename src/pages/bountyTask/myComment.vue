<template>
	<div class="myComment">
		<van-sticky>
			<div class="header">
				<van-nav-bar :border="false"  title="我的评价" left-arrow   @click-left="leftBack"/>
				<!-- <div class="search-con">
					<van-search v-model="searchName" shape="round" background="transparent" placeholder="请输入任务标题" @search="onSearch" @clear="onSearch" clearable/>
				</div> -->
			</div>
		</van-sticky>
        <div class="task-box">
			<van-pull-refresh v-model="isLoading" @refresh="onRefresh" :disabled="!data || data.length == 0">
				<van-list v-model="loading" :finished="finished" :finished-text="data && data.length > 0 ? '没有更多了' : '暂无评价'" @load="getData" >
					<template #loading>
                        <div class="list-loading-con">
                            <img  src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                            <span>加载中...</span>
                        </div>
                    </template>
					<div class="task-group" v-for="(item, index) in data" :key="index" @click="toTaskDetail(item)">
						<div class="task-tit-con van-hairline--bottom">
							<div class="tit">{{item.title}}</div>
							<div class="num">{{item.add_time}}</div>
						</div>
						<div class="task-con">
							<div class="task-img-con">
								<img :src="item.icon ? item.icon : 'https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png'" alt="">
							</div>
							<div class="task-desc-con">
								<div class="task-tag-con">
									<div class="tag">{{item.type_name}}</div>
									<template v-if="item.name">
										<div class="tag name" >{{item.name}}</div>
									</template>
								</div>
								<div class="task-desc-con">{{item.note}}</div>
							</div>
							<div class="task-price-con">
								<div class="tip" v-if="item.is_n == 1">已匿名</div>
								<div class="price"></div>
								<div class="btn-con" @click.stop="delItem(item, index)">
									<div class="btn-item">删除</div>
								</div>
							</div>
						</div>
						<div class="comment-text">{{item.comment ? item.comment : '您还未评价'}}</div>
					</div>
				</van-list>
			</van-pull-refresh>
		</div>
	</div>
</template>
<script>
	export default {
		name: "myComment",
		data() {
			return {
				searchName: '',
				loading: false,
				finished: false,
				isErr: false,
				page: 0,
				size: 10,
				data: [],
				isLoading: false
			};
		},
		mounted() {
			window.leftBack = this.leftBack
		},
		methods: {
            leftBack() {
                this.$router.push('/taskCenter');
			},
			onRefresh() {
                this.page = 0
                this.loading = true
                this.finished = false
                this.getData()
            },
			// 获取任务列表
			getData() {
				this.finished = false
				let page = this.page + 1
				this.loading = true
				
				this.$api.myCommentLists({
					page: page,
					size: this.size,
					title: this.searchName,
				}).then(res => {
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
					}
				}).catch(err=>{
					this.$toast('服务异常,请稍后重试')
					this.isLoading = false
					this.loading = false
					this.finished = true
					this.page = 0
					this.isErr = true
				})
			},
			// 搜索
			onSearch () {
				this.page = 0
				this.loading = true
                this.finished = false
				this.data = []
				this.getData()
            },
            // 删除
            delItem (item, index) {
                this.$dialog.confirm({
                    title: '提示',
                    message: '确认删除此评论吗?',
                    })
                    .then(() => {
                        this.$api.commentDel({
                            reward_comment_id: item.reward_comment_id
                        }).then(res => {
                            if (res.errno == 0) {
                                this.$toast('删除成功')
                                this.data.splice(index, 1)
                                if (this.data && this.data.length == 0) {
                                    this.getData()
                                }
                            } else {
                                this.$toast(res.errmsg)	
                            }
                        }).catch(err=>{
                            this.$toast('服务异常,请稍后重试')
                        })
                    })
                    .catch(() => {
                        // on cancel
                });
            },
			// 前往任务详情
			toTaskDetail (item) {
				this.$router.push({
					path: '/taskDetail',
					query: {
						id: item.reward_id,
						lastPath: '/myComment'
					}
				})
			}
		}
	};
</script>
<style lang="less">
	.myComment {
		min-height: 100%;
		background: #f0f6fc;
        position: relative;
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
			background: url(../../images/bgHeader1.png) no-repeat;
			background-size: 100% 100%;
			width: 100%;
			height: 65px;
			.search-con {
				display: flex;
				justify-content: space-between;
                align-items: center;
                padding: 0 10px;
                .van-search {
                    width: 100%;
                    .van-search__content--round {
                        background: #fff;
                    }
                }
			}
		}
		.task-box {
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
                min-height: 450px;
            }
			.task-group-type {
				display: flex;
				align-items: center;
				padding: 6px 10px;
				.name-con {
					display: flex;
					align-items: center;
					.icon {
						width: 0.7rem;
					}
					.desc {
						font-weight: bold;
						font-size: 14px;
					}
				}
			}
			.task-group {
				margin: 0 10px;
				background: #fff;
				border-radius: 10px;
				margin-bottom: 15px;
				box-shadow: 5px 5px 10px #ccc;
				.task-tit-con {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 10px;
					.tit {
						font-weight: bold;
						font-size: 14px;
					}
					.num {
						color: #999
					}
				}
				.task-con {
					display: flex;
					align-items: center;
					padding: 10px;
					.task-img-con {
						width: 50px;
						height: 50px;
						border-radius: 50%;
						margin-right: 8px;
						img {
							width: 100%;
							height: 100%;
						}
					}
					.task-desc-con {
						flex: 1;
						display: flex;
						flex-direction: column;
						overflow: hidden;
						.task-tag-con {
							display: flex;
							margin-bottom: 6px;
							.tag {
								padding: 4px 6px;
								background: rgb(161, 122, 255);
								// background: rgb(219, 204, 255);
								// color: rgb(161, 122, 255);
								color: #fff;
								border-radius: 100px;
								font-weight: normal;
								font-size: 0.3rem
							}
							.name {
								margin-left: 10px;
								background: #1989fa;
								color: #fff;
							}
							.sale {
								margin-left: 10px;
								background: #F56C6C;
								color: #fff;
							}
							.isShow {
								background: #67C23A;
								color: #fff;
							}
						}
						.task-desc-con {
							display: block;
							width: 100%;
							color: #666;
							overflow: hidden; 
							text-overflow: ellipsis;
							white-space: nowrap; 
						}
					}
                }
                .comment-text {
                    padding: 10px;
                    color: #000;
                }
				.task-price-con {
					display: flex;
					flex-direction: column;
					align-items: center;
					.tip {
						color: #999;
					}
					.price {
						font-weight: bold;
						font-size: 14px;
						color: #F85E23;
						padding: 6px 0;
					}
					.btn-con {
						display: flex;
						align-items: center;
						margin-left: 8px;
						.btn-item {
							padding: 6px 12px;
							background: #ee0a24;
							color: #fff;
							border-radius: 1000px;
						}
					}
				}
			}
		}
		.slect-tit-con {
			display: flex;
			align-items: center;
			justify-items: center;
			.text {
				width: 50px;
				height: 50px;
				color: #7045f2;
            }
            .cancle {
                width: 70px!important;
            }
			.tit {
				flex: 1;
				display: block;
				overflow: hidden; 
				text-overflow: ellipsis;
				white-space: nowrap; 
			}
		}
		.van-cascader__title {
			width: 100%;
			height: 100%;
			line-height: normal;
			.slect-tit-con {
				width: 100%;
				height: 100%;
				.text {
					width: 50px;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.tit {
					text-align: center;
					.masker {
						font-weight: bold;
					}
				}
			}
		}
	}
</style>
