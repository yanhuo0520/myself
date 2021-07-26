<template>
	<div class="myGujin" ref="scrollTopMygujin" @scroll="scrollEvent($event)" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="我的股金" left-arrow fixed @click-left="leftBack" />
		<div class="jieCont">
			<p class="num">{{totalMoney}}</p>
			<p class="title">股金金额</p>
			<img src="../../images/light3.png" alt="" class="bgTop" />
			<img src="../../images/logoBg.png" alt="" class="bgLogo" />
			<img src="../../images/xiexianBg.png" alt="" class="bgBottom" />
		</div>

		<van-sticky :offset-top="46">
			<van-tabbar :fixed="false" class="jieTabbar">
				<van-tabbar-item v-for="(item1,index1) of itemsJie" @click="clickitemsJieTab(item1.id)" :key="index1">
					<template #icon>
						<img :src="item1.id == status ?item1.iconSelect: item1.icon" />
					</template>
				</van-tabbar-item>
			</van-tabbar>
		</van-sticky>
		<div class="main-cont">
			<!-- 入股记录 -->
			<div class="contentTab" v-if="status == 1">
				<div class="searchCont">
					<div class="timeCont" @click="dateShow = true">
						<img src="../../images/time.png" alt="" class="time">
						{{startDate}}
						<span class="lineText">至</span>
						{{endDate}}
						<img src="../../images/down.png" alt="" class="down">
					</div>
					<p>共计<span>{{totalNum}}</span>条</p>
				</div>
				<div class="item" v-for="(item, index) in proList" :key="index">
					<div class="left">
						<img src="../../images/gujin.png" />
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

			<!-- 分红记录 -->
			<div class="contentTab" v-if="status == 2">
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
		</div>



	<!-- <van-calendar v-model="dateShow" :min-date="minDate" color="#3B6AF1" title="选择借款日期" type="range" @confirm="onConfirm" /> -->
	<van-action-sheet v-model="dateShow" title="选择时间" class="selSheet" :closeable="false" cancel-text="确定" @cancel="sureSel()">
		<template #description>
			<ul class="m-title">
				<li :class="(selId == 1)? 'active' : ''" @click="selId = 1, searchDate(1)">全部</li>
				<li :class="(selId == 2)? 'active' : ''" @click="selId = 2, searchDate(2)">近一年</li>
				<li :class="(selId == 3)? 'active' : ''" @click="selId = 3, searchDate(3)">本月</li>
			</ul>
		</template>
		<van-calendar
			:min-date="minDate"
			:max-date="maxDate"
			color="#3B6AF1"
			row-height="40"
			first-day-of-week="1" 
			:poppable="false"
			:show-confirm="false"
			@select="sureSelDate"
			:style="{ height: '330px' }"
			>
			<template #title>
				<div class="searchDate">
					<van-field v-model="instartDate" @click="selInId = 1, selIn(1)" :class="(selInId == 1)? 'selInput' : ''" readonly placeholder="请选择开始日期" />
					<p>至</p>
					<van-field v-model="inendDate" @click="selInId = 2, selIn(2)" :class="(selInId == 2)? 'selInput' : ''" readonly placeholder="请选择结束日期" /><span></span>
				</div>

			</template>	
		</van-calendar>
	</van-action-sheet>


	</div>
</template>
<script>
	export default {
		name: "myGujin",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				ifFixed: false,
				coopera_id: '',
				status: 1,  // log_type 记录类型：0全部，1股份记录，2分红记录
				totalMoney: 0,

				itemsJie: [{
						name: "入股记录",
						id: 1,
						icon: require("../../images/fufenTitle.png"),
						iconSelect: require("../../images/fufenTitleSel.png")
					},
					{
						name: "分红记录",
						id: 2,
						icon: require("../../images/fenhongTitle.png"),
						iconSelect: require("../../images/fenhongTitleSel.png")
					}
				],

				proList: [],
				ifChange: false,
				pageSize: 10, //每页显示
				page: 1, //当前页
				totalNum: 0, //总条数
				totalPage: 1, //总页数
				ifFinish: false, //是否加载完成
				isLoading: true, //是否加载更多
				deviceTip: '',

				minDate: new Date(2021, 0, 1),
				maxDate: new Date(),
				selId: 1,
				selInId: '',
				startDate: '',
				endDate: '',
				instartDate: '',
				inendDate: '',
				dateShow: false,
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.coopera_id = this.$route.query.id
			this.totalMoney = this.$route.query.gujin
			this.endDate = this.$dateCurrent()
			this.getList()
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			// 点选时间段
			searchDate(id){
				this.selInId = ''
				this.instartDate = ''
				this.inendDate = ''
				this.minDate = new Date(2021, 0, 1)
				this.maxDate = new Date()
				if(id == 1){ // 全部
					this.startDate = ''
					this.endDate = this.$dateCurrent()
				}else if(id == 2){ // 近一年
					this.startDate = this.$dateCurrentAfterNum(-365)
					this.endDate = this.$dateCurrent()
				}else if(id == 3){ // 本月
					this.startDate = this.$dateCurYearMonth() + '-01'
					this.endDate = this.$dateCurrent()
				}
				this.dateShow = false
				this.proList = []
				this.page = 1
				this.totalNum = 0
				this.totalPage = 1
				this.ifFinish = false
				this.isLoading = true
				this.deviceTip = ''
				this.getList()
			},
			// 选择时间区间
			selIn(id){
				if(id == 1){
					if(this.inendDate){
						this.maxDate = new Date(this.inendDate)
						this.minDate = new Date(2021, 0, 1)
					}else{
						this.maxDate = new Date()
					}
				}else if(id == 2){
					if(this.instartDate){
						this.minDate = new Date(this.instartDate)
						this.maxDate = new Date()
					}else{
						this.minDate = new Date(2021, 0, 1)
					}
				}
			},
			// 选择某个时间
			sureSelDate(date){
				if(this.selInId == 1){
					if(new Date(this.formatDate(date)).getTime() > new Date(this.inendDate)){
						this.$toast("开始日期不能大于结束日期")
						return
					}
					this.instartDate = this.formatDate(date)
				}else if(this.selInId == 2){
					if(new Date(this.formatDate(date)).getTime() < new Date(this.instartDate)){
						this.$toast("结束日期不能小于开始日期")
						return
					}
					this.inendDate = this.formatDate(date)
				}
			},
			// 确定选择区间搜索
			sureSel(){
				if(!this.instartDate){
					this.$toast("请选择开始日期")
					this.dateShow = true
					this.selInId = 1
					this.selIn(1)
					return
				}
				if(!this.inendDate){
					this.$toast("请选择结束日期")
					this.dateShow = true
					this.selInId = 2
					this.selIn(2)
					return
				}

				this.selId = ''
				this.dateShow = false
				this.startDate = this.instartDate
				this.endDate = this.inendDate
				this.proList = []
				this.page = 1
				this.totalNum = 0
				this.totalPage = 1
				this.ifFinish = false
				this.isLoading = true
				this.deviceTip = ''
				this.getList()
			},
			// 切换标题
			clickitemsJieTab(id) {
				this.ifChange = true
				this.$refs.scrollTopMygujin.scrollTop = 0
				this.status = id
				this.proList = []
				this.page = 1
				this.totalNum = 0
				this.totalPage = 1
				this.ifFinish = false
				this.isLoading = true
				this.deviceTip = ''
				this.getList()
			},
			formatDate(date) {
				let mon = (date.getMonth()+1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth()
				let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
				return `${date.getFullYear()}-${mon}-${day}`;
			},
			onConfirm(date) {
				const [start, end] = date;
				this.dateShow = false;
				this.startDate = this.formatDate(start)
				this.endDate = this.formatDate(end)

				this.proList = []
				this.page = 1
				this.totalNum = 0
				this.totalPage = 1
				this.ifFinish = false
				this.isLoading = true
				this.deviceTip = ''
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

					if (scrollTop > 105) {
						this.ifFixed = true
					} else {
						this.ifFixed = false
					}

					//到底了
					// console.log(this.isLoading, this.ifFinish);
					// console.log(scrollTop, clientHeight, scrollHeight);
					//是否继续加载且已完成加载
					if (scrollTop + clientHeight >= scrollHeight && this.isLoading && !this.ifFinish && this.page <= this
						.totalPage && !this.ifChange) {
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
				data.log_type = this.status
				data.page = this.page
				data.size = this.pageSize
				data.start_date = this.startDate
				data.end_date = this.endDate
				this.$api.user_coopera_stock_log(data).then(res => {
					this.ifChange = false
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
	.myGujin {
		padding-top: 46px;
		overflow: auto;
		background: #f0f6fc url(../../images/bgHeader6.png) no-repeat;
		background-size: 100% 170px;

		.van-nav-bar {
			z-index: 10;
			background: url(../../images/bgHeader6.png) no-repeat top center;
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
				font-size: 30px;
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

		.van-sticky--fixed {
			background: url(../../images/bgraduis.png) no-repeat;
			background-size: 100% auto;
			.jieTabbar {
				border-radius: 10px 10px 0 0;
			}
		}

		.van-tabbar.jieTabbar {
			padding: 15px 0 10px 0;
			height: auto;

			.van-tabbar-item__icon {
				height: 25px;

				img {
					width: 64px;
					height: auto;
				}
			}

			.van-tabbar-item--active {
				background: transparent;
			}
		}

		.van-hairline--top-bottom::after,
		.van-hairline-unset--top-bottom::after {
			border-width: 0
		}

		.contentTab {
			.searchCont{
				padding: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #9AA8B6;
				background: #FFFFFF;
				line-height: 24px;
				.timeCont{
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
				.lineText{
					padding: 0 5px;
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


		// 选择框
		.selSheet {
			max-height: 90%;
			background: #F0F6FC;
			.van-action-sheet__header {
				font-size: 15px;
				font-weight: bold;
				position: relative;
				background: #FFFFFF;

				&::after {
					content: '';
					position: absolute;
					height: 3px;
					width: 30px;
					background: #3B6AF1;
					border-radius: 2px;
					bottom: 6px;
					left: calc(50% - 15px);
				}
			}
			.van-action-sheet__description{
				background: #ffffff;
				ul{
					display: flex;
					justify-content: space-between;
					color: #9AA8B6;
					font-size: 15px;
					line-height: 33px;
					li{
						background: #F0F6FC;
						padding: 0 28px;
						border-radius: 30px;
						border: 1px solid #f0f6fc;
						&.active{
							color: #3B6AF1;
							background: #E2F4FF;
							border: 1px solid #3B6AF1;
						}
					}
				}
			}
			.van-calendar__header-title{
				padding-top: 10px;
				font-size: 15px;
				background: #F0F6FC;
			}
			.searchDate{
				height: 32px;
				line-height: 32px;
				display: flex;
				.van-cell{
					background: #F0F6FC;
					line-height: 20px;
					&::after{
						border-bottom: 1px solid transparent;
					}
					&.selInput{
						&::after{
							border-bottom: 1px solid #3B6AF1;
						}
					}
					.van-field__control{
						text-align: center;
						color: #3B6AF1;
						font-weight: normal;
					}
				}
				p{
					line-height: 42px;
				}
			}
			.van-calendar__header-subtitle{
				display: none;
			}
			.van-calendar__weekdays{
				padding-top: 10px;
				background: #F0F6FC;
			}
			.van-calendar__body{
				background: #F0F6FC;
			}
			.van-calendar__month-mark{
				font-size: 120px;
				color: #d1d8e0;
			}
			.van-calendar__selected-day{
				border-radius: 50%;
			}

			.van-action-sheet__gap{
				height: 0px;
			}
			.van-action-sheet__cancel{
				color: #FFFFFF;
				height: 80px;
				font-size: 15px;
				padding-top: 25px;
				background: url(../../images/bgBtn1.png) no-repeat center 25px;
				background-size: calc(100% - 40px) 40px;
			}
		}


	}
</style>
