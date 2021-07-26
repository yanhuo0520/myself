<template>
	<div class="huzhuhOut" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar :title="mTitle" left-arrow fixed @click-left="leftBack" />
		<template v-if="bankList.length > 0">
			<van-cell-group>
				<van-cell :title="cardNum" class="bankCont" is-link @click="show = true">
					<template #icon>
						<img :src="cardImg" class="leftIcon" />
					</template>
				</van-cell>
			</van-cell-group>

		</template>
		<template v-else>
			<van-cell title="添加支付方式" class="bankCont" is-link @click="$router.push('/applyCard')">
				<template #icon>
					<img src="../../images/addqian.png" class="leftIcon" />
				</template>
			</van-cell>
		</template>

		<div class="inCont">
			<p class="m-title">取出金额(元)</p>
			<van-field v-model="money" :readonly="ifFromDing" :class="ifIn? 'ifIn' : ''" clearable placeholder="" @input="ifIn = true, outMoney()">
				<template #right-icon v-if="!ifFromDing">
					<p @click="money = allMoney">全部</p>
				</template>
				<template #left-icon>
					<img src="../../images/qian4.png" alt="" class="iconImg" />
				</template>
			</van-field>
			<div class="tip" v-if="!ifFromDing">
				可取出金额<span>¥{{allMoney}}</span>
			</div>
		</div>

		<!-- 1快速到账，2普通到账 -->
		<van-radio-group v-model="radio" class="selSheet">
			<van-cell-group>
				<van-cell title="快速到账" clickable label="每日快速到账额度10万元,预计实时到账" @click="radio = '1'">
					<template #right-icon>
						<van-radio name="1">
							<template #icon="props">
								<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
							</template>
						</van-radio>
					</template>
				</van-cell>
				<van-cell title="普通到账" clickable label="无限额,预计10月21日(星期二)到账" @click="radio = '2'">
					<template #right-icon>
						<van-radio name="2">
							<template #icon="props">
								<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
							</template>
						</van-radio>
					</template>
				</van-cell>
			</van-cell-group>
		</van-radio-group>

		<p class="btnRound" @click="goPay()">确定存入</p>

		<!-- 选择银行 -->
		<van-action-sheet v-model="show" title="选择银行" class="selSheet" :closeable="false">
			<template v-if="bankList.length > 0">
				<van-radio-group v-model="selRadio" v-for="(item, index) in bankList" :key="index">
					<van-cell :title="item.NameNum" clickable
						@click="selRadio = item.bank_id, selImg = item.logoImg, selTitle = item.NameNum"
						:class="selRadio == item.bank_id ? 'active' : ''">
						<template #icon>
							<img :src="item.logoImg" alt="" class="logoIcon" />
						</template>
						<template #right-icon>
							<van-radio :name="item.bank_id">
								<template #icon="props">
									<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
								</template>
							</van-radio>
						</template>
					</van-cell>
				</van-radio-group>
			</template>

			<p class="sheetNull" v-if="bankList.length == 0">暂无</p>
			<van-button round block type="info" @click="sureSel()">确定</van-button>
		</van-action-sheet>


		<van-overlay :show="showInput" class="inputCont" @click="this.showKeyboard = false">
			<div class="wrapper" @click.stop @click="showInput = false,showKeyboard = false">
				<div class="block">
					<p class="title">请输入支付密码</p>
					<!-- 密码输入框 -->
					<van-password-input :value="passward" :focused="showKeyboard" @focus="showKeyboard = true" />
					<!-- 数字键盘 -->
					<van-number-keyboard v-model="passward" :show="showKeyboard" :transition="false" theme="custom"
						:maxlength="6" close-button-text="完成" @close="closeKeyboard" />
				</div>

			</div>
		</van-overlay>

	</div>
</template>
<script>
	export default {
		name: "huzhuhOut",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				cardImg: '',
				cardNum: '',
				bank_id: '',

				money: '',
				ifIn: false,
				allMoney: '',
				dingMoney: '',
				ifFromDing: false,
				mTitle: '活期本金取出',

				show: false,
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),
				selRadio: '',
				selImg: '',
				selTitle: '',
				bankList: [],
				radio: '1',

				showInput: false,
				showKeyboard: false,
				passward: ''
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.allMoney = this.$route.query.money
			this.dingMoney = this.$route.query.dingMoney
			if(this.allMoney){ // 页面来自活期本金取出
			this.ifFromDing = false
				this.mTitle = "活期本金取出"
			}else if(this.dingMoney){ // 页面来自定期本金取出
				this.ifFromDing = true
				this.mTitle = "定期本金取出"
				this.money = this.dingMoney
			}
			this.userBank()
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			userBank() {
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.user_bank({}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						res.data.forEach(ele => {
							let bank_num = ele.bank_num
							ele.NameNum = ele.open_bank + '(' + bank_num.substring(bank_num.length - 4) +
								')'
							if (ele.open_bank_letter == 'CCB') { // 建行
								ele.logoImg = require("../../images/CCB.png")
							} else if (ele.open_bank_letter == 'BC') {
								ele.logoImg = require("../../images/BC.png")
							} else if (ele.open_bank_letter == 'BOC') {
								ele.logoImg = require("../../images/BOC.png")
							} else if (ele.open_bank_letter == 'CMB') {
								ele.logoImg = require("../../images/CMB.png")
							} else if (ele.open_bank_letter == 'GF') {
								ele.logoImg = require("../../images/GF.png")
							} else if (ele.open_bank_letter == 'ICBC') { // 工商
								ele.logoImg = require("../../images/ICBC.png")
							} else if (ele.open_bank_letter == 'CITIC') {
								ele.logoImg = require("../../images/ZX.png")
							} else if (ele.open_bank_letter == 'ABC') { // 农行
								ele.logoImg = require("../../images/ABC.png")
							} else if (ele.open_bank_letter == 'CMBC') {
								ele.logoImg = require("../../images/CMBC.png")
							} else if (ele.open_bank_letter == 'YZ') {
								ele.logoImg = require("../../images/YZ.png")
							} else if (ele.open_bank_letter == 'CEB') { // 光大
								ele.logoImg = require("../../images/CEB.png")
							} else {
								ele.logoImg = ele.bank_log
							}
						});
						this.cardNum = res.data[0].NameNum
						this.cardImg = res.data[0].logoImg;
						this.bank_id = res.data[0].bank_id

						this.selTitle = res.data[0].NameNum
						this.selImg = res.data[0].logoImg
						this.selRadio = res.data[0].bank_id
						this.bankList = res.data
					} else {
						this.$toast(res.errmsg)
					}

				}).catch(err => {
					this.$toast.clear()
				})
			},
			sureSel() {
				this.bank_id = this.selRadio
				this.cardNum = this.selTitle
				this.cardImg = this.selImg
				this.show = false
			},
			outMoney() {
				if (Number(this.money) > Number(this.allMoney)) {
					this.money = this.allMoney
					this.$toast("账户最多只能转出" + this.allMoney + "元！")
					return
				}
			},
			goPay() {
				if (this.money <= 0) {
					this.$toast("请输入转出金额")
					return
				}
				this.passward = ''
				this.showInput = true
				this.showKeyboard = true
			},
			closeKeyboard() {
				if (this.passward.length < 6) {
					this.$toast('请输入完整的6位数密码')
					return
				}
				this.showInput = false
				this.showKeyboard = false
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				let data = {}
				data.bank_id = this.bank_id
				data.pay_pwd = this.$md5(this.passward) // 支付密码（前端md5加密）
				data.money = this.money
				data.turn_way = this.radio
				this.$api.submit_passbook_take_out(data).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.$toast(res.errmsg)
						this.$router.go(-1);
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				});
			},

		}
	}
</script>
<style lang="less">
	.huzhuhOut {
		padding-top: 46px;
		background: #F0F6FC;
		overflow: auto;

		.van-nav-bar {
			background: #F0F6FC;

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

		.van-cell-group {
			margin: 10px 10px 0 10px;
			border-radius: 10px;

			.van-cell {
				&:first-child {
					border-top-left-radius: 10px;
					border-top-right-radius: 10px;
				}

				&:last-child {
					border-bottom-left-radius: 10px;
					border-bottom-right-radius: 10px;
				}
			}
		}

		.bankCont {
			.leftIcon {
				width: 24px;
				height: 24px;
				margin-right: 5px;
			}
		}

		.noBank {
			margin: 0 10px;
			height: 40px;
			padding-left: 10px;
			border-radius: 10px;
			background: #FFFFFF;
			display: flex;
			align-items: center;
			font-size: 14px;

			img {
				width: 16px;
				margin-right: 5px;
			}
		}

		.inCont {
			background: #FFFFFF;
			margin: 10px;
			padding: 15px;
			border-radius: 10px;

			.m-title {
				color: #9AA8B6;
			}

			.van-cell {
				margin-top: 15px;
				padding: 0;

				&.ifIn {
					&::after {
						border-bottom: 1px solid #3B6AF1;
					}
				}

				&::after {
					left: 0;
					right: 0;
				}

				input {
					font-size: 21px;
				}

				img {
					height: 10px;
					margin-top: 10px;
				}

				.van-field__right-icon {
					color: #3B6AF1;
					font-size: 13px;
				}
			}

			.tip {
				margin-top: 10px;
				color: #9AA8B6;
			}
		}

		// 选择框
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

			.logoIcon {
				width: 20px;
				height: 20px;
				margin: 3px 5px 0 0;
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

			.sheetNull {
				margin: 20px 0;
				color: #666666;
				text-align: center;
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
