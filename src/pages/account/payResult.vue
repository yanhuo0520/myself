<template>
	<div class="payResult" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="支付结果" left-arrow fixed @click-left="leftBack" />
		<div class="huanCont">

			<!-- 成功 -->
			<template v-if="ifSuccess == 1">
				<img src="../../images/success.png" class="tipImg" />
				<div class="cont">
					<div class="item itemLe">
						<img src="../../images/zhi.png" />
						<p class="name">支付宝</p>
					</div>
					<div class="item itemRi">
						<img src="../../images/qian4.png" />
						<p class="money">3745.92</p>
					</div>
				</div>
				<p class="btn">完成</p>
			</template>


			<!-- 失败 -->
			<template v-else-if="ifSuccess == 2">
				<img src="../../images/failed.png" class="tipImg" />
				<p class="btn">重新转入</p>
			</template>
			
			<!-- 查询中 -->
			<template v-else>
				<img src="../../images/ing.png" class="tipImg" />
				<div class="cont">
					<div class="item itemLe">
						<img src="../../images/zhi.png" />
						<p class="name">支付宝</p>
					</div>
					<div class="item itemRi">
						<img src="../../images/qian4.png" />
						<p class="money">3745.92</p>
					</div>
				</div>
			</template>


		</div>


	</div>
</template>
<script>
	export default {
		name: "payResult",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				wCode: '',
				ifSuccess: 0
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.wCode = this.$route.query.wCode
			if (this.wCode) {
				this.getResult()
			}
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			getResult() {
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.loanBackOrderQuery({
					w_code: this.w_code
				}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.ifSuccess = 1
					} else {
						this.ifSuccess = 2
					}
				}).catch(err => {
					this.$toast.clear()
				})
			}
		},
	}
</script>
<style lang="less">
	.payResult {
		padding-top: 46px;
		background: #F0F6FC;
		overflow: auto;

		.van-nav-bar {
			z-index: 10;
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

		.huanCont {
			height: 100%;
			background: #FFFFFF;
			border-radius: 10px 10px 0 0;
			text-align: center;

			.tipImg {
				margin: 30px 0;
				width: 96px;
			}

			.cont {
				margin: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.item {
					display: flex;
					align-items: center;

					img {
						padding-right: 3px;
					}

					&.itemLe {
						img {
							width: 15px;
						}

						.name {
							font-size: 15px;
						}
					}

					&.itemRi {
						img {
							height: 10px;
						}

						.money {
							font-family: DIN, DIN-Medium;
							font-size: 18px;
						}
					}
				}
			}
		}

		.btn {
			margin: 30px 15px 0 15px;
			text-align: center;
			line-height: 36px;
			color: #FFFFFF;
			border-radius: 30px;
			font-size: 15px;
			background: #3B6AF1;
			border: 1px solid #3B6AF1;
		}



	}
</style>
