<template>
	<div class="accouOut" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="账户转出" left-arrow fixed @click-left="leftBack" />
		<div class="inTitle" @click="show = true">
			<p>转出到{{zhuanTitle}}</p>
			<div class="inDesc">
				<img :src="cardImg" class="icon" />
				<p class="descType" v-if="zhuanTitle == '微信'">
					<template >{{zhuanTitle}}账号</template>({{cardNameNum}})</p>
				<p v-else>{{cardNameNum}}</p>
				<van-icon name="arrow" size="15" />
			</div>
		</div>
		<!-- 之前是跟进银行卡判断是否增加收款方式
		现在增加微信提醒，登录时微信已绑定，即使没有添加银行卡也是可以的 -->
		<!-- <template v-if="bankList.length > 0">
			<van-cell :title="cardNameNum" class="bankCont" is-link @click="show = true">
				<template #icon>
					<img :src="cardImg" class="leftIcon" />
				</template>
			</van-cell>
		</template>
		<template v-else>
			<van-cell title="添加收款方式" class="bankCont" is-link @click="show = true">
				<template #icon>
					<img src="../../images/addqian.png" class="leftIcon" />
				</template>
			</van-cell>
		</template> -->

		<div class="inCont">
			<p class="m-title">取出金额(元)</p>
			<van-field v-model="money" type="number" clearable :class="ifIn? 'ifIn' : ''" @input="ifIn = true, outMoney()" @clear="disabled = true"
				placeholder="">
				<template #right-icon>
					<p @click="allMoneyIn()">全部</p>
				</template>
				<template #left-icon>
					<img src="../../images/qian4.png" alt="" class="iconImg" />
				</template>
			</van-field>
			<div class="tip">
				<p>当前账户可转出余额 ¥{{allMoney}}元</p>
				<!-- 暂时先不收手续费，不显示 -->
				<!-- <p v-if="ifIn">需收取服务费￥{{fuwuMoney}}元</p> -->
			</div>
		</div>
		
		<div class="inCont inBankName" v-if="sure_out_type == 1">
			<p class="m-title">卡主真实姓名</p>
			<van-field v-model="userName" clearable placeholder="请输入银行卡卡主姓名" />
			<div></div>
		</div>

		<van-radio-group v-model="typeRadio" class="selSheet selSheetZhuan">
			<van-cell-group>
				<van-cell title="实时到账" clickable @click="selFast()">
					<template #icon>
						<van-radio name="1" :disabled="!ifcanSel">
							<template #icon="props">
								<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
							</template>
						</van-radio>
					</template>
					<template #label>
						预计<span class="tip">2小时内</span>到账,每日限额1万
					</template>
				</van-cell>
				<van-cell title="普通到账" clickable @click="typeRadio = '2'">
					<template #icon>
						<van-radio name="2">
							<template #icon="props">
								<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
							</template>
						</van-radio>
					</template>
					<template #label>
						预计<span class="tip">1天后</span>({{tomorrowDate}} 23:59前)到账,每日无限额,{{nowMonthDate}}仍有收益
					</template>
				</van-cell>
			</van-cell-group>
		</van-radio-group>

		<van-button :disabled="disabled" :icon='require("../../images/out1.png")' type="info" block class="sendBtn" @click="goPay()" v-if="hidshowFooter">
			立即转出
		</van-button>

		<!-- 暂时先不收手续费，先不显示 -->
		<!-- 提醒服务费-赶紧入页面显示，输入时不显示，显示手续费 -->
		<!-- <div class="tipCont" v-if="!ifIn">
			<img src="../../images/tipImg.png" alt="" class="leftImg" />
			由于运营成本不断提升,提现需收取服务费1‰
			<img src="../../images/guang.png" alt="" class="rightImg" />
		</div> -->

		<!-- 选择银行 -->
		<van-action-sheet v-model="show" title="选择转出账户" class="selSheet" :closeable="false" cancel-text="确定" @cancel="sureSel()">
			<van-radio-group v-model="selRadio">
				<!-- 微信已绑定 -->
				<van-cell clickable @click="selRadio = 1000, selImg = headimgurl, selTitle = nickname, bank_id='',  out_type = 2" :class="selRadio === 1000 ? 'active' : ''">
					<template #icon>
						<img :src="headimgurl" alt="" class="logoIcon" />
					</template>
					<template #title>
						<span class="custom-title">微信账号({{nickname}})</span>
						<van-tag round>预计1小时到账</van-tag>
					</template>
					<template #right-icon>
						<van-radio :name="1000">
							<template #icon="props">
								<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
							</template>
						</van-radio>
					</template>
				</van-cell>
				<template v-if="bankList.length > 0">
					<!-- 银行卡列表 -->
					<van-cell clickable v-for="(item, index) in bankList" :key="index"
						@click="selRadio = item.bank_id, selImg = item.logoImg, selTitle = item.NameNum, out_type = 1"
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
		</van-action-sheet>


		<van-overlay :show="showInput" class="inputCont" @click="this.showKeyboard = false">
			<div class="wrapper" @click.stop @click="showInput = false,showKeyboard = false">
				<div class="block">
					<p class="title">请输入支付密码</p>
					<!-- 密码输入框 -->
					<van-password-input :value="passward" :focused="showKeyboard" @focus="showKeyboard = true" />
					<!-- 数字键盘 -->
					<van-number-keyboard v-model="passward" :show="showKeyboard" :transition="false" theme="custom"
						:maxlength="6" close-button-text="转出" @close="closeKeyboard" />
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
		name: "accouOut",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 90,
				userName: '',
				lock_wx_id: '', // 加密后的微信信息id
				zhuanTitle: '微信',
				headimgurl: '',
				nickname: '',
				out_type: '',
				sure_out_type: '',
				
				bandPhone: false,
				phoneBand: '',
				yzmBand: '',
				showBandBtn: true,
				bandTimes: 180,

				cardImg: '',
				cardNameNum: '',
				bank_id: '',

				money: '',
				disabled: true,
				allMoney: 0,
				fuwuMoney: 0,
				ifIn: false,
				show: false,
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),
				selRadio: '',
				selTitle: '',
				selImg: '',
				bankList: [],

				typeRadio: '1',
				ifcanSel: true,
				nowMonthDate: '', // 今天的日期，07-02
				tomorrowDate: '', // 明天的日期， 07-03
				
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
			if(typeof android != 'undefined'){
				this.userName = android.load("userName")
			}else{
				this.userName = localStorage.getItem('userName')
			}
			
			this.allMoney = this.$route.query.wallet
			this.nowMonthDate = this.$dateCurMonthDate()
			this.tomorrowDate = this.$dateCurrentAfterNum(1)
			this.outInfo()
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
			outInfo(){
				this.$api.user_wallet_out_index().then(res=>{
					if (res.errno == 0) {
						this.allMoney = res.data.can_out_wallet
						// "if_quick_arrival_way": 1,//是否能快速到账：0否，1是
						if(res.data.if_quick_arrival_way == 0){
							this.ifcanSel = false
							this.typeRadio = '2'
						}else{
							this.ifcanSel = true
						}
					} else {
						this.$toast(res.errmsg)
					}
				})
			},
			selFast(){
				if(this.ifcanSel){
					this.typeRadio = '1'
				}else{
					this.$toast("实时到账每日限额1万")
				}
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
						this.headimgurl = res.data.headimgurl
						this.nickname = res.data.nickname
						
						this.selImg = res.data.headimgurl
						this.selTitle = res.data.nickname
						this.cardImg = res.data.headimgurl
						this.cardNameNum = res.data.nickname
						
						this.selRadio = 1000
						this.bank_id = ''
						this.out_type = 2
						this.userBank()
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
				this.$api.get_code({phone: this.phoneBand}).then(res => {
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
						this.bankList = res.data
					} else {
						this.$toast(res.errmsg)
					}

				}).catch(err => {
					this.isLoading = false
				})
			},
			sureSel() {
				if(this.out_type == 1){
					this.sure_out_type = 1
					this.bank_id = this.selRadio
					this.cardImg = this.selImg
					this.zhuanTitle = '银行卡'
				}else{
					this.sure_out_type = ''
					this.bank_id = ''
					this.cardImg = this.headimgurl
					this.zhuanTitle = '微信'
				}
				this.cardNameNum = this.selTitle
				this.show = false
			},
			outMoney() {
				if (Number(this.allMoney == 0)) {
					this.$toast("暂无余额可以提取")
					this.money = ''
					this.disabled = true
					return
				}else if (Number(this.money) > Number(this.allMoney)) {
					this.money = this.allMoney
					this.disabled = false
					this.$toast("账户最多只能转出" + this.allMoney + "元！")
					return
				} else {
					this.disabled = false
					this.fuwuMoney = (this.money * 0.001).toFixed(2)
				}
			},
			allMoneyIn(){
				if(this.allMoney <= 0){
					this.$toast("暂无余额可转出")
					this.disabled = true
					return
				}else{
					this.money = this.allMoney
					this.disabled = false
				}
				this.disabled = false
				// 暂时先不收手续费
				// this.ifIn = true
				// this.fuwuMoney = (this.money * 0.001).toFixed(2)
			},
			goPay() {
				if (Number(this.money) <= 0) {
					this.$toast("请输入转出金额")
					return
				}else if(Number(this.money) < 0.3){
					this.$toast("转出金额至少为0.3元")
					return
				}else if(this.sure_out_type == 1 && !this.userName){
					this.$toast("请输入卡主真实姓名！")
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
				data.out_type = this.out_type // 1银行卡，2微信
				data.out_arrival_way = this.typeRadio
				data.turn_bank_user = this.userName
				
				this.$api.user_wallet_take_out_apply(data).then(res => {
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
	.accouOut {
		padding-top: 46px;
		padding-bottom: 44px;
		overflow: auto;
		background: #F0F6FC;

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
		.inTitle{
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
			background: #F0F6FC;
			align-items: center;

			.leftIcon {
				width: 24px;
				height: 24px;
				border: 3px solid #ffffff;
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
			background: #ffffff;
			border-radius: 10px 10px 0 0;
			padding: 15px;
			&.inBankName{
				margin-top: 10px;
				border-radius: 0;
			}

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
					padding-bottom: 5px;
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
				display: flex;
				justify-content: space-between;
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
			&.selSheetZhuan{
				margin-top: 10px;
				.van-radio{
					margin-right: 10px;
				}
				.van-cell__label{
					margin-top: 0;
					.tip{
						color: #3B6AF1;
					}
				}
			}
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

		.sendBtn {
			position: fixed;
			bottom: 0;
			left: 0;
			font-size: 15px;
			border-radius: 0;
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


	}
</style>
