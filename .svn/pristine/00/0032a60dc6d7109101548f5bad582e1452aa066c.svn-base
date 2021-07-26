<template>
	<div class="huanJilu">
		<van-nav-bar title="还款记录" left-arrow fixed @click-left="leftBack" />
		<div class="header">
			<div>
				<img src="../../images/yijieqing.png" alt="" class="leftStatuImg" />
			</div>
			<img src="../../images/jiedetailright6.png" class="rightStatImg" />
		</div>
		<div class="moneyCont">
			<p class="time">{{detail.add_time}}</p>
			<van-grid class="grid" :column-num="3" :border="false">
				<van-grid-item>
					<p class="num">{{detail.loan_money > 0 ? detail.loan_money : 0}}</p>
					<p class="title">借款金额</p>
				</van-grid-item>
				<van-grid-item>
					<p class="num">{{detail.interest_money > 0 ? detail.interest_money : 0}}</p>
					<p class="title">利息</p>
				</van-grid-item>
				<van-grid-item>
					<p class="num"
						:class="{'ri': detail.loan_term_sign == 3,'yue': detail.loan_term_sign == 2,'nian': detail.loan_term_sign == 1}">
						{{detail.loan_term_number}}</p>
					<p class="title">借款时长</p>
				</van-grid-item>
				<van-grid-item>
					<p class="num">{{detail.back_principal ? detail.back_principal : 0}}</p>
					<p class="title">已还金额</p>
				</van-grid-item>
				<van-grid-item>
					<p class="num">{{detail.overdue_day ? detail.overdue_day : 0}}</p>
					<p class="title">逾期天数</p>
				</van-grid-item>
				<van-grid-item>
					<p class="num">{{detail.overdue_money ? detail.overdue_money : 0}}</p>
					<p class="title">逾期滞纳金</p>
				</van-grid-item>
			</van-grid>
		</div>
		<div class="content" v-if="ifLoading">
			<div class="titlTop">
				<div>
					<img src="../../images/time1.png" class="time" />
					<p>还款记录</p>
				</div>
				<p>还款截止日期:{{detail.end_date}}</p>
			</div>
			<div class="item" v-for="(item, index) in juluList" :key="index" @click="goHuanDetail(item.back_code, 1, item.back_type, item.qishu)">
				<!-- "back_type":0,//0按期还款，1提前还款 -->
				<!-- 提前还款是多期合并记录 -->
				<div class="top">
					<img src="../../images/textImg.png" />
					<!-- "back_type":0,//0按期还款，1提前还款 -->
					<template v-if="item.back_type == 0">
						<p class="title">第{{item.qishu}}期</p>
						<p class="status">已还款</p>
					</template>
					<template v-else>
						<p class="title">第{{item.qishu}}期</p>
						<p class="status">提前还款</p>
					</template>
				</div>
				<van-grid class="grid" :column-num="item.overdue_day > 0 ? 3 : 2" :border="false">
					<van-grid-item >
						<template v-if="item.back_type == 0">
							<p class="num">{{item.should_back_date}}</p>
							<p class="title">当期最后还款日</p>
						</template>
						<template v-else>
							<p class="num">{{item.real_back_date}}</p>
							<p class="title">提前还款日</p>
						</template>
					</van-grid-item>
					
					<van-grid-item>
						<p class="num">{{item.all_repaid}}</p>
						<p class="title">还款金额</p>
					</van-grid-item>
					<van-grid-item v-if="item.overdue_day > 0">
						<p class="num">{{item.overdue_rate}}</p>
						<p class="title">逾期滞纳金</p>
					</van-grid-item>
				</van-grid>
			</div>
		</div>

	</div>
</template>
<script>
	export default {
		name: "huanJilu",
		data() {
			return {
				loanCode: '',
				detail: '',
				juluList: [],
				ifLoading: false,
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.loanCode = this.$route.query.loanCode
			if (this.loanCode) {
				this.getDetail()
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
			}
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			getDetail() {
				// 我要还款--已结清时我的还款记录（提前还款下跟着前边未还的逾期信息）
				this.$api.myClearLoanBackLog({
					"loan_code": this.loanCode
				}).then(res => {
					this.ifLoading = true
					this.$toast.clear()
					if (res.errno == 0) {
						this.detail = res.loan_info
						this.juluList = res.data
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			goHuanDetail(back_code, status, back_type, qishu) {
				if(back_type == 1){ // 提前还款
					this.$router.push({
						path: '/huanJiluList',
						query: {
							backCode: back_code,
							qishu: qishu
						}
					})
				}else{
					this.$router.push({
						path: '/huanDetail',
						query: {
							backCode: back_code,
							status: status
						}
					})
				}
				
			}
		},
	}
</script>
<style lang="less">
	.huanJilu {
		padding-top: 46px;
		min-height: calc(100% - 46px);
		// 已结清
		background: #f0f6fc url(../../images/jiedetailgrey.png) no-repeat top center;
		background-size: 100% 170px;

		.van-nav-bar {
			background: url(../../images/jiedetailgrey.png) no-repeat top center;
			background-size: 100% 170px;
		}

		.van-nav-bar {
			z-index: 10;
			.van-icon {
				color: #ffffff;
			}

			.van-nav-bar__title {
				font-size: 16px;
				font-weight: bold;
				color: #ffffff;
			}
		}

		.van-hairline--bottom::after {
			border-bottom-width: 0
		}

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;

			div {
				.leftStatuImg {
					width: 100px;
				}

				p {
					color: #FFFFFF;
					margin-left: 15px;
					line-height: 16px;
				}
			}


			.rightStatImg {
				width: 190px;
			}
		}

		.moneyCont {
			margin: 0 10px;
			border-radius: 10px;
			background: #FFFFFF;

			.time {
				font-size: 15px;
				line-height: 42px;
				padding-left: 20px;
				position: relative;

				&::before {
					position: absolute;
					top: 16px;
					left: 12px;
					content: '';
					width: 3px;
					height: 8px;
					border-radius: 35%;
					background: #3B6AF1;
				}
			}

			.grid {
				.van-grid-item {
					border-top: 1px solid #F0F6FC;
					border-right: 1px solid #F0F6FC;

					&:nth-child(3n) {
						border-right: none;
					}

					&:nth-child(3) {
						.num {
							&.ri::before {
								background: url(../../images/ri.png) no-repeat;
								background-size: auto 10px;
							}

							&.yue::before {
								background: url(../../images/yue1.png) no-repeat;
								background-size: auto 10px;
							}

							&.nian::before {
								background: url(../../images/nian.png) no-repeat;
								background-size: auto 10px;
							}
						}
					}

					&:nth-child(4) {
						.van-grid-item__content {
							border-bottom-left-radius: 10px;
						}
					}

					&:nth-child(5) {
						.num {
							&::before {
								background: url(../../images/tian.png) no-repeat;
								background-size: auto 10px;
							}
						}
					}

					&:nth-child(6) {
						.van-grid-item__content {
							border-bottom-right-radius: 10px;
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



		.content {
			margin-top: 10px;
			padding: 0 10px 15px 10px;
			position: relative;

			&::before {
				content: '';
				position: absolute;
				left: 18px;
				top: 23px;
				width: 1px;
				height: calc(100% - 30px);
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
				height: 26px;

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
						padding: 0 5px;
					}

					.status {
						border-radius: 20px;
						padding: 2px 5px;
						color: #3B6AF1;
						background: #e2f4ff;
						border: 1px solid #3b6af1;
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



	}
</style>
