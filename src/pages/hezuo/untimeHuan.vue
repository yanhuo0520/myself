<template>
	<div class="untimeHuan" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="按期还款" left-arrow fixed @click-left="leftBack" />
		<div class="header">
			<p class="title">本期应还总额</p>
			<p class="num"><span>¥</span>{{baseDetail.all_repaid}}</p>
		</div>
		<van-radio-group class="huanCont">
			<van-cell :title="baseDetail.rate_explain" :value="baseDetail.loan_rate_str">
				<template #icon>
					<img src="../../images/yearlilv.png" alt="" />
				</template>
			</van-cell>
			<van-cell title="利息" :value="baseDetail.back_interest">
				<template #icon>
					<img src="../../images/jielixi.png" alt="" />
				</template>
			</van-cell>
			<template>
				<van-cell title="应还日期" :value="baseDetail.should_back_date">
					<template #icon>
						<img src="../../images/date1.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="逾期滞纳金" :value="baseDetail.overdue_rate">
					<template #icon>
						<img src="../../images/qian2.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="逾期天数" :value="baseDetail.overdue_number">
					<template #icon>
						<img src="../../images/date.png" alt="" />
					</template>
				</van-cell>
				<van-cell title="未还本金" :value="baseDetail.back_principal">
					<template #icon>
						<img src="../../images/qian3.png" alt="" />
					</template>
				</van-cell>
			</template>
		</van-radio-group>

		<van-radio-group v-model="radioBanType" class="selGroup">
				<van-cell :title="item.bank_num_str" clickable v-for="(item, index) in radioPayItem" :key="index"
					@click="radioBanType = item.pay_type, radioBankId = item.bank_id, radioBanNum = item.bank_num, radioBanNumStr = item.bank_num_str" :class="radioBanType == item.pay_type ? 'active' : ''">
					<template #icon>
						<img :src="item.icon" alt="" class="iconImg" />
					</template>
					<template #right-icon>
						<van-radio :name="item.pay_type">
							<template #icon="props">
								<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
							</template>
						</van-radio>
					</template>
				</van-cell>
			</van-radio-group>
			
			<p class="btnRound"  @click="goPay()">立即还款</p>
		
		<van-overlay :show="showInput" class="inputCont" @click="this.showKeyboard = false">
			<div class="wrapper" @click.stop @click="showInput = false,showKeyboard = false" >
				<div class="block">
					<p class="title">请输入支付密码</p>
					<!-- 密码输入框 -->
					<van-password-input :value="passward" :focused="showKeyboard" @focus="showKeyboard = true" />
					<!-- 数字键盘 -->
					<van-number-keyboard
						v-model="passward"
					  :show="showKeyboard"
					  :transition="false"
					  theme="custom"
						:maxlength="6"
					  close-button-text="完成"
					  @close="closeKeyboard"
					/>
				</div>

			</div>
		</van-overlay>
		

	</div>
</template>
<script>
	export default {
		name: "untimeHuan",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				backCode: '',
				baseDetail: '',
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),
				radioBankId: '',
				radioBanNum: '',
				radioBanType: '',
				radioBanNumStr: '',
				radioPayItem: [],
				showInput: false,
				showKeyboard: false,
				passward: '',
				order_id: '',
				interval: '',
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.backCode = this.$route.query.backCode
			this.$toast.loading({
				message: '加载中...',
				forbidClick: true,
				duration: 0,
			});
			this.getDetail()
			this.getPayType()
			
			let that = this;
			if (that.interval) {
        clearInterval(that.interval)
        that.interval = ''
      }
		},
		methods: {
			leftBack() {
				if (this.interval) {
					clearInterval(this.interval)
					this.interval = ''
				}

				this.$router.go(-1);
			},
			// 调取支付之后---轮询查支付状态
			onPayFinish(info) {
				// hasResult为false开始轮询
				if (info.length > 0 && !info.hasResult) {
					this.orderState()
					this.interval = setInterval(function() {
						this.orderState()
					}, 1000)
				}
			},
			getDetail() { // 我要还款--还款计划未还款的还款详情
				this.$api.loanBackByPlanDetail({
					"back_code": this.backCode
				}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.baseDetail = res.data
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			toggle(index) {
				this.$refs.checkboxes[index].toggle();
			},
			getPayType() { // 我要还款--还款时显示支付方式
				this.$api.loanBackSelectPayType().then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						res.data.forEach(ele => {
							if (ele.pay_type == 1) {
								ele.icon = require("../../images/card1.png")
							} else if (ele.pay_type == 3 || ele.pay_type == 5) {
								ele.icon = require("../../images/wei.png")
							} else if (ele.pay_type == 4 || ele.pay_type == 6) {
								ele.icon = require("../../images/zhi.png")
							} else if (ele.pay_type == 7) {
								ele.icon = require("../../images/yun.png")
							}
						})
						this.radioBankId = res.data[0].bank_id
						this.radioBanNum = res.data[0].bank_num
						this.radioBanType = res.data[0].pay_type
						this.radioBanNumStr = res.data[0].bank_num_str
						this.radioPayItem = res.data
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			goPay(){ // 立即还款
				if(typeof android == "undefined"){
					this.$toast("请在手机端支付！")
					return
				}
				this.passward = ''
				if(this.radioBanType == 1){
					this.showInput = true
					this.showKeyboard = true
				}else{
					this.closeKeyboard()
				}
			},
			closeKeyboard(){
				if(this.radioBanType == 1 && this.passward.length < 6){
					this.$toast('请输入完整的6位数密码')
					return
				}
				this.showInput = false
				this.showKeyboard = false
				let data = {}
					data.back_code = this.backCode
					data.bank_id = this.radioBankId
					data.bank_num = this.radioBanNum
					// 支付密码（合作社卡支付也就是pay_type为1时才必传）
					data.pay_pwd = this.$md5(this.passward)
					// 还款支付方式：1社内卡3微信4支付宝5微信银联渠道6支付宝银联渠道7云闪付
					data.pay_type = this.radioBanType
				this.$api.payLoanBackPlanByPassbook(data).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						if(this.radioBanType == 1){ // 合作社卡支付
							this.$router.push({
								path: '/huanSuccess',
								query:{
									bankStr: this.radioBanNumStr,
									type: this.radioBanType,
									money: this.baseDetail.all_repaid
								}
							})
						}else{
							this.backCode = res.back_code //还款计划编号id
							this.order_id = res.order_id // 订单id
							// nongAliPay,农行支付宝渠道.，unionAliPay云闪付支付宝渠道，unionPay云闪付，unionWxPay云闪付微信渠道
							if(this.radioBanType == 5){ // 微信支付(银联渠道)
								if (typeof android != "undefined") {
									android.unionWxPay(res.data);
								}
							}else if(this.radioBanType == 6){ // 支付宝支付(银联渠道)
								if (typeof android != "undefined") {
									android.unionAliPay(res.data);
								}
							}else if(this.radioBanType == 7){ // 云闪付
								let dataJson = JSON.parse(res.data)
								if (typeof android != "undefined") {
									android.unionPay(dataJson.tn);
								}
							}
							let that = this
							that.interval = setInterval(() => {
								that.orderState()
							}, 1000)
						}
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			orderState() {
				let that = this
				let data = {}
					data.order_id = this.order_id
					data.back_code = this.backCode
				this.$api.loanBackOrderQuery(data).then(res => {
					if (res.errno == 0) {
						this.$router.push({
							path: '/huanResult',
							query: {
								orderId: this.order_id,
								backCode: this.backCode
							}
						})
						clearInterval(that.interval)
						that.interval = ''
					}
				}).catch(err => {
					clearInterval(that.interval)
					that.interval = ''
				})

			},
		},
	}
</script>
<style lang="less">
	.untimeHuan {
		padding-top: 46px;
		background: #f0f6fc url(../../images/bgHeader6.png) no-repeat;
		background-size: 100% 170px;
		overflow: auto;

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

		.header {
			margin: 0 10px;
			padding: 25px 0;
			text-align: center;

			.num {
				font-size: 30px;
				margin-top: 10px;
				font-family: DIN, DIN-Medium;

				span {
					font-size: 14px;
					font-weight: bold;
					padding-right: 5px;
				}
			}

			.tip {
				margin-top: 10px;
				color: #9AA8B6;
				background: #ffffff;
				border-radius: 30px;
				display: inline-block;
				line-height: 20px;
				padding: 0 15px;
				position: relative;

				&::before {
					content: '';
					position: absolute;
					left: 8px;
					top: 9px;
					width: 2px;
					height: 2px;
					border-radius: 50%;
					background: #9AA8B6;
				}

				&::after {
					content: '';
					position: absolute;
					right: 8px;
					top: 9px;
					width: 2px;
					height: 2px;
					border-radius: 50%;
					background: #9AA8B6;
				}
			}
		}

		.huanCont {
			margin: 0 10px;
			.van-cell {
				&:first-child {
					border-radius: 10px 10px 0 0;
				}
				&:nth-last-of-type(1) {
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

			.tip {
				margin-top: 20px;
				display: flex;
				align-items: center;
				background: #FDF7ED;
				color: #AA9C8B;
				line-height: 18px;

				img {
					width: 58px;
					margin-right: 5px;
				}

			}

		}

		.selGroup {
			margin: 10px;

			.van-cell {
				&:first-child {
					border-top-left-radius: 10px;
					border-top-right-radius: 10px;
				}

				&:nth-last-of-type(1) {
					border-bottom-left-radius: 10px;
					border-bottom-right-radius: 10px;
				}

				.img-icon {
					width: 15px;
					height: 15px;
				}

				img {
					width: 15px;
					height: 15px;
					margin: 3.5px 5px 0 0;
				}
			}
		}




		.btnRound {
			margin: 20px 15px 10px 15px;
			text-align: center;
			line-height: 36px;
			color: #FFFFFF;
			border-radius: 30px;
			font-size: 15px;
			background: #3B6AF1;
			border: 1px solid #3B6AF1;
		}
.van-overlay{
			z-index: 10;
		}
		.inputCont {
			.wrapper {
				height: 100%;

				.block {
					text-align: center;
					position: fixed;
					bottom: 0;
					left: 0;
					right: 0;
					height: 380px;
					background-color: #fff;
					border-radius: 10px 10px 0 0;

					.title {
						line-height: 60px;
						font-size: 15px;
					}
				}

			}

		}


	}
</style>
