<template>
	<div class="messageDetail">
		<van-nav-bar :title="mTitle" left-arrow fixed @click-left="leftBack" />
		<p class="time">{{detailInfo.add_date}}</p>
		<div class="cont">
			{{detailInfo.content}}
		</div>
	</div>
</template>
<script>
	export default {
		name: "messageDetail",
		data() {
			return {
				mTitle: '',
				a_id: '',
				detailInfo: ''
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			this.a_id = this.$route.query.a_id
			this.mTitle = this.$route.query.title
			if(this.a_id){
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.getDetail()
			}
			
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			getDetail(){
				this.$api.user_notify_announce_detail({a_id: this.a_id}).then(res=>{
					this.$toast.clear()
					if(res.errno == 0){
						this.detailInfo = res.data
					}else{
						this.$toast(res.errmsg)
					}
					
				}).catch(err=>{
					this.$toast.clear()
				})
			}

		}
	}
</script>
<style lang="less">
	.messageDetail {
		padding-top: 46px;
		background: #F0F6FC;
		min-height: calc(100% - 46px);
		text-align: center;

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
		.time{
			margin: 10px 0;
			color: #9AA8B6;
		}
		.cont{
			margin: 0 10px;
			padding: 10px;
			background: #FFFFFF;
			border-radius: 10px;
			text-align: left;
			color: #444444;
			font-size: 15px;
			line-height: 22px;
		}


	}
</style>
