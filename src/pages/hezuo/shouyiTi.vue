<template>
	<div class="shouyiTi"  @scroll="scrollEvent($event)" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="收益提取" left-arrow fixed @click-left="leftBack" />
		<div class="m-cont">
			<img src="../../images/light3.png" alt="" class="bgTop" />
			<img src="../../images/logoBg.png" alt="" class="bgLogo" />
			<img src="../../images/xiexianBg.png" alt="" class="bgBottom" />
			<div class="title">
				<p>可提现余额</p>
				<p class="ing" v-if="moneyInfo.on_the_way_bonus_money>0">正在打款中￥{{moneyInfo.on_the_way_bonus_money}}</p>
			</div>
			<p class="num">{{moneyInfo.can_out_bonus_money}}</p>
			
			<p class="desc">累计收益￥{{moneyInfo.all_profit}}</p>
			<p class="btn" @click="goTiMoney()">提现</p>
		</div>
		<div class="searchCont">
			<div class="itemSea" @click="showType=true">
				<img src="../../images/type.png" class="icon" />
				<p>{{typeName}}</p>
				<img src="../../images/down.png" alt="" class="down">
			</div>
			<div class="itemSea" @click="dateShow=true">
				<img src="../../images/time.png" alt="" class="icon">{{start_date}}
				<span class="lineText">至</span>{{end_date}}
				<img src="../../images/down.png" alt="" class="down">
			</div>
		</div>
		<div class="content" v-if="list.length > 0">
			<!-- 0全部，4活期利息，7红利，13收益取出，19定期利息 -->
			<div class="item" v-for="(item, index) in list" :key="index">
				<div class="top">
					<div class="topLeft">
						<p class="title">{{item.log_type_str}}
						<!-- 操作状态：0失败（取出申请驳回），1成功，2审核中 -->
							<van-tag round class="zhuanIng" v-if="item.status == 2">转出中</van-tag>
							<van-tag round class="faile" v-else-if="item.status == 0">失败</van-tag></p>
						<div class="imgCont">
							<img src="../../images/time.png" />{{item.log_date}}
							<img src="../../images/qian2.png" />余额 ¥{{item.after_money}}
						</div>
					</div>
					<div class="topRight">
						<img src="../../images/qian16.png" />{{item.log_money}}
					</div>
				</div>
				<img src="../../images/down3.png" v-if="(item.log_type == 4 || item.log_type == 19) && !item.show " @click="item.show = !item.show" alt="" class="downIcon" />
				<!-- 活期利息 -->
				<template v-if="item.log_type == 4 && item.show">
					<van-grid class="grid grid3" :column-num="3">
						<van-grid-item>
							<p class="num yuan">{{item.store_money}}</p>
							<p class="title">存入金额</p>
						</van-grid-item>
						<van-grid-item>
							<p class="num liLv">{{item.rate}}</p>
							<p class="title">{{item.rate_explain}}</p>
						</van-grid-item>
						<van-grid-item>
							<p class="num">{{item.term_name}}</p>
							<p class="title">期限</p>
						</van-grid-item>
					</van-grid>
				</template>
				<template v-else-if="item.log_type == 19 && item.show">
					<van-grid class="grid grid6" :column-num="3">
							<van-grid-item>
								<p class="num yuan">{{item.store_money}}</p>
								<p class="title">存入金额</p>
							</van-grid-item>
							<van-grid-item>
								<p class="num liLv">{{item.rate}}</p>
								<p class="title">{{item.rate_explain}}</p>
							</van-grid-item>
							<van-grid-item>
								<p class="num">{{item.term_name}}</p>
								<p class="title">期限</p>
							</van-grid-item>
							<van-grid-item>
								<p class="num yuan">12</p>
								<p class="title">支付方式</p>
							</van-grid-item>
							<van-grid-item>
								<p class="num liLv">{{item.start_rate_date}}</p>
								<p class="title">起息日</p>
							</van-grid-item>
							<van-grid-item>
								<p class="num">活期</p>
								<p class="title">到期日</p>
							</van-grid-item>
						</van-grid>
				</template>
				<img src="../../images/up.png" v-if="(item.log_type == 4 || item.log_type == 19) && item.show " @click="item.show = !item.show" alt="" class="upIcon" />
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
		
		
		<!-- 选择类别 -->
		<van-action-sheet v-model="showType" title="选择类别" class="selSheet" :closeable="false" cancel-text="确定" @cancel="sureSel()">
			<ul class="typeUl">
				<li :class="sel_log_type==item.log_type?'active': ''" @click="sel_log_type = item.log_type, selTypeName = item.name" v-for="(item, index) in typeItem" :key="index">{{item.name}}</li>
			</ul>
		</van-action-sheet>
		
		<!-- <van-calendar v-model="dateShow" :min-date="minDate" color="#3B6AF1" title="选择收益日期" type="range" @confirm="onConfirm" /> -->
		<van-action-sheet v-model="dateShow" title="选择时间" class="selSheet selDate" :closeable="false" cancel-text="确定" @cancel="sureSheetSel()">
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
		name: "shouyiTi",
		data() {
			return{
				deviceHeight: document.body.clientHeight - 46,
				moneyInfo: {
					all_profit: 0, //累计收益
					can_out_bonus_money: 0, //可提现收益
					on_the_way_bonus_money: 0 //转出中收益
				},
				log_type: 0,
				sel_log_type: 0,
				showType: false,
				// 记录类型：0全部，4活期利息，7红利，13收益取出，19定期利息
				typeName: '全部',
				selTypeName: '全部',
				typeItem: [{
					name: '全部',
					log_type: 0
				}, {
					name: '活期利息',
					log_type: 4
				}, {
					name: '红利',
					log_type: 7
				}, {
					name: '收益取出',
					log_type: 13
				}, {
					name: '定期利息',
					log_type: 19
				}],

				minDate: new Date(2021, 0, 1),
				maxDate: new Date(),
				selId: 1,
				selInId: '',
				start_date: '',
				end_date: '',
				instartDate: '',
				inendDate: '',
				dateShow: false,

				list: [],
				pageSize: 20, //每页显示
				page: 1, //当前页
				totalNum: 0, //总条数
				totalPage: 1, //总页数
				ifFinish: false, //是否加载完成
				isLoading: true, //是否加载更多
				deviceTip: ''
			}
				
		},
		mounted() {
			window.leftBack = this.leftBack
			
			this.end_date = this.$dateCurrent()
			// 互助金收益账户当前所剩收益与累计收益
			this.$toast.loading({
				message: '加载中...',
				forbidClick: true,
				duration: 0,
			});
			this.$api.passbook_bonus_money().then(res=>{
				this.$toast.clear()
				if (res.errno == 0){
					this.moneyInfo = res.data
				}else{
					this.$toast(res.errmsg)
				}
			}).catch(err=>{
				this.$toast.clear()
			})
			this.getList()
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			goTiMoney(){
				this.$router.push({
					path: '/shouyiOut',
					query: {
						money: this.moneyInfo.can_out_bonus_money
					}
				})
			},
			sureSel(){
				this.showType = false
				this.typeName = this.selTypeName
				if(this.log_type != this.sel_log_type){
					this.log_type = this.sel_log_type
					this.list = []
					this.page = 1
					this.totalNum = 0
					this.totalPage = 1
					this.ifFinish = false
					this.isLoading = true
					this.deviceTip = ''
					this.getList()
				}
			},
			// 点击选择时间筛选
			searchDate(id){
				this.selInId = ''
				this.instartDate = ''
				this.inendDate = ''
				this.minDate = new Date(2021, 0, 1)
				this.maxDate = new Date()
				if(id == 1){ // 全部
					this.start_date = ''
					this.end_date = this.$dateCurrent()
				}else if(id == 2){ // 近一年
					this.start_date = this.$dateCurrentAfterNum(-365)
					this.end_date = this.$dateCurrent()
				}else if(id == 3){ // 本月
					this.start_date = this.$dateCurYearMonth() + '-01'
					this.end_date = this.$dateCurrent()
				}
				this.dateShow = false
				this.list = []
				this.page = 1
				this.totalNum = 0
				this.totalPage = 1
				this.ifFinish = false
				this.isLoading = true
				this.deviceTip = ''
				this.getList()
			},
			// 选择时间段
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
			sureSheetSel(){
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
				this.start_date = this.instartDate
				this.end_date = this.inendDate
				this.list = []
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
				this.start_date = this.formatDate(start)
				this.end_date = this.formatDate(end)
				this.list = []
				this.page = 1
				this.totalNum = 0
				this.totalPage = 1
				this.ifFinish = false
				this.isLoading = true
				this.deviceTip = ''
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
				data.log_type = this.log_type
				data.start_date = this.start_date
				data.end_date = this.end_date
				this.$api.passbook_bonus_log(data).then(res => {
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
						let getData = res.data.log
						getData.forEach(ele=>{
							ele.show = false
						})
						this.list = this.list.concat(getData);
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

		},
	}
</script>
<style lang="less">
	.shouyiTi {
		padding-top: 46px;
		background: #f0f6fc url(../../images/bgHeader2.png) no-repeat;
		background-size: 100% 200px;
		overflow: auto;

		.van-nav-bar {
			z-index: 10;
			background: url(../../images/bgHeader2.png) no-repeat top center;
			background-size: 100% 200px;

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

		.m-cont {
			margin: 0 10px;
			padding: 20px 15px;
			border-radius: 15px;
			background: linear-gradient(-35deg, #3b6af1 0%, #5a94ff 100%);
			color: #FFFFFF;
			position: relative;
			overflow: hidden;
			height: 70px;

			.bgTop {
				position: absolute;
				top: 0;
				right: 0;
				width: 200px;
			}

			.bgLogo {
				position: absolute;
				left: -40px;
				bottom: -10px;
				width: 110px;
			}

			.bgBottom {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 300px;
			}
			.title{
				display: flex;
				justify-content: space-between;
				.ing{
					color: #B2CAFF;
				}
			}

			.num {
				font-family: DIN, DIN-Medium;
				font-size: 30px;
				position: relative;
				display: inline-block;
				margin-top: 10px;

				&::before {
					position: absolute;
					top: -5px;
					left: 100%;
					content: '';
					width: 14px;
					height: 10px;
					background: url(../../images/yuan.png) no-repeat;
					background-size: auto 10px;
				}
			}

			.desc {
				margin-top: 10px;
				color: #B2CAFF;
			}

			.btn {
				position: absolute;
				right: 15px;
				bottom: 15px;
				font-size: 15px;
				line-height: 28px;
				padding: 0 20px;
				border-radius: 30px;
				border: 1px solid #FFFFFF;
			}
		}

		.searchCont {
			display: flex;
			align-items: center;
			margin: 15px 10px;

			.itemSea {
				display: flex;
				align-items: center;
				background: #FFFFFF;
				border-radius: 30px;
				height: 25px;
				padding: 0 10px;
				color: #9AA8B6;

				&:last-child {
					margin-left: 10px;
				}

				.icon {
					width: 12px;
					height: 12px;
					margin-right: 5px;
				}

				.down {
					width: 8px;
					height: 5px;
					margin-left: 5px;
				}

				.lineText {
					color: #3B6AF1;
					padding: 0 5px;
				}
			}
		}

		.content {
			.item {
				margin: 15px 10px 0 10px;
				background: #FFFFFF;
				border-radius: 10px;
				position: relative;
				&:first-child{
					margin-top: 10px;
				}

				.top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 12px 8px 12px 8px;

					.topLeft {
						color: #9AA8B6;

						.title {
							font-size: 15px;
							color: #444444;
							padding-left: 6px;
							position: relative;

							&::before {
								position: absolute;
								top: 4px;
								left: 0;
								content: '';
								width: 3px;
								height: 8px;
								border-radius: 35%;
								background: #3B6AF1;
							}
							.faile {
								color: #F24B4B;
								background: #ffeded;
								border: 1px solid #f24b4b;
							}
							.zhuanIng {
								color: #3B6AF1;
								background: #e2f4ff;
								border: 1px solid #3b6af1;
							}
						}

						.imgCont {
							margin-top: 10px;
							display: flex;
							align-items: center;

							img {
								width: 12px;
								height: 12px;
								margin-right: 3px;

								&:last-child {
									margin-left: 8px;
								}
							}
						}
					}

					.topRight {
						background: linear-gradient(#e4eff9 0%, #f0f6fc 100%);
						border-radius: 30px;
						height: 30px;
						display: flex;
						align-items: center;
						font-family: DIN, DIN-Bold;
						font-size: 18px;
						padding: 0 6px 0 3px;
						font-weight: bold;

						img {
							width: 20px;
							height: 20px;
						}
					}
				}

				.downIcon {
					position: absolute;
					top: 48px;
					left: calc(50% - 37px);
					padding: 15px 20px;
					width: 34px;
					height: 24px;
				}

				.upIcon {
					position: absolute;
					bottom: -26px;
					left: calc(50% - 37px);
					padding: 15px 20px;
					width: 34px;
					height: 24px;
				}

				.grid {
					color: #9AA8B6;

					&.grid3 {
						.van-grid-item__content::after {
							border-width: 0 1px 0 0;
						}
					}

					&.grid6 {

						.van-grid-item:nth-child(4),
						.van-grid-item:nth-child(5),
						.van-grid-item:nth-child(6) {
							.van-grid-item__content::after {
								border-width: 0 1px 0 0;
							}
						}

					}

					.num {
						font-size: 15px;
						color: #444444;
						margin-bottom: 5px;
						font-weight: 400;
						display: inline-block;
						position: relative;

						&.yuan::before {
							background: url(../../images/yuan1.png) no-repeat;
							background-size: auto 10px;
						}

						&.liLv::before {
							background: url(../../images/baifen1.png) no-repeat;
							background-size: auto 10px;
						}

						&::before {
							position: absolute;
							top: -5px;
							left: calc(100% + 2px);
							content: '';
							width: 100%;
							min-width: 15px;
							height: 10px;
						}
					}
				}
			}
		}

		.null {
			img {
				max-width: 100%;
			}
		}

		.van-loading,
		.noMore {
			padding: 20px 0;
			text-align: center;
		}
		
		// 选择框
		.selSheet {
			max-height: 90%;
			&.selDate{
				background: #F0F6FC;
				.van-action-sheet__header{
					background: #ffffff;
				}
				.van-calendar__header-title{
					padding-top: 10px;
					font-size: 15px;
					background: #F0F6FC;
				}
			}
			.van-action-sheet__header {
				font-size: 15px;
				font-weight: bold;
				position: relative;

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
			.typeUl{
				margin: 0 10px;
				padding: 5px 0 20px 0;
				display: flex;
				flex-wrap: wrap;
				li{
					justify-content: space-between;
					color: #9AA8B6;
					font-size: 15px;
					line-height: 33px;
					width: calc(33.333% - 12px);
					max-width: 103px;
					text-align: center;
					border-radius: 30px;
					background: #F0F6FC;
					border: 1px solid #F0F6FC;
					margin: 15px 5px 0 5px;
					&.active{
						color: #3B6AF1;
						background: #E2F4FF;
						border: 1px solid #3b6af1;
					}
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
