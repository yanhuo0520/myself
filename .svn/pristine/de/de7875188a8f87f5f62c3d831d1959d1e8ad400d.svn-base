<template>
	<div class="danDetail" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="详情" left-arrow fixed @click-left="leftBack" />
		<div class="header">
			<p class="title">{{baseDetail.pay_way_str}}</p>
			<p class="num"><span>¥</span>{{baseDetail.money}}</p>
		</div>
		<van-radio-group class="huanCont">
			<van-cell title="收款人" :value="baseDetail.turn_bank_user">
				<!-- <template #icon>
					<img src="../../images/person2.png" alt="" />
				</template> -->
			</van-cell>
			<van-cell title="收款账户" class="moreTitle" :value="baseDetail.turn_bank_num">
				<!-- <template #icon>
					<img src="../../images/person2.png" alt="" />
				</template> -->
			</van-cell>
			<van-cell title="收款账户" class="moreTitle" :value="baseDetail.turn_bank_name">
				<!-- <template #icon>
					<img src="../../images/person2.png" alt="" />
				</template> -->
			</van-cell>
			<van-cell title="创建时间" :value="baseDetail.add_date">
				<!-- <template #icon>
					<img src="../../images/person1.png" alt="" />
				</template> -->
			</van-cell>
		</van-radio-group>

	</div>
</template>
<script>
	export default {
		name: "danDetail",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 90,
				wId: '',
				baseDetail: '',
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.wId = this.$route.query.wId
			if (this.wId) {
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
				this.$api.wallet_take_out_detail({
					"w_id": this.wId
				}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.baseDetail = res.data
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
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
		



	}
</style>
