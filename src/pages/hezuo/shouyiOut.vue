<template>
	<div class="shouyiOut" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="提现" right-text="提现记录" left-arrow fixed @click-left="leftBack" @click-right="onClickRight" />
		<!-- 只能提到银行卡 -->
		<template v-if="bankList.length > 0">
			<van-cell-group>
				<van-cell :title="cardNum" class="bankCont" is-link @click="showBank = true">
					<template #icon>
						<img :src="cardImg" class="leftIcon" />
					</template>
				</van-cell>
			</van-cell-group>
		</template>
		<template v-else>
			<van-cell title="添加收款方式" class="bankCont" is-link @click="$router.push('/applyCard')">
				<template #icon>
					<img src="../../images/addqian.png" class="leftIcon" />
				</template>
			</van-cell>
		</template>

		<div class="inCont">
			<p class="m-title">提现金额</p>
			<van-field v-model="money" type="number" clearable :class="ifIn? 'ifIn' : ''" @input="ifIn = true, outMoney()" @clear="disabled = true"
				placeholder="">
				<template #right-icon>
					<p @click="allOut()">全部</p>
				</template>
				<template #left-icon>
					<img src="../../images/qian4.png" alt="" class="iconImg" />
				</template>
			</van-field>
			<div class="tip">
				<p>当前可提现余额 ¥{{allMoney}}元</p>
			</div>
		</div>

		<van-button :disabled="disabled" :icon='require("../../images/out1.png")' type="info" block class="sendBtn" @click="goPay()"
			v-if="hidshowFooter">
			立即提现
		</van-button>

		<van-overlay :show="showInput" class="inputCont" @click="this.showKeyboard = false">
			<div class="wrapper" @click.stop @click="showInput = false,showKeyboard = false">
				<div class="block">
					<p class="title">请输入支付密码</p>
					<!-- 密码输入框 -->
					<van-password-input :value="passward" :focused="showKeyboard" @focus="showKeyboard = true" />
					<!-- 数字键盘 -->
					<van-number-keyboard v-model="passward" :show="showKeyboard" :transition="false" theme="custom"
						:maxlength="6" close-button-text="提现" @close="closeKeyboard" />
				</div>

			</div>
		</van-overlay>

		<!-- 选择银行 -->
		<van-action-sheet v-model="showBank" title="选择收款账户" class="selSheet" :closeable="false">
			<van-radio-group v-model="selRadio">
				<template v-if="bankList.length > 0">
					<!-- 银行卡列表 -->
					<van-cell clickable v-for="(item, index) in bankList" :key="index"
						@click="selRadio = item.bank_id, selImg = item.logoImg, selTitle = item.NameNum"
						:class="selRadio == item.bank_id ? 'active' : ''">
						<template #icon>
							<img :src="item.logoImg" alt="" class="logoIcon" />
						</template>
						<template #title>
							<span class="custom-title">{{item.NameNum}}</span>
							<van-tag round>预计2小时到账</van-tag>
						</template>
						<template #right-icon>
							<van-radio :name="item.bank_id">
								<template #icon="props">
									<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
								</template>
							</van-radio>
						</template>
					</van-cell>
				</template>

				<!-- 添加新银行卡 -->
				<van-cell title="添加新银行卡" is-link @click="$router.push('/applyCard')">
					<template #icon>
						<img src="../../images/cardIcon.png" class="logoIcon" />
					</template>
				</van-cell>
			</van-radio-group>
			<van-button round block type="info" @click="sureSel()">确定</van-button>
		</van-action-sheet>


	</div>
</template>
<script>
	export default {
		name: "shouyiOut",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 90,
				showBank: false,
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),
				selRadio: '',
				selTitle: '',
				selImg: '',

				cardNum: '',
				bank_id: '',
				cardImg: '',
				bankList: [],

				money: '',
				disabled: true,
				allMoney: 0,
				ifIn: false,

				showInput: false,
				showKeyboard: false,
				passward: '',

				docmHeight: document.documentElement.clientHeight, //默认屏幕高度
				showHeight: "0", //实时屏幕高度
				hidshowFooter: true, //显示或者隐藏footer,
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.allMoney = this.$route.query.money
			this.userBank()

			window.onresize = () => { // 实时屏幕高度
				this.showHeight = document.body.clientHeight;
			};
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			// 提现记录
			onClickRight() {
				this.$router.push({
					path: '/shouyiOutList'
				})
			},
			// 银行卡列表
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
				this.showBank = false
			},
			outMoney() {
				if (Number(this.allMoney) == 0 || this.allMoney == '') {
					this.$toast("暂无收益可以提取")
					this.money = ''
					this.disabled = true
					return
				} else if (Number(this.money) > Number(this.allMoney)) {
					this.money = this.allMoney
					this.disabled = false
					this.$toast("账户最多只能转出" + this.allMoney + "元！")
					return
				}else{
					this.disabled = false
				}
			},
			allOut(){
				if(this.allMoney <= 0){
					this.$toast("暂无余额可提现")
					this.disabled = true
					return
				}else{
					this.money = this.allMoney
					this.ifIn = true
					this.disabled = false
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
				data.money = this.money
				data.pay_pwd = this.$md5(this.passward) // 支付密码（前端md5加密）
				data.turn_way = 1
				
				this.$api.submit_passbook_bonus_take_out(data).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.$toast("预计2小时到账，请耐心等待")
						setTimeout(() => {
							this.$router.go(-1);
						}, 1000)

					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				});
			},

		},
		watch: {
			showHeight: function() {
				if (this.docmHeight > this.showHeight) {
					this.hidshowFooter = false;
				} else {
					this.hidshowFooter = true;
				}
			}
		}
	}
</script>
<style lang="less">
	.shouyiOut {
		padding-top: 46px;
		padding-bottom: 44px;
		overflow: auto;
		background: #F0F6FC;

		.van-nav-bar {
			background: #F0F6FC;

			.van-icon,
			.van-nav-bar__text {
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

		.inTitle {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 15px;
			font-size: 15px;
			color: #444444;

			.icon {
				width: 16px;
				height: 16px;
				border: 2px solid #ffffff;
				border-radius: 50%;
				margin-right: 3px;
			}

			.inDesc {
				display: flex;
				align-items: center;
			}

			.descType {
				color: #222222;
				margin: 0 3px;
			}
		}

		.bankCont {
			align-items: center;
			background: #F0F6FC;

			.leftIcon {
				width: 24px;
				height: 24px;
				border-radius: 50%;
				margin-right: 5px;
				border: 3px solid #FFFFFF;
			}
		}

		.noBank {
			height: 40px;
			padding-left: 15px;
			background: #F0F6FC;
			display: flex;
			align-items: center;
			font-size: 14px;

			img {
				width: 16px;
				margin-right: 5px;
			}
		}

		.inCont {
			background: #ffffff url(../../images/radiustop1.png) no-repeat top center;
			background-size: 100% 30px;
			padding: 15px;

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

		.sendBtn {
			position: fixed;
			bottom: 0;
			left: 0;
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

			.van-tag {
				border: 1px solid #3b6af1;
				background: #e2f4ff;
				color: #3B6AF1;
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
				width: 20px;
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
