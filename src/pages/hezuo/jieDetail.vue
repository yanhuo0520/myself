<template>
	<div class="jieDetail"
		:class="{'blue': detail.status == 0, 'green': detail.status == 1, 'red': detail.status == 2, 'purple': detail.status == 10, 'yellow': detail.status == 11, 'grey': detail.status == 4, 'orange': detail.status == 3}">
		<van-nav-bar title="借款详情" left-arrow fixed @click-left="leftBack" />
		<div class="header">
			<!-- 贷款状态：0待审批，1已放款，2已拒绝，3放款失败，4已结清，10已担保，11待担保 -->
			<!-- 待审批 -->
			<template v-if="detail.status == 0">
				<div>
					<img src="../../images/daishenpi.png" alt="" class="leftStatuImg" />
				</div>
				<img src="../../images/jiedetailright1.png" class="rightStatImg" />
			</template>
			<!-- 已放款 -->
			<template v-if="detail.status == 1">
				<div>
					<img src="../../images/yifangkuan.png" alt="" class="leftStatuImg" />
					<p>{{detail.loan_money_time}}</p>
				</div>
				<img src="../../images/jiedetailright2.png" class="rightStatImg" />
			</template>
			<!-- 已拒绝 -->
			<template v-if="detail.status == 2">
				<div>
					<img src="../../images/yijujue.png" alt="" class="leftStatuImg" />
					<p>{{detail.reason}}</p>
				</div>
				<img src="../../images/jiedetailright3.png" class="rightStatImg" />
			</template>
			<!-- 放款失败 -->
			<template v-if="detail.status == 3">
				<div>
					<img src="../../images/shibai.png" alt="" class="leftStatuImg" />
					<p>{{detail.reason}}</p>
				</div>
				<img src="../../images/jiedetailright7.png" class="rightStatImg" />
			</template>
			<!-- 已担保 -->
			<template v-if="detail.status == 10">
				<div>
					<img src="../../images/yidanbao.png" alt="" class="leftStatuImg" />
				</div>
				<img src="../../images/jiedetailright4.png" class="rightStatImg" />
			</template>
			<!-- 待担保 -->
			<template v-if="detail.status == 11">
				<div>
					<img src="../../images/daidanbao.png" alt="" class="leftStatuImg" />
				</div>
				<img src="../../images/jiedetailright5.png" class="rightStatImg" />
			</template>
			<!-- 已结清 -->
			<template v-if="detail.status == 4">
				<div>
					<img src="../../images/yijieqing.png" alt="" class="leftStatuImg" />
				</div>
				<img src="../../images/jiedetailright6.png" class="rightStatImg" />
			</template>
		</div>
		<div class="moneyCont">
			<p class="time">{{detail.add_time}}</p>
			<van-grid class="grid" :column-num="3" :border="false">
				<van-grid-item class="unitYuan">
					<p class="num">{{detail.loan_money > 0 ? detail.loan_money : 0}}</p>
					<p class="title">借款金额</p>
				</van-grid-item>
				<!-- 放款后 -->
				<template v-if="detail.status == 1 || detail.status == 4">
					<van-grid-item class="unitYuan">
						<p class="num">{{detail.interest_money}}</p>
						<p class="title">借款利息</p>
					</van-grid-item>
					<van-grid-item class="unitYuan" :class="detail.overdue_day > 0 ? 'overtime' : ''">
						<p class="num">{{detail.left_principal}}</p>
						<p class="title">待还金额</p>
					</van-grid-item>
				</template>
				<!-- 放款前 -->
				<template v-else>
					<van-grid-item class="unitTime">
						<!-- 借款期限标识：0无，1年，2月，3日 -->
						<p class="num"
							:class="{'ri': detail.loan_term_sign == 3,'yue': detail.loan_term_sign == 2,'nian': detail.loan_term_sign == 1}">
							{{detail.loan_term_number}}
						</p>
						<p class="title">借款时长</p>
					</van-grid-item>
					<van-grid-item class="unitLilv">
						<p class="num">{{detail.loan_rate_str}}</p>
						<p class="title">借款{{detail.rate_explain}}</p>
					</van-grid-item>
				</template>
			</van-grid>
		</div>


		<p class="m-title">借款人信息</p>
		<div class="jieCont">
			<van-cell title="社员卡号" :value="detail.passbook_num">
				<template #icon>
					<img src="../../images/cardNum.png" alt="" />
				</template>
			</van-cell>
			<van-cell title="社员姓名" :value="detail.name">
				<template #icon>
					<img src="../../images/person1.png" alt="" />
				</template>
			</van-cell>
			<van-cell title="身份证号" :value="detail.idcard">
				<template #icon>
					<img src="../../images/person2.png" alt="" />
				</template>
			</van-cell>
			<van-cell title="手机号" :value="detail.phone">
				<template #icon>
					<img src="../../images/phone.png" alt="" />
				</template>
			</van-cell>
		</div>

		<p class="m-title">借款信息</p>
		<div class="jieCont">
			<van-cell title="产品名称" :value="detail.product_name">
				<template #icon>
					<img src="../../images/text.png" alt="" />
				</template>
			</van-cell>
			<!-- "status": 1,//贷款状态：0待审批，1已放款，2已拒绝，3放款失败，4已结清，10已担保，11待担保 -->
			<!-- 放款后 -->
			<template v-if="detail.status == 1 || detail.status == 4">
				<van-cell :title="detail.rate_explain ? '借款' + detail.rate_explain : '借款利率'"
					:value="detail.loan_rate_str">
					<template #icon>
						<img src="../../images/yearlilv.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="还款方式" :value="detail.repayment_name">
					<template #icon>
						<img src="../../images/huanpay.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="借款用途" :value="detail.loan_use_name">
					<template #icon>
						<img src="../../images/jieuse.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="借款时长" :value="detail.loan_name">
					<template #icon>
						<img src="../../images/time.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="已还金额" :value="detail.back_principal">
					<template #icon>
						<img src="../../images/qian6.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="已还期数" :value="detail.repaid_period">
					<template #icon>
						<img src="../../images/date3.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="待还期数" :value="detail.nopaid_period">
					<template #icon>
						<img src="../../images/date4.png" alt="" />
					</template>
				</van-cell>
				<!-- 逾期 -->
				<template v-if="detail.overdue_day > 0">
					<van-cell title="逾期天数" :value="detail.overdue_day">
						<template #icon>
							<img src="../../images/date.png" alt="" />
						</template>
					</van-cell>
					<van-cell title="逾期滞纳金" :value="detail.overdue_money">
						<template #icon>
							<img src="../../images/qian2.png" alt="" />
						</template>
					</van-cell>
				</template>
			</template>

			<!-- 未放款 -->
			<template v-else>
				<van-cell title="借款利息" :value="detail.interest_money">
					<template #icon>
						<img src="../../images/jielixi.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="还款方式" :value="detail.repayment_name">
					<template #icon>
						<img src="../../images/huanpay.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="借款用途" :value="detail.loan_use_name">
					<template #icon>
						<img src="../../images/jieuse.png" alt="" />
					</template>
				</van-cell>
			</template>
		</div>
		<p class="m-title">担保信息</p>
		<div class="jieContDab">
			<div class="top">
				<p class="title">担保人</p>
				<p class="value">{{detail.guarantee_user}}</p>
			</div>
			<div class="desc">
				<p v-for="(item, index) in detail.newAarry" :key="index">
					<span>{{item.name}}</span>
					{{item.yuanyin}}
				</p>
			</div>
		</div>

	</div>
</template>
<script>
	export default {
		name: "jieDetail",
		data() {
			return {
				loanCode: '',
				detail: '',
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.loanCode = this.$route.query.loanCode
			if (this.loanCode) {
				this.getDetail()
			}
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			getDetail() {
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.user_loan_detail({
					"loan_code": this.loanCode
				}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						let guarantee_detail = res.data.guarantee_detail
						guarantee_detail = guarantee_detail.substr(0, guarantee_detail.length - 1)
						let nameArray = []
						let yuanyinArray = []
						let newAarry = []
						if (res.data.guarantee_user) {
							nameArray = res.data.guarantee_user.split('、')
							yuanyinArray = guarantee_detail.split('；')
						}
						if (nameArray.length > 0) {
							for (var i = 0; i < nameArray.length; i++) {
								let dataChi = {}
								dataChi.name = nameArray[i]
								dataChi.yuanyin = yuanyinArray[i]
								newAarry.push(dataChi)
							}
						}

						res.data.newAarry = newAarry
						this.detail = res.data
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
		},
	}
</script>
<style lang="less">
	.jieDetail {
		padding-top: 46px;
		min-height: calc(100% - 46px);
		background: #f0f6fc;

		&.blue {
			// 待审批
			background: #f0f6fc url(../../images/jiedetailblue.png) no-repeat top center;
			background-size: 100% 170px;

			.van-nav-bar {
				background: url(../../images/jiedetailblue.png) no-repeat top center;
				background-size: 100% 170px;
			}
		}

		&.green {
			// 已放款
			background: #f0f6fc url(../../images/jiedetailgreen.png) no-repeat top center;
			background-size: 100% 170px;

			.van-nav-bar {
				background: url(../../images/jiedetailgreen.png) no-repeat top center;
				background-size: 100% 170px;
			}
		}

		&.red {
			// 已拒绝
			background: #f0f6fc url(../../images/jiedetailred.png) no-repeat top center;
			background-size: 100% 170px;

			.van-nav-bar {
				background: url(../../images/jiedetailred.png) no-repeat top center;
				background-size: 100% 170px;
			}
		}

		&.purple {
			// 已担保
			background: #f0f6fc url(../../images/jiedetailpurple.png) no-repeat top center;
			background-size: 100% 170px;

			.van-nav-bar {
				background: url(../../images/jiedetailpurple.png) no-repeat top center;
				background-size: 100% 170px;
			}
		}

		&.yellow {
			// 待担保
			background: #f0f6fc url(../../images/jiedetailyellow.png) no-repeat top center;
			background-size: 100% 170px;

			.van-nav-bar {
				background: url(../../images/jiedetailyellow.png) no-repeat top center;
				background-size: 100% 170px;
			}
		}

		&.grey {
			// 已结清
			background: #f0f6fc url(../../images/jiedetailgrey.png) no-repeat top center;
			background-size: 100% 170px;

			.van-nav-bar {
				background: url(../../images/jiedetailgrey.png) no-repeat top center;
				background-size: 100% 170px;
			}
		}

		&.orange {
			// 放款失败
			background: #f0f6fc url(../../images/jiedetailorange.png) no-repeat top center;
			background-size: 100% 170px;

			.van-nav-bar {
				background: url(../../images/jiedetailorange.png) no-repeat top center;
				background-size: 100% 170px;
			}
		}

		.van-nav-bar {
			z-index: 10;
			background: transparent;

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

					&.unitYuan {
						.num {
							&::before {
								background: url(../../images/yuan1.png) no-repeat;
								background-size: auto 10px;
							}
						}
					}

					&.overtime {
						.num {
							color: #F24B4B;

							&::before {
								background: url(../../images/yuan2.png) no-repeat;
								background-size: auto 10px;
							}
						}

						.title {
							color: #F24B4B;
						}
					}

					&.unitTime {
						.num.ri {
							&::before {
								background: url(../../images/ri.png) no-repeat;
								background-size: auto 10px;
							}
						}

						.num.yue {
							&::before {
								background: url(../../images/yue1.png) no-repeat;
								background-size: auto 10px;
							}
						}

						.num.nian {
							&::before {
								background: url(../../images/nian.png) no-repeat;
								background-size: auto 10px;
							}
						}
					}

					&.unitLilv {
						.num {
							&::before {
								background: url(../../images/qian1.png) no-repeat;
								background-size: auto 10px;
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
						}
					}

					.title {
						margin-top: 5px;
						color: #9AA8B6;
					}
				}
			}
		}

		.m-title {
			margin: 10px;
			font-size: 15px;
		}

		.jieCont {
			margin: 0 10px;

			.van-cell {
				&:first-child {
					border-radius: 10px 10px 0 0;
				}

				&:last-child {
					border-radius: 0 0 10px 10px;
				}

				img {
					width: 15px;
					height: 15px;
					margin: 3.5px 5px 0 0;
				}

				.van-cell__title {
					flex: 0.5;
					color: #444444;
					font-size: 15px;
				}

				.van-cell__value {
					font-size: 15px;
					color: #9AA8B6;
				}
			}
		}

		.jieContDab {
			margin: 0 10px;
			background: #FFFFFF;
			border-radius: 10px;
			padding: 15px;
			font-size: 15px;

			.top {
				padding-left: 20px;
				background: url(../../images/person3.png) no-repeat;
				background-size: 15px 15px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 10px;
				border-bottom: 1px solid #F0F6FC;

				.title {
					color: #444444;
				}

				.value {
					color: #9AA8B6;
				}
			}

			.desc {
				p {
					margin-top: 15px;
					color: #9AA8B6;
					position: relative;
					padding-left: 60px;

					span {
						font-size: 13px;
						color: #3B6AF1;
						background: #e2f4ff;
						border: 1px solid #3b6af1;
						border-radius: 20px;
						padding: 1px 0;
						width: 50px;
						text-align: center;
						position: absolute;
						left: 0;
						top: 0;
					}
				}
			}
		}




	}
</style>
