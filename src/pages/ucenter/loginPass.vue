<template>
	<div class="loginPass">
		<van-nav-bar :title="title" left-arrow fixed @click-left="leftBack" />
		<p class="m-title">请<span>牢记</span>登录密码,切勿将密码告诉他人</p>
		<div class="content">
			<van-field v-model="password0" type="password" @input="filterSpaces(1)" label="原密码" :left-icon="require('../../images/yzm.png')" placeholder="请输入原密码" />
			
			<van-field v-model="password1" type="password" @input="filterSpaces(2)" label="新密码" :left-icon="require('../../images/passw.png')" placeholder="请输入新密码" />
			<van-field v-model="password2" type="password" @input="filterSpaces(3)" label="确认新密码" :left-icon="require('../../images/passw.png')" placeholder="请再次输入新密码" />
							
		</div>
		<van-button :icon= 'require("../../images/dui2.png")'  type="info" block class="addBtn" @click="goSet()" v-if="hidshowFooter">
			立即提交
		</van-button>
	</div>
</template>
<script>
	export default {
		name: "loginPass",
		data() {
			return {
				title: '修改登录密码',
				password0: '',
				password1: '',
				password2: '',

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
			// 判断之前没有没有密码
			this.$api.user_check_pwd().then(res=>{
				// 0 之前有密码
				// 1 用户不存在
				// 2 没有设置过密码
				if(res.errno == 0){
					this.title = '修改登录密码'
				}else if(res.errno == 2){
					this.title = '设置登录密码'
				}else{
					this.$toast(res.errmsg)
				}
			}).catch(err => {
				
			})
			
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			// 过滤所有空格
			filterSpaces(id){
				if(id == 1){
					this.password0 = this.password0.replace(/ /g,'')
				}else if(id == 2){
					this.password1 = this.password1.replace(/ /g,'')
				}else if(id == 3){
					this.password2 = this.password2.replace(/ /g,'')
				}
			},
			goSet(){
				if (this.password0.trim().length == 0) {
					this.$toast("请输入原密码")
					return
				}
				if (this.password1.trim().length == 0) {
					this.$toast("请输入新密码")
					return
				}
				if (this.password2.trim().length == 0) {
					this.$toast("请再次输入新密码")
					return
				}
				let data = {}
				data.old_password = this.$md5(this.password0)
				data.password = this.$md5(this.password1)
				data.confirm_password = this.$md5(this.password2)
				this.$toast.loading({
					message: '提交中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.user_set_pwd(data).then(res=>{
					this.$toast.clear()
					this.$toast(res.errmsg)
					if(res.errno == 0){
						setTimeout(()=>{
							this.$router.go(-1);
						}, 1000)
					}
				}).catch(res=>{
					this.$toast.clear()
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
	.loginPass {
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
			margin-top: 10px;
			border-radius: 10px 10px 0 0;
			height: calc(100% - 32px);
			.van-cell{
				&:first-child{
					border-radius: 10px 10px 0 0;
				}
				.van-field__label{
					width: 5.2em;
				}
				.van-field__control{
					text-align: right;
				}
			}
		}
		.addBtn{
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
