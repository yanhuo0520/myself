<template>
	<div class="accouIn" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="转入" left-arrow fixed @click-left="leftBack" />
		<template v-if="bankList.length > 0">
			<van-cell :title="cardNameNum" class="bankCont" is-link @click="show = true">
				<template #icon>
					<img :src="cardImg" class="leftIcon" />
				</template>
			</van-cell>
		</template>
		<template v-else>
			<van-cell title="添加支付方式" class="bankCont" is-link @click="show = true">
				<template #icon>
					<img src="../../images/addqian.png" class="leftIcon" />
				</template>
			</van-cell>
		</template>

		<div class="inCont">
			<p class="m-title">转入金额(元)</p>
			<van-field v-model="money" clearable :class="ifIn? 'ifIn' : ''" placeholder="" @input="ifIn = true">
				<template #left-icon>
					<img src="../../images/qian4.png" alt="" class="iconImg" />
				</template>
			</van-field>
			<br />
		</div>

		<van-button :icon='require("../../images/in1.png")' type="info" block class="sendBtn" @click="goPay()">
			立即转入
		</van-button>

		<!-- 选择银行 -->
		<van-action-sheet v-model="show" title="选择付款方式" class="selSheet" :closeable="false">
			<van-radio-group v-model="selRadio">
				<template v-if="bankList.length > 0">
					<!-- 支付宝已绑定，可选择 -->
					<van-cell clickable @click="selRadio = 1, selTitle = '支付宝'" :class="selRadio == 1 ? 'active' : ''">
						<template #icon>
							<img src="../../images/zhi.png" alt="" class="logoIcon" />
						</template>
						<template #title>
							<span class="custom-title">支付宝</span>
							<van-tag round>预计到账1个小时</van-tag>
						</template>
						<template #right-icon>
							<van-radio :name="1">
								<template #icon="props">
									<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
								</template>
							</van-radio>
						</template>
					</van-cell>
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
				<!-- 绑定支付宝 -->
				<van-cell title="绑定支付宝" is-link>
					<template #icon>
						<img src="../../images/zhi1.png" class="logoIcon" />
					</template>
				</van-cell>
			</van-radio-group>
			<van-button round block type="info" @click="sureSel()">确定</van-button>
		</van-action-sheet>

	</div>
</template>
<script>
	export default {
		name: "accouIn",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				cardImg: '',
				cardNameNum: '',
				bank_id: '',
				money: '',
				ifIn: false,
				show: false,
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),
				selRadio: '',
				selTitle: '',
				selImg: '',
				bankList: []
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
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
							ele.NameNum = ele.open_bank + '(' + bank_num.substring(bank_num
								.length - 4) + ')'
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
						this.cardImg = res.data[0].logoImg;
						this.cardNameNum = res.data[0].NameNum
						this.selTitle = res.data[0].NameNum
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
				if(this.selTitle == "支付宝"){
					this.cardImg = require("../../images/zhi.png")
				}else{
					this.cardImg = this.selImg
				}
				this.cardNameNum = this.selTitle
				this.show = false
			},

			goPay() {
				if (this.money <= 0) {
					this.$toast("请输入转出金额")
					return
				}
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				let data = {}
				data.bank_id = this.bank_id
				data.pay_pwd = this.pay_pwd // 支付密码（前端md5加密）
				data.money = this.money
				this.$api.user_wallet_take_out_apply(data).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {

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
	.accouIn {
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

		.sendBtn {
			position: fixed;
			bottom: 0;
			left: 0;
			font-size: 15px;
			background: #3B6AF1;
			border: 1px solid #3B6AF1;
		}


	}
</style>
