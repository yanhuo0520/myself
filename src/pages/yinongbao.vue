<template>
	<div class="yinongbao">
		<iframe class="yinong-iframe" :src="url" frameborder="0"></iframe>
		<div class="back-btn" @click.stop="toRouter('/')">
			返回三位一体
		</div>
	</div>
</template>
<script>
	export default {
		name: "yinongbao",
		data() {
			return {
				url: ''
			};
		},
		mounted() {
			let url = this.$route.query.url ? this.$route.query.url : ''
			if (url) {
				this.url = url
			} else {
				this.$router.push('/')
			}
		},
		methods: {
			toRouter(path) {
				this.$router.push(path)
			},
		}
	};
</script>
<style lang="less">
	.yinongbao {
		height: 100%;

		.yinong-iframe {
			width: 100%;
			height: 100%;
		}

		.back-btn {
			position: fixed;
			top: calc(50% - 100px);
			left: 0;
			background: url(../images/backBg.png);
			background-size: 100% 100%;
			font-size: 14px;
			color: #fff;
			text-align: center;
			letter-spacing: 2px;
			width: 20px;
			height: 180px;
			padding-left: 1px;
			writing-mode: vertical-lr;
			text-align: center;
		}
	}
</style>
