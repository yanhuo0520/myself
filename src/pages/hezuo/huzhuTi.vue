<template>
	<div class="huzhuTi" ref="scrollTopHuan" @scroll="scrollEvent($event)" :style='{height: deviceHeight + "px"}'
		:class="{'ifFixed': ifFixed}">
		<van-nav-bar title="互助金提取" left-arrow fixed @click-left="leftBack" />
		<div class="jieCont">
			<img src="../../images/light3.png" alt="" class="bgTop" />
			<img src="../../images/logoBg.png" alt="" class="bgLogo" />
			<img src="../../images/xiexianBg.png" alt="" class="bgBottom" />
			<div class="wraning" v-if="leftCont.on_the_way_money > 0">
				<img src="../../images/warning.png" class="tip" />
				<p>打款中的活期金额¥{{leftCont.on_the_way_money}}</p>
			</div>
			<p class="maxEdu">{{leftCont.total_money}}</p>
			<div class="jieDesc">
				<div class="item">
					<p class="num">{{leftCont.can_out_money}}</p>
					<p class="title">活期本金总额</p>
				</div>
				<div class="item">
					<p class="num">{{leftCont.regular_money}}</p>
					<p class="title">定期本金总额</p>
				</div>
			</div>
		</div>

		<div class="main-cont" :class="{'ifFixed': ifFixed}">
			<van-sticky :offset-top="46">
				<van-tabbar :fixed="false" class="jieTabbar">
					<van-tabbar-item v-for="(item1,index1) of itemTab" @click="clickItemTab(item1.id)" :key="index1">
						<template #icon>
							<img :src="index1 === tabId ?item1.iconSelect: item1.icon" />
						</template>
					</van-tabbar-item>
				</van-tabbar>
			</van-sticky>

			<!-- 活期本金提取 -->
			<div class="contentTab1" v-if="tabId == 0">
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
					<van-cell title="添加收款方式" class="bankCont" is-link @click="$router.push('/applyCard')">
						<template #icon>
							<img src="../../images/addqian.png" class="leftIcon" />
						</template>
					</van-cell>
				</template>

				<div class="inCont">
					<p class="m-title">取出金额(元)</p>
					<van-field v-model="money" type="number" :class="ifIn? 'ifIn' : ''" clearable
						placeholder="" @input="ifIn = true, outMoney()" @clear="disabled = true" >
						<template #right-icon>
							<p @click="allOut()">全部</p>
						</template>
						<template #left-icon>
							<img src="../../images/qian4.png" alt="" class="iconImg" />
						</template>
					</van-field>
					<div class="tip">
						可取出金额<span>¥{{allMoney}}</span>
					</div>
				</div>

				<van-button :disabled="disabled" type="info" block class="btnRound" @click="goPay()">
					确定取出
				</van-button>

			</div>

			<!-- 定期本金提取 -->
			<div class="contentTab2" v-if="tabId == 1">
				<div class="item" v-for="(item, index) in proList" :key="index">
					<div class="header" @click="goOut(item.id, item.money, item.if_expire, item.status)">
						<p class="time">{{item.save_date}}</p>
						<!-- "status": 0,//存款的状态：：0未取出 1已取出 2审核中
						"if_expire": 0,//定期是否到期：0否，1是 -->
						<template v-if="item.status == 0">
							<img src="../../images/outBtn1.png" v-if="item.if_expire == 1" />
							<img src="../../images/outBtn2.png" v-else />
						</template>
						<template v-else-if="item.status == 2">
							<img src="../../images/outBtn4.png" />
						</template>
						<template v-else>
							<img src="../../images/outBtn3.png" />
						</template>
						
						
					</div>
					<van-grid class="grid" :column-num="3" :border="false">
						<van-grid-item>
							<p class="num yuan">{{item.money}}</p>
							<p class="title">存入金额</p>
						</van-grid-item>
						<van-grid-item>
							<p class="num lv">{{item.save_rate}}</p>
							<p class="title">利率</p>
						</van-grid-item>
						<van-grid-item>
							<p class="num" :class="{'ri': item.sign == 3,'yue': item.sign == 2,'nian': item.sign == 1}">
								{{item.number}}</p>
							<p class="title">期限</p>
						</van-grid-item>
						<van-grid-item>
							<p class="num">{{item.pay_way}}</p>
							<p class="title">支付方式</p>
						</van-grid-item>
						<van-grid-item>
							<p class="num">{{item.start_rate_date}}</p>
							<p class="title">起息日</p>
						</van-grid-item>
						<van-grid-item>
							<p class="num">{{item.end_rate_date}}</p>
							<p class="title">到期日</p>
						</van-grid-item>

					</van-grid>
				</div>
				<!-- 加载中 -->
				<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
				<!-- 没有更多了 -->
				<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>
			</div>
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

		<!-- 确认提取支出弹框 -->
		<van-popup v-model="advTip" class="advTipCont">
			<img src="../../images/danTip.png" class="IMg" />
			<p class="tipTitle">提前支取会有损利息 <br /> 您确定要取出吗?</p>
			<div class="btnCont">
				<p class="btn cancel" @click="advTip = false">取消</p>
				<p class="btn sure" @click="sureTan()">确定</p>
			</div>
		</van-popup>


	</div>
</template>
<script>
	export default {
		name: "huzhuTi",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				ifFixed: false,
				fromPath: '',
				leftCont: {
					total_money: 0, //总额
					money: 0, //活期
					regular_money: 0, //定期
				},
				tabId: 0,
				status: 0,
				itemTab: [{
						name: "活期本金提取",
						id: 0,
						icon: require("../../images/huTiTItle1.png"),
						iconSelect: require("../../images/huTiTItle1Sel.png")
					},
					{
						name: "定期本金提取",
						id: 1,
						icon: require("../../images/huTiTItle2.png"),
						iconSelect: require("../../images/huTiTItle2Sel.png")
					}
				],
				
				money: '',
				disabled: true,
				ifIn: false,
				allMoney: '',
				dingMoney: '',

				show: false,
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),
				selRadio: '',
				selTitle: '',
				selImg: '',
				
				cardNum: '',
				bank_id: '',
				cardImg: '',
				
				bankList: [],
				
				showInput: false,
				showKeyboard: false,
				passward: '',


				proList: [],
				ifChange: false,
				pageSize: 10, //每页显示
				page: 1, //当前页
				totalNum: 0, //总条数
				totalPage: 1, //总页数
				ifFinish: false, //是否加载完成
				isLoading: true, //是否加载更多
				deviceTip: '',

				advTip: false,
				dingId: '',
				dingMoney: '',
				if_expire: '',

			};
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				// 通过 `vm` 访问组件实例,将值传入fromPath
				vm.fromPath = from.path
			})
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.$nextTick(() => {
				if (this.fromPath == '/huzhudTi') {
					this.tabId = 1
					this.proList = []
					this.page = 1
					this.totalNum = 0
					this.totalPage = 1
					this.ifFinish = false
					this.isLoading = true
					this.deviceTip = ''
					this.getList()
				}
				this.passbookMoney()
				this.userBank()
			})
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			// 头部额度
			passbookMoney() {
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.passbook_money({}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.leftCont = res.data
						this.allMoney = res.data.can_out_money 
					} else {
						this.$toast(res.errmsg)
					}

				}).catch(err => {
					this.$toast.clear()
				})
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
				if(this.allMoney == 0){
					this.$toast("暂无可转出金额")
					this.money = ''
					this.disabled = true
					return
				}else if (Number(this.money) > Number(this.allMoney)) {
					this.money = this.allMoney
					this.disabled = false
					this.$toast("账户最多只能转出" + this.allMoney + "元！")
					return
				}else{
					this.disabled = false
				}
			},
			allOut(){
				if(this.allMoney == 0){
					this.$toast("暂无可转出金额")
					this.money = ''
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
				data.pay_pwd = this.$md5(this.passward) // 支付密码（前端md5加密）
				data.money = this.money
				data.turn_way = 1
				this.$api.submit_passbook_take_out(data).then(res => {
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
			// 切换标题 tabId
			clickItemTab(id) {
				this.ifChange = true
				this.$refs.scrollTopHuan.scrollTop = 0
				this.tabId = id
				if (id == 1) {
					this.proList = []
					this.page = 1
					this.totalNum = 0
					this.totalPage = 1
					this.ifFinish = false
					this.isLoading = true
					this.deviceTip = ''
					this.getList()
				}

			},
			// 页面滚动
			scrollEvent(e) {
				if (e instanceof Event) {
					let el = e.target;
					let scrollTop = el.scrollTop;
					let clientHeight = el.clientHeight; // 获取可视区的高度
					let scrollHeight = el.scrollHeight; // 获取滚动条的总高度
					let height = 50;

					if (scrollTop > 138) {
						this.ifFixed = true
					} else {
						this.ifFixed = false
					}

					//到底了
					// console.log(this.isLoading, this.ifFinish);
					// console.log(scrollTop, clientHeight, scrollHeight);
					//是否继续加载且已完成加载
					if (scrollTop + clientHeight >= scrollHeight && this.isLoading && !this.ifFinish && this.page <= this
						.totalPage && !this.ifChange) {
						// 把距离顶部的距离加上可视区域的高度 等于或者大于滚动条的总高度就是到达底部
						this.isLoading = true;
						// console.log("到底了");
						setTimeout(() => {
							this.getList();
						}, 1000);
					}

				}
			},
			getList() {
				let data = {}
				data.status = this.status
				data.page = this.page
				data.size = this.pageSize
				this.$api.regular_lists(data).then(res => {
					this.ifChange = false
					if (res.errno == 0) {
						this.totalNum = res.data.count;
						this.totalPage = res.data.total_page
						if (this.totalNum == 0) {
							// console.log("没有数据");
							this.isLoading = false;
							this.ifFinish = true;
							this.page = 1;
							this.deviceTip = "暂无数据";
							return false;
						}
						this.proList = this.proList.concat(res.data.log);
						// console.log(this.page, this.totalPage);
						if (this.page == this.totalPage) {
							this.isLoading = false;
							this.ifFinish = true;
							// this.page = 1;
							this.deviceTip = "没有更多了~";
							// console.log("没有更多了");
						} else {
							// console.log("下一页");
							this.isLoading = true;
							this.ifFinish = false;
							this.page++;
							this.deviceTip = "正在加载中~";
						}
					} else {
						this.proList = [];
						this.isLoading = false;
						this.ifFinish = true;
						this.page = 1;
						this.deviceTip = "数据加载失败~";
					}
				}).catch(err => {

				});
			},
			goOut(id, money, if_expire, status) {
				if(status == 0){ // 0未取出 1已取出 2 审核中
					if(if_expire == 0){
						this.advTip = true
						this.dingId = id
						this.dingMoney = money
						this.if_expire = if_expire
					}else{
						this.$router.push({
							path: '/huzhudTi',
							query: {
								id: id,
								money: money,
								if_expire: if_expire
							}
						})
					}
				}
				
			},
			sureTan(){
				this.$router.push({
					path: '/huzhudTi',
					query: {
						id: this.dingId,
						money: this.dingMoney,
						if_expire: this.if_expire
					}
				})
			}

		},
	}
</script>
<style lang="less">
	.huzhuTi {
		padding-top: 46px;
		overflow: auto;
		background: #f0f6fc url(../../images/bgHeader6.png) no-repeat;
		background-size: 100% 170px;

		&.ifFixed {
			background: #f0f6fc url(../../images/bgTop6.png) no-repeat center 46px;
			background-size: 100% 200px;
		}

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


		.jieCont {
			margin: 0 10px;
			padding-top: 35px;
			padding: 35px 0 15px 0;
			text-align: center;
			border-radius: 15px 15px 0 0;
			background: linear-gradient(-35deg, #3b6af1 0%, #5a94ff 100%);
			color: #FFFFFF;
			position: relative;
			overflow: hidden;

			.bgTop {
				position: absolute;
				top: 0;
				right: 0;
				width: 200px;
			}

			.bgLogo {
				position: absolute;
				left: -40px;
				bottom: -10px;
				width: 110px;
			}

			.bgBottom {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 300px;
			}
			.wraning {
				position: absolute;
				left: 10px;
				top: 10px;
				height: 16px;
				padding-right: 8px;
				display: flex;
				align-items: center;
				background: #F0F6FC;
				color: #444444;
				border-radius: 10px;

				.tip {
					width: 20px;
					margin-right: 2px;
				}
			}

			.maxEdu {
				font-family: DIN, DIN-Medium;
				font-size: 30px;
				position: relative;
				display: inline;

				&::before {
					position: absolute;
					top: -5px;
					left: calc(100% + 2px);
					content: '';
					width: 65px;
					height: 10px;
					background: url(../../images/huzongBg.png) no-repeat;
					background-size: auto 10px;
				}
			}

			.jieDesc {
				margin-top: 25px;
				display: flex;
				justify-content: space-around;

				.item {
					position: relative;
					width: 50%;

					&:last-child {
						&::after {
							background: transparent;
						}
					}

					&::after {
						position: absolute;
						content: '';
						top: 0;
						right: 0;
						width: 1px;
						height: 30px;
						background: linear-gradient(0deg, rgba(255, 255, 255, 0.2) 0%, #ffffff 50%, rgba(255, 255, 255, 0.2) 100%);
					}

					.num {
						font-size: 15px;
						position: relative;
						display: inline;

						&::before {
							position: absolute;
							top: -5px;
							left: calc(100% + 2px);
							content: '';
							width: 14px;
							height: 10px;
							background: url(../../images/yuan.png) no-repeat;
							background-size: auto 10px;
						}
					}

					.title {
						margin-top: 5px;
						color: #B2CAFF;
					}
				}
			}
		}

		.van-sticky--fixed {
			.jieTabbar {
				border-radius: 10px 10px 0 0;
			}
		}

		.van-tabbar.jieTabbar {
			padding: 15px 0 10px 0;
			height: auto;

			.van-tabbar-item__icon {
				height: 25px;

				img {
					width: 95px;
					height: auto;
				}
			}

			.van-tabbar-item--active {
				background: transparent;
			}
		}

		.van-hairline--top-bottom::after,
		.van-hairline-unset--top-bottom::after {
			border-width: 0
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

		.main-cont {
			background: url("../../images/jiebg.png") no-repeat;
			background-size: 100% 170px;

			&.ifFixed {
				background: none;
			}
		}

		.contentTab1 {
			.van-cell-group {
				margin: 0 10px;
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

			.btnRound {
				margin: 20px 15px 10px 15px;
				width: calc(100% - 30px);
				text-align: center;
				line-height: 40px;
				height: 40px;
				color: #FFFFFF;
				border-radius: 30px;
				font-size: 15px;
				background: #3B6AF1;
				border: 1px solid #3B6AF1;
			}
		}

		.contentTab2 {
			.item {
				margin: 10px 10px 0 10px;
				border-radius: 10px;
				background: #FFFFFF;

				&:first-child {
					margin-top: 0;
				}

				.header {
					font-size: 15px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					line-height: 42px;
					padding: 0 15px;
					position: relative;

					&::before {
						position: absolute;
						top: 16px;
						left: 8px;
						content: '';
						width: 3px;
						height: 8px;
						border-radius: 35%;
						background: #3B6AF1;
					}

					img {
						width: 55px;
						height: 20px;
					}
				}

				.grid {
					.van-grid-item {
						border-top: 1px solid #F0F6FC;
						border-right: 1px solid #F0F6FC;

						&:nth-child(3n) {
							border-right: none;
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

							&.yuan::before {
								background: url(../../images/yuan1.png) no-repeat;
								background-size: auto 10px;
							}

							&.lv::before {
								background: url(../../images/qian1.png) no-repeat;
								background-size: auto 10px;
							}

							&.ri::before {
								background: url(../../images/ri.png) no-repeat;
								background-size: auto 10px;
							}

							&.yue::before {
								background: url(../../images/yue1.png) no-repeat;
								background-size: auto 10px;
							}

							&.nian::before {
								background: url(../../images/nian.png) no-repeat;
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

		.null {
			img {
				max-width: 100%;
			}
		}

		.van-loading,
		.noMore {
			padding: 10px 0;
			text-align: center;
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

		// 密码框
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

		.advTipCont{
			width: calc(100% - 60px);
			max-width: 510px;
			border-radius: 10px;
			background: transparent url(../../images/danTipBg.png) no-repeat center 46px;
			background-size: 100% auto;
			text-align: center;
			font-size: 15px;
			color: #444444;
			.IMg{
				width: 100%;
			}
			.tipTitle{
				background: #FFFFFF;
				padding: 20px 0;
				line-height: 20px;
			}
			.btnCont{
				display: flex;
				justify-content: space-around;
				background: #FFFFFF;
				padding: 10px 0 20px 0;
				.btn{
					border-radius: 30px;
					line-height: 34px;
					width: calc(50% - 20px);
					&.cancel{
						color: #9AA8B6;
						background: #F0F6FC;
					}
					&.sure{
						color: #FFFFFF;
						background: #3B6AF1;
					}
				}
			}
		}


	}
</style>
