<template>
	<div class="carDetail">
		<van-nav-bar title="银行卡" left-arrow fixed @click-left="leftBack" />
		<div class="top">
			<div class="cont" :class="{
				'blue':(detailInfo.open_bank_letter == 'CCB' || detailInfo.open_bank_letter == 'BC'),
				'red':(detailInfo.open_bank_letter == 'BOC' ||detailInfo.open_bank_letter == 'CMB' ||detailInfo.open_bank_letter == 'GF' ||detailInfo.open_bank_letter == 'ICBC' ||detailInfo.open_bank_letter == 'CITIC'),
				'green':(detailInfo.open_bank_letter == 'ABC' || detailInfo.open_bank_letter == 'CMBC' || detailInfo.open_bank_letter == 'YZ'),
				'purple':detailInfo.open_bank_letter == 'CEB',
				'orange':detailInfo.open_bank_letter == 'ZZBANK'}">
				<img src="../../images/light3.png" class="itemBg" />
				<img src="../../images/light2.png" class="itemBgAll" />
				<div class="topCont">
					<img :src="detailInfo.logoImg" alt="" />
					<div>
						<p class="title">{{detailInfo.open_bank}}</p>
						<div class="tipTips">
							<p class="tip">{{detailInfo.bank_type}}</p>
							<p class="tip" v-if="sureRemark">{{sureRemark}}</p>
						</div>
					</div>
					
				</div>
				
				<p class="carnum">{{detailInfo.bank_num}}</p>
			</div>
		</div>
		<div class="cell-cont">
			<van-cell title="修改手机号" is-link :value="surePhone" @click="ifPhone = true">
				<template #icon>
					<img src="../../images/phone1.png" alt="" class="iconImg" />
				</template>
			</van-cell>
			<van-field v-model="surekaiBank" clearable label="修改开户行" @click="addreShow = true"
				:left-icon="require('../../images/bank2.png')"
				:right-icon="require('../../images/right11.png')" placeholder="请输入银行卡类型" input-align="right" readonly />
			
			<van-cell title="银行卡备注" is-link @click="ifBeizhu=true">
				<template #icon>
					<img src="../../images/beizhu.png" alt="" class="iconImg" />
				</template>
			</van-cell>
			<van-cell title="解除绑定" is-link @click="ifTipJie=true">
				<template #icon>
					<img src="../../images/jie.png" alt="" class="iconImg" />
				</template>
			</van-cell>
		</div>
		
		
		
		<!-- 修改手机号 -->
		<van-action-sheet v-model="ifPhone" title="修改手机号" class="selSheet selSheetBei selSheetPhone" :closeable="false" cancel-text="确定" @cancel="surePhoneIn()">
			<van-field v-model="inPhone" maxlength="11" type="number"
				placeholder="请输入银行预留手机号" />
		</van-action-sheet>
		
		<!-- 请选择所在地区 -->
		<van-popup v-model="addreShow" round position="bottom">
			<van-cascader v-model="cascaderValue" title="请选择开户行所在地区" :options="options" active-color="#1989fa"
				@close="addreShow = false" @change="onChange" @finish="onFinish" />
		</van-popup>
		
		<!-- 选择开户行 -->
				<van-action-sheet v-model="bankSelShow" title="选择开户行" class="selSheet" :closeable="false" cancel-text="确定" @cancel="sureSel()">
					<template #description>
						<van-search v-model="nameSear" show-action placeholder="请输入搜索关键词" class="searchName" @clear="clearSear()">
							<template #action>
								<!-- <div >搜索</div> -->
								<img src="../../images/search.png" @click="onSearch" class="searIcon" />
							</template>
						</van-search>
					</template>
					<template v-if="selList.length > 0">
						<van-radio-group v-model="radioId">
							<van-cell :title="item1.bankBranchName" clickable v-for="(item1, index1) in selList" :key="index1"
								@click="radioId = item1.code, radioStatusText = item1.bankBranchName"
								:class="radioId == item1.code ? 'active' : ''">
								<template #right-icon>
									<van-radio :name="item1.code">
										<template #icon="props">
											<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
										</template>
									</van-radio>
								</template>
							</van-cell>
						</van-radio-group>
					</template>
					<template v-else>
						<p class="sheetNull" v-if="!isloading">暂无</p>
					</template>
					
				</van-action-sheet>

		
		<!-- 银行卡备注 -->
		<van-action-sheet v-model="ifBeizhu" title="银行卡备注" class="selSheet selSheetBei" :closeable="false" cancel-text="确定" @cancel="saveChange()">
			<van-field v-model="inBeizhu" rows="3" @input="selType=''" maxlength="6" type="textarea"
				placeholder="请输入银行卡备注(最多六个字)" />
			<ul>
				<li v-for="(item, index) in type" :key="index" :class="(item == selType)?'active':''"
					@click="selType = item, inBeizhu = item">{{item}}</li>
			</ul>
		</van-action-sheet>

		<!-- 解除绑定 -->
		<van-popup v-model="ifTipJie" class="tipCont">
			<img src="../../images/danTip.png" class="IMg" />
			<p class="tipTitle">确认要解除<br /> 该银行卡的绑定吗?</p>
			<div class="btnCont">
				<p class="btn cancel" @click="ifTipJie = false">取消</p>
				<p class="btn sure" @click="sureJie()">确定</p>
			</div>
		</van-popup>

	</div>
</template>
<script>
	export default {
		name: "carDetail",
		data() {
			return {
				bank_id: '',
				detailInfo: '',
				
				surePhone: '',
				ifPhone: false,
				inPhone: '',
				
				surekaiBank: '',
				kaiBank: '',
				addreShow: false,
				cascaderValue: '',
				optionId1: 0,
				options: [{
					text: '浙江省',
					value: '330000',
					children: [],
				}, ],
				city_id: '',
				searchBank: '',
				
				bankSelShow: false,
				nameSear: '',
				isloading: true,
				radioId: '',
				selList: [],
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),
				
				sureRemark: '',
				ifBeizhu: false,
				ifTipJie: false,
				inBeizhu: '',
				selType: '',
				type: ['工资卡', '房贷卡', '车贷卡', 'ETC卡']
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.bank_id = this.$route.query.id
			if (this.bank_id) {
				this.detail()
			}
			this.getAddress()

		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			detail() {
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.user_bank_detail({
					bank_id: this.bank_id
				}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						let dataJson = res.data
						if (dataJson.open_bank_letter == 'CCB') { // 建行
							dataJson.logoImg = require("../../images/CCB.png")
						} else if (dataJson.open_bank_letter == 'BC') {
							dataJson.logoImg = require("../../images/BC.png")
						} else if (dataJson.open_bank_letter == 'BOC') {
							dataJson.logoImg = require("../../images/BOC.png")
						} else if (dataJson.open_bank_letter == 'CMB') {
							dataJson.logoImg = require("../../images/CMB.png")
						} else if (dataJson.open_bank_letter == 'GF') {
							dataJson.logoImg = require("../../images/GF.png")
						} else if (dataJson.open_bank_letter == 'ICBC') { // 工商
							dataJson.logoImg = require("../../images/ICBC.png")
						} else if (dataJson.open_bank_letter == 'CITIC') {
							dataJson.logoImg = require("../../images/ZX.png")
						} else if (dataJson.open_bank_letter == 'ABC') { // 农行
							dataJson.logoImg = require("../../images/ABC.png")
						} else if (dataJson.open_bank_letter == 'CMBC') {
							dataJson.logoImg = require("../../images/CMBC.png")
						} else if (dataJson.open_bank_letter == 'YZ') {
							dataJson.logoImg = require("../../images/YZ.png")
						} else if (dataJson.open_bank_letter == 'CEB') { // 光大
							dataJson.logoImg = require("../../images/CEB.png")
						} else {
							dataJson.logoImg = dataJson.bank_log
						}
						this.detailInfo = dataJson
						this.surePhone = dataJson.open_phone
						this.inPhone = dataJson.open_phone
						this.searchBank = dataJson.open_bank
						this.surekaiBank = dataJson.open_branch_bank
						this.kaiBank = dataJson.open_branch_bank
						this.sureRemark = dataJson.bank_remark
						this.inBeizhu = dataJson.bank_remark
						this.selType = dataJson.bank_remark
					} else {
						this.$toast(res.errmsg)
					}

				}).catch(err => {
					this.$toast.clear()
				})
			},
			getAddress() {
				this.$api.select_all_yinlian_province().then(res => {
					this.$toast.clear()
					this.options = []
					if (res.errno == 0){
						for (let i = 0; i < res.list.length; i++){
							let resData = {}
								resData.id = i
								resData.value = res.list[i].yinlianProvinceCode
								resData.text = res.list[i].yinlianProvinceName
								resData.children = []
							this.options.push(resData)
						}
					}else{
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			onChange({selectedOptions,tabIndex}) {
				if (tabIndex == 0) {
					this.optionId1 = selectedOptions[0].id
				} 
				if (tabIndex > 0) {
					return
				}
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.select_by_province_code({yinlianProvinceCode: selectedOptions[0].value}).then(res => {
					this.$toast.clear()
					if(res.errno == 0){
						let childOption = []
						for (let i = 0; i < res.list.length; i++){
							let resData = {}
								resData.id = i
								resData.value = res.list[i].yinlianCityCode
								resData.text = res.list[i].yinlianCityName
								childOption.push(resData)
						}
						this.$nextTick(() => {
							if (tabIndex == 0) {
									this.options[this.optionId1].children = childOption;
								}
						})
						
					}else{
						this.$toast(res.message)
					}
					
				}).catch(err => {
					this.$toast.clear()
				})
			},
			onFinish({
				selectedOptions
			}) {
				this.addreShow = false;
				this.city_id = selectedOptions[1].value
				this.selBankList()
			},
			clearSear(){
				this.radioId = ''
				this.isloading = true
				this.selList = []
				this.selBankList()
			},
			onSearch(){
				this.radioId = ''
				this.isloading = true
				this.selList = []
				this.selBankList(this.nameSear)
			},
			sureSel(){
				if(this.radioId){
					this.kaiBank = this.radioStatusText
					this.saveChange();
				}else{
					this.$toast("请选择好修改的支行")
				}
			},
			selBankList(nameSear){
				let data = {}
					data.city_id = this.city_id;
					if(nameSear){
						data.name = this.searchBank + '/' + this.nameSear
					}else{
						data.name = this.searchBank
					}
					
					this.$toast.loading({
						message: '加载中...',
						forbidClick: true,
						duration: 0,
					});
				this.$api.get_branch_bank(data).then(res=>{
					this.$toast.clear()
					this.isloading = false
					if(res.errno == 0){
						this.bankSelShow = true
						this.selList = JSON.parse(res.list)
					}else{
						this.$toast(res.errmsg)
					}
				}).catch(res=>{
					this.isloading = false
					this.$toast.clear()
				})
			},
			surePhoneIn(){
				if (this.$validatePhone(this.inPhone) != true) {
					this.$toast(this.$validatePhone(this.inPhone))
					this.ifPhone = true
					return
				}
				this.saveChange()
			},
			// 修改银行卡信息
			saveChange() {
				if(!this.kaiBank){
					this.$toast("请选择开户支行")
					return
				}
				this.$toast.loading({
					message: '提交中...',
					forbidClick: true,
					duration: 0,
				});
				let data = {}
				data.bank_id = this.bank_id
				data.bank_remark = this.inBeizhu
				data.open_phone = this.inPhone
				data.open_bank_letter = this.detailInfo.open_bank_letter
				data.open_bank = this.detailInfo.open_bank
				data.bank_num = this.detailInfo.bank_num
				data.bank_log = this.detailInfo.bank_log
				data.bank_card_name = this.detailInfo.bank_card_name
				data.bank_type = this.detailInfo.bank_type
				data.open_branch_bank = this.kaiBank
				this.$api.user_change_bank(data).then(res => {
					this.$toast.clear()
					this.$toast(res.errmsg)
					if (res.errno == 0) {
						this.surePhone = this.inPhone
						this.surekaiBank = this.kaiBank
						this.sureRemark = this.inBeizhu
						// setTimeout(()=>{
						// 	this.$router.go(-1);
						// }, 1000)
						
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			// 解除绑定
			sureJie() {
				this.$api.user_del_bank({
					bank_id: this.bank_id
				}).then(res => {
					this.$toast(res.errmsg)
					if (res.errno == 0) {
						this.$toast(res.errmsg)
						this.$router.go(-1);
					}
				}).catch(err => {

				})
			}
		}
	}
</script>
<style lang="less">
	.carDetail {
		padding-top: 46px;

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

		.top {
			padding-top: 10px;
			height: 120px;
			background: #F0F6FC;

			.cont {
				color: #FFFFFF;
				background: linear-gradient(#3799fc 0%, #3d6be2 100%);
				height: 120px;
				margin: 0 10px;
				border-radius: 15px 15px 0 0;
				position: relative;

				&.blue {
					background: linear-gradient(#3799fc 0%, #3d6be2 100%);
				}

				&.red {
					background: linear-gradient(#ff717e 0%, #f73c57 100%);
				}

				&.green {
					background: linear-gradient(#09beaa 0%, #00aa95 100%);
				}

				&.purple {
					background: linear-gradient(#aa91fc 0%, #755ddf 100%);
				}

				&.orange {
					background: linear-gradient(#ffa500 0%, #ff8917 100%);
				}

				.itemBg {
					position: absolute;
					right: 0;
					top: 0;
					height: 45px;
				}

				.itemBgAll {
					position: absolute;
					left: 0;
					bottom: 0;
					width: 100%;
					height: 120px;
					max-width: 750px;
				}

				.topCont {
					display: flex;
					align-items: center;
					padding: 20px 15px 0 15px;

					img {
						width: 45px;
						height: 45px;
						border-radius: 50%;
					}

					.title {
						margin-left: 10px;
						font-size: 18px;
					}
				}
				.tipTips{
					display: flex;
					margin-top: 6px;
					margin-left: 5px;
					.tip {
						font-size: 13px;
						color: #eeeeee;
						margin-left: 5px;
						line-height: 20px;
						padding: 0 8px;
						text-align: center;
						border-radius: 40px;
						background: rgba(225, 225, 225, 0.2);
					}
				}

				.carnum {
					margin-top: 18px;
					margin-right: 15px;
					font-family: DIN Bold, DIN Bold-Bold;
					font-weight: bold;
					font-size: 24px;
					text-align: right;
				}

			}
		}


		.cell-cont {
			margin-top: 10px;

			.van-cell {
				padding: 10px;

			}

			.van-cell::after {
				border: none;
			}
			
			.van-field__label{
				color: #323233;
				margin-right: 0;
			}
			.van-field__value{
				.van-field__control{
					color: #969799;
				}
			}
			.van-field__right-icon .van-icon{
				font-size: 13px;
			}

			.iconImg {
				height: 15px;
				margin-top: 4px;
				margin-right: 6px;
			}
		}

		// 选择框
		.selSheet {
			&.selSheetBei{
				.van-field__control {
					background: #F0F6FC;
					border-radius: 10px;
					padding: 10px;
				}
			}
			&.selSheetPhone{
				.van-field__control{
					padding-bottom: 30px;
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

			.van-cell::after {
				border-bottom: none;
			}
			
			.searchName {
					padding: 2px 5px 4px 5px;
					background: #F0F6FC;
					border-radius: 30px;
				}
				.van-search__content{
					background: transparent;
				}
				.van-search__action{
					line-height: 0;
				}
				.searIcon{
					width: 25px;
					height: 25px;
				}
				.van-action-sheet__description{
					padding: 10px 16px;
				}
				.img-icon {
					height: 20px;
				}
				.active {
					.van-cell__title {
						color: #3B6AF1;
					}
				}

			

			ul {
				margin: 0 10px;

				li {
					background: #F0F6FC;
					padding: 5px 10px;
					border-radius: 30px;
					display: inline-block;
					margin: 10px 10px 0 0;
					font-size: 15px;
					color: #444444;

					&.active {
						color: #FFFFFF;
						background: #3B6AF1;
					}
				}
			}

			.sheetNull{
				padding-top: 20px;
				text-align: center;
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


		.tipCont {
			width: calc(100% - 60px);
			max-width: 510px;
			border-radius: 10px;
			background: transparent url(../../images/danTipBg.png) no-repeat center 46px;
			background-size: 100% auto;
			text-align: center;
			font-size: 15px;
			color: #444444;

			.IMg {
				width: 100%;
			}

			.tipTitle {
				background: #FFFFFF;
				padding: 20px 0;
				line-height: 20px;
			}

			.btnCont {
				display: flex;
				justify-content: space-around;
				background: #FFFFFF;
				padding: 10px 0 20px 0;

				.btn {
					border-radius: 30px;
					line-height: 34px;
					width: calc(50% - 20px);

					&.cancel {
						color: #9AA8B6;
						background: #F0F6FC;
					}

					&.sure {
						color: #FFFFFF;
						background: #3B6AF1;
					}
				}
			}
		}


	}
</style>
