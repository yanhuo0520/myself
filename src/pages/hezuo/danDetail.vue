<template>
	<div class="danDetail" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar :title="baseTitle" left-arrow fixed @click-left="leftBack" />
		<div class="header">
			<template v-if="status == 1">
				<p class="title">我的担保额</p>
				<p class="num"><span>¥</span>{{baseDetail.has_guarantee_money}}</p>
			</template>
			<template v-else>
				<p class="title">需担保额</p>
				<p class="num"><span>¥</span>{{baseDetail.loan_left_guarantee_money}}</p>
			</template>
			
		</div>
		<van-radio-group class="huanCont">
			<van-cell title="借款人" :value="baseDetail.name">
				<template #icon>
					<img src="../../images/person1.png" alt="" />
				</template>
			</van-cell>
			<van-cell title="借款人身份证号" class="moreTitle" :value="baseDetail.idcard">
				<template #icon>
					<img src="../../images/person2.png" alt="" />
				</template>
			</van-cell>
			<van-cell title="借款人手机号" class="moreTitle" :value="baseDetail.phone">
				<template #icon>
					<img src="../../images/phone.png" alt="" />
				</template>
			</van-cell>
			<van-cell title="借款金额" :value="baseDetail.loan_money">
				<template #icon>
					<img src="../../images/jieNum.png" alt="" />
				</template>
			</van-cell>
			<van-cell title="借款利息" :value="baseDetail.interest_money">
				<template #icon>
					<img src="../../images/jielixi.png" alt="" />
				</template>
			</van-cell>
			<van-cell title="借款时长" :value="baseDetail.loan_name">
				<template #icon>
					<img src="../../images/time.png" alt="" />
				</template>
			</van-cell>
			<van-cell title="借款用途" :value="baseDetail.loan_use_name">
				<template #icon>
					<img src="../../images/jieuse.png" alt="" />
				</template>
			</van-cell>
			<van-cell title="已担保额" :value="baseDetail.has_guarantee_money + '元'">
				<template #icon>
					<img src="../../images/qian7.png" alt="" />
				</template>
			</van-cell>
		</van-radio-group>
		
		<van-radio-group class="huanCont refuse" v-if="baseDetail.disagree_reason && status == 2">
			<van-cell title="拒绝理由">
				<template #icon>
					<img src="../../images/jujueIcon.png" alt="" />
				</template>
			</van-cell>
			<p class="desc">{{baseDetail.disagree_reason}}</p>
		</van-radio-group>
		<div class="otherCont">
			查看<div class="title" @click="otherList()">其历史借款<img src="../../images/right5.png" /> </div>
		</div>

		<div class="btnCont" v-if="status == 0">
			<van-button :icon='require("../../images/jujue.png")' block class="sendBtn" @click="danTip = true">
				拒绝担保
			</van-button>
			<van-button :icon='require("../../images/danbaoIcon.png")' type="info" block class="sendBtn"
				@click="goDanbao()">
				为他担保
			</van-button>
		</div>


		<!-- 担保确认弹框 -->
		<van-popup v-model="danTip" class="danTipCont">
			<img src="../../images/danTip2.png" class="IMg" />
			<van-field
				v-model="message"
				type="textarea"
				placeholder="请您输入拒绝理由，借款人无权查看您 的拒绝理由，请您放心填写"
			/>
			<div class="btnCont">
				<p class="btn cancel" @click="danTip = false">取消</p>
				<p class="btn sure" @click="sureJujue()">拒绝</p>
			</div>
		</van-popup>


	</div>
</template>
<script>
	export default {
		name: "danDetail",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 90,
				danTip: false, // 担保弹框
				loanCode: '',
				status: '',
				baseTitle: '借款详情',
				baseDetail: '',
				message: ''
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.loanCode = this.$route.query.loanCode
			this.status = this.$route.query.status
			if (this.loanCode) {
				this.getDetail()
			}
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			getDetail() {
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.guaranteeLoanDetail({
					"loan_code": this.loanCode
				}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.baseTitle = res.data[0].name + '借款详情'
						this.baseDetail = res.data[0]
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			// 其他历史借款
			otherList(){
				this.$router.push({
					path: '/historyJie',
					query: {
						loanCode: this.loanCode,
						name: this.baseDetail.name
					}
				})
			},
			// 拒绝
			sureJujue(){
				if(this.message.trim().length == 0){
					this.$toast("请输入拒绝理由")
					return
				}
				let data = {}
					data.guarantee_code = this.baseDetail.guarantee_code
					data.if_agree = 0 // 是否同意担保：0拒绝，1同意
					data.disagree_reason = this.message
				this.$api.goLoanGuarantee(data).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.$router.go(-1);
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			goDanbao() { // 为他担保
				this.$router.push({
					path: '/danInput',
					query: {
						name: this.baseDetail.name,
						needMoney: this.baseDetail.loan_left_guarantee_money,
						guaranteeCode: this.baseDetail.guarantee_code,
					}
				})

			}
		},
	}
</script>
<style lang="less">
	.danDetail {
		padding-top: 46px;
		padding-bottom: 44px;
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

		.huanCont {
			margin: 0 10px;
			&.refuse{
				margin-top: 10px;
				background: #FFFFFF;
				border-radius: 10px;
				.desc{
					font-size: 15px;
					color: #9AA8B6;
					padding: 10px 16px;
				}
			}

			.van-cell {
				&:first-child {
					border-top-left-radius: 10px;
					border-top-right-radius: 10px;
				}
				&:nth-last-child(1){
					border-bottom-left-radius: 10px;
					border-bottom-right-radius: 10px;
				}
				&.moreTitle{
					.van-cell__title{
						flex: 0.65;
					}
				}

				img {
					height: 15px;
					margin: 3.5px 5px 0 0;
				}

				.van-cell__title {
					flex: 0.5;
					color: #444444;
					font-size: 15px;
				}

				.van-cell__value {
					font-size: 15px;
					color: #9AA8B6;
				}
			}

			.tip {
				margin-top: 20px;
				display: flex;
				align-items: center;
				background: #FDF7ED;
				color: #AA9C8B;
				line-height: 18px;

				img {
					width: 58px;
					margin-right: 5px;
				}

			}

		}
		
		
		.otherCont{
			font-size: 13px;
			margin: 15px 20px;
			display: flex;
			align-items: center;
			.title{
				color: #3B6AF1;
			}
			img{
				width: 10px;
				margin-left: 2px;
			}
		}

		.btnCont {
			position: fixed;
			left: 0;
			width: 100%;
			bottom: 0;
			display: flex;

			.van-button--default {
				color: #3B6AF1;
			}
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
			.van-cell{
				height: 180px;
			}
			.van-field__control{
				height: 100px;
				background: #F0F6FC;
				border-radius: 10px;
				padding: 10px;
				line-height: 20px;
			}
			.van-field--min-height .van-field__control{
				min-height: auto;
			}
			.btnCont{
				display: flex;
				justify-content: space-around;
				background: #FFFFFF;
				padding: 10px 0 20px 0;
				.btn{
					line-height: 34px;
					width: calc(50% - 20px);
					border-radius: 30px;
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
