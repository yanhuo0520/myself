<template>
	<div class="applyCardDetail" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="银行卡信息" left-arrow fixed @click-left="leftBack" />
		<div class="cardCont">
			<div class="item" :class="{
				'blue':(info.open_bank_letter == 'CCB' || info.open_bank_letter == 'BC'),
				'red':(info.open_bank_letter == 'BOC' ||info.open_bank_letter == 'CMB' ||info.open_bank_letter == 'GF' ||info.open_bank_letter == 'ICBC' ||info.open_bank_letter == 'CITIC'),
				'green':(info.open_bank_letter == 'ABC' || info.open_bank_letter == 'CMBC' || info.open_bank_letter == 'YZ'),
				'purple':info.open_bank_letter == 'CEB',
				'orange':info.open_bank_letter == 'ZZBANK'}">
				<img src="../../images/light3.png" class="itemBg" />
				<img src="../../images/light2.png" class="itemBgAll" />
				<div class="topCont">
					<img :src="info.bank_log" alt="" />
					<p class="title">{{info.open_bank}}</p>
					<p class="tip">{{info.bank_type}}</p>
				</div>
				<p class="carnum">{{carNum}}</p>
			</div>
		</div>
		<div class="inputGroup">
			<p class="title">银行卡类型</p>
			<van-field v-model="cardType" clearable
				:right-icon="require('../../images/card2.png')" placeholder="请输入银行卡类型" readonly />
				
			<p class="title">开户行</p>
			<van-field v-model="kaiBank" clearable @click="addreShow = true"
				:right-icon="require('../../images/bank1.png')" placeholder="请点击选择开户行" readonly />

			<p class="title phone">银行预留手机号</p>
			<van-field v-model="phone" type="number" :class="ifInPhone? 'inInput' : ''" clearable
				:right-icon="require('../../images/phone.png')" placeholder="请输入银行预留手机号" @input="ifInPhone = true" @blur="ifInPhone = false"  />
			<p class="tip" @click="ifShowXieyi = true">查看<span>《用户协议》</span></p>
		</div>
		<van-button :icon='require("../../images/xieyi.png")' type="info" block class="addBtn" v-if="hidshowFooter"
			@click="userChangeBank()">
			同意协议并绑卡
		</van-button>
		
		
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
		

		<!-- 用户协议 -->
		<van-popup v-model="ifShowXieyi" position="bottom" :style="{ height: '100%' }" class="xieyiContent">
			<van-nav-bar :title="xieYi.title ? xieYi.title : '用户协议'" left-arrow fixed @click-left="ifShowXieyi = false" />
			<div class="content" v-html="xieYi.content"></div>
		</van-popup>
	</div>
</template>
<script>
	export default {
		name: "applyCardDetail",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 90,
				carNum: '',
				cardType: '',
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
				
				info: '',
				iconImg: '',
				phone: '',
				ifInPhone: false,

				ifShowXieyi: false,
				xieYi: '',

				docmHeight: document.documentElement.clientHeight, //默认屏幕高度
				showHeight: "0", //实时屏幕高度
				hidshowFooter: true, //显示或者隐藏footer,
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.carNum = this.$route.query.carNum
			this.cardType = this.$route.query.cardType
			this.info = JSON.parse(this.$route.query.info)
			this.searchBank = this.info.open_bank
			this.getAddress()
			this.getXieyi()
			window.onresize = () => { // 实时屏幕高度
				this.showHeight = document.body.clientHeight;
			};
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			getXieyi(){
				this.$api.user_bank_agreement().then(res=>{
					if(res.errno == 0){
						this.xieYi = res.data
					}else{
						this.$toast(res.errmsg)
					}
				})
			},
			userChangeBank() {
				if(!this.kaiBank){
					this.$toast("请选择开户支行")
					return
				}
				if (this.$validatePhone(this.phone) != true) {
					this.$toast(this.$validatePhone(this.phone))
					return
				}
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				let data = {}
					// data.bank_id = '' // 银行卡id：修改时需要	
					data.bank_remark = '' // 用户自定义银行卡备注
					data.open_phone = this.phone // 银行开户手机号	
					data.open_bank_letter = this.info.open_bank_letter // 开户行缩写字母
					data.open_bank = this.info.open_bank // 开户行
					data.bank_num = this.carNum // 银行卡号
					data.bank_log = this.info.bank_log // 银行logo
					data.bank_card_name = this.info.bank_card_name // 银行卡名称	
					data.bank_type = this.info.bank_type // 银行卡类型
					data.open_branch_bank = this.kaiBank
				this.$api.user_change_bank(data).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.$toast("添加成功")
						setTimeout(()=>{
							this.$router.replace({
								path: '/cooCardAcc'
							})
						})
						
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
			}
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
	.applyCardDetail {
		padding-top: 46px;
		padding-bottom: 44px;
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

		.inputGroup {
			padding-top: 10px;
			height: calc(100% - 116px);
			background: #FFFFFF;

			input:-ms-input-placeholder {
				color: #444444;
			}

			::-webkit-input-placeholder {
				color: #444444;
			}

			.title {
				margin-left: 15px;
				margin-top: 20px;
				color: #9AA8B6;
			}

			.van-cell {
				background: transparent;
				&.inInput {
					&::after {
						border-bottom: 1px solid #3B6AF1;
					}
				}

				.van-field__right-icon {
					color: #3B6AF1;
				}

				.iconImg {
					width: 11px;
					padding-right: 2px;
				}
			}

			.tip {
				margin: 20px 15px 0 15px;
				font-size: 13px;

				span {
					color: #3B6AF1;
				}
			}
		}


		.cardCont {
			margin: 0 10px;

			.item {
				margin-top: 10px;
				height: 120px;
				color: #FFFFFF;
				border-radius: 10px 10px 0 0;
				position: relative;
				background: linear-gradient(#3799fc 0%, #3d6be2 100%);

				&.blue {
					// 建行
					background: linear-gradient(#3799fc 0%, #3d6be2 100%);
				}

				&.red {
					// 工商银行
					background: linear-gradient(#ff717e 0%, #f73c57 100%);
				}

				&.green {
					// 民生银行
					background: linear-gradient(#09beaa 0%, #00aa95 100%);
				}

				&.purple {
					// 广大
					background: linear-gradient(#aa91fc 0%, #755ddf 100%);
				}

				&.orange{ 
					background: linear-gradient(#ffa500  0%, #ff8917 100%);
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
					max-width: 290px;
				}

				.topCont {
					display: flex;
					align-items: center;
					padding: 20px 15px 0 15px;

					img {
						width: 30px;
						height: 30px;
						border-radius: 50%;
					}

					.title {
						margin-left: 10px;
						font-size: 17px;
					}

					.tip {
						font-size: 13px;
						color: #eeeeee;
						margin-left: 5px;
						padding: 1px 8px;
						line-height: 20px;
						border-radius: 40px;
						background: rgba(225, 225, 225, 0.2);
					}

				}

				.carnum {
					margin-top: 30px;
					margin-right: 20px;
					font-family: DIN Bold, DIN Bold-Bold;
					font-weight: bold;
					font-size: 22px;
					text-align: right;
				}
			}
		}

		.null {
			img {
				max-width: 100%;
			}
		}

		.van-loading {
			padding: 10px 0;
			text-align: center;
		}

		.addBtn {
			position: fixed;
			bottom: 0;
			left: 0;
			font-size: 15px;
			background: #3B6AF1;
			border: 1px solid #3B6AF1;
		}
		
		
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
				

			.active {
				.van-cell__title {
					color: #3B6AF1;
				}
			}

			.img-icon {
				height: 20px;
			}
			.sheetNull{
				text-align: center;
				padding-top: 20px;
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

		.xieyiContent{
			background: #F0F6FC;
			.content{
				margin-top: 56px;
				height: calc(100% - 86px);
				overflow-y: scroll;
				background: #FFFFFF;
				border-radius: 10px 10px 0 0;
				padding: 15px 10px;
				line-height: 18px;
				font-size: 13px;
			}
		}

	}
</style>
