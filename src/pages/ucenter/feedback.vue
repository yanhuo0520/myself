<template>
	<div class="feedback">
		<van-nav-bar title="意见反馈" left-arrow fixed @click-left="leftBack" />
		<p class="m-title">您的反馈是我们宝贵的财富，谢谢您的支持</p>
		<div class="content">
			<van-field v-model="message" rows="10" autosize type="textarea" placeholder="请您详细地描述反馈意见，以便我们及时改正…" />

			<van-uploader v-model="fileList" :after-read="afterRead" :before-delete="beforeDelete" class="uploadCont">
			  <img src="../../images/jia.png" />
				<p>问题截图(选填)</p>
			</van-uploader>
		</div>

		<van-field class="phone" v-model="phone" type="number" clearable label="联系方式" input-align="right"
			:left-icon="require('../../images/phone.png')" placeholder="选填" />
		<van-button :icon='require("../../images/send.png")' type="info" block class="sendBtn" @click="sendBFeed()" v-if="hidshowFooter">
			立即提交
		</van-button>
	</div>
</template>
<script>
	export default {
		name: "feedback",
		data() {
			return {
				message: '',
				fileList: [],
				filesArray: [],
				token: '',
				phone: '',

				docmHeight: document.documentElement.clientHeight, //默认屏幕高度
				showHeight: "0", //实时屏幕高度
				hidshowFooter: true, //显示或者隐藏footer,
			}
		},
		mounted() {
			window.leftBack = this.leftBack;
			if(typeof android != 'undefined'){
				this.token = android.load("token")
				this.phone = android.load("phone")
			}else{
				this.token = localStorage.getItem('token')
				this.phone = localStorage.getItem('phone')
			}
			window.onresize = () => { // 实时屏幕高度
				this.showHeight = document.body.clientHeight;
			};
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			afterRead(file) {
				this.$toast.loading({
					message: '上传中...',
					forbidClick: true,
					duration: 0,
				});
				this.$compreImg(file.content).then(result => {
					if (result.size > file.file.size){
						//压缩后比原来更大，则将原图上传
						this._uploadFile(file.file, file.file.name);
					} else {
						//压缩后比原来小，上传压缩后的
						this._uploadFile(result, file.file.name)
					}
				})
			},
			_uploadFile(file, filename){
				var formdata = new FormData();
				//可以通过append()方法来追加数据
				formdata.append("file", file, filename);
				formdata.append("token", this.token);
				const instance = this.$axios.create({
					//withCredentials:true
				});
				instance.post("http://coopera.xfd365.com/user/auth/uploadImg", formdata).then(res => {
					this.$toast.clear()
					if (res.data.errno === 0) {
						this.$toast("上传成功");
						this.filesArray.push(res.data.data.url)
					} else {
						this.$toast(res.errmsg);
					}
				});
			},
			beforeDelete(file, detail) {
				let index = detail.index
				this.fileList.splice(index, 1);
				this.filesArray.splice(index, 1);
			},
			sendBFeed() {
				if (this.$validatePhone(this.phone) != true && this.phone) {
					this.$toast(this.$validatePhone(this.phone))
					return
				}
				let data = {}
				data.content = this.message
				data.img_arr = this.filesArray
				data.feedback_phone = this.phone
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
	.feedback {
		padding-top: 46px;
		padding-bottom: 44px;
		min-height: calc(100% - 90px);
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

			.van-cell {
				border-radius: 10px 10px 0 0;

				&::after {
					border-bottom: 0;
				}
			}

			.uploadCont {
				margin: 0 10px;

				.van-uploader__preview-image{
					width: 100px;
					height: 70px;
				}
				.van-uploader__input-wrapper{
					background: #F0F6FC;
					width: 100px;
					height: 70px;
					text-align: center;
					color: #9AA8B6;
					img{
						width: 15px;
						height: 15px;
						margin: 16px 0 5px 0;
					}
				}
			}
		}

		.phone {
			margin-top: 10px;
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
