<template>
	<div class="danInput" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="为他担保" left-arrow fixed @click-left="leftBack" />
		<div class="header">
			<p class="title">{{name}}需担保额</p>
			<p class="num"><span>¥</span>{{needMoney}}</p>
		</div>
		<div class="selectCont">
			<p class="m-title">选择机构类型</p>
			<div class="sel-Title">
				<div>
					<p @click="guarantee_type = 0, selType(1)" :class="{'active':guarantee_type == 0}">社内额度担保 <img src="../../images/dui.png"
							class="selImg" v-if="guarantee_type == 0" /> </p>
					<p @click="guarantee_type = 1, selType(2)" :class="{'active':guarantee_type == 1}">其他资产担保 <img src="../../images/dui.png"
							v-if="guarantee_type == 1" class="selImg" /> </p>
				</div>
			</div>
			<template v-if="guarantee_type == 1">
				<p class="m-title other">选择担保资产</p>
				<div class="otherTitle">
					<!-- 房产 type_id=1   车产 type_id=2   其他 type_id=3 -->
					<div class="item" @click="goDan(1)">
						<img src="../../images/massbg.png" alt="" class="topBg" />
						<img src="../../images/fangchan.png" alt="" class="textImg" />
						<img src="../../images/right.png" alt="" class="rightBtn" />
					</div>
					<div class="item" @click="goDan(2)">
						<img src="../../images/massbg.png" alt="" class="topBg" />
						<img src="../../images/chechan.png" alt="" class="textImg" />
						<img src="../../images/right.png" alt="" class="rightBtn" />
					</div>
					<div class="item" @click="goDan(3)">
						<img src="../../images/massbg.png" alt="" class="topBg" />
						<img src="../../images/qita.png" alt="" class="textImg" />
						<img src="../../images/right.png" alt="" class="rightBtn" />
					</div>
				</div>
				<div class="otherList">
					<van-cell is-link v-for="(item, index) in zichanList" :key="index" @click="zichanDetail(item.assets_code, item.guarantee_type_id)">
						<template #title>
							<span class="custom-title">{{item.guarantee_type_name}}-{{item.assets_name}}</span>
							<van-tag plain type="primary">¥{{item.assets_price}}</van-tag>
						</template>
					</van-cell>
				</div>
			</template>

		</div>
		<div class="tabCont tabCont1" v-if="guarantee_type == 0">
			<p class="m-title">为其担保金额</p>
			<van-field v-model="danMoney1" :class="ifIn1 ? 'ifIn' : ''"  @input="ifIn1 = true, InMoney1()" @clear="disabled = true" clearable placeholder="">
				<template #right-icon>
					<p @click="allDan()">全部</p>
				</template>
				<template #left-icon>
					<img src="../../images/qian4.png" alt="" class="iconImg" />
				</template>
			</van-field>
			<div class="tip">
				<img src="../../images/sheneiedu.png" />{{left_guarantee_money}}元
			</div>
		</div>
		<div class="tabCont tabCont2" v-if="guarantee_type == 1">
			<p class="m-title">为其担保金额</p>
			<van-field v-model="danMoney2" :class="ifIn2 ? 'ifIn' : ''" @input="ifIn2 = true, disabled = false" @clear="disabled = true" clearable placeholder="">
				<template #left-icon>
					<img src="../../images/qian4.png" alt="" class="iconImg" />
				</template>
			</van-field>
			<p></p>
		</div>

		<van-button :disabled="disabled" type="info" block class="btnRound" @click="goLoanGuarantee()">
			确认担保
		</van-button>
		
		<!-- 担保确认弹框 -->
		<van-popup v-model="danTip" class="danTipCont">
			<img src="../../images/danTip.png" class="IMg" />
			<p class="tipTitle">确认担保后不能撤销<br /> 您确定要担保吗?</p>
			<div class="btnCont">
				<p class="btn cancel" @click="danTip = false">取消</p>
				<p class="btn sure" @click="sureDan()">确定</p>
			</div>
		</van-popup>

	</div>
</template>
<script>
	export default {
		name: "danInput",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				ifIn1: false,
				ifIn2: false,
				danTip: false, // 确认担保弹框
				guaranteeCode: '', // 借款担保人担保编号
				fromPath:'',
				guarantee_type: 0,  //  社内额度担保 0    其他资产担保 1
				danMoney1: '',  // 社内担保金额
				danMoney2: '',  // 其他资产担保金额
				disabled: true,
				name: '',
				needMoney: '', // 需担保额
				left_guarantee_money: 0, // 社内剩余可担保额度
				zichanList: []
			};
		},
		beforeRouteEnter (to, from, next){
			next(vm => {
				 // 通过 `vm` 访问组件实例,将值传入fromPath
				vm.fromPath = from.path
			})
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.$nextTick(()=>{
				// 验证是否获取到了上页的url
				/* eslint-disable no-console */
			  if(this.fromPath == '/danFang' || this.fromPath == '/danChe' || this.fromPath == '/danOther'){
			  	this.guarantee_type = 1
			  }
				this.name = this.$route.query.name
				this.needMoney = this.$route.query.needMoney
				this.guaranteeCode = this.$route.query.guaranteeCode
				this.myGuaranteeLimit()
				this.getTypeLoanGuaranteeAssets()
			})
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			// 我要担保--我的社内担保额度
			myGuaranteeLimit() { 
				this.$api.myGuaranteeLimit({}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.left_guarantee_money = res.data.left_guarantee_money
					} else {
						this.$toast(res.errmsg)
					}

				}).catch(err => {
					this.$toast.clear()
				})
			},
			selType(id){
				if(id == 1){
					if(this.danMoney1 > 0){
						this.disabled = false
					}else{
						this.disabled = true
					}
				}else if(id == 2){
					if(this.danMoney2 > 0){
						this.disabled = false
					}else{
						this.disabled = true
					}
				}
			},
			InMoney1(){
				if(this.left_guarantee_money == 0){
					this.$toast("暂无金额可以担保")
					this.danMoney1 = ''
					this.disabled = true
					return
				}else if (Number(this.danMoney1) > Number(this.left_guarantee_money)) {
					this.danMoney1 = ''
					this.disabled = false
					this.$toast("担保金额不能大于可担保额")
					return
				}else{
					this.disabled = false
				}
			},
			// 已上传的资产担保信息
			getTypeLoanGuaranteeAssets() {
				this.$api.getTypeLoanGuaranteeAssets({guarantee_code: this.guaranteeCode}).then(res => {
					if (res.errno == 0) {
						this.zichanList = res.data
					} else {
						this.$toast(res.errmsg)
					}
			
				}).catch(err => {
					this.$toast.clear()
				})
			},
			zichanDetail(assets_code, guarantee_type_id){
				let pathUrl = ''
				if(guarantee_type_id == 1){
					pathUrl = '/danFang'
				}else if(guarantee_type_id == 2){
					pathUrl = '/danChe'
				}else{
					pathUrl = '/danOther'
				}
				this.$router.push({
					path: pathUrl,
					query: {
						type_id: guarantee_type_id,
						assetsCode: assets_code,
						guaranteeCode: this.guaranteeCode,
					}
				})
			},
			
			// 点击全部担保
			allDan() {
				if(this.left_guarantee_money == 0){
					this.$toast("暂无金额可以担保")
					this.danMoney1 = ''
					this.disabled = true
					return
				}else if (this.left_guarantee_money >= this.needMoney) {
					this.danMoney1 = this.needMoney
					this.disabled = false
				} else {
					this.danMoney1 = this.left_guarantee_money
					this.disabled = false
				}
			},
			// 点击不同类型担保
			goDan(type_id){
				let pathUrl = ''
				if(type_id == 1){
					pathUrl = '/danFang'
				}else if(type_id == 2){
					pathUrl = '/danChe'
				}else{
					pathUrl = '/danOther'
				}
				this.$router.push({
					path: pathUrl,
					query: {
						type_id: type_id,
						guaranteeCode: this.guaranteeCode
					}
				})
			},
			// 担保--弹出弹框
			goLoanGuarantee() {
				if(this.guarantee_type == 1 && this.zichanList.length == 0){
					this.$toast("请添加资产信息")
					return
				}else 
				if(this.guarantee_type == 0 && this.danMoney1 <= 0 || this.guarantee_type == 1 && this.danMoney2 <= 0){
					this.$toast("请输入担保金额")
					return
				}
				this.danTip = true
			},
			// 确认担保
			sureDan(){
				let data = {}
				data.guarantee_code = this.guaranteeCode
				data.guarantee_type = this.guarantee_type
				data.if_agree = 1
				if(this.guarantee_type == 0){
					data.guarantee_money = this.danMoney1
				}else{
					data.guarantee_money = this.danMoney2
				}
				this.$api.goLoanGuarantee(data).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						setTimeout(()=>{
							this.$router.go(-2);
						}, 1000)
					} else {
						this.$toast(res.errmsg)
						this.danTip = false
					}
							
				}).catch(err => {
					this.$toast.clear()
				})
			},
		},
	}
</script>
<style lang="less">
	.danInput {
		padding-top: 46px;
		background: #f0f6fc url(../../images/bgHeader7.png) no-repeat;
		background-size: 100% 170px;
		overflow: auto;

		.van-nav-bar {
			z-index: 10;
			background: url(../../images/bgHeader7.png) no-repeat top center;
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
		}

		.m-title {
			color: #9AA8B6;

			&.other {
				margin: 20px 0 10px 0;
			}
		}

		.selectCont {
			background: #FFFFFF;
			margin: 10px;
			padding: 20px 15px;
			border-radius: 10px;
		}

		.sel-Title {
			div {
				margin-top: 15px;
				display: flex;
				justify-content: space-between;

				p {
					color: #9AA8B6;
					background: #F0F6FC;
					border: 1px solid #F0F6FC;
					line-height: 38px;
					width: calc(50% - 15px);
					text-align: center;
					font-size: 15px;
					border-radius: 8px;

					&.active {
						color: #3B6AF1;
						border: 1px solid #3b6af1;
						position: relative;

						.selImg {
							position: absolute;
							right: 0;
							bottom: 0;
							background: #3B6AF1;
							width: 8px;
							padding: 4px 10px;
							border-radius: 8px 0 6px 0;
						}
					}

				}
			}
		}

		.otherTitle {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.item {
				width: calc(33.33333% - 10px);
				height: 50px;
				line-height: 50px;
				position: relative;
				text-align: center;
				border-radius: 5px;
				overflow: hidden;

				&:nth-child(1) {
					background: #FDEBDB;

					.rightBtn {
						background: #E1C5AB;
					}
				}

				&:nth-child(2) {
					background: #DCF2FA;

					.rightBtn {
						background: #9BC5D4;
					}
				}


				&:nth-child(3) {
					background: #EEEBFC;

					.rightBtn {
						background: #BCB6D6;
					}
				}

				.topBg {
					position: absolute;
					top: 0;
					right: 0;
					height: 50px;
				}

				.textImg {
					height: 15px;
				}

				.rightBtn {
					position: absolute;
					right: 0;
					bottom: 0;
					height: 7px;
					padding: 5px 10px;
					border-radius: 10px 0 10px 0;
				}
			}
		}

		.otherList {
			margin-top: 10px;

			.van-cell {
				padding: 10px;
				background: #F6FAFE;

				&::after {
					left: 10px;
					right: 10px;
					border-color: #FFFFFF;
				}

				.van-tag--plain {
					border-radius: 30px;
					background: #E2F4FF;
				}
			}
		}

		.tabCont {
			background: #FFFFFF;
			margin: 10px;
			padding: 15px;
			border-radius: 10px;

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
		}

		.tabCont1 {
			.tip {
				margin-top: 10px;
				display: flex;
				align-items: center;
				font-size: 15px;
				color: #9AA8B6;

				img {
					height: 20px;
					margin-right: 5px;
				}
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
		
		.danTipCont{
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
