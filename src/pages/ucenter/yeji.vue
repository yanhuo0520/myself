<template>
	<div class="ucenerYeji">
		<van-nav-bar title="业绩顾问" left-arrow fixed @click-left="leftBack" />
		<p class="m-title">业绩顾问编号是顾问的身份识别，请您认真填写</p>
		<div class="content">
			<van-field v-model="message" rows="18" autosize type="textarea" placeholder="请您输入业绩顾问的编号" />
		</div>

		<van-button :icon='require("../../images/send.png")' type="info" block class="sendBtn" @click="sendBFeed()" v-if="hidshowFooter">
			立即提交
		</van-button>
	</div>
</template>
<script>
	export default {
		name: "ucenerYeji",
		data() {
			return {
				message: '',

				docmHeight: document.documentElement.clientHeight, //默认屏幕高度
				showHeight: "0", //实时屏幕高度
				hidshowFooter: true, //显示或者隐藏footer,
			}
		},
		mounted() {
			window.leftBack = this.leftBack;
			window.onresize = () => { // 实时屏幕高度
				this.showHeight = document.body.clientHeight;
			};
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			sendBFeed() {
				return
				let data = {}
				data.content = this.message
				this.$api.add_feedback(data).then(res => {
					if (res.errno == 0) {
						this.$toast(res.errmsg)
						setTimeout(()=>{
							this.$router.go(-1);
						}, 1000)
						
					} else {
						this.$toast(res.errmsg)
					}

				}).catch(err => {

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
	.ucenerYeji {
		padding-top: 46px;
		padding-bottom: 44px;
		height: calc(100% - 90px);
		overflow-y: scroll;
		background: #f0f6fc url(../../images/applyBg.png) no-repeat right 46px;
		background-size: auto 36px;

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

		.m-title {
			margin: 0 10px;
			padding-top: 10px;
		}

		.content {
			margin-top: 10px;
			padding-bottom: 10px;
			border-radius: 10px 10px 0 0;
			background: #FFFFFF;
			height: calc(100% - 42px);

			.van-cell {
				border-radius: 10px 10px 0 0;

				&::after {
					border-bottom: 0;
				}
			}
			.van-field__control{
				height: 100% !important;
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

	}
</style>
