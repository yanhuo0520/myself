<template>
	<div class="pasSet">
		<van-nav-bar title="密码设置" left-arrow fixed @click-left="leftBack" />
		<van-cell-group class="cell-cont">
			<van-cell title="支付密码" is-link @click="$router.push('/payPass')">
				<template #icon>
					<img src="../../images/passw.png" alt="" class="iconImg" />
				</template>
			</van-cell>
			<van-cell title="登录密码" is-link @click="$router.push('/loginPass')">
				<template #icon>
					<img src="../../images/passw.png" alt="" class="iconImg" />
				</template>
			</van-cell>
		</van-cell-group>
		

	</div>
</template>
<script>
	export default {
		name: "pasSet",
		data() {
			return {
				
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
		}
	}
</script>
<style lang="less">
	.pasSet {
		padding-top: 46px;
		background: #F0F6FC;
		min-height: calc(100% - 46px);

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
		.van-hairline--bottom::after{
			border-bottom-width: 0
		}


		.cell-cont {
			border-radius: 10px 10px 0 0;
			.van-cell{
				&:first-child{
					border-radius: 10px 10px 0 0;
				}
			}
			.iconImg {
				height: 15px;
				margin-top: 4px;
				margin-right: 6px;
			}
		}


	}
</style>
