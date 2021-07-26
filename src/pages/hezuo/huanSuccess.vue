<template>
	<div class="huanSuccess" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="按期还款" left-arrow fixed @click-left="leftBack" />
		<div class="huanCont">
			<!-- 成功 -->
			<img src="../../images/success.png" class="tipImg" />
			<div class="cont">
				<div class="item itemLe">
					<img :src="imgIcon" />
					<p class="name">{{bankStr}}</p>
				</div>
				<div class="item itemRi">
					<img src="../../images/qian4.png" />
					<p class="money">{{money}}</p>
				</div>
			</div>
			<p class="btn" @click="finish()">完成</p>

		</div>


	</div>
</template>
<script>
	export default {
		name: "huanSuccess",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				bankStr: '',
				imgIcon: require("../../images/card1.png"),
				type: '',
				money: ''
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.bankStr = this.$route.query.bankStr
			this.type = this.$route.query.type
			this.money = this.$route.query.money
			if (this.type == 1) {
				this.imgIcon = require("../../images/card1.png")
			} else if (this.pay_type == 3 || this.pay_type == 5) {
				this.imgIcon = require("../../images/wei.png")
			} else if (this.pay_type == 4 || this.pay_type == 6) {
				this.imgIcon = require("../../images/zhi.png")
			} else if (this.pay_type == 7) {
				this.imgIcon = require("../../images/yun.png")
			}
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			finish() {
				this.$router.replace('/presidentHuan');
			}
		},
	}
</script>
<style lang="less">
	.huanSuccess {
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



	}
</style>
