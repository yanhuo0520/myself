<template>
	<div class="huanJiluList" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="提前还款记录" left-arrow fixed @click-left="leftBack" />
		<div class="content" v-if="ifLoading">
			<van-sticky :offset-top="46">
				<div class="titlTop">
					<div>
						<img src="../../images/time1.png" class="time" />
						<p>第{{qishu}}期</p>
						<img src="../../images/down1.png" class="down" />
					</div>
					<p>提前还款日:{{info.real_back_date}}</p>
				</div>
			</van-sticky>
			
			<template v-if="qishu.length > 0">
				<div class="item" v-for="(item, index) in huanList" :key="index">
					<div class="top">
						<img src="../../images/textImg.png" />
						<p class="title">第{{item.qishu}}期</p>
						<template v-if="item.overdue_day == 0">
							<p class="status blue">提前{{item.pre_day}}天</p>
						</template>
						<template v-else>
							<p class="status red">逾期{{item.overdue_day}}天</p>
						</template>
					</div>
					<van-grid class="grid" :column-num="item.overdue_day > 0 ? 3 : 2" :border="false">
						<van-grid-item>
							<p class="num">{{item.should_back_date}}</p>
							<p class="title">应该还款日</p>
						</van-grid-item>
						<van-grid-item class="yuanBg">
							<p class="num">{{item.all_repaid}}</p>
							<p class="title">还款金额</p>
						</van-grid-item>
						<van-grid-item class="yuanBg" v-if="item.overdue_day > 0">
							<p class="num">{{item.overdue_rate}}</p>
							<p class="title">逾期滞纳金</p>
						</van-grid-item>
					</van-grid>
				</div>
				<div class="item">
					<div class="top">
						<img src="../../images/textImg.png" />
						<p class="title">{{info.pre_interest_start}} ~ {{info.pre_interest_end}}利息</p>
					</div>
					<van-grid class="grid" :column-num="3" :border="false">
						<van-grid-item class="yuanBg">
							<p class="num">{{info.back_principal}}</p>
							<p class="title">本金</p>
						</van-grid-item>
						<van-grid-item class="yuanBg">
							<p class="num">{{info.pre_interest}}</p>
							<p class="title">利息</p>
						</van-grid-item>
						<van-grid-item class="liLvBg">
							<p class="num">{{info.loan_rate}}</p>
							<p class="title">{{info.rate_explain}}</p>
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

	</div>
</template>
<script>
	export default {
		name: "huanJiluList",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				ifLoading: false,
				backCode: '',
				qishu: '',
				info: '',
				huanList: []
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.qishu = this.$route.query.qishu
			this.backCode = this.$route.query.backCode
			if (this.backCode) {
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
			getList() {
				this.$api.myPrebackLogIncludePlan({
					"back_code": this.backCode
				}).then(res => {
					this.ifLoading = true
					this.$toast.clear()
					if (res.errno == 0) {
						this.info = res.info
						this.huanList = res.data
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
	.huanJiluList {
		padding-top: 46px;
		overflow: auto;
		background: #f0f6fc url(../../images/bgTop6.png) no-repeat center 46px;
		background-size: 100% 200px;
		
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

		.van-sticky--fixed{
			.titlTop{
				padding: 0 10px;
				border-radius: 20px 20px 0 0;
				background: #ffffff;
			}
		}
		.content {
			padding: 0 10px 15px 10px;
			position: relative;

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
					// background: url(../../images/right1.png) no-repeat calc(100% - 5px) center;
					// background-size: 9px 15px;

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

						&.yuanBg{
							.num::before {
								background: url(../../images/yuan1.png) no-repeat;
								background-size: auto 10px;
							}
						}
						&.liLvBg{
							.num::before {
								background: url(../../images/qian1.png) no-repeat;
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
