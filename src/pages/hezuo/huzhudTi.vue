<template>
	<div class="huzhudTi" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="定期本金提取" left-arrow fixed @click-left="leftBack" />
		<template v-if="bankList.length > 0">
			<van-cell :title="cardNum" class="bankCont" is-link @click="show = true">
				<template #icon>
					<img :src="cardImg" class="leftIcon" />
				</template>
			</van-cell>
		</template>
		<template v-else>
			<van-cell title="添加收款方式" class="bankCont" is-link @click="$router.push('/applyCard')">
				<template #icon>
					<img src="../../images/addqian.png" class="leftIcon" />
				</template>
			</van-cell>
		</template>

		<div class="inCont">
			<p class="m-title">取出金额(元)</p>
			<van-field v-model="money" readonly clearable
				placeholder="">
				<template #left-icon>
					<img src="../../images/qian4.png" alt="" class="iconImg" />
				</template>
			</van-field>
			<div class="tip">
				<p>本金 ¥{{allMoney}}元</p>
			</div>
		</div>

		<van-button :icon='require("../../images/out1.png")' type="info" block class="sendBtn" @click="goPay()" v-if="hidshowFooter">
			立即取出
		</van-button>

		<!-- 提取取出提醒 -->
		<div class="tipCont" v-if="ifShowTip">
			<img src="../../images/tipImg.png" alt="" class="leftImg" />
			提前支取利息会相应损失减少,且无法撤销操作。
			<img src="../../images/guang.png" alt="" class="rightImg" />
		</div>

		<!-- 选择银行 -->
		<van-action-sheet v-model="show" title="选择转出账户" class="selSheet" :closeable="false" cancel-text="确定" @cancel="sureSel()">
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
							<span class="custom-title">{{item.open_bank}}</span>
							<van-tag round>预计到账2个小时</van-tag>
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
		</van-action-sheet>


		<van-overlay :show="showInput" class="inputCont" @click="this.showKeyboard = false">
			<div class="wrapper" @click.stop @click="showInput = false,showKeyboard = false">
				<div class="block">
					<p class="title">请输入支付密码</p>
					<!-- 密码输入框 -->
					<van-password-input :value="passward" :focused="showKeyboard" @focus="showKeyboard = true" />
					<!-- 数字键盘 -->
					<van-number-keyboard v-model="passward" :show="showKeyboard" :transition="false" theme="custom"
						:maxlength="6" close-button-text="提取" @close="closeKeyboard" />
				</div>

			</div>
		</van-overlay>

	</div>
</template>
<script>
	export default {
		name: "huzhudTi",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 90,

				cardImg: '',
				cardNameNum: '',
				bank_id: '',
				
				if_expire: '',
				ifShowTip: false,
				dingId: '',
				money: '',
				allMoney: 0,

				show: false,
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),
				selRadio: '',
				selTitle: '',
				selImg: '',
				bankList: [],
				
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
			
			this.if_expire = this.$route.query.if_expire
			// "if_expire": 0,//定期是否到期：0否，1是
			if(this.if_expire == 0){
				this.ifShowTip = true
			}
			this.dingId = this.$route.query.id
			this.money = this.$route.query.money
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
			userBank() {
				this.$api.user_bank({}).then(res => {
					this.isLoading = false
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
					this.isLoading = false
				})
			},
			sureSel() {
				this.bank_id = this.selRadio
				this.cardImg = this.selImg
				this.cardNum = this.selTitle
				this.show = false
			},
			goPay() {
				if (Number(this.money) <= 0) {
					this.$toast("暂无金额可转出！")
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
				data.id = this.dingId
				data.turn_way = 1
				this.$api.submit_regular_money_take_out(data).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.$toast("预计2小时到账，请耐心等待")
						setTimeout(()=>{
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
	.huzhudTi {
		padding-top: 46px;
		padding-bottom: 44px;
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

		.bankCont {
			background: #F0F6FC;

			.leftIcon {
				width: 24px;
				height: 24px;
				border-radius: 50%;
				margin-right: 5px;
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

			}

			.tip {
				margin-top: 10px;
				color: #9AA8B6;
			}
		}

		.tipCont {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 60px;
			background: #3A3F4E;
			line-height: 40px;
			height: 40px;
			font-size: 13px;
			color: #C3C8D8;
			padding-left: 50px;
			border-radius: 5px;

			.leftImg {
				position: absolute;
				left: 2px;
				bottom: 5px;
				width: 45px;
				height: 45px;
			}

			.rightImg {
				position: absolute;
				right: 0;
				top: 0;
				height: 40px;
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

	}
</style>
