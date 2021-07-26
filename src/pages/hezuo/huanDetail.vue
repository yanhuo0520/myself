<template>
	<div class="huanDetail" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="还款详情" left-arrow fixed @click-left="leftBack" />
		<div class="header">
			<img src="../../images/logobg2.png" alt="" class="bgLogo" />
			<p class="num">{{detail.all_repaid}}</p>
			<p class="title">还款金额</p>
		</div>
		<div class="line"></div>
		<div class="huanCont">
			<!-- 已还 -->
			<template v-if="detail.if_should_repaid == 0">
				<van-cell title="还款方式" :value="detail.repayment_way">
					<template #icon>
						<img src="../../images/huanpay.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="提交还款时间" :value="detail.real_back_date">
					<template #icon>
						<img src="../../images/time.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="还款到账时间" :value="detail.real_back_date">
					<template #icon>
						<img src="../../images/time.png" alt="" />
					</template>
				</van-cell>
			</template>
			
			<!-- 任何状态都显示 -->
			<van-cell title="当期最后还款日" :value="detail.should_back_date">
				<template #icon>
					<img src="../../images/date1.png" alt="" />
				</template>
			</van-cell>
			<!-- 待还款  待还款(未到期)  已还款  逾期(未还)  逾期(已还) -->
			<!-- status 还款状态：0未还款，1已还款，2还款失败 -->
			<!-- "if_should_repaid": 0,//是否应该还款：0已还，1立即还款，2未还不到时间还，3可提前10日内还款 -->
			<template  v-if="detail.if_should_repaid == 2">
				<van-cell title="当期最早可还日" :value="detail.can_back_date">
					<template #icon>
						<img src="../../images/date2.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="还款状态" value="待还款(未到期)">
						<template #icon>
							<img src="../../images/status.png" alt="" />
						</template>
					</van-cell>
			</template>
			
				<van-cell title="还款状态" value="已还款" v-else-if="detail.if_should_repaid == 0 && detail.overdue_number == 0">
					<template #icon>
						<img src="../../images/status.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="还款状态" value="逾期(已还)" v-else-if="detail.if_should_repaid == 0 && detail.overdue_number > 0">
					<template #icon>
						<img src="../../images/status.png" alt="" />
					</template>
				</van-cell>
			
			<!-- 逾期显示-->
			<template v-if="detail.overdue_number > 0">
				<van-cell title="逾期天数" :value="detail.overdue_number">
					<template #icon>
						<img src="../../images/date.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="逾期滞纳金" :value="detail.overdue_rate">
					<template #icon>
						<img src="../../images/qian2.png" alt="" />
					</template>
				</van-cell>
			</template>
			
			<!-- 任何状态都显示 -->
			<van-cell title="利息" :value="detail.back_interest">
				<template #icon>
					<img src="../../images/jielixi.png" alt="" />
				</template>
			</van-cell>
			<van-cell title="本金" :value="detail.back_principal">
				<template #icon>
					<img src="../../images/qian3.png" alt="" />
				</template>
			</van-cell>
			
		</div>


	</div>
</template>
<script>
	export default {
		name: "huanDetail",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				backCode: '',
				status: '', //还款状态：0未还款，1已还款，2还款失败
				detail: '',
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.backCode = this.$route.query.backCode
			this.status = this.$route.query.status
			if (this.backCode) {
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.getDetail()
			}
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			getDetail() {
				if(this.status == 1){ // 已还款
					// 我要还款--已还详情（修改返回参数）
					this.$api.myLoanBackDetail({
						"back_code": this.backCode
					}).then(res => {
						this.$toast.clear()
						if (res.errno == 0) {
							res.data.if_should_repaid = 0
							this.detail = res.data
						} else {
							this.$toast(res.errmsg)
						}
					}).catch(err => {
						this.$toast.clear()
					})
				}else{ // 未还款
					//我要还款--还款计划未还款的还款详情
					this.$api.myPrepaidLoanBackDetail({
						"back_code": this.backCode
					}).then(res => {
						this.$toast.clear()
						if (res.errno == 0) {
							this.detail = res.data
						} else {
							this.$toast(res.errmsg)
						}
					}).catch(err => {
						this.$toast.clear()
					})
				}
				
			},
			ontimeHuan(){
				this.$router.push({
					path: '/untimeHuan',
					query: {
						backCode: this.detail.back_code
					}
				})
			}
		},
	}
</script>
<style lang="less">
	.huanDetail {
		padding-top: 46px;
		background: #3B6AF1;
		overflow: auto;
		.van-nav-bar {
			z-index: 10;
			background: #3B6AF1;

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
		.header{
			margin: 0 10px;
			padding: 25px 0;
			text-align: center;
			background: #FFFFFF;
			border-radius: 10px 10px 0 0;
			position: relative;
			.bgLogo{
				position: absolute;
				right: 0;
				top: 0;
				width: 70px;
			}
			.num{
				font-size: 24px;
				font-family: DIN, DIN-Medium;
				position: relative;
				display: inline-block;
				&::before{
					    position: absolute;
					    top: -5px;
					    left: calc(100% + 2px);
					    content: '';
					    width: 14px;
					    height: 10px;
					    background: url(../../images/yuan1.png) no-repeat;
					    background-size: auto 10px;
				}
			}
			.title{
				margin-top: 8px;
				color: #9AA8B6;
			}
		}
		.line{
			height: 14px;
			position: relative;
			margin: -0.5px 10px;
			&::before{
				content: '';
				position: absolute;
				left: 0;
				width: 100%;
				top: 0;
				height: 7px;
				background: url(../../images/radiustop.png) no-repeat;
				background-size: 100% 7px;
			}
			&::after{
				content: '';
					position: absolute;
					left: 0;
					width: 100%;
					bottom: 0;
					height: 7px;
					background: url(../../images/radiusbot.png) no-repeat;
					background-size: 100% 7px;
				}
			}


		.huanCont {
			margin: 0 10px 10px 10px;
			padding: 10px 0;
			min-height: calc(100% - 146px);
			background: #FFFFFF;
			border-radius: 0 0 10px 10px;
			.van-cell {
				img {
					width: 15px;
					height: 15px;
					margin: 3.5px 5px 0 0;
				}

				.van-cell__title {
					flex: 0.75;
					color: #444444;
					font-size: 15px;
				}

				.van-cell__value {
					font-size: 15px;
					color: #9AA8B6;
				}
			}
		}





	}
</style>
