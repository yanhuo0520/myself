<template>
	<div class="shouyiList" @scroll="scrollEvent($event)" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="收益记录" left-arrow fixed @click-left="leftBack" />
		<div class="topTitle">
			<p class="time" @click="show=true">{{showTime}}</p>
			<p>本月收益￥{{monthMoney}} 累积收益￥{{totalMoney}}</p>
		</div>
		<div class="content" v-if="list.length > 0">
			<div class="item" v-for="(item, index) in list" :key="index">
				<div class="left">
					<img src="../../images/lixiIcon.png" />
					<div>
						<p class="title">{{item.log_type_str}}</p>
						<p class="time">{{item.log_date}}</p>
					</div>
				</div>
				<p class="price">{{item.log_money}}</p>
			</div>
			<!-- 加载中 -->
			<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
			<!-- 没有更多了 -->
			<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>
		</div>
		<!-- 暂无内容 -->
		<div class="content null" v-else-if="list.length == 0 && !isLoading">
			<img src="../../images/zanwu.png" alt="" />
		</div>


		<van-popup v-model="show" round position="bottom" :style="{ height: '40%' }">
			<van-datetime-picker v-model="currentDate" type="year-month" title="选择年月" :min-date="minDate"
				:max-date="maxDate" @cancel="show=false" @confirm="handleTime" />
		</van-popup>


	</div>
</template>
<script>
	export default {
		name: "shouyiList",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 106,
				showTime: '',
				monthMoney: 0,
				totalMoney: 0,
				show: false,
				minDate: new Date(2020, 0, 1),
				maxDate: new Date(),
				currentDate: new Date(),
				searchDate: '',
				list: [],
				pageSize: 20, //每页显示
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
			
			this.$toast.loading({
				message: '加载中...',
				forbidClick: true,
				duration: 0,
			});
			
			this.showTime = this.$dateCurMonth()
			this.searchDate = this.$dateCurYearMonth()
			
			this.getList()
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			handleTime(value) {
				let d = new Date(value);
				let year = d.getFullYear()
				let month = (d.getMonth() < 9) ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1)
				let myDate = new Date(year, month, 0);
				this.showTime = year + '-' + month
				this.searchDate = year + '-' + month
				this.show = false
				this.page = 1
				this.list = []
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.getList()

			},
			scrollEvent(e) {
				if (e instanceof Event) {
					let el = e.target;
					let scrollTop = el.scrollTop;
					let clientHeight = el.clientHeight; // 获取可视区的高度
					let scrollHeight = el.scrollHeight; // 获取滚动条的总高度
					let height = 50;
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
				data.page = this.page
				data.size = this.pageSize
				data.date = this.searchDate
				this.$api.user_wallet_profit_log(data).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.totalNum = res.data.count;
						this.totalPage = res.data.total_page
						this.monthMoney = res.data.month_in;
						this.totalMoney = res.data.all_in;

						if (this.totalNum == 0) {
							// console.log("没有数据");
							this.isLoading = false;
							this.ifFinish = true;
							this.page = 1;
							this.deviceTip = "暂无数据";
							return false;
						}
						this.list = this.list.concat(res.data.log);
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
						this.list = [];
						this.isLoading = false;
						this.ifFinish = true;
						this.page = 1;
						this.deviceTip = "数据加载失败~";
					}
				}).catch(err => {
					this.$toast.clear()
				});
			},
		}
	}
</script>
<style lang="less">
	.shouyiList {
		padding-top: 106px;
		overflow: auto;

		.van-nav-bar {
			background: #F0F6FC;
			z-index: 10;

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

		.topTitle {
			position: fixed;
			top: 46px;
			left: 0;
			width: 100%;
			padding: 0 10px;
			line-height: 20px;
			height: 60px;
			background: #F0F6FC url(../../images/cooperativebg1.png) no-repeat bottom right;
			background-size: auto 45px;

			&::after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				height: 10px;
				width: calc(100% - 20px);
				background: url(../../images/bgraduis1.png) no-repeat bottom;
				background-size: 100% 10px;
			}

			.time {
				padding-right: 15px;
				display: inline-block;
				background: url(../../images/down.png) no-repeat center right;
				background-size: 8px 5px;
			}
		}

		.content {
			background: #FFFFFF;
			border-radius: 10px 10px 0 0;
			padding: 0 10px;

			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10px 0;
				border-bottom: 1px solid #F0F6FC;

				&:first-child {
					border-radius: 10px 10px 0 0;
				}
			}

			.left {
				display: flex;
				align-items: center;

				img {
					width: 40px;
					margin-right: 10px;
				}

				.title {
					font-size: 14px;
				}

				.time {
					margin-top: 6px;
					color: #9AA8B6;
				}
			}

			.price {
				font-weight: bold;
				font-size: 15px;
			}
		}

		.null {
			text-align: center;

			img {
				margin-top: 30px;
				max-width: 100%;
			}
		}

		.van-loading,
		.noMore {
			padding: 10px 0;
			text-align: center;
		}
	}
</style>
