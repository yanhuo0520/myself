<template>
	<div class="stateGoodsDetails" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="商品详情" left-arrow fixed @click-left="leftBack" />
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
			<van-swipe-item><img src="../../images/card3.jpg" alt="" /> </van-swipe-item>
			<van-swipe-item><img src="../../images/CMB.png" alt="" /> </van-swipe-item>
			<van-swipe-item><img src="../../images/CMB.png" alt="" /></van-swipe-item>
			<van-swipe-item><img src="../../images/CMB.png" alt="" /></van-swipe-item>
		</van-swipe>
	</div>
</template>
<script>
	export default{
		name: 'stateGoodsDetails',
		data(){
			return {
				deviceHeight: document.body.clientHeight - 46,
			}
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
	.stateGoodsDetails{
		padding-top: 46px;
		background: #F0F6FC;
		overflow: auto;
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
        .my-swipe .van-swipe-item {
			height: 150px;
			text-align: center;
			img{
				max-width: 100%;
				max-height: 100%;
			}
		}
	}
</style>