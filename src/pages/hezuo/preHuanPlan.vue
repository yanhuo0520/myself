<template>
	<div class="preHuanPlan" @scroll="scrollEvent($event)" :style='{height: deviceHeight + "px"}'
		:class="{'ifFixed': ifFixed}">
		<van-nav-bar title="还款计划" left-arrow fixed @click-left="leftBack" />
		<div class="jieCont">
			<img src="../../images/light3.png" alt="" class="bgTop" />
			<img src="../../images/logoBg.png" alt="" class="bgLogo" />
			<img src="../../images/xiexianBg.png" alt="" class="bgBottom" />
			<!-- 逾期显示 -->
			<div class="wraning" v-if="info.overdue_number > 0">
				<img src="../../images/warning.png" class="tip" />
				<p>您有{{info.overdue_number}}笔借款已逾期</p>
				<img src="../../images/right1.png" class="right" />
			</div>
			<p class="tipTop" :class="info.overdue_number > 0 ? '' : 'unOvertime'">合同编号:{{loanCode}} <br /> 借款时长:{{info.loan_name}}</p>
			<p class="title">待还本金总额</p>
			<p class="money">{{info.left_principal}}</p>
			<div class="bott">
				<p>共{{info.all_number}}期,已还{{info.back_number}}期,逾期{{info.overdue_number}}期</p>
				<p>已还{{info.back_principal}}元</p>
			</div>
		</div>
		<div class="content" :class="{'ifFixed': ifFixed}" v-if="ifLoading">
			<van-sticky :offset-top="46">
				<div class="titlTop">
					<div @click="selectShow = true">
						<img src="../../images/time1.png" class="time" />
						<p>还款计划:{{selTitle}}</p>
						<img src="../../images/down1.png" class="down" />
					</div>
					<p>还款截止日期:{{info.end_date}}</p>
				</div>
			</van-sticky>
			
			<template v-if="palanList.length > 0">
				<div class="item" v-for="(item, index) in palanList" :key="index" @click="goHuanDetail(item.back_code, item.status, item.if_should_repaid)">
					<div class="top">
						<img src="../../images/textImg.png" />
						<p class="title">第{{item.qishu}}期</p>
						<!-- "if_should_repaid": 0,//是否应该还款：0已还，1立即还款，2未还不到时间还，3可提前10日内还款 -->
						<template v-if="item.if_should_repaid == 0">
							<p class="status blue">已还款</p>
						</template>
						<template v-else-if="item.if_should_repaid == 1 && item.overdue_day > 0">
							<p class="status yellow">待还款</p>
							<p class="status red">已逾期{{item.overdue_day}}天</p>
						</template>
						<template v-else-if="item.if_should_repaid == 2">
							<p class="status gary">未到期</p>
							<p class="status gary">{{item.can_back_date + '后可还款'}}</p>
						</template>
						<!-- v-else-if="(item.if_should_repaid == 1 && item.overdue_day == 0) || item.if_should_repaid == 2" -->
						<template v-else>
							<p class="status yellow">待还款</p>
						</template>
					</div>
					<van-grid class="grid" :column-num="item.overdue_day > 0 ? 3 : 2" :border="false">
						<van-grid-item>
							<p class="num">{{item.should_back_date}}</p>
							<p class="title">当期最后还款日</p>
						</van-grid-item>
						<van-grid-item v-if="item.if_should_repaid == 0">
							<p class="num">{{item.all_repaid}}</p>
							<p class="title">还款金额</p>
						</van-grid-item>
						<van-grid-item v-else>
							<p class="num">{{item.all_repaid}}</p>
							<p class="title">待还金额</p>
						</van-grid-item>
						<van-grid-item v-if="item.overdue_day > 0">
							<p class="num">{{item.overdue_rate}}</p>
							<p class="title">逾期滞纳金</p>
						</van-grid-item>
					</van-grid>
				</div>
			</template>
			<template v-else>
				<div class="item">
					暂无
				</div>
			</template>
			

		</div>
		<div class="btnCont">
			<van-button :icon='require("../../images/tiqian.png")' block class="sendBtn sendBtn1" @click="advanceHuan(info.if_can_clear)">
				提前还款
			</van-button>
			<van-button :icon='require("../../images/anshi.png")' block class="sendBtn sendBtn2" @click="ontimeHuan()"> 
				按期还款
			</van-button>
		</div>


		<!-- 选择还款计划 -->
		<van-action-sheet v-model="selectShow" title="选择还款计划" class="selSheet" :closeable="false">
			<van-radio-group v-model="radioId">
				<van-cell :title="item1.name" clickable v-for="(item1, index1) in radioItem" :key="index1" @click="radioId = item1.id, radioSelStatus = item1.status, radioSelTitle = item1.name" :class="radioId == item1.id ? 'active' : ''">
					<template #right-icon>
						<van-radio :name="item1.id">
							<template #icon="props">
								<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
							</template>
						</van-radio>
					</template>
				</van-cell>
			</van-radio-group>
			<van-button round block type="info" @click="sureSel()">确定</van-button>
		</van-action-sheet>


	</div>
</template>
<script>
	export default {
		name: "preHuanPlan",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 90,
				ifFixed: false,
				ifLoading: false,
				loanCode: '',
				backCode: '',
				selectShow: false,
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),
				radioId: 0,
				radioSelId: 0,
				selTitle: '全部',
				radioSelTitle: '全部',
				radioStatus: '',
				radioSelStatus: '',
				radioItem: [{
					id: 0,
					status: '',
					name: '全部'
				},{
					id: 1,
					status: 0,
					name: '未还款'
				},{
					id: 2,
					status: 1,
					name: '已还款'
				},],
				info: '',
				ifHasHuan: false,
				palanList: []
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.loanCode = this.$route.query.loanCode
			if (this.loanCode) {
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.getList()
			}
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

					if (scrollTop > 135) {
						this.ifFixed = true
					} else {
						this.ifFixed = false
					}

				}
			},
			getList() {
				this.$api.myRepaidLoanBackPlan({
					"loan_code": this.loanCode,
					"status": this.radioStatus
				}).then(res => {
					this.ifLoading = true
					this.$toast.clear()
					if (res.errno == 0) {
						this.info = res.data.info
						this.palanList = res.data.loan_back_plan
						this.backCode = res.data.loan_back_plan[0].back_code
						this.palanList.forEach(ele=>{
							if(ele.if_should_repaid == 1 || ele.if_should_repaid == 3){
								this.ifHasHuan = true
							}
						})
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			sureSel(){
				this.selectShow = false
				if(this.radioId != this.radioSelId){
					this.radioSelId = this.radioId;
					this.radioStatus = this.radioSelStatus;
					this.selTitle = this.radioSelTitle;

					this.palanList = []
					this.ifLoading = false
					this.$toast.loading({
						message: '加载中...',
						forbidClick: true,
						duration: 0,
					});
					this.getList()
				}
			},
			goHuanDetail(back_code, status, if_should_repaid) {
				// "if_should_repaid": 0,//是否应该还款：0已还，1立即还款，2未还不到时间还，3可提前10日内还款
				if(if_should_repaid == 1 || if_should_repaid == 3){ // 还款-->进入按期还款页面
					this.$router.push({
						path: '/untimeHuan',
						query: {
							backCode: back_code, //还款计划编号
						}
					})
				}else{ // 进入还款详情查看页面 if_should_repaid 0已还  2未还不到时间还
					this.$router.push({
						path: '/huanDetail',
						query: {
							backCode: back_code, //还款计划编号
							status: status
						}
					})
				}
				
			},
			advanceHuan(if_can_clear){
				// if_can_clear": 0,//是否可以提前还款：0否，1是
				if(if_can_clear == 0){
					this.$toast("无法进行提前还款")
				}else{
					this.$router.push({
						path: '/advanceHuan',
						query: {
							loanCode: this.loanCode //借款编号
						}
					})
				}
				
			},
			ontimeHuan(){
				if(this.ifHasHuan){
					this.$router.push({
						path: '/ontimeHuan',
						query: {
							loanCode: this.loanCode //借款编号
						}
					})
				}else{
					// this.$toast("暂无到期计划")
					this.$router.push({
						path: '/ontimeHuanNull'
					})
				}
				
			}

		},
	}
</script>
<style lang="less">
	.preHuanPlan {
		padding-top: 46px;
		overflow: auto;
		background: #f0f6fc url(../../images/bgHeader6.png) no-repeat;
		background-size: 100% 170px;

		&.ifFixed {
			background: #f0f6fc url(../../images/bgTop6.png) no-repeat center 46px;
			background-size: 100% 200px;
		}

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
			padding: 15px 10px;
			border-radius: 15px 15px 0 0;
			background: linear-gradient(-35deg, #3b6af1 0%, #5a94ff 100%);
			color: #FFFFFF;
			position: relative;
			overflow: hidden;

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

			.wraning {
				position: absolute;
				left: 10px;
				top: 10px;
				display: flex;
				align-items: center;
				background: #F0F6FC;
				color: #444444;
				border-radius: 10px;

				.tip {
					width: 15px;
				}

				p {
					margin-top: 2px;
				}

				.right {
					margin-left: 5px;
					height: 8px;
					padding-right: 5px;
				}
			}

			.tipTop {
				color: #B2CAFF;
				line-height: 16px;
				text-align: right;
				transform: scale(0.95);
				margin-right: -5px;
				&.unOvertime{
					margin-top: -10px;
				}
			}

			.title {
				color: #FFFFFF;
			}

			.money {
				font-family: DIN, DIN-Medium;
				font-size: 30px;
				position: relative;
				display: inline-block;
				margin-top: 10px;

				&::before {
					position: absolute;
					top: -5px;
					left: calc(100% + 2px);
					content: '';
					width: 65px;
					height: 10px;
					background: url(../../images/yuan.png) no-repeat;
					background-size: auto 10px;
				}
			}

			.bott {
				margin-top: 10px;
				display: flex;
				justify-content: space-between;
				color: #B2CAFF;
			}

		}
		.van-sticky--fixed{
			.titlTop{
				padding: 0 10px;
				border-radius: 10px 10px 0 0;
				background: #ffffff;
			}
		}
		.content {
			padding: 0 10px 15px 10px;
			background: url(../../images/bgHeader3Ch1.png) no-repeat top center;
			background-size: 100% 200px;
			position: relative;

			&.ifFixed {
				background: none;
			}

			&::before {
				content: '';
				position: absolute;
				left: 18px;
				top: 30px;
				width: 1px;
				height: calc(100% - 40px);
				background: #3B6AF1;
			}

			&::after {
				content: '';
				position: absolute;
				left: 13px;
				bottom: 0;
				width: 12px;
				height: 12px;
				background: url(../../images/dui1.png) no-repeat;
				background-size: 12px 12px;
			}

			.titlTop {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 40px;

				div {
					display: flex;
					align-items: center;
					background: #3B6AF1;
					border-radius: 30px;
					color: #FFFFFF;
					padding: 0 5px 0 2px;

					.time {
						width: 13px;
					}

					p {
						font-size: 13px;
						padding: 0 3px;
						line-height: 20px;
					}

					.down {
						width: 8px;
					}
				}
			}

			.item {
				margin: 10px 0 0 20px;
				background: #ffffff;
				padding: 0 5px;
				border-radius: 0 0 10px 10px;
				position: relative;

				&::before {
					content: '';
					position: absolute;
					left: -14px;
					top: 0;
					width: 5px;
					height: 5px;
					border-radius: 10px;
					background: #3B6AF1;
				}

				.top {
					display: flex;
					align-items: center;
					height: 40px;
					padding: 0 5px;
					border-bottom: 1px solid #F0F6FC;
					background: url(../../images/right1.png) no-repeat calc(100% - 5px) center;
					background-size: 9px 15px;

					img {
						width: 20px;
					}

					.title {
						font-size: 15px;
						padding-left: 5px;
					}

					.status {
						border-radius: 20px;
						padding: 2px 5px;
						margin-left: 5px;

						&.blue {
							color: #3B6AF1;
							background: #e2f4ff;
							border: 1px solid #3b6af1;
						}

						&.red {
							color: #F24B4B;
							background: #ffeded;
							border: 1px solid #f24b4b;
						}
						&.gary {
							color: #9AA8B6;
							background: #f0f6fc;
							border: 1px solid #9aa8b6;
						}
						&.yellow {
							color: #FFA800;
							background: #fffde2;
							border: 1px solid #ffa800;
						}
					}
				}

				.grid {
					.van-grid-item {
						border-right: 1px solid #F0F6FC;

						.van-grid-item__content {
							padding: 16px 0;
						}

						&:last-child {
							border: none;
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
							}
						}

						&:nth-child(2),
						&:nth-child(3) {
							.num::before {
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
		}

		.btnCont {
			position: fixed;
			left: 0;
			bottom: 0;
			right: 0;
			display: flex;

			.sendBtn {
				font-size: 15px;
				border: none;
				border-radius: 0;

				&.sendBtn2 {
					color: #FFFFFF;
					background: #3B6AF1;
				}
			}
		}
		// 选择
				.selSheet {
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
		
					.active {
						.van-cell__title {
							color: #3B6AF1;
						}
					}
		
					.img-icon {
						height: 20px;
					}
		
					.van-button--info {
						margin: 15px;
						width: calc(100% - 30px);
						height: 38px;
						background: #3B6AF1;
						border: 1px solid #3B6AF1;
					}
				}

	}
</style>
