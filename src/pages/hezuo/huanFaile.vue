<template>
	<div class="huanFaile" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="按期还款" left-arrow fixed @click-left="leftBack" />
		<div class="huanCont">
				<img src="../../images/failed.png" class="tipImg" />
				<p class="btn">重新还款</p>
				<p class="btnBack">返回我要还款</p>
		</div>


	</div>
</template>
<script>
	export default {
		name: "huanFaile",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
		},
	}
</script>
<style lang="less">
	.huanFaile {
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
				margin: 0 10px;
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

		.btnBack {
			margin-top: 10px;
			line-height: 36px;
			color: #444444;
			font-size: 15px;
		}




	}
</style>
