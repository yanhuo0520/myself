<template>
	<div class="loginPw">
		<van-nav-bar title="登录令牌" left-arrow fixed @click-left="leftBack" />
		<p class="m-title">登录令牌<span>60秒</span>自动刷新，实时保护帐号安全</p>
		<div class="content">
			<p class="num">{{num}}</p>
			<p class="time">失效时间剩余:<span>{{times}}秒</span></p>
		</div>
	</div>
</template>
<script>
	export default {
		name: "loginPw",
		data() {
			return {
				num: '',
				times: 60,
				timer: ''
			}
		},
		mounted() {
			window.leftBack = this.leftBack;
			if(typeof android != "undefined"){
				this.getCode()
			}else{
				this.$toast("请用手机端访问")
			}
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			getCode() {
				this.num = android.totpCode('LPCS7I5KPSTTYTXF')
				this.timer = setInterval(() => {
					this.times--
					if (this.times === 0) {
						this.times = 60
						clearInterval(this.timer)
						this.timer = ''
						this.getCode()
					}
				}, 1000)
			}

		},
		beforeRouteLeave (to, from, next) {
			clearInterval(this.timer)
			this.timer = ''
		  next();
		},
	}
</script>
<style lang="less">
	.loginPw {
		padding-top: 46px;
		background: #f0f6fc url(../../images/applyBg.png) no-repeat right 46px;
				background-size: auto 36px;
		height: calc(100% - 46px);

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
		
					span {
						color: #3B6AF1;
					}
				}


		.content {
			background: #ffffff;
			padding-top: 30px;
						margin-top: 10px;
						border-radius: 10px 10px 0 0;
						height: calc(100% - 62px);
						text-align: center;
			.num{
				height: 50px;
				line-height: 50px;
				font-family: DIN, DIN-Bold;
				font-size: 36px;
				color: #444444;
				font-weight: bold;
				letter-spacing: 19px;
				padding-left: 19px;
				background: url(../../images/pwBg.png) no-repeat center top;
				background-size: 235px 50px;
			}
			.time{
				margin-top: 30px;
				color: #9AA8B6;
				span{
					color: #3B6AF1;
				}
			}
		}
	}
</style>
