<template>
	<div class="huzhudOut" @scroll="scrollEvent($event)" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="定期本金取出" left-arrow fixed @click-left="leftBack" />
		<div class="content">
			<div class="item" v-for="(item, index) in proList" :key="index">
				<div class="header">
					<p class="time">{{item.save_date}}</p>
					<p class="btn" @click="goOut(item.money)">到期取出</p>
				</div>
				<van-grid class="grid" :column-num="3" :border="false">
					<van-grid-item>
						<p class="num">{{item.money}}</p>
						<p class="title">存入金额</p>
					</van-grid-item>
					<van-grid-item>
						<p class="num">{{item.term_name}}</p>
						<p class="title">存入期限</p>
					</van-grid-item>
					<van-grid-item>
						<p class="num">{{item.save_rate}}</p>
						<p class="title">存入利率</p>
					</van-grid-item>
					<van-grid-item>
						<p class="num">{{item.start_rate_date}}</p>
						<p class="title">起息日期</p>
					</van-grid-item>
					<van-grid-item>
						<p class="num">{{item.pay_way}}</p>
						<p class="title">支付方式</p>
					</van-grid-item>
					<van-grid-item>
						<p class="num">{{item.end_rate_date}}</p>
						<p class="title">到期日期</p>
					</van-grid-item>
				</van-grid>
			</div>

			<!-- 加载中 -->
			<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
			<!-- 没有更多了 -->
			<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>
		</div>

	</div>
</template>
<script>
	export default {
		name: "huzhudOut",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				totalMoney: '',
				status: 10, // status存款的状态：0全部 10未取出 1已取出
				proList: [],
				pageSize: 10, //每页显示
				page: 1, //当前页
				totalNum: 0, //总条数
				totalPage: 1, //总页数
				ifFinish: false, //是否加载完成
				isLoading: true, //是否加载更多
				deviceTip: ''
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.getList()
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			// 页面滚动
			scrollEvent(e) {
				if (e instanceof Event) {
					let el = e.target;
					let scrollTop = el.scrollTop;
					let clientHeight = el.clientHeight; // 获取可视区的高度
					let scrollHeight = el.scrollHeight; // 获取滚动条的总高度
					let height = 50;

					if (scrollTop > 138) {
						this.ifFixed = true
					} else {
						this.ifFixed = false
					}

					//到底了
					// console.log(this.isLoading, this.ifFinish);
					// console.log(scrollTop, clientHeight, scrollHeight);
					//是否继续加载且已完成加载
					if (scrollTop + clientHeight >= scrollHeight && this.isLoading && !this.ifFinish && this.page <= this
						.totalPage) {
						// 把距离顶部的距离加上可视区域的高度 等于或者大于滚动条的总高度就是到达底部
						this.isLoading = true;
						// console.log("到底了");
						setTimeout(() => {
							this.getList();
						}, 1000);
					}

				}
			},
			getList() {
				let data = {}
				data.status = this.status
				data.page = this.page
				data.size = this.pageSize
				this.$api.regular_lists(data).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.totalNum = res.data.count;
						this.totalPage = res.data.total_page
						this.totalMoney = res.data.regular_money
						if (this.totalNum == 0) {
							// console.log("没有数据");
							this.isLoading = false;
							this.ifFinish = true;
							this.page = 1;
							this.deviceTip = "暂无数据";
							return false;
						}
						this.proList = this.proList.concat(res.data.log);
						// console.log(this.page, this.totalPage);
						if (this.page == this.totalPage) {
							this.isLoading = false;
							this.ifFinish = true;
							// this.page = 1;
							this.deviceTip = "没有更多了~";
							// console.log("没有更多了");
						} else {
							// console.log("下一页");
							this.isLoading = true;
							this.ifFinish = false;
							this.page++;
							this.deviceTip = "正在加载中~";
						}
					} else {
						this.proList = [];
						this.isLoading = false;
						this.ifFinish = true;
						this.page = 1;
						this.deviceTip = "数据加载失败~";
					}
				}).catch(err => {
					this.$toast.clear()
				});
			},
			// 到期转出
			goOut(money){
				this.$router.push({
					path: '/huzhuhOut',
					query: {
						dingMoney: money
					}
				})
			}

		}
	}
</script>
<style lang="less">
	.huzhudOut {
		padding-top: 46px;
		background: #F0F6FC;
		overflow: auto;

		.van-nav-bar {
			background: #F0F6FC;

			.van-icon {
				color: #222222;
			}

			.van-nav-bar__title {
				font-size: 16px;
				font-weight: bold;
			}
		}

		.van-hairline--bottom::after {
			border-bottom-width: 0
		}

		.content {
			.item {
				margin: 10px 10px 0 10px;
				border-radius: 10px;
				background: #FFFFFF;

				.header {
					font-size: 15px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background: url(../../images/right1.png) no-repeat calc(100% - 10px) center;
					background-size: 9px 15px;
					height: 42px;
					padding: 0 30px 0 15px;
					position: relative;

					&::before {
						position: absolute;
						top: 16px;
						left: 8px;
						content: '';
						width: 3px;
						height: 8px;
						border-radius: 35%;
						background: #3B6AF1;
					}
					.btn{
						    text-align: center;
						    line-height: 24px;
								font-size: 14px;
								padding: 0 8px;
						    color: #FFFFFF;
						    border-radius: 30px;
						    background: #3B6AF1;
						    border: 1px solid #3B6AF1;
					}
				}

				.grid {
					.van-grid-item {
						border-top: 1px solid #F0F6FC;
						border-right: 1px solid #F0F6FC;

						&:nth-child(3n) {
							border-right: none;
						}

						&:first-child {
							.num {
								&::before {
									background: none;
								}
							}
						}

						.num {
							font-size: 15px;
							position: relative;

							&::before {
								position: absolute;
								top: -5px;
								left: calc(100% + 2px);
								content: '';
								min-width: 14px;
								height: 10px;
								background: url(../../images/yuan1.png) no-repeat;
								background-size: auto 10px;
							}
						}

						.title {
							margin-top: 5px;
							color: #9AA8B6;
						}
					}
				}
			}

			.null {
				text-align: center;

				img {
					max-width: 100%;
				}
			}

			.van-loading,
			.noMore {
				padding: 10px 0;
				text-align: center;
			}
		}


	}
</style>
