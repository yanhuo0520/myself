<template>
	<div class="accouInSuccessRedirect">
		<!-- 支付支付 - 成功跳转重定向地址 -->
		<van-nav-bar title="支付结果" left-arrow fixed />
		<div>
			{{message}}
		</div>
	</div>
</template>
<script>
	export default {
		name: "accouInSuccessRedirect",
		data() {
			return {
				message: ''
			};
		},
		mounted(){
			// 支付完成- 跳转链接样式（线上链接（http） + Android链接 + 页面地址 + 拼接参数
			// 获取Android链接进行页面地址重定向
			// window.location.href = 'file:///storage/emulated/0/Android/data/com.xfd365.cooperativeapp/files/XfdCashProject/apps/com.xfd365.cooperativeapp-' 
			// 	+ this.$route.query.url + 'accouInResult?w_code=' + this.$route.query.w_code + '&token=' + this.$route.query.token
			this.message = 'file:///storage/emulated/0/Android/data/com.xfd365.cooperativeapp/files/XfdCashProject/apps/com.xfd365.cooperativeapp-' 
							+ this.$route.query.url + 'accouInResult?w_code=' + this.$route.query.w_code + '&token=' + this.$route.query.token
		},
		
	}
</script>
<style lang="less">
	.accouInSuccessRedirect{

	}
</style>
