<template>
	<div class="myHuzhu" ref="scrollTopMygujin" @scroll="scrollEvent($event)" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="我的互助金" left-arrow fixed @click-left="leftBack" />
		<div class="jieCont">
			<img src="../../images/light3.png" alt="" class="bgTop" />
			<img src="../../images/logoBg.png" alt="" class="bgLogo" />
			<img src="../../images/xiexianBg.png" alt="" class="bgBottom" />
			<div class="item">
				<p class="num">{{totalMoney}}</p>
				<p class="title">互助金金额</p>
			</div>
			<div class="item">
				<p class="num">{{shouyi}}</p>
				<p class="title">累积总收益</p>
			</div>
		</div>

			<div class="contentTab">
				<div class="searCont">
					<div class="leftCont" @click="show=true">
						<img src="../../images/time.png" alt="" class="time">
						<p>{{showTime}}</p>
						<img src="../../images/down.png" alt="" class="down">
					</div>
					<p>共计<span>{{totalNum}}</span>条</p>
				</div>
				<div class="item" v-for="(item, index) in proList" :key="index">
					<div class="left">
						<img src="../../images/huzhujin.png" />
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

		<van-popup v-model="show" round position="bottom" :style="{ height: '40%' }">
			<van-datetime-picker v-model="currentDate" type="year-month" title="选择年月" :min-date="minDate"
				:max-date="maxDate" @cancel="show=false" @confirm="handleTime" />
		</van-popup>


	</div>
</template>
<script>
	export default {
		name: "myHuzhu",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				coopera_id: '',
				totalMoney: 0,
				shouyi: 0,

				show: false,
				showTime: '',
				searchDate: '',
				minDate: new Date(2020, 0, 1),
				maxDate: new Date(),
				currentDate: new Date(),

				proList: [],
				pageSize: 15, //每页显示
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
			
			this.showTime = this.$dateCurMonth()
			this.searchDate = this.$dateCurYearMonth()

			this.coopera_id = this.$route.query.id
			this.totalMoney = this.$route.query.huzhu
			this.shouyi = this.$route.query.shouyi
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

				this.showTime = year + '-' + month
				this.searchDate = year + '-' + month
				this.show = false
				this.page = 1
				this.proList = []
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.getList()

			},
			// 页面滚动
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
				data.coopera_id = this.coopera_id
				data.page = this.page
				data.size = this.pageSize
				data.date = this.searchDate
				this.$api.user_coopera_hz_passbook_log(data).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.totalNum = res.data.count;
						this.totalPage = res.data.total_page
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

		},
	}
</script>
<style lang="less">
	.myHuzhu {
		padding-top: 46px;
		overflow: auto;
		background: #f0f6fc url(../../images/bgHeader2.png) no-repeat;
		background-size: 100% 170px;
		.van-nav-bar {
			z-index: 10;
			background: url(../../images/bgHeader2.png) no-repeat top center;
			background-size: 100% 170px;


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


		.jieCont {
			margin: 0 10px;
			padding-top: 35px;
			height: 70px;
			text-align: center;
			border-radius: 15px 15px 0 0;
			background: linear-gradient(-35deg, #3b6af1 0%, #5a94ff 100%);
			color: #FFFFFF;
			position: relative;
			overflow: hidden;
			text-align: center;

			display: flex;
			justify-content: space-around;

			.bgTop {
				position: absolute;
				top: 0;
				right: 0;
				width: 150px;
			}

			.bgLogo {
				position: absolute;
				left: -20px;
				bottom: -10px;
				width: 100px;
			}

			.bgBottom {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				max-width: 750px;
			}
			.num {
				font-family: DIN, DIN-Medium;
				font-size: 24px;
				position: relative;
				display: inline;

				&::before {
					position: absolute;
					top: -5px;
					left: calc(100% + 2px);
					content: '';
					width: 14px;
					height: 10px;
					background: url(../../images/yuan.png) no-repeat;
					background-size: auto 10px;
				}
			}

			.title {
				margin-top: 5px;
				transform: scale(0.85);
			}
		}

		.contentTab {
			.searCont{
				background: #FFFFFF;
				padding: 15px 10px 15px 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				line-height: 24px;
				.leftCont{
					display: flex;
					align-items: center;
					background: #F0F6FC;
					padding: 0 10px;
					border-radius: 30px;
				}
				.time{
					margin-right: 5px;
					width: 12px;
					height: 12px;
				}
				.down{
					margin-left: 5px;
					width: 8px;
					height: 5px;
				}
				span{
					color: #3B6AF1;
				}
			}
			.item {
				background: #FFFFFF;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10px;
				border-bottom: 1px solid #F0F6FC;
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
</style>
