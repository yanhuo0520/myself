<template>
	<div class="tiXian" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="提现" right-text="提现记录" left-arrow fixed @click-left="leftBack" @click-right="onClickRight" />
		<!-- 只能提到微信，又新增平台账户 -->
		<div class="inTitle" @click="show = true">
			<p>提现到{{zhuanTitle}}</p>
			<div class="inDesc">
				<template v-if="withdrawal_type == 1">
					<img :src="wxInfo.headimgurl" class="icon" />
					<p class="descType">
						<template >微信账号</template>({{wxInfo.nickname}})</p>
				</template>
				
				<van-icon name="arrow" size="15" />
			</div>
		</div>

		<div class="inCont">
			<p class="m-title">提现金额</p>
			<van-field v-model="money" clearable :class="ifIn? 'ifIn' : ''" @input="ifIn = true, outMoney()"
				placeholder="">
				<template #right-icon>
					<p @click="money = allMoney, ifIn= true">全部</p>
				</template>
				<template #left-icon>
					<img src="../../images/qian4.png" alt="" class="iconImg" />
				</template>
			</van-field>
			<div class="tip">
				<p>当前余额 ¥{{allMoney}}元</p>
			</div>
		</div>

		<van-button :icon='require("../../images/out1.png")' type="info" block class="sendBtn" @click="goPay()"
			v-if="hidshowFooter">
			立即提现
		</van-button>

		<!-- 选择提现账户 -->
		<van-action-sheet v-model="show" title="选择提现账户" class="selSheet" :closeable="false" cancel-text="确定" @cancel="sureSel()">
			<van-radio-group v-model="selRadio">
				<!-- 微信已绑定 -->
				<van-cell clickable @click="selRadio = 1, selTitle = '微信'" :class="selRadio === 1 ? 'active' : ''">
					<template #icon>
						<img :src="wxInfo.headimgurl" alt="" class="logoIcon" />
					</template>
					<template #title>
						<span class="custom-title">微信账号({{wxInfo.nickname}})</span>
						<van-tag round>预计1小时到账</van-tag>
					</template>
					<template #right-icon>
						<van-radio :name="1">
							<template #icon="props">
								<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
							</template>
						</van-radio>
					</template>
				</van-cell>
				<!-- 平台账户 -->
				<van-cell clickable @click="selRadio = 2, selTitle = '平台账户'" :class="selRadio === 2 ? 'active' : ''">
					<template #icon>
						<img src="../../images/card1.png" alt="" class="logoIcon" />
					</template>
					<template #title>
						<span class="custom-title">平台账户</span>
						<van-tag round>秒到账</van-tag>
					</template>
					<template #right-icon>
						<van-radio :name="2">
							<template #icon="props">
								<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
							</template>
						</van-radio>
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
						:maxlength="6" close-button-text="完成" @close="closeKeyboard" />
				</div>

			</div>
		</van-overlay>

		<!-- 绑定手机号弹框 -->
		<van-popup v-model="bandPhone" class="tipContWx">
			<img src="../../images/loginTip1.png" class="IMg" />
			<div class="content">
				<img src="../../images/loginTip2.png" class="titleIMg" />
			</div>
			<div class="bandCont">
				<van-field v-model="phoneBand" placeholder="请输入手机号" />
				<van-field v-model="yzmBand" clearable placeholder="请输入手机验证码" class="yzmCell">
					<template v-if="showBandBtn" #right-icon>
						<p @click="getCode()">发送验证码</p>
					</template>
					<template v-else #right-icon>
						<p>{{bandTimes}}</p>
					</template>
				</van-field>
				<p class="btn" @click="wxBindPho()">立即绑定</p>
			</div>

			<img src="../../images/close.png" @click="bandPhone = false" class="closeIMg" />
		</van-popup>


	</div>
</template>
<script>
	export default {
		name: "tiXian",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 90,
				teamId: '',
				money: '',
				allMoney: 0,
				ifIn: false,

				bandPhone: false,
				phoneBand: '',
				yzmBand: '',
				showBandBtn: true,
				bandTimes: 180,

				lock_wx_id: '', // 加密后的微信信息id
				wxInfo: '',

				selRadio: 1, 
				withdrawal_type: 1, // 提现类型：1微信提现，2钱包提现
				zhuanTitle: '微信',
				selTitle: '微信',
				show: false,
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),

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
			this.teamId = this.$route.query.team_id
			this.userWxInfo()
			// 微信成功授权并返回用户信息
			window.onWxLogin = this.onWxLogin
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
					path: '/tixianList',
					query: {
						teamId: this.teamId
					}
				})
			},
			userWxInfo() {
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.user_wx_info().then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.wxInfo = res.data

					} else if (res.errno == 1002) { // 请绑定微信
						if (typeof android != "undefined") {
							// 调用Android方法唤起微信登录
							android.loginWX()
						}
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			sureSel(){
				this.withdrawal_type = this.selRadio
				this.zhuanTitle = this.selTitle
			},
			// 微信成功授权并返回用户信息
			onWxLogin(info) {
				this.$toast.loading({
					message: '获取中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.wechatbindLogin({
					wx_json: JSON.stringify(info)
				}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.userWxInfo()
					} else if (res.errno == 1001) { // 去绑定手机号
						this.lock_wx_id = res.lock_wx_id
						this.bandPhone = true
					} else {
						this.$toast(res.errmsg)
					}

				}).catch(err => {
					this.$toast.clear()
				})
			},
			// 获取验证码倒计时
			getCode() {
				if (this.$validatePhone(this.phoneBand) != true) {
					this.$toast(this.$validatePhone(this.phoneBand))
					return
				}
				this.$api.get_code({
					phone: this.phoneBand
				}).then(res => {
					if (res.errno == 0) { // 启用倒计时
						this.showBandBtn = false
						this.timer = setInterval(() => {
							this.bandTimes--
							if (this.bandTimes === 0) {
								this.bandTimes = 180
								this.showBandBtn = true
								clearInterval(this.timer)
							}
						}, 1000)
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {

				})

			},
			wxBindPho() {
				// 绑定手机号
				if (this.$validatePhone(this.phoneBand) != true) {
					this.$toast(this.$validatePhone(this.phoneBand))
					return
				}
				this.$api.wx_bind_phone({
					phone: this.phoneBand,
					code: this.yzmBand,
					lock_wx_id: this.lock_wx_id
				}).then(res => {
					if (res.errno == 0) {
						this.bandPhone = false
						this.userWxInfo()
					} else {
						this.$toast(res.errmsg)
					}

				}).catch(err => {

				})
			},
			outMoney() {
				if (Number(this.allMoney) == 0 || this.allMoney == '') {
					this.$toast("暂无收益可以提取")
					this.money = ''
					return
				} else if (Number(this.money) > Number(this.allMoney)) {
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
				data.team_id = this.teamId
				data.money = this.money
				data.withdrawal_type = this.withdrawal_type
				data.pay_pwd = this.$md5(this.passward) // 支付密码（前端md5加密）
				this.$api.userAddTeamWithdrawal(data).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.$toast(res.errmsg)
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
	.tiXian {
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
		.inTitle{
			height: 20px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 15px;
			font-size: 15px;
			color: #444444;
			.icon{
				width: 16px;
				height: 16px;
				border: 2px solid #ffffff;
				border-radius: 50%;
				margin-right: 3px;
			}
			.inDesc{
				display: flex;
				align-items: center;
			}
			.descType{
				color: #222222;
				margin: 0 3px;
			}
			.van-icon{
				color: #3B6AF1;
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

		.tipContWx {
			width: calc(100% - 60px);
			max-width: 510px;
			border-radius: 10px;
			background: transparent;
			text-align: center;
			font-size: 15px;
			color: #444444;

			.IMg {
				width: 45px;
				margin-left: calc(50% + 20px);
			}

			.content {
				margin-top: -30px;
				text-align: center;
				background: #ffffff;
				border-radius: 10px 10px 0 0;
			}

			.bandCont {
				padding: 20px 10px;
				background: #ffffff;
				margin-top: -1px;
				border-radius: 0 0 10px 10px;

				.van-cell {
					background-color: #F0F6FC;
					border-radius: 30px;
					padding: 5px 16px;
				}

				.van-field__right-icon {
					color: #3B6AF1;
				}

				.yzmCell {
					margin-top: 10px;

					.van-button {
						height: auto;
						background: transparent;
						border: none;
						color: #3B6AF1;
					}
				}
			}

			.titleIMg {
				margin: 50px 0 20px 0;
				width: 145px;
			}

			.btn {
				margin-top: 20px;
				border-radius: 40px;
				font-size: 15px;
				line-height: 40px;
				text-align: center;
				background: #3b6af1;
				color: #FFFFFF;
			}

			.closeIMg {
				margin-top: 30px;
				padding: 10px 30px;
				width: 20px;
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
				border-radius: 50%;
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


	}
</style>
